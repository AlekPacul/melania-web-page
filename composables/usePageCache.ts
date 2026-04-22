const TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Provides getCachedData / markFetched helpers for useAsyncData.
 *
 * Usage:
 *   const { getCachedData, markFetched } = usePageCache()
 *   const { data } = await useAsyncData('key', async () => {
 *     const result = await fetch(...)
 *     markFetched('key')
 *     return result
 *   }, { getCachedData: (key) => getCachedData(key) })
 *
 * On SSR: fetches normally, timestamps hydrate to client via useState.
 * On SPA navigation back to the page: returns cached payload if < TTL,
 * skipping the Supabase round-trip entirely.
 */
export function usePageCache() {
  const nuxtApp = useNuxtApp()
  const timestamps = useState<Record<string, number>>('cache:ts', () => ({}))

  function getCachedData<T>(key: string, ttl = TTL): T | undefined {
    const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    if (cached === undefined || cached === null) return undefined
    const ts = timestamps.value[key]
    if (!ts || Date.now() - ts > ttl) return undefined
    return cached as T
  }

  function markFetched(key: string) {
    timestamps.value[key] = Date.now()
  }

  return { getCachedData, markFetched }
}
