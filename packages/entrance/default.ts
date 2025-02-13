// 全部组件
import type { App, Component, Plugin } from 'vue'
import { SchemaForm, SchemaForm2 } from '@surge/components'
import { INSTALLED_KEY } from '@surge/constants'
import * as SurgeUtils from '@surge/utils'

const COMPONENTS: Component[] = [SchemaForm, SchemaForm2]

const SurgeComponents: Plugin = {
  install(app: App) {
    if (app[INSTALLED_KEY]) return
    app[INSTALLED_KEY] = true
    COMPONENTS.forEach(comp => app.component(comp.name!, comp))
  },
}

export default { SurgeComponents, SurgeUtils }
