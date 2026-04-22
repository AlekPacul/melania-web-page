<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Kelola Kegiatan — Admin' })

const supabase = useSupabase()
const toast = useToast()

const SUPABASE_URL = 'https://cllrlcjrlhzrlwnrnwze.supabase.co'

// ── Types ──────────────────────────────────────────────────────────────────
type Category = 'pengumuman' | 'kegiatan' | 'liturgi' | 'sosial'

interface Activity {
  id: string
  title: string
  description: string | null
  activity_date: string
  activity_time: string | null
  location: string | null
  category: Category
  image_url: string | null
  is_published: boolean
  created_by: string
  created_at: string
}

type ActivityForm = {
  title: string
  description: string
  activity_date: string
  activity_time: string
  location: string
  category: Category
  image_url: string
  is_published: boolean
}

// ── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES: { value: Category; label: string; color: string; icon: string }[] = [
  { value: 'pengumuman', label: 'Pengumuman', color: 'info',    icon: 'i-lucide-megaphone' },
  { value: 'kegiatan',   label: 'Kegiatan',   color: 'success', icon: 'i-lucide-calendar-days' },
  { value: 'liturgi',    label: 'Liturgi',    color: 'warning', icon: 'i-lucide-church' },
  { value: 'sosial',     label: 'Sosial',     color: 'secondary', icon: 'i-lucide-users' },
]

const CATEGORY_FILTER_OPTIONS = [
  { label: 'Semua Kategori', value: '' },
  ...CATEGORIES.map(c => ({ label: c.label, value: c.value })),
]

const STATUS_FILTER_OPTIONS = [
  { label: 'Semua Status', value: '' },
  { label: 'Dipublikasi',  value: 'published' },
  { label: 'Draf',         value: 'draft' },
]

// ── State ───────────────────────────────────────────────────────────────────
const activities   = ref<Activity[]>([])
const loading      = ref(true)
const saving       = ref(false)

// Filters
const searchQuery    = ref('')
const filterCategory = ref('')
const filterStatus   = ref('')

// Modal state
const modalOpen  = ref(false)
const editingId  = ref<string | null>(null)
const form       = reactive<ActivityForm>({
  title:         '',
  description:   '',
  activity_date: '',
  activity_time: '',
  location:      '',
  category:      'kegiatan',
  image_url:     '',
  is_published:  false,
})

// Image upload state
const imageFile    = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const imageInput   = ref<HTMLInputElement | null>(null)

// Delete confirmation
const confirmOpen  = ref(false)
const deleteId     = ref<string | null>(null)
const deleteTitle  = ref('')

// ── Data fetching ───────────────────────────────────────────────────────────
async function fetchActivities() {
  loading.value = true
  const { data, error } = await supabase
    .from('activities')
    .select('id, title, description, activity_date, activity_time, location, category, image_url, is_published, created_by, created_at')
    .order('activity_date', { ascending: false })

  if (error) {
    toast.add({ title: 'Gagal memuat data', description: 'Tidak dapat mengambil data kegiatan.', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    activities.value = data as Activity[]
  }
  loading.value = false
}

onMounted(fetchActivities)

// ── Filtered list ───────────────────────────────────────────────────────────
const filtered = computed(() => {
  let list = activities.value

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q),
    )
  }

  if (filterCategory.value) {
    list = list.filter(a => a.category === filterCategory.value)
  }

  if (filterStatus.value === 'published') {
    list = list.filter(a => a.is_published)
  } else if (filterStatus.value === 'draft') {
    list = list.filter(a => !a.is_published)
  }

  return list
})

// ── Category helpers ─────────────────────────────────────────────────────────
function getCategoryMeta(cat: Category) {
  return CATEGORIES.find(c => c.value === cat) ?? CATEGORIES[1]
}

