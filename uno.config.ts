import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  presets: [
    presetUno(),
  ],
})
