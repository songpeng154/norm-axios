import type { INSTALLED_KEY } from '@surge/entrance'

declare module 'vue' {
  interface App {
    [INSTALLED_KEY]: boolean
  }
}