// ── Date/time formatting ─────────────────────────────────────────────────────
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtTime(t: string | null) {
  if (!t) return null
  return t.slice(0, 5)
}

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
  const path = `activities/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('activity-images')
    .upload(path, imageFile.value, { upsert: true })

  if (error) {
    toast.add({ title: 'Gagal mengunggah gambar', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
    return null
  }

  return `${SUPABASE_URL}/storage/v1/object/public/activity-images/${path}`
}

// ── Modal helpers ────────────────────────────────────────────────────────────
function openCreate() {
  editingId.value = null
  Object.assign(form, {
    title: '', description: '', activity_date: '', activity_time: '',
    location: '', category: 'kegiatan', image_url: '', is_published: false,
  })
  imageFile.value = null
  imagePreview.value = null
  modalOpen.value = true
}

function openEdit(a: Activity) {
  editingId.value = a.id
  Object.assign(form, {
    title:         a.title,
    description:   a.description ?? '',
    activity_date: a.activity_date,
    activity_time: a.activity_time ? fmtTime(a.activity_time) : '',
    location:      a.location ?? '',
    category:      a.category,
    image_url:     a.image_url ?? '',
    is_published:  a.is_published,
  })
  imageFile.value = null
  imagePreview.value = a.image_url ?? null
  modalOpen.value = true
}

// ── Sanitize & validate inputs (OWASP A03) ───────────────────────────────────
function buildPayload(imageUrl: string | null, userId?: string) {
  return {
    title:         form.title.trim().slice(0, 200),
    description:   form.description.trim().slice(0, 5000) || null,
    activity_date: form.activity_date,
    activity_time: form.activity_time || null,
    location:      form.location.trim().slice(0, 200) || null,
    category:      form.category,
    image_url:     imageUrl,
    is_published:  form.is_published,
    ...(userId ? { created_by: userId } : {}),
  }
}

const isFormValid = computed(() =>
  form.title.trim().length > 0 && form.activity_date.length > 0,
)

async function saveActivity() {
  if (!isFormValid.value) return
  saving.value = true

  const imageUrl = await uploadImage()
  if (imageFile.value && imageUrl === null) {
    // upload failed — abort
    saving.value = false
    return
  }

  if (editingId.value) {
    const { error } = await supabase
      .from('activities')
      .update(buildPayload(imageUrl))
      .eq('id', editingId.value)

    if (error) {
      toast.add({ title: 'Gagal menyimpan', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
    } else {
      toast.add({ title: 'Berhasil disimpan', color: 'success', icon: 'i-lucide-check-circle' })
      modalOpen.value = false
      await fetchActivities()
    }
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.add({ title: 'Sesi tidak valid', description: 'Silakan login kembali.', color: 'error', icon: 'i-lucide-log-in' })
      saving.value = false
      return
    }

    const { error } = await supabase
      .from('activities')
      .insert(buildPayload(imageUrl, user.id))

    if (error) {
      toast.add({ title: 'Gagal menambah', description: error.message, color: 'error', icon: 'i-lucide-alert-circle' })
    } else {
      toast.add({ title: 'Kegiatan ditambahkan', color: 'success', icon: 'i-lucide-check-circle' })
      modalOpen.value = false
      await fetchActivities()
    }
  }

  saving.value = false
}

// ── Toggle published ────────────────────────────────────────────────────────
async function togglePublished(a: Activity) {
  const next = !a.is_published
  const { error } = await supabase
    .from('activities')
    .update({ is_published: next })
    .eq('id', a.id)

  if (error) {
    toast.add({ title: 'Gagal mengubah status', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    a.is_published = next
    toast.add({
      title: next ? 'Kegiatan dipublikasi' : 'Kegiatan dijadikan draf',
      color: next ? 'success' : 'neutral',
      icon: next ? 'i-lucide-globe' : 'i-lucide-file',
    })
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────
function confirmDelete(a: Activity) {
  deleteId.value = a.id
  deleteTitle.value = a.title
  confirmOpen.value = true
}

async function doDelete() {
  if (!deleteId.value) return
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', deleteId.value)

  confirmOpen.value = false
  if (error) {
    toast.add({ title: 'Gagal menghapus', description: 'Tidak dapat menghapus kegiatan.', color: 'error', icon: 'i-lucide-alert-circle' })
  } else {
    toast.add({ title: 'Kegiatan dihapus', color: 'neutral', icon: 'i-lucide-trash-2' })
    await fetchActivities()
  }
}
</script>

<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.15em] mb-1">Admin</p>
        <h1 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
          Kelola Kegiatan
        </h1>
      </div>
      <button
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
        @click="openCreate"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        Tambah Kegiatan
      </button>
    </div>

    <!-- ── Filters ────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <UIcon name="i-lucide-search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71787c] pointer-events-none" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Cari judul, lokasi..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
        />
      </div>
      <select
        v-model="filterCategory"
        class="px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
      >
        <option v-for="opt in CATEGORY_FILTER_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <select
        v-model="filterStatus"
        class="px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
      >
        <option v-for="opt in STATUS_FILTER_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <!-- ── Loading ────────────────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin" />
    </div>

    <!-- ── Activity list ──────────────────────────────────────────────── -->
    <template v-else>
      <p v-if="filtered.length === 0" class="text-center text-[#71787c] py-16">
        {{ activities.length === 0 ? 'Belum ada kegiatan. Klik "Tambah Kegiatan" untuk mulai.' : 'Tidak ada kegiatan yang sesuai filter.' }}
      </p>

      <div v-else class="space-y-3">
        <div
          v-for="a in filtered"
          :key="a.id"
          class="bg-white rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 editorial-shadow"
          :class="{ 'opacity-60': !a.is_published }"
        >
          <!-- Image thumbnail -->
          <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#f4f3f2] flex items-center justify-center">
            <img
              v-if="a.image_url"
              :src="a.image_url"
              :alt="a.title"
              class="w-full h-full object-cover"
            />
            <UIcon v-else :name="getCategoryMeta(a.category).icon" class="size-6 text-[#c1c7cc]" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-[#1a1c1c] font-semibold text-sm truncate">{{ a.title }}</span>
              <UBadge :label="getCategoryMeta(a.category).label" :color="getCategoryMeta(a.category).color as any" variant="subtle" size="sm" />
              <UBadge :label="a.is_published ? 'Dipublikasi' : 'Draf'" :color="a.is_published ? 'success' : 'neutral'" variant="subtle" size="sm" />
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#71787c]">
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" class="size-3" />
                {{ fmtDate(a.activity_date) }}
                <template v-if="fmtTime(a.activity_time)">· {{ fmtTime(a.activity_time) }}</template>
              </span>
              <span v-if="a.location" class="flex items-center gap-1">
                <UIcon name="i-lucide-map-pin" class="size-3" />
                {{ a.location }}
              </span>
            </div>
            <p v-if="a.description" class="text-[#71787c] text-xs mt-1 line-clamp-1">{{ a.description }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <UButton :icon="a.is_published ? 'i-lucide-eye-off' : 'i-lucide-globe'" :title="a.is_published ? 'Jadikan Draf' : 'Publikasikan'" color="neutral" variant="ghost" size="xs" @click="togglePublished(a)" />
            <UButton icon="i-lucide-pencil" title="Edit" color="neutral" variant="ghost" size="xs" @click="openEdit(a)" />
            <UButton icon="i-lucide-trash-2" title="Hapus" color="error" variant="ghost" size="xs" @click="confirmDelete(a)" />
          </div>
        </div>
      </div>
    </template>

    <!-- ── Add / Edit Modal ────────────────────────────────────────────── -->
    <UModal v-model:open="modalOpen">
      <template #content>
        <div class="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
          <h2 class="text-[#1a3b4c] text-lg font-semibold sticky top-0 bg-white pb-2" style="font-family: 'Noto Serif', serif;">
            {{ editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru' }}
          </h2>

          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Judul <span class="text-red-500">*</span></label>
              <input
                v-model="form.title"
                type="text"
                maxlength="200"
                placeholder="e.g. Misa Peringatan Bunda Maria"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
              <p class="text-[#71787c] text-xs mt-1 text-right">{{ form.title.length }}/200</p>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Kategori <span class="text-red-500">*</span></label>
              <select
                v-model="form.category"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              >
                <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>

            <!-- Date + Time -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Tanggal <span class="text-red-500">*</span></label>
                <input v-model="form.activity_date" type="date" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Waktu <span class="text-[#71787c] font-normal">(opsional)</span></label>
                <input v-model="form.activity_time" type="time" class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition" />
              </div>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Lokasi <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <input
                v-model="form.location"
                type="text"
                maxlength="200"
                placeholder="e.g. Gereja Paroki Santa Melania"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">Deskripsi <span class="text-[#71787c] font-normal">(opsional)</span></label>
              <textarea
                v-model="form.description"
                maxlength="5000"
                rows="4"
                placeholder="Detail kegiatan, info tambahan, persyaratan..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] transition resize-none"
              />
              <p class="text-[#71787c] text-xs mt-1 text-right">{{ form.description.length }}/5000</p>
            </div>

            <!-- Image upload -->
            <div>
              <label class="block text-sm font-medium text-[#1a1c1c] mb-1.5">
                Gambar <span class="text-[#71787c] font-normal">(opsional)</span>
              </label>

              <!-- Preview -->
              <div v-if="imagePreview" class="relative mb-3 rounded-xl overflow-hidden bg-[#f4f3f2]">
                <img :src="imagePreview" alt="Preview" class="w-full h-40 object-cover" />
                <button
                  type="button"
                  class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                  @click="clearImage"
                >
                  <UIcon name="i-lucide-x" class="size-3.5" />
                </button>
              </div>

              <label
                class="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-[#d9d9d9] bg-[#faf9f8] hover:bg-[#f4f3f2] cursor-pointer transition-colors"
              >
                <UIcon name="i-lucide-upload" class="size-4 text-[#71787c] flex-shrink-0" />
                <span class="text-sm text-[#71787c]">
                  {{ imageFile ? imageFile.name : 'Pilih gambar (JPG, PNG, WebP · maks. 5MB)' }}
                </span>
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  class="sr-only"
                  @change="onImageChange"
                />
              </label>
            </div>

            <!-- Published toggle -->
            <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f7f5] border border-[#e8e6e3]">
              <div>
                <p class="text-sm font-medium text-[#1a1c1c]">Publikasikan</p>
                <p class="text-xs text-[#71787c]">Tampilkan di halaman publik setelah disimpan</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="form.is_published"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30"
                :class="form.is_published ? 'bg-[#1a3b4c]' : 'bg-[#d9d9d9]'"
                @click="form.is_published = !form.is_published"
              >
                <span class="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform" :class="form.is_published ? 'translate-x-6' : 'translate-x-1'" />
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t border-[#f4f3f2]">
            <button class="px-4 py-2.5 rounded-xl border border-[#d9d9d9] text-[#41484b] text-sm font-medium hover:bg-[#f4f3f2] transition-colors" @click="modalOpen = false">Batal</button>
            <button
              :disabled="saving || !isFormValid"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="saveActivity"
            >
              <UIcon v-if="saving" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ editingId ? 'Simpan Perubahan' : 'Tambah Kegiatan' }}
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
              <h2 class="text-[#1a1c1c] font-semibold">Hapus Kegiatan?</h2>
              <p class="text-[#41484b] text-sm mt-1">
                Kegiatan <strong>{{ deleteTitle }}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
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
