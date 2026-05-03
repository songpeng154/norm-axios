<script lang="ts" setup>
import { useClipboard, useToggle } from '@vueuse/core'
import { codeToHtml } from 'shiki'
import { onBeforeMount, ref } from 'vue'
import { getComponent } from '../utils'

const props = defineProps<{
  path: string
  runUrl: string
  sourceCode: string
}>()
const files = import.meta.glob('../examples/**/*.vue', {
  eager: true,
})

const [isShow, toggleShow] = useToggle()
const [isCopySuccess, toggleCopySuccess] = useToggle()
const [isCopyFail, toggleCopyFail] = useToggle()
const clipboard = useClipboard()

const Example = getComponent(files, props.path)

const html = ref('')

const onCopy = () => {
  clipboard
    .copy(decodeURIComponent(props.sourceCode))
    .then(() => {
      toggleCopySuccess(true)
      setTimeout(() => toggleCopySuccess(false), 1000)
    })
    .catch(() => {
      toggleCopyFail(true)
      setTimeout(() => toggleCopyFail(false), 1000)
    })
}

onBeforeMount(async () => {
  html.value = await codeToHtml(decodeURIComponent(props.sourceCode), {
    lang: 'vue',
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })
})
</script>

<template>
  <div class="demo">
    <div class="card">
      <div class="card-content">
        <Example />
      </div>
      <div class="card-action">
        <div>
          <a v-if="runUrl" :href="runUrl">在线运行</a>
        </div>
        <div class="card-action-icon-group">
          <div v-if="(!isCopySuccess && !isCopyFail)" class="icon i-ep:copy-document" @click="onCopy" />
          <div v-if="isCopySuccess" class="success">
            复制成功！
          </div>
          <div v-if="isCopyFail" class="fail">
            复制失败！
          </div>
          <div
            class="icon i-ic:baseline-code"
            @click="toggleShow()"
          />
        </div>
      </div>
      <div v-show="isShow" class="code-container">
        <div class="code" v-html="html" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  //background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  margin-top: 10px;
  border-radius: 12px;

  &-content {
    padding: 24px;
    flex: 1;
  }

  &-action {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--vp-c-divider);
    height: 40px;
    a {
      font-size: 14px;
    }

    &-icon-group {
      display: flex;
      gap: 10px;
      align-items: center;

      .icon {
        cursor: pointer;
        font-size: 16px;
      }

      div{
        font-size: 12px;
      }

      .success{
        color: #0da608;
      }

      .fail{
        color: red;
      }
    }
  }
}

.code-container {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  width: 100%;
  overflow: auto;
}
</style>
