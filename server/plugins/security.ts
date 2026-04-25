/**
 * Nitro plugin — remove technology-disclosure response headers.
 *
 * routeRules headers are merged ON TOP of Nuxt's own headers, so setting
 * X-Powered-By to '' in routeRules only adds an empty value instead of
 * removing the one Nuxt already set. Hooking into render:response here
 * deletes it after Nuxt writes it, before the response is sent.
 *
 * OWASP A05 / CWE-200 — Information Exposure (pentest finding F-06)
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response) => {
    delete response.headers['x-powered-by']
    delete response.headers['X-Powered-By']
  })
})
