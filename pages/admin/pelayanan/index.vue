<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Kelola Pelayanan — Admin' })

const supabase = useSupabase()
const toast = useToast()

const SUPABASE_URL = 'https://cllrlcjrlhzrlwnrnwze.supabase.co'

// ── Types ──────────────────────────────────────────────────────────────────
type MinistryColor = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'teal' | 'indigo'

interface Ministry {
  id: string
  name: string
  slug: string
  description: string | null
  long_description: string | null
  icon: string
  color: MinistryColor
  image_url: string | null
  meeting_schedule: string | null
  contact_name: string | null
  contact_phone: string | null
  sort_order: number
  is_published: boolean
  created_by: string | null
  created_at: string
}

type MinistryForm = {
  name: string
  slug: string
  description: string
  long_description: string
  icon: string
  color: MinistryColor
  image_url: string
  meeting_schedule: string
  contact_name: string
  contact_phone: string
  sort_order: number
  is_published: boolean
}

// ── Constants ───────────────────────────────────────────────────────────────
const COLORS: { value: MinistryColor; label: string; dot: string }[] = [
  { value: 'blue',   label: 'Biru',   dot: 'bg-blue-500' },
  { value: 'green',  label: 'Hijau',  dot: 'bg-green-500' },
  { value: 'amber',  label: 'Kuning', dot: 'bg-amber-500' },
  { value: 'purple', label: 'Ungu',   dot: 'bg-purple-500' },
  { value: 'red',    label: 'Merah',  dot: 'bg-red-500' },
  { value: 'teal',   label: 'Teal',   dot: 'bg-teal-500' },
  { value: 'indigo', label: 'Indigo', dot: 'bg-indigo-500' },
]

const COLOR_BAR: Record<MinistryColor, string> = {
  blue: 'bg-blue-500', green: 'bg-green-500', amber: 'bg-amber-500',
  purple: 'bg-purple-500', red: 'bg-red-500', teal: 'bg-teal-500', indigo: 'bg-indigo-500',
}
const COLOR_BG: Record<MinistryColor, string> = {
  blue: 'bg-blue-100', green: 'bg-green-100', amber: 'bg-amber-100',
  purple: 'bg-purple-100', red: 'bg-red-100', teal: 'bg-teal-100', indigo: 'bg-indigo-100',
}
const COLOR_ICON: Record<MinistryColor, string> = {
  blue: 'text-blue-600', green: 'text-green-600', amber: 'text-amber-600',
  purple: 'text-purple-600', red: 'text-red-600', teal: 'text-teal-600', indigo: 'text-indigo-600',
}

// ── State ───────────────────────────────────────────────────────────────────
const ministries = ref<Ministry[]>([])
const loading    = ref(true)
const saving     = ref(false)

const searchQuery = ref('')

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<MinistryForm>({
  name: '', slug: '', description: '', long_description: '',
  icon: 'i-lucide-heart-handshake', color: 'blue',
  image_url: '', meeting_schedule: '', contact_name: '', contact_phone: '',
  sort_order: 0, is_published: false,
})

const imageFile    = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const imageInput   = ref<HTMLInputElement | null>(null)

const confirmOpen = ref(false)
const deleteId    = ref<string | null>(null)
const deleteTitle = ref('')

// ── Fetch ───────────────────────────────────────────────────────────────────
async function fetchMinistries() {
  loading.value = true
  const { data, error } = await supabase
    .from('ministries')
    .select('id, name, slug, description, long_description, icon, color, image_url, meeting_schedule, contact_name, contact_phone, sort_order, is_published, created_by, created_at')
    .order('sort_order', { ascending: true })

  if (error) {
    toast.add({ title: 'Gagal memuat data', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    ministries.value = data as Ministry[]
  }
  loading.value = false
}

onMounted(fetchMinistries)

// ── Filtered list ────────────────────────────────────────────────────────────
const filtered = computed(() => {
  if (!searchQuery.value.trim()) return ministries.value
  const q = searchQuery.value.trim().toLowerCase()
  return ministries.value.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.description?.toLowerCase().includes(q),
  )
})

// ── Slug helper ──────────────────────────────────────────────────────────────
function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

watch(() => form.name, (val) => {
  if (!editingId.value) {
    form.slug = toSlug(val)
  }
})

// ── Image helpers ────────────────────────────────────────────────────────────
function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = null
  form.image_url = ''
  if (imageInput.value) imageInput.value.value = ''
}

