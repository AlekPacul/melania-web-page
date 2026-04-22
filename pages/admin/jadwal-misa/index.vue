<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Kelola Jadwal Misa — Admin' })

const supabase = useSupabase()

// ── Active tab ────────────────────────────────────────────────────────
const activeTab = ref<'weekly' | 'special'>('weekly')

// ── Types ─────────────────────────────────────────────────────────────
interface MassSchedule {
  id: string
  day_label: string
  mass_time: string
  mass_type: string
  note: string | null
  sort_order: number
  is_active: boolean
}

interface SpecialSchedule {
  id: string
  event_name: string
  event_date: string
  mass_time: string
  mass_type: string
  note: string | null
  location: string | null
  dismiss_after: string | null
  is_active: boolean
  sort_order: number
}

type ScheduleForm = Omit<MassSchedule, 'id' | 'is_active'>
type SpecialForm = Omit<SpecialSchedule, 'id' | 'is_active'>

// ── State ─────────────────────────────────────────────────────────────
const schedules = ref<MassSchedule[]>([])
const loading = ref(true)
const saving = ref(false)
const errorMsg = ref<string | null>(null)

// Modal state
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<ScheduleForm>({
  day_label: '',
  mass_time: '',
  mass_type: '',
  note: '',
  sort_order: 0,
})

// Delete confirmation
const deleteId = ref<string | null>(null)
const deleteLabel = ref('')
const confirmOpen = ref(false)

// ── Data fetching ─────────────────────────────────────────────────────
async function fetchSchedules() {
  loading.value = true
  errorMsg.value = null
  const { data, error } = await supabase
    .from('mass_schedules')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) {
    errorMsg.value = 'Gagal memuat data jadwal.'
  } else {
    schedules.value = data as MassSchedule[]
  }
  loading.value = false
}

onMounted(fetchSchedules)

// ── Group schedules by day for display ───────────────────────────────
const groupedSchedules = computed(() => {
  const map = new Map<string, MassSchedule[]>()
  for (const s of schedules.value) {
    const existing = map.get(s.day_label) ?? []
    map.set(s.day_label, [...existing, s])
  }
  return map
})

// ── Modal helpers ─────────────────────────────────────────────────────
function openCreate() {
  editingId.value = null
  Object.assign(form, { day_label: '', mass_time: '', mass_type: '', note: '', sort_order: 0 })
  modalOpen.value = true
}

function openEdit(s: MassSchedule) {
  editingId.value = s.id
  Object.assign(form, {
    day_label: s.day_label,
    mass_time: s.mass_time.slice(0, 5), // "HH:MM"
    mass_type: s.mass_type,
    note: s.note ?? '',
    sort_order: s.sort_order,
  })
  modalOpen.value = true
}

async function saveSchedule() {
  if (!form.day_label || !form.mass_time || !form.mass_type) return
  saving.value = true
  errorMsg.value = null

  const payload = {
    day_label: form.day_label.trim(),
    mass_time: form.mass_time,
    mass_type: form.mass_type.trim(),
    note: form.note?.trim() || null,
    sort_order: Number(form.sort_order),
  }

  if (editingId.value) {
    const { error } = await supabase
      .from('mass_schedules')
      .update(payload)
      .eq('id', editingId.value)
    if (error) errorMsg.value = 'Gagal menyimpan perubahan.'
  } else {
    const { error } = await supabase
      .from('mass_schedules')
      .insert({ ...payload, is_active: true })
    if (error) errorMsg.value = 'Gagal menambah jadwal.'
  }

  saving.value = false
  if (!errorMsg.value) {
    modalOpen.value = false
    await fetchSchedules()
  }
}

// ── Toggle active ─────────────────────────────────────────────────────
async function toggleActive(s: MassSchedule) {
  const { error } = await supabase
    .from('mass_schedules')
    .update({ is_active: !s.is_active })
    .eq('id', s.id)
  if (!error) s.is_active = !s.is_active
}

// ── Delete ────────────────────────────────────────────────────────────
function confirmDelete(s: MassSchedule) {
  deleteId.value = s.id
  deleteLabel.value = `${s.day_label} ${s.mass_time.slice(0, 5)} — ${s.mass_type}`
  confirmOpen.value = true
}

async function doDelete() {
  if (!deleteId.value) return
  const { error } = await supabase
    .from('mass_schedules')
    .delete()
    .eq('id', deleteId.value)
  confirmOpen.value = false
  if (!error) await fetchSchedules()
}

// ── Format time for display ───────────────────────────────────────────
function fmtTime(t: string) {
  return t.slice(0, 5)
}

