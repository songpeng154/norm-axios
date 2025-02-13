<script setup lang="ts">
import { SchemaFormProps } from './types/props.ts'

defineProps<SchemaFormProps>()

defineOptions({
  name: 'SchemaForm',
})
const a = ''

a.includes('in')
a.concat()
a.charAt()
a.includes()
</script>
<template>
  <div>
    <div style=" class="test">11</div>
    <button class="test">{{ name || '测试' }}</button>
  </div>
</template>
<!--<style lang="scss">-->
<!--.test{-->
<!--  background: antiquewhite;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  width: 400px;-->
<!--}-->
<!--</style>-->
