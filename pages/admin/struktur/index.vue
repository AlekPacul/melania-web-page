<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Struktur Organisasi — Admin' })

const supabase = useSupabase()
const toast = useToast()
const SUPABASE_URL = 'https://cllrlcjrlhzrlwnrnwze.supabase.co'

// ── Types ──────────────────────────────────────────────────────────────────
interface Group {
  id: string
  name: string
  description: string | null
  sort_order: number
  is_active: boolean
}

interface Member {
  id: string
  group_id: string
  name: string
  title: string
  photo_url: string | null
  sort_order: number
  is_active: boolean
}

// ── State ───────────────────────────────────────────────────────────────────
const activeTab   = ref<'groups' | 'members'>('groups')
const groups      = ref<Group[]>([])
const members     = ref<Member[]>([])
const loading     = ref(true)
const saving      = ref(false)

// Group modal
const groupModalOpen = ref(false)
const editingGroupId = ref<string | null>(null)
const groupForm = reactive({ name: '', description: '', sort_order: 0 })

// Member modal
const memberModalOpen  = ref(false)
const editingMemberId  = ref<string | null>(null)
const memberForm = reactive({ group_id: '', name: '', title: '', sort_order: 0 })
const memberImageFile    = ref<File | null>(null)
const memberImagePreview = ref<string | null>(null)
const memberImageInput   = ref<HTMLInputElement | null>(null)
const existingPhotoUrl   = ref<string | null>(null)

// Delete
const confirmOpen  = ref(false)
const deleteId     = ref<string | null>(null)
const deleteLabel  = ref('')
const deleteType   = ref<'group' | 'member'>('group')

// Filter for members tab
const filterGroupId = ref('')

// ── Fetch ────────────────────────────────────────────────────────────────────
async function fetchGroups() {
  loading.value = true
  const { data, error } = await supabase
    .from('parish_groups')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) toast.add({ title: 'Gagal memuat kelompok', color: 'error', icon: 'i-lucide-alert-circle' })
  else groups.value = data as Group[]
  loading.value = false
}

async function fetchMembers() {
  loading.value = true
  const { data, error } = await supabase
    .from('parish_members')
    .select('*')
    .order('group_id')
    .order('sort_order', { ascending: true })
  if (error) toast.add({ title: 'Gagal memuat anggota', color: 'error', icon: 'i-lucide-alert-circle' })
  else members.value = data as Member[]
  loading.value = false
}

onMounted(() => {
  fetchGroups()
  fetchMembers()
})

watch(activeTab, (tab) => {
  if (tab === 'members' && members.value.length === 0) fetchMembers()
})

// ── Computed ─────────────────────────────────────────────────────────────────
const filteredMembers = computed(() => {
  if (!filterGroupId.value) return members.value
  return members.value.filter(m => m.group_id === filterGroupId.value)
})

function groupName(id: string) {
  return groups.value.find(g => g.id === id)?.name ?? '—'
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

// ── Group modal ───────────────────────────────────────────────────────────────
function openCreateGroup() {
  editingGroupId.value = null
  Object.assign(groupForm, { name: '', description: '', sort_order: 0 })
  groupModalOpen.value = true
}

function openEditGroup(g: Group) {
  editingGroupId.value = g.id
  Object.assign(groupForm, { name: g.name, description: g.description ?? '', sort_order: g.sort_order })
  groupModalOpen.value = true
}

async function saveGroup() {
  if (!groupForm.name.trim()) return
  saving.value = true
  const payload = {
    name:        groupForm.name.trim().slice(0, 100),
    description: groupForm.description.trim().slice(0, 500) || null,
    sort_order:  Number(groupForm.sort_order),
  }
  if (editingGroupId.value) {
    const { error } = await supabase.from('parish_groups').update(payload).eq('id', editingGroupId.value)
    if (error) toast.add({ title: 'Gagal menyimpan', color: 'error', icon: 'i-lucide-alert-circle' })
    else { toast.add({ title: 'Kelompok disimpan', color: 'success', icon: 'i-lucide-check-circle' }); groupModalOpen.value = false; await fetchGroups() }
  } else {
    const { error } = await supabase.from('parish_groups').insert({ ...payload, is_active: true })
    if (error) toast.add({ title: 'Gagal menambah', color: 'error', icon: 'i-lucide-alert-circle' })
    else { toast.add({ title: 'Kelompok ditambahkan', color: 'success', icon: 'i-lucide-check-circle' }); groupModalOpen.value = false; await fetchGroups() }
  }
  saving.value = false
}

async function toggleGroupActive(g: Group) {
  const { error } = await supabase.from('parish_groups').update({ is_active: !g.is_active }).eq('id', g.id)
  if (!error) g.is_active = !g.is_active
}

// ── Member modal ─────────────────────────────────────────────────────────────
function openCreateMember(groupId = '') {
  editingMemberId.value = null
  Object.assign(memberForm, { group_id: groupId, name: '', title: '', sort_order: 0 })
  memberImageFile.value = null
  memberImagePreview.value = null
  existingPhotoUrl.value = null
  memberModalOpen.value = true
}

function openEditMember(m: Member) {
  editingMemberId.value = m.id
  Object.assign(memberForm, { group_id: m.group_id, name: m.name, title: m.title, sort_order: m.sort_order })
  memberImageFile.value = null
  existingPhotoUrl.value = m.photo_url
  memberImagePreview.value = m.photo_url
  memberModalOpen.value = true
}

function onMemberImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  memberImageFile.value = file
  memberImagePreview.value = URL.createObjectURL(file)
}