async function uploadImage(): Promise<string | null> {
  if (!imageFile.value) return form.image_url || null
  const ext = imageFile.value.name.split('.').pop() ?? 'jpg'
  const path = `ministries/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from('ministry-images')
    .upload(path, imageFile.value, { upsert: true })
  if (error) {
    toast.add({ title: 'Gagal mengunggah gambar', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
    return null
  }
  return `${SUPABASE_URL}/storage/v1/object/public/ministry-images/${path}`
}

// ── Modal helpers ────────────────────────────────────────────────────────────
function openCreate() {
  editingId.value = null
  const nextOrder = ministries.value.length
    ? Math.max(...ministries.value.map(m => m.sort_order)) + 1
    : 1
  Object.assign(form, {
    name: '', slug: '', description: '', long_description: '',
    icon: 'i-lucide-heart-handshake', color: 'blue',
    image_url: '', meeting_schedule: '', contact_name: '', contact_phone: '',
    sort_order: nextOrder, is_published: false,
  })
  imageFile.value = null
  imagePreview.value = null
  modalOpen.value = true
}

function openEdit(m: Ministry) {
  editingId.value = m.id
  Object.assign(form, {
    name: m.name, slug: m.slug,
    description: m.description ?? '',
    long_description: m.long_description ?? '',
    icon: m.icon, color: m.color,
    image_url: m.image_url ?? '',
    meeting_schedule: m.meeting_schedule ?? '',
    contact_name: m.contact_name ?? '',
    contact_phone: m.contact_phone ?? '',
    sort_order: m.sort_order, is_published: m.is_published,
  })
  imageFile.value = null
  imagePreview.value = m.image_url ?? null
  modalOpen.value = true
}

// ── Save ─────────────────────────────────────────────────────────────────────
const isFormValid = computed(() =>
  form.name.trim().length > 0 && form.slug.trim().length > 0,
)

function buildPayload(imageUrl: string | null, userId?: string) {
  return {
    name:             form.name.trim().slice(0, 200),
    slug:             form.slug.trim().slice(0, 100),
    description:      form.description.trim().slice(0, 500) || null,
    long_description: form.long_description.trim().slice(0, 10000) || null,
    icon:             form.icon.trim().slice(0, 100) || 'i-lucide-heart-handshake',
    color:            form.color,
    image_url:        imageUrl,
    meeting_schedule: form.meeting_schedule.trim().slice(0, 300) || null,
    contact_name:     form.contact_name.trim().slice(0, 200) || null,
    contact_phone:    form.contact_phone.trim().slice(0, 30) || null,
    sort_order:       form.sort_order,
    is_published:     form.is_published,
    ...(userId ? { created_by: userId } : {}),
  }
}

async function saveMinistry() {
  if (!isFormValid.value) return
  saving.value = true

  const imageUrl = await uploadImage()
  if (imageFile.value && imageUrl === null) {
    saving.value = false
    return
  }

  if (editingId.value) {
    const { error } = await supabase
      .from('ministries')
      .update(buildPayload(imageUrl))
      .eq('id', editingId.value)

    if (error) {
      toast.add({ title: 'Gagal menyimpan', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
    } else {
      toast.add({ title: 'Berhasil disimpan', color: 'success', icon: 'i-lucide-check-circle' })
      modalOpen.value = false
      await fetchMinistries()
    }
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.add({ title: 'Sesi tidak valid', description: 'Silakan login kembali.', color: 'error', icon: 'i-lucide-log-in' })
      saving.value = false
      return
    }
    const { error } = await supabase
      .from('ministries')
      .insert(buildPayload(imageUrl, user.id))

    if (error) {
      toast.add({ title: 'Gagal menambah', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
    } else {
      toast.add({ title: 'Pelayanan ditambahkan', color: 'success', icon: 'i-lucide-check-circle' })
      modalOpen.value = false
      await fetchMinistries()
    }
  }

  saving.value = false
}

// ── Toggle published ─────────────────────────────────────────────────────────
async function togglePublished(m: Ministry) {
  const next = !m.is_published
  const { error } = await supabase.from('ministries').update({ is_published: next }).eq('id', m.id)
  if (error) {
    toast.add({ title: 'Gagal mengubah status', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    m.is_published = next
    toast.add({
      title: next ? 'Pelayanan dipublikasi' : 'Pelayanan dijadikan draf',
      color: next ? 'success' : 'neutral',
      icon: next ? 'i-lucide-globe' : 'i-lucide-file',
    })
  }
}

// ── Sort order ───────────────────────────────────────────────────────────────
async function moveItem(m: Ministry, direction: 'up' | 'down') {
  const list = [...ministries.value]
  const idx = list.findIndex(x => x.id === m.id)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= list.length) return

  const a = list[idx]
  const b = list[swapIdx]
  const aOrder = a.sort_order
  const bOrder = b.sort_order
  const newAOrder = aOrder === bOrder ? (direction === 'up' ? aOrder - 1 : aOrder + 1) : bOrder
  const newBOrder = aOrder === bOrder ? (direction === 'up' ? bOrder + 1 : bOrder - 1) : aOrder

  const [r1, r2] = await Promise.all([
    supabase.from('ministries').update({ sort_order: newAOrder }).eq('id', a.id),
    supabase.from('ministries').update({ sort_order: newBOrder }).eq('id', b.id),
  ])
  if (r1.error || r2.error) {
    toast.add({ title: 'Gagal mengubah urutan', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    await fetchMinistries()
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────
function confirmDelete(m: Ministry) {
  deleteId.value = m.id
  deleteTitle.value = m.name
  confirmOpen.value = true
}

async function doDelete() {
  if (!deleteId.value) return
  const { error } = await supabase.from('ministries').delete().eq('id', deleteId.value)
  confirmOpen.value = false
  if (error) {
    toast.add({ title: 'Gagal menghapus', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    toast.add({ title: 'Pelayanan dihapus', color: 'neutral', icon: 'i-lucide-trash-2' })
    await fetchMinistries()
  }
}
</script>

<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

    <!-- ── Header ─────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.15em] mb-1">Admin</p>
        <h1 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
          Kelola Pelayanan
        </h1>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
        @click="openCreate"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Tambah Pelayanan
      </button>
    </div>

    <!-- ── Search ────────────────────────────────────────────────── -->
    <div class="relative max-w-sm">
      <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71787c] pointer-events-none" />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Cari nama pelayanan..."
        class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
      />
    </div>

    <!-- ── Loading ───────────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin" />
    </div>

    <!-- ── List ──────────────────────────────────────────────────── -->
    <template v-else>
      <p v-if="filtered.length === 0" class="text-center text-[#71787c] py-16">
        {{ ministries.length === 0 ? 'Belum ada pelayanan. Klik "Tambah Pelayanan" untuk mulai.' : 'Tidak ada pelayanan yang sesuai pencarian.' }}
      </p>

      <div v-else class="space-y-3">
        <div
          v-for="(m, idx) in filtered"
          :key="m.id"
          class="bg-white rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 editorial-shadow"
          :class="{ 'opacity-60': !m.is_published }"
        >
          <!-- Icon -->
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="COLOR_BG[m.color]"
          >
            <UIcon :name="m.icon" class="size-5" :class="COLOR_ICON[m.color]" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-0.5">
              <span class="text-[#1a1c1c] font-semibold text-sm truncate">{{ m.name }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="[COLOR_BG[m.color], COLOR_ICON[m.color]]">{{ m.color }}</span>
              <UBadge :label="m.is_published ? 'Dipublikasi' : 'Draf'" :color="m.is_published ? 'success' : 'neutral'" variant="subtle" size="sm" />
            </div>
            <p v-if="m.description" class="text-[#71787c] text-xs line-clamp-1">{{ m.description }}</p>
            <p class="text-[#c1c7cc] text-xs mt-0.5">Urutan: {{ m.sort_order }} · /pelayanan/{{ m.slug }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- Sort order arrows -->
            <UButton icon="i-lucide-chevron-up" title="Naikan urutan" color="neutral" variant="ghost" size="xs" :disabled="idx === 0" @click="moveItem(m, 'up')" />
            <UButton icon="i-lucide-chevron-down" title="Turunkan urutan" color="neutral" variant="ghost" size="xs" :disabled="idx === filtered.length - 1" @click="moveItem(m, 'down')" />
            <div class="w-px h-5 bg-[#e8e4df] mx-1" />
            <UButton :icon="m.is_published ? 'i-lucide-eye-off' : 'i-lucide-globe'" :title="m.is_published ? 'Jadikan Draf' : 'Publikasikan'" color="neutral" variant="ghost" size="xs" @click="togglePublished(m)" />
            <UButton icon="i-lucide-pencil" title="Edit" color="neutral" variant="ghost" size="xs" @click="openEdit(m)" />
            <UButton icon="i-lucide-trash-2" title="Hapus" color="error" variant="ghost" size="xs" @click="confirmDelete(m)" />
          </div>
        </div>
      </div>
    </template>

    <!-- ── Add / Edit Modal ───────────────────────────────────────── -->
    <UModal v-model:open="modalOpen">
      <template #content>
        <div class="p-6 space-y-5 max-h-[90vh] overflow-y-auto">
          <h2 class="text-[#1a3b4c] text-lg font-semibold sticky top-0 bg-white pb-2 border-b border-[#f4f3f2]" style="font-family: 'Noto Serif', serif;">
            {{ editingId ? 'Edit Pelayanan' : 'Tambah Pelayanan Baru' }}
          </h2>

          <div class="space-y-4">

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                maxlength="200"
                placeholder="e.g. Pelayanan Ekaristi"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Slug -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">
                Slug URL <span class="text-red-500">*</span>
                <span class="text-[#71787c] font-normal text-xs ml-1">(auto dari nama)</span>
              </label>
              <div class="flex items-center gap-0">
                <span class="flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-[#d9d9d9] bg-[#f4f3f2] text-[#71787c] text-xs">/pelayanan/</span>
                <input
                  v-model="form.slug"
                  type="text"
                  maxlength="100"
                  placeholder="nama-pelayanan"
                  class="flex-1 px-3.5 py-2.5 rounded-r-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
                />
              </div>
            </div>

            <!-- Icon -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Icon Lucide</label>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#f4f3f2] flex items-center justify-center flex-shrink-0">
                  <UIcon :name="form.icon || 'i-lucide-heart-handshake'" class="size-5 text-[#41484b]" />
                </div>
                <input
                  v-model="form.icon"
                  type="text"
                  maxlength="100"
                  placeholder="i-lucide-heart-handshake"
                  class="flex-1 px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
                />
              </div>
              <p class="text-[#71787c] text-xs mt-1">Cari nama ikon di <a href="https://lucide.dev/icons/" target="_blank" class="underline">lucide.dev</a>, format: i-lucide-nama-ikon</p>
            </div>

            <!-- Color -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-2">Warna Aksen</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="c in COLORS"
                  :key="c.value"
                  type="button"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
                  :class="form.color === c.value
                    ? 'border-[#1a3b4c] bg-[#1a3b4c]/5 text-[#1a3b4c]'
                    : 'border-[#d9d9d9] text-[#41484b] hover:border-[#c1c7cc]'"
                  @click="form.color = c.value"
                >
                  <span class="w-3 h-3 rounded-full flex-shrink-0" :class="c.dot" />
                  {{ c.label }}
                </button>
              </div>
            </div>

            <!-- Short description -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Deskripsi Singkat <span class="text-[#71787c] font-normal">(opsional, maks. 500 karakter)</span></label>
              <textarea
                v-model="form.description"
                maxlength="500"
                rows="2"
                placeholder="Deskripsi singkat yang muncul di kartu pelayanan..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition resize-none"
              />
              <p class="text-[#71787c] text-xs mt-1 text-right">{{ form.description.length }}/500</p>
            </div>

            <!-- Long description -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Deskripsi Lengkap <span class="text-[#71787c] font-normal">(opsional — muncul di halaman detail)</span></label>
              <textarea
                v-model="form.long_description"
                maxlength="10000"
                rows="5"
                placeholder="Ceritakan lebih lengkap tentang pelayanan ini, kegiatan-kegiatannya, cara bergabung..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition resize-none"
              />
              <p class="text-[#71787c] text-xs mt-1 text-right">{{ form.long_description.length }}/10000</p>
            </div>

            <!-- Meeting schedule -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Jadwal Pertemuan <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <input
                v-model="form.meeting_schedule"
                type="text"
                maxlength="300"
                placeholder="e.g. Setiap Minggu ke-2, pukul 10.00 WIB"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Contact -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama Koordinator <span class="text-[#71787c] font-normal">(opsional)</span></label>
                <input
                  v-model="form.contact_name"
                  type="text"
                  maxlength="200"
                  placeholder="e.g. Bapak Antonius"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">No. HP/WA <span class="text-[#71787c] font-normal">(opsional)</span></label>
                <input
                  v-model="form.contact_phone"
                  type="tel"
                  maxlength="30"
                  placeholder="e.g. 081234567890"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
                />
              </div>
            </div>

            <!-- Image upload -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Gambar <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <div v-if="imagePreview" class="relative mb-3 rounded-xl overflow-hidden bg-[#f4f3f2]">
                <img :src="imagePreview" alt="Preview" class="w-full h-40 object-cover" />
                <button type="button" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center" @click="clearImage">
                  <UIcon name="i-lucide-x" class="size-3.5" />
                </button>
              </div>
              <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#d9d9d9] bg-[#faf9f8] hover:bg-[#f4f3f2] cursor-pointer transition-colors">
                <UIcon name="i-lucide-upload" class="size-4 text-[#71787c] flex-shrink-0" />
                <span class="text-sm text-[#71787c]">{{ imageFile ? imageFile.name : 'Pilih gambar (JPG, PNG, WebP · maks. 5MB)' }}</span>
                <input ref="imageInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only" @change="onImageChange" />
              </label>
            </div>

            <!-- Sort order + published -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nomor Urut</label>
                <input
                  v-model.number="form.sort_order"
                  type="number"
                  min="0"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
                />
              </div>
              <div class="flex items-end pb-0.5">
                <div class="flex items-center justify-between w-full p-3.5 rounded-xl bg-[#f8f7f5] border border-[#e8e6e3]">
                  <div>
                    <p class="text-sm font-medium text-[#1a1c1c]">Publikasikan</p>
                    <p class="text-xs text-[#71787c]">Tampil di halaman publik</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="form.is_published"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                    :class="form.is_published ? 'bg-[#1a3b4c]' : 'bg-[#d9d9d9]'"
                    @click="form.is_published = !form.is_published"
                  >
                    <span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform" :class="form.is_published ? 'translate-x-6' : 'translate-x-1'" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div class="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t border-[#f4f3f2]">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="modalOpen = false">Batal</button>
            <button
              :disabled="saving || !isFormValid"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="saveMinistry"
            >
              <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ editingId ? 'Simpan Perubahan' : 'Tambah Pelayanan' }}
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Delete Confirmation ────────────────────────────────────── -->
    <UModal v-model:open="confirmOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-trash-2" class="size-5 text-red-600" />
            </div>
            <div>
              <h2 class="text-[#1a1c1c] font-semibold">Hapus Pelayanan?</h2>
              <p class="text-[#41484b] text-sm mt-1">
                Pelayanan <strong>{{ deleteTitle }}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
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
