<script setup lang="ts">
// import './test.css'

defineProps<{ name: string }>()
</script>

<template>
  <div class="abc">
    {{ name }}
  </div>
</template>

<!-- <style lang="scss"> -->
<!-- .abc{ -->
<!--  background: red; -->
<!-- } -->
<!-- </style> -->