function clearMemberImage() {
  memberImageFile.value = null
  memberImagePreview.value = null
  existingPhotoUrl.value = null
  if (memberImageInput.value) memberImageInput.value.value = ''
}

async function uploadMemberPhoto(): Promise<string | null> {
  if (!memberImageFile.value) return existingPhotoUrl.value
  const ext = memberImageFile.value.name.split('.').pop() ?? 'jpg'
  const path = `members/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('member-photos').upload(path, memberImageFile.value, { upsert: true })
  if (error) { toast.add({ title: 'Gagal mengunggah foto', color: 'error', icon: 'i-lucide-alert-circle' }); return null }
  return `${SUPABASE_URL}/storage/v1/object/public/member-photos/${path}`
}

async function saveMember() {
  if (!memberForm.name.trim() || !memberForm.title.trim() || !memberForm.group_id) return
  saving.value = true
  const photoUrl = await uploadMemberPhoto()
  if (memberImageFile.value && photoUrl === null) { saving.value = false; return }

  const payload = {
    group_id:   memberForm.group_id,
    name:       memberForm.name.trim().slice(0, 100),
    title:      memberForm.title.trim().slice(0, 100),
    photo_url:  photoUrl,
    sort_order: Number(memberForm.sort_order),
  }

  if (editingMemberId.value) {
    const { error } = await supabase.from('parish_members').update(payload).eq('id', editingMemberId.value)
    if (error) toast.add({ title: 'Gagal menyimpan', color: 'error', icon: 'i-lucide-alert-circle' })
    else { toast.add({ title: 'Anggota disimpan', color: 'success', icon: 'i-lucide-check-circle' }); memberModalOpen.value = false; await fetchMembers() }
  } else {
    const { error } = await supabase.from('parish_members').insert({ ...payload, is_active: true })
    if (error) toast.add({ title: 'Gagal menambah', color: 'error', icon: 'i-lucide-alert-circle' })
    else { toast.add({ title: 'Anggota ditambahkan', color: 'success', icon: 'i-lucide-check-circle' }); memberModalOpen.value = false; await fetchMembers() }
  }
  saving.value = false
}

async function toggleMemberActive(m: Member) {
  const { error } = await supabase.from('parish_members').update({ is_active: !m.is_active }).eq('id', m.id)
  if (!error) m.is_active = !m.is_active
}

// ── Delete ────────────────────────────────────────────────────────────────────
function confirmDelete(id: string, label: string, type: 'group' | 'member') {
  deleteId.value = id
  deleteLabel.value = label
  deleteType.value = type
  confirmOpen.value = true
}

async function doDelete() {
  if (!deleteId.value) return
  const table = deleteType.value === 'group' ? 'parish_groups' : 'parish_members'
  const { error } = await supabase.from(table).delete().eq('id', deleteId.value)
  confirmOpen.value = false
  if (error) toast.add({ title: 'Gagal menghapus', color: 'error', icon: 'i-lucide-alert-circle' })
  else {
    toast.add({ title: 'Dihapus', color: 'neutral', icon: 'i-lucide-trash-2' })
    if (deleteType.value === 'group') { await fetchGroups(); await fetchMembers() }
    else await fetchMembers()
  }
}
</script>

<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.15em] mb-1">Admin</p>
        <h1 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
          Struktur Organisasi
        </h1>
      </div>
      <button
        v-if="activeTab === 'groups'"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
        @click="openCreateGroup"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Tambah Kelompok
      </button>
      <button
        v-else
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
        @click="openCreateMember()"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Tambah Anggota
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-[#f4f3f2] p-1 rounded-xl w-fit">
      <button
        v-for="tab in [{ key: 'groups', label: 'Kelompok / Organisasi' }, { key: 'members', label: 'Anggota' }]"
        :key="tab.key"
        :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', activeTab === tab.key ? 'bg-white text-[#1a3b4c] shadow-sm' : 'text-[#71787c] hover:text-[#1a3b4c]']"
        @click="activeTab = tab.key as 'groups' | 'members'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin" />
    </div>

    <!-- ── Groups tab ─────────────────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'groups'">
      <p v-if="groups.length === 0" class="text-center text-[#71787c] py-16">
        Belum ada kelompok. Klik "Tambah Kelompok" untuk mulai.
      </p>
      <div v-else class="space-y-3">
        <div
          v-for="g in groups"
          :key="g.id"
          class="bg-white rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 editorial-shadow"
          :class="{ 'opacity-60': !g.is_active }"
        >
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-0.5">
              <span class="text-[#1a3b4c] font-semibold text-sm">{{ g.name }}</span>
              <UBadge :label="g.is_active ? 'Aktif' : 'Nonaktif'" :color="g.is_active ? 'success' : 'neutral'" variant="subtle" size="sm" />
              <span class="text-[#71787c] text-xs">
                {{ members.filter(m => m.group_id === g.id).length }} anggota
              </span>
            </div>
            <p v-if="g.description" class="text-[#71787c] text-xs mt-0.5 line-clamp-1">{{ g.description }}</p>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1a3b4c] bg-[#f4f3f2] hover:bg-[#eae9e7] transition-colors"
              @click="() => { activeTab = 'members'; filterGroupId = g.id }"
            >
              <UIcon name="i-lucide-users" class="size-3.5" />
              Lihat Anggota
            </button>
            <UButton :icon="g.is_active ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="ghost" size="xs" @click="toggleGroupActive(g)" />
            <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEditGroup(g)" />
            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(g.id, g.name, 'group')" />
          </div>
        </div>
      </div>
    </template>

    <!-- ── Members tab ────────────────────────────────────────────────────── -->
    <template v-else>
      <!-- Filter by group -->
      <div class="flex items-center gap-3">
        <select
          v-model="filterGroupId"
          class="px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
        >
          <option value="">Semua Kelompok</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
      </div>

      <p v-if="filteredMembers.length === 0" class="text-center text-[#71787c] py-16">
        Belum ada anggota.
      </p>
      <div v-else class="space-y-3">
        <div
          v-for="m in filteredMembers"
          :key="m.id"
          class="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 editorial-shadow"
          :class="{ 'opacity-60': !m.is_active }"
        >
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full overflow-hidden bg-[#1a3b4c]/10 flex items-center justify-center flex-shrink-0">
            <img v-if="m.photo_url" :src="m.photo_url" :alt="m.name" class="w-full h-full object-cover" />
            <span v-else class="text-[#1a3b4c] text-sm font-semibold">{{ initials(m.name) }}</span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-0.5">
              <span class="text-[#1a1c1c] font-semibold text-sm">{{ m.name }}</span>
              <UBadge :label="m.is_active ? 'Aktif' : 'Nonaktif'" :color="m.is_active ? 'success' : 'neutral'" variant="subtle" size="sm" />
            </div>
            <p class="text-[#735a3a] text-xs">{{ m.title }}</p>
            <p class="text-[#71787c] text-xs mt-0.5">{{ groupName(m.group_id) }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <UButton :icon="m.is_active ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="ghost" size="xs" @click="toggleMemberActive(m)" />
            <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="openEditMember(m)" />
            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" @click="confirmDelete(m.id, m.name, 'member')" />
          </div>
        </div>
      </div>
    </template>

    <!-- ── Group Modal ────────────────────────────────────────────────────── -->
    <UModal v-model:open="groupModalOpen">
      <template #content>
        <div class="p-6 space-y-5">
          <h2 class="text-[#1a3b4c] text-lg font-semibold" style="font-family: 'Noto Serif', serif;">
            {{ editingGroupId ? 'Edit Kelompok' : 'Tambah Kelompok Baru' }}
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama Kelompok <span class="text-red-500">*</span></label>
              <input v-model="groupForm.name" type="text" maxlength="100" placeholder="e.g. Imam Paroki, OMK, Dewan Paroki" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Deskripsi <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <textarea v-model="groupForm.description" maxlength="500" rows="3" placeholder="Penjelasan singkat tentang kelompok ini..." class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition resize-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Urutan Tampil</label>
              <input v-model="groupForm.sort_order" type="number" min="0" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
              <p class="text-[#71787c] text-xs mt-1">Angka lebih kecil tampil lebih awal.</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="groupModalOpen = false">Batal</button>
            <button :disabled="saving || !groupForm.name.trim()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" @click="saveGroup">
              <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ editingGroupId ? 'Simpan Perubahan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Member Modal ───────────────────────────────────────────────────── -->
    <UModal v-model:open="memberModalOpen">
      <template #content>
        <div class="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          <h2 class="text-[#1a3b4c] text-lg font-semibold sticky top-0 bg-white pb-2" style="font-family: 'Noto Serif', serif;">
            {{ editingMemberId ? 'Edit Anggota' : 'Tambah Anggota Baru' }}
          </h2>
          <div class="space-y-4">
            <!-- Group -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Kelompok <span class="text-red-500">*</span></label>
              <select v-model="memberForm.group_id" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition">
                <option value="" disabled>Pilih kelompok...</option>
                <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
              </select>
            </div>
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Nama <span class="text-red-500">*</span></label>
              <input v-model="memberForm.name" type="text" maxlength="100" placeholder="e.g. Rm. Yohanes Berchmans" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Jabatan <span class="text-red-500">*</span></label>
              <input v-model="memberForm.title" type="text" maxlength="100" placeholder="e.g. Pastor Kepala, Ketua, Wakil Ketua" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
            <!-- Photo -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Foto <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <div v-if="memberImagePreview" class="relative mb-3 w-20 h-20 rounded-full overflow-hidden mx-auto">
                <img :src="memberImagePreview" alt="Preview" class="w-full h-full object-cover" />
                <button type="button" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full" @click="clearMemberImage">
                  <UIcon name="i-lucide-x" class="size-4 text-white" />
                </button>
              </div>
              <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#d9d9d9] bg-[#faf9f8] hover:bg-[#f4f3f2] cursor-pointer transition-colors">
                <UIcon name="i-lucide-upload" class="size-4 text-[#71787c] flex-shrink-0" />
                <span class="text-sm text-[#71787c]">{{ memberImageFile ? memberImageFile.name : 'Pilih foto (JPG, PNG, WebP · maks. 3MB)' }}</span>
                <input ref="memberImageInput" type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="onMemberImageChange" />
              </label>
            </div>
            <!-- Sort order -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Urutan Tampil</label>
              <input v-model="memberForm.sort_order" type="number" min="0" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t border-[#f4f3f2]">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="memberModalOpen = false">Batal</button>
            <button :disabled="saving || !memberForm.name.trim() || !memberForm.title.trim() || !memberForm.group_id" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" @click="saveMember">
              <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ editingMemberId ? 'Simpan Perubahan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ── Delete Confirmation ────────────────────────────────────────────── -->
    <UModal v-model:open="confirmOpen">
      <template #content>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-trash-2" class="size-5 text-red-600" />
            </div>
            <div>
              <h2 class="text-[#1a1c1c] font-semibold">Hapus {{ deleteType === 'group' ? 'Kelompok' : 'Anggota' }}?</h2>
              <p class="text-[#41484b] text-sm mt-1">
                <strong>{{ deleteLabel }}</strong> akan dihapus permanen.
                <template v-if="deleteType === 'group'"> Semua anggota di kelompok ini juga akan terhapus.</template>
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