// ── Special schedules state ───────────────────────────────────────────
const specials = ref<SpecialSchedule[]>([])
const specialLoading = ref(false)
const specialSaving = ref(false)
const specialErrorMsg = ref<string | null>(null)
const specialModalOpen = ref(false)
const specialEditingId = ref<string | null>(null)
const specialForm = reactive<SpecialForm>({
  event_name: '',
  event_date: '',
  mass_time: '',
  mass_type: '',
  note: '',
  location: '',
  dismiss_after: '',
  sort_order: 0,
})
const specialDeleteId = ref<string | null>(null)
const specialDeleteLabel = ref('')
const specialConfirmOpen = ref(false)

async function fetchSpecials() {
  specialLoading.value = true
  specialErrorMsg.value = null
  const { data, error } = await supabase
    .from('special_mass_schedules')
    .select('*')
    .order('event_date', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) {
    specialErrorMsg.value = 'Gagal memuat jadwal khusus.'
  } else {
    specials.value = data as SpecialSchedule[]
  }
  specialLoading.value = false
}

watch(activeTab, (tab) => {
  if (tab === 'special' && specials.value.length === 0) fetchSpecials()
})

function dayAfter(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// Auto-fill dismiss_after when event_date changes (only if not manually edited)
watch(() => specialForm.event_date, (newDate) => {
  if (!specialEditingId.value) {
    specialForm.dismiss_after = dayAfter(newDate)
  }
})

function openCreateSpecial() {
  specialEditingId.value = null
  Object.assign(specialForm, { event_name: '', event_date: '', mass_time: '', mass_type: '', note: '', location: '', dismiss_after: '', sort_order: 0 })
  specialModalOpen.value = true
}

function openEditSpecial(s: SpecialSchedule) {
  specialEditingId.value = s.id
  Object.assign(specialForm, {
    event_name:    s.event_name,
    event_date:    s.event_date,
    mass_time:     s.mass_time.slice(0, 5),
    mass_type:     s.mass_type,
    note:          s.note ?? '',
    location:      s.location ?? '',
    dismiss_after: s.dismiss_after ?? '',
    sort_order:    s.sort_order,
  })
  specialModalOpen.value = true
}

async function saveSpecial() {
  if (!specialForm.event_name || !specialForm.event_date || !specialForm.mass_time || !specialForm.mass_type) return
  specialSaving.value = true
  specialErrorMsg.value = null

  const payload = {
    event_name:    specialForm.event_name.trim(),
    event_date:    specialForm.event_date,
    mass_time:     specialForm.mass_time,
    mass_type:     specialForm.mass_type.trim(),
    note:          specialForm.note?.trim() || null,
    location:      specialForm.location?.trim() || null,
    dismiss_after: specialForm.dismiss_after || null,
    sort_order:    Number(specialForm.sort_order),
  }

  if (specialEditingId.value) {
    const { error } = await supabase.from('special_mass_schedules').update(payload).eq('id', specialEditingId.value)
    if (error) specialErrorMsg.value = 'Gagal menyimpan perubahan.'
  } else {
    const { error } = await supabase.from('special_mass_schedules').insert({ ...payload, is_active: true })
    if (error) specialErrorMsg.value = 'Gagal menambah jadwal khusus.'
  }

  specialSaving.value = false
  if (!specialErrorMsg.value) {
    specialModalOpen.value = false
    await fetchSpecials()
  }
}

async function toggleSpecialActive(s: SpecialSchedule) {
  const { error } = await supabase.from('special_mass_schedules').update({ is_active: !s.is_active }).eq('id', s.id)
  if (!error) s.is_active = !s.is_active
}

function confirmDeleteSpecial(s: SpecialSchedule) {
  specialDeleteId.value = s.id
  specialDeleteLabel.value = `${s.event_name} — ${s.event_date}`
  specialConfirmOpen.value = true
}

async function doDeleteSpecial() {
  if (!specialDeleteId.value) return
  const { error } = await supabase.from('special_mass_schedules').delete().eq('id', specialDeleteId.value)
  specialConfirmOpen.value = false
  if (!error) await fetchSpecials()
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}
</script>

<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.15em] mb-1">Admin</p>
        <h1 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
          Kelola Jadwal Misa
        </h1>
      </div>
      <button
        v-if="activeTab === 'weekly'"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
        @click="openCreate"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Tambah Jadwal
      </button>
      <button
        v-else
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
        @click="openCreateSpecial"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Tambah Jadwal Khusus
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-[#f4f3f2] p-1 rounded-xl w-fit">
      <button
        v-for="tab in [{ key: 'weekly', label: 'Jadwal Mingguan' }, { key: 'special', label: 'Jadwal Khusus & Hari Raya' }]"
        :key="tab.key"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === tab.key
            ? 'bg-white text-[#1a3b4c] shadow-sm'
            : 'text-[#71787c] hover:text-[#1a3b4c]',
        ]"
        @click="activeTab = tab.key as 'weekly' | 'special'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── Weekly Tab ──────────────────────────────────────────────────── -->
    <template v-if="activeTab === 'weekly'">
      <!-- Error -->
      <div
        v-if="errorMsg"
        class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm"
      >
        <UIcon name="i-lucide-alert-circle" class="size-4 flex-shrink-0" />
        {{ errorMsg }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin" />
      </div>

      <template v-else>
        <div
          v-for="[day, items] in groupedSchedules"
          :key="day"
          class="bg-white rounded-2xl overflow-hidden editorial-shadow"
        >
          <div class="bg-[#1a3b4c] px-6 py-3">
            <h2 class="text-white font-semibold text-sm" style="font-family: 'Noto Serif', serif;">{{ day }}</h2>
          </div>
          <div class="divide-y divide-[#f4f3f2]">
            <div
              v-for="s in items"
              :key="s.id"
              class="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <span class="text-[#1a3b4c] text-xl font-semibold w-14 flex-shrink-0" style="font-family: 'Noto Serif', serif;">
                  {{ fmtTime(s.mass_time) }}
                </span>
                <div class="min-w-0">
                  <p class="text-[#1a1c1c] font-medium text-sm truncate">{{ s.mass_type }}</p>
                  <p v-if="s.note" class="text-[#735a3a] text-xs mt-0.5">{{ s.note }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <UBadge :label="s.is_active ? 'Aktif' : 'Nonaktif'" :color="s.is_active ? 'success' : 'neutral'" variant="subtle" size="sm" />
                <UButton :icon="s.is_active ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="ghost" size="xs" @click="toggleActive(s)" />
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEdit(s)" />
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(s)" />
              </div>
            </div>
          </div>
        </div>
        <p v-if="schedules.length === 0" class="text-center text-[#71787c] py-16">
          Belum ada jadwal. Klik "Tambah Jadwal" untuk mulai.
        </p>
      </template>
    </template>

    <!-- ── Special Tab ─────────────────────────────────────────────────── -->
    <template v-else>
      <div
        v-if="specialErrorMsg"
        class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm"
      >
        <UIcon name="i-lucide-alert-circle" class="size-4 flex-shrink-0" />
        {{ specialErrorMsg }}
      </div>

      <div v-if="specialLoading" class="flex justify-center py-16">
        <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin" />
      </div>

      <template v-else>
        <div
          v-for="s in specials"
          :key="s.id"
          class="bg-white rounded-2xl px-6 py-4 editorial-shadow flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <div class="flex-1 min-w-0">
            <p class="text-[#71787c] text-xs mb-0.5">{{ formatDate(s.event_date) }}</p>
            <p class="text-[#1a3b4c] font-semibold text-sm" style="font-family: 'Noto Serif', serif;">{{ s.event_name }}</p>
            <p class="text-[#41484b] text-xs mt-0.5">{{ fmtTime(s.mass_time) }} — {{ s.mass_type }}<span v-if="s.location"> · {{ s.location }}</span></p>
            <p v-if="s.note" class="text-[#735a3a] text-xs mt-0.5 italic">{{ s.note }}</p>
            <p v-if="s.dismiss_after" class="flex items-center gap-1 text-[#71787c] text-xs mt-1">
              <UIcon name="i-lucide-clock" class="size-3" />
              Auto-dismiss: {{ formatDate(s.dismiss_after) }}
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <UBadge :label="s.is_active ? 'Aktif' : 'Nonaktif'" :color="s.is_active ? 'success' : 'neutral'" variant="subtle" size="sm" />
            <UButton :icon="s.is_active ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="ghost" size="xs" @click="toggleSpecialActive(s)" />
            <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEditSpecial(s)" />
            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDeleteSpecial(s)" />
          </div>
        </div>
        <p v-if="specials.length === 0" class="text-center text-[#71787c] py-16">
          Belum ada jadwal khusus. Klik "Tambah Jadwal Khusus" untuk mulai.
        </p>
      </template>
    </template>

    <!-- ── Add / Edit Modal ─────────────────────────────────────────── -->
    <UModal v-model:open="modalOpen">
      <template #content>
        <div class="p-6 space-y-5">
          <h2 class="text-[#1a3b4c] text-lg font-semibold" style="font-family: 'Noto Serif', serif;">
            {{ editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru' }}
          </h2>

          <!-- Error inside modal -->
          <div
            v-if="errorMsg && modalOpen"
            class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm"
          >
            <UIcon name="i-lucide-alert-circle" class="size-4 flex-shrink-0" />
            {{ errorMsg }}
          </div>

          <div class="space-y-4">
            <!-- Day label -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Hari</label>
              <input
                v-model="form.day_label"
                type="text"
                placeholder="e.g. Minggu"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Time -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Waktu</label>
              <input
                v-model="form.mass_time"
                type="time"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Mass type -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama Misa</label>
              <input
                v-model="form.mass_type"
                type="text"
                placeholder="e.g. Misa Pagi I"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Note -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">
                Catatan <span class="text-[#71787c] font-normal">(opsional)</span>
              </label>
              <input
                v-model="form.note"
                type="text"
                placeholder="e.g. Jumat pertama awal bulan"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Sort order -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Urutan Tampil</label>
              <input
                v-model="form.sort_order"
                type="number"
                min="0"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
              <p class="text-[#71787c] text-xs mt-1">Angka lebih kecil tampil lebih awal.</p>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="modalOpen = false">Batal</button>
            <button
              :disabled="saving || !form.day_label || !form.mass_time || !form.mass_type"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="saveSchedule"
            >
              <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ editingId ? 'Simpan Perubahan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Special Add / Edit Modal ──────────────────────────────────── -->
    <UModal v-model:open="specialModalOpen">
      <template #content>
        <div class="p-6 space-y-5">
          <h2 class="text-[#1a3b4c] text-lg font-semibold" style="font-family: 'Noto Serif', serif;">
            {{ specialEditingId ? 'Edit Jadwal Khusus' : 'Tambah Jadwal Khusus' }}
          </h2>
          <div
            v-if="specialErrorMsg && specialModalOpen"
            class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm"
          >
            <UIcon name="i-lucide-alert-circle" class="size-4 flex-shrink-0" />
            {{ specialErrorMsg }}
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama Acara</label>
              <input v-model="specialForm.event_name" type="text" placeholder="e.g. Misa Malam Natal" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Tanggal</label>
                <input v-model="specialForm.event_date" type="date" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Waktu</label>
                <input v-model="specialForm.mass_time" type="time" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama Misa</label>
              <input v-model="specialForm.mass_type" type="text" placeholder="e.g. Misa Vigili, Misa Fajar" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Lokasi <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <input v-model="specialForm.location" type="text" placeholder="e.g. Gereja Utama, Kapel" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Catatan <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <input v-model="specialForm.note" type="text" placeholder="e.g. Wajib mendaftar sebelumnya" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <!-- Auto-dismiss -->
            <div class="p-4 rounded-xl bg-[#f8f7f5] border border-[#e8e6e3] space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-[#1a1c1c]">
                  Auto-dismiss setelah tanggal
                </label>
                <button
                  v-if="specialForm.dismiss_after"
                  type="button"
                  class="text-xs text-[#71787c] hover:text-red-500 transition-colors"
                  @click="specialForm.dismiss_after = ''"
                >
                  Hapus (tidak pernah)
                </button>
              </div>
              <input
                v-model="specialForm.dismiss_after"
                type="date"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
              <p class="text-[#71787c] text-xs">
                Jadwal disembunyikan dari halaman publik mulai tanggal ini. Default: hari setelah acara.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="specialModalOpen = false">Batal</button>
            <button
              :disabled="specialSaving || !specialForm.event_name || !specialForm.event_date || !specialForm.mass_time || !specialForm.mass_type"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="saveSpecial"
            >
              <UIcon v-if="specialSaving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ specialEditingId ? 'Simpan Perubahan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Special Delete Confirmation ───────────────────────────────── -->
    <UModal v-model:open="specialConfirmOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-trash-2" class="size-5 text-red-600" />
            </div>
            <div>
              <h2 class="text-[#1a1c1c] font-semibold">Hapus Jadwal Khusus?</h2>
              <p class="text-[#41484b] text-sm mt-1">
                <strong>{{ specialDeleteLabel }}</strong> akan dihapus permanen.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="specialConfirmOpen = false">Batal</button>
            <button class="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors" @click="doDeleteSpecial">Hapus</button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Delete Confirmation ──────────────────────────────────────── -->
    <UModal v-model:open="confirmOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-trash-2" class="size-5 text-red-600" />
            </div>
            <div>
              <h2 class="text-[#1a1c1c] font-semibold">Hapus Jadwal?</h2>
              <p class="text-[#41484b] text-sm mt-1">
                Jadwal <strong>{{ deleteLabel }}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="confirmOpen = false">Batal</button>
            <button class="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors" @click="doDelete">Hapus</button>
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>
