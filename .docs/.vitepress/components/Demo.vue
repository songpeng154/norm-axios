<script lang="ts" setup>
import { getComponent } from '../utils'
import { codeToHtml } from 'shiki'
import { computed, onBeforeMount, ref } from 'vue'
import { useClipboard, useToggle } from '@vueuse/core'

const props = defineProps<{
  path: string
  sourceCode: string
}>()
const files = import.meta.glob('../examples/**/*.vue', {
  eager: true,
})

const [ isShow, toggleShow ] = useToggle()
const clipboard = useClipboard()

const info = computed(() => {
  return {
    icon: isShow.value ? 'i-ep:arrow-up-bold' : 'i-ep:arrow-down-bold',
    text: isShow.value ? '收起代码' : '显示代码',
  }
})

const Example = getComponent(files, props.path)

const html = ref('')

const onCopy = () => {
  clipboard.copy(decodeURIComponent(props.sourceCode)).then(() => {
    // message.success('复制成功')
  }).catch(() => {
    // message.error('复制失败')
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
    <!--    <a-card>-->
    <!--      <Example></Example>-->
    <!--      <template #actions>-->
    <!--        <a-flex gap="10" class="cursor-default" justify="flex-end">-->
    <!--          <a-tooltip :mouse-enter-delay="0.5">-->
    <!--            <template #title >复制</template>-->
    <!--            <a-button @click="onCopy" type="text">-->
    <!--              <div class="i-ep:copy-document"/>-->
    <!--            </a-button>-->
    <!--          </a-tooltip>-->
    <!--          <a-tooltip :mouse-enter-delay="0.5">-->
    <!--            <template #title>{{info.text}}</template>-->
    <!--            <a-button @click="toggleShow()" type="text">-->
    <!--              <div :class="info.icon"/>-->
    <!--            </a-button>-->
    <!--          </a-tooltip>-->
    <!--        </a-flex>-->
    <!--      </template>-->
    <!--    </a-card>-->
    <div>123</div>
    <transition>
      <div class="content" v-show="isShow" v-html="html">
      </div>
    </transition>
  </div>
</template>

<style scoped>
:deep(.ant-card-actions li) {
  margin: 7px;
}

.collapse-enter-active, .collapse-leave-active {
  transition: height 0.5s ease;
}

.collapse-enter-from, .collapse-leave-to {
  height: 0;
  overflow: hidden;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.content {
  height: auto; /* Let the content determine its height */
  overflow: hidden; /* Ensure no content overflows */
}
</style>