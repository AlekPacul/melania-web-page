import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/no-v-html': 'off',
      // Self-closing void elements (<img/>, <input/>, <br/>) is consistent
      // style throughout this codebase — allow it.
      'vue/html-self-closing': 'off',
    },
  },
)
