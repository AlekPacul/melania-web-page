<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Umat & Paroki — Admin' })

const supabase = useSupabase()
const toast = useToast()

// ── Types ──────────────────────────────────────────────────────────────────
type Role = 'GUEST' | 'MEMBER' | 'ADMIN' | 'PRIEST'

interface Member {
  id: string
  email: string
  name: string | null
  role: Role
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

type MemberForm = {
  name: string
  phone: string
  address: string
  role: Role
}

// ── Constants ───────────────────────────────────────────────────────────────
const ROLES: { value: Role; label: string; color: string; icon: string }[] = [
  { value: 'GUEST',  label: 'Tamu',   color: 'neutral', icon: 'i-lucide-user' },
  { value: 'MEMBER', label: 'Umat',   color: 'success', icon: 'i-lucide-user-check' },
  { value: 'PRIEST', label: 'Pastor', color: 'warning', icon: 'i-lucide-church' },
  { value: 'ADMIN',  label: 'Admin',  color: 'info',    icon: 'i-lucide-shield' },
]

const ROLE_FILTER_OPTIONS = [
  { label: 'Semua Peran', value: '' },
  ...ROLES.map(r => ({ label: r.label, value: r.value })),
]

// ── State ───────────────────────────────────────────────────────────────────
const members  = ref<Member[]>([])
const loading  = ref(true)
const saving   = ref(false)

const searchQuery = ref('')
const filterRole  = ref('')

// Edit modal
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<MemberForm>({
  name:    '',
  phone:   '',
  address: '',
  role:    'GUEST',
})

// Delete confirmation
const confirmOpen = ref(false)
const deleteId    = ref<string | null>(null)
const deleteName  = ref('')

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = computed(() => ({
  total:   members.value.length,
  pending: members.value.filter(m => m.role === 'GUEST').length,
  member:  members.value.filter(m => m.role === 'MEMBER').length,
  clergy:  members.value.filter(m => m.role === 'PRIEST').length,
}))

// ── Data fetching ───────────────────────────────────────────────────────────
async function fetchMembers() {
  loading.value = true
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, role, phone, address, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    toast.add({ title: 'Gagal memuat data', description: 'Tidak dapat mengambil data umat.', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    members.value = data as Member[]
  }
  loading.value = false
}

onMounted(fetchMembers)

// ── Filtered list ───────────────────────────────────────────────────────────
const filtered = computed(() => {
  let list = members.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(m =>
      m.email.toLowerCase().includes(q) ||
      m.name?.toLowerCase().includes(q) ||
      m.phone?.includes(q),
    )
  }

  if (filterRole.value) {
    list = list.filter(m => m.role === filterRole.value)
  }

  return list
})

// ── Helpers ──────────────────────────────────────────────────────────────────
function getRoleMeta(role: Role) {
  return ROLES.find(r => r.value === role) ?? ROLES[0]
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getInitials(m: Member) {
  const src = m.name ?? m.email
  return src
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || '?'
}

// ── Modal ────────────────────────────────────────────────────────────────────
function openEdit(m: Member) {
  editingId.value = m.id
  Object.assign(form, {
    name:    m.name ?? '',
    phone:   m.phone ?? '',
    address: m.address ?? '',
    role:    m.role,
  })
  modalOpen.value = true
}

// Sanitize inputs (OWASP A03)
function buildPayload() {
  return {
    name:       form.name.trim().slice(0, 100) || null,
    phone:      form.phone.trim().slice(0, 30) || null,
    address:    form.address.trim().slice(0, 300) || null,
    role:       form.role,
    updated_at: new Date().toISOString(),
  }
}

async function saveMember() {
  if (!editingId.value) return
  saving.value = true

  const { error } = await supabase
    .from('users')
    .update(buildPayload())
    .eq('id', editingId.value)

  if (error) {
    toast.add({ title: 'Gagal menyimpan', description: 'Tidak dapat memperbarui data umat.', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    toast.add({ title: 'Data disimpan', color: 'success', icon: 'i-lucide-check-circle' })
    modalOpen.value = false
    await fetchMembers()
  }
  saving.value = false
}

// ── Quick verify (GUEST → MEMBER) ────────────────────────────────────────────
async function verifyMember(m: Member) {
  const { error } = await supabase
    .from('users')
    .update({ role: 'MEMBER', updated_at: new Date().toISOString() })
    .eq('id', m.id)

  if (error) {
    toast.add({ title: 'Gagal verifikasi', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    m.role = 'MEMBER'
    toast.add({
      title: `${m.name ?? m.email} telah diverifikasi`,
      color: 'success',
      icon: 'i-lucide-user-check',
    })
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────
function confirmDelete(m: Member) {
  deleteId.value  = m.id
  deleteName.value = m.name ?? m.email
  confirmOpen.value = true
}

async function doDelete() {
  if (!deleteId.value) return
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', deleteId.value)

  confirmOpen.value = false
  if (error) {
    toast.add({ title: 'Gagal menghapus', description: 'Tidak dapat menghapus data umat.', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    toast.add({ title: 'Data umat dihapus', color: 'neutral', icon: 'i-lucide-trash-2' })
    await fetchMembers()
  }
}
</script>

<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <div>
      <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.15em] mb-1">Admin</p>
      <h1 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
        Umat & Paroki
      </h1>
    </div>

    <!-- ── Stats row ────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white rounded-2xl px-4 py-3 editorial-shadow">
        <p class="text-[#71787c] text-xs mb-1">Total Terdaftar</p>
        <p class="text-[#1a3b4c] text-2xl font-semibold">{{ stats.total }}</p>
      </div>
      <div class="bg-white rounded-2xl px-4 py-3 editorial-shadow">
        <p class="text-[#71787c] text-xs mb-1">Menunggu Verifikasi</p>
        <p class="text-amber-600 text-2xl font-semibold">{{ stats.pending }}</p>
      </div>
      <div class="bg-white rounded-2xl px-4 py-3 editorial-shadow">
        <p class="text-[#71787c] text-xs mb-1">Umat Terverifikasi</p>
        <p class="text-green-600 text-2xl font-semibold">{{ stats.member }}</p>
      </div>
      <div class="bg-white rounded-2xl px-4 py-3 editorial-shadow">
        <p class="text-[#71787c] text-xs mb-1">Pastor / Imam</p>
        <p class="text-[#1a3b4c] text-2xl font-semibold">{{ stats.clergy }}</p>
      </div>
    </div>

    <!-- ── Filters ────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71787c] pointer-events-none" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari nama, email, telepon..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
        />
      </div>
      <select
        v-model="filterRole"
        class="px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
      >
        <option v-for="opt in ROLE_FILTER_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- ── Loading ────────────────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin" />
    </div>

    <!-- ── Member list ───────────────────────────────────────────────── -->
    <template v-else>
      <p v-if="filtered.length === 0" class="text-center text-[#71787c] py-16">
        {{ members.length === 0 ? 'Belum ada data umat.' : 'Tidak ada umat yang sesuai filter.' }}
      </p>

      <div v-else class="space-y-2">
        <div
          v-for="m in filtered"
          :key="m.id"
          class="bg-white rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 editorial-shadow"
        >
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-[#1a3b4c] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 select-none">
            {{ getInitials(m) }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-0.5">
              <span class="text-[#1a1c1c] font-semibold text-sm">
                {{ m.name ?? '(Nama belum diisi)' }}
              </span>
              <UBadge
                :label="getRoleMeta(m.role).label"
                :color="getRoleMeta(m.role).color as any"
                variant="subtle"
                size="sm"
              />
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#71787c]">
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-mail" class="size-3" />
                {{ m.email }}
              </span>
              <span v-if="m.phone" class="flex items-center gap-1">
                <UIcon name="i-lucide-phone" class="size-3" />
                {{ m.phone }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" class="size-3" />
                Daftar {{ fmtDate(m.created_at) }}
              </span>
            </div>
            <p v-if="m.address" class="text-[#71787c] text-xs mt-0.5 truncate">
              <UIcon name="i-lucide-map-pin" class="size-3 inline mr-1" />{{ m.address }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- Verify button — only shown for GUEST -->
            <UButton
              v-if="m.role === 'GUEST'"
              label="Verifikasi"
              icon="i-lucide-user-check"
              size="xs"
              color="success"
              variant="subtle"
              @click="verifyMember(m)"
            />
            <UButton
              icon="i-lucide-pencil"
              title="Edit"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="openEdit(m)"
            />
            <UButton
              icon="i-lucide-trash-2"
              title="Hapus"
              color="error"
              variant="ghost"
              size="xs"
              @click="confirmDelete(m)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- ── Edit Modal ─────────────────────────────────────────────────── -->
    <UModal v-model:open="modalOpen">
      <template #content>
        <div class="p-6 space-y-5">
          <h2 class="text-[#1a3b4c] text-lg font-semibold" style="font-family: 'Noto Serif', serif;">
            Edit Data Umat
          </h2>

          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama Lengkap</label>
              <input
                v-model="form.name"
                type="text"
                maxlength="100"
                placeholder="e.g. Maria Susanti"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">No. Telepon</label>
              <input
                v-model="form.phone"
                type="tel"
                maxlength="30"
                placeholder="e.g. 08123456789"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Alamat</label>
              <textarea
                v-model="form.address"
                maxlength="300"
                rows="3"
                placeholder="Alamat lengkap..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition resize-none"
              />
            </div>

            <!-- Role -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Peran</label>
              <select
                v-model="form.role"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              >
                <option v-for="r in ROLES" :key="r.value" :value="r.value">{{ r.label }}</option>
              </select>
              <p class="text-[#71787c] text-xs mt-1">
                Tamu = belum diverifikasi · Umat = terverifikasi · Pastor / Admin = akses penuh
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-[#f4f3f2]">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="modalOpen = false">Batal</button>
            <button
              :disabled="saving"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="saveMember"
            >
              <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              Simpan
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Delete Confirmation ──────────────────────────────────────────── -->
    <UModal v-model:open="confirmOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-trash-2" class="size-5 text-red-600" />
            </div>
            <div>
              <h2 class="text-[#1a1c1c] font-semibold">Hapus Data Umat?</h2>
              <p class="text-[#41484b] text-sm mt-1">
                Data <strong>{{ deleteName }}</strong> akan dihapus dari direktori paroki.
                Akun login mereka tidak terpengaruh.
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
