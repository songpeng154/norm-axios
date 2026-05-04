<script setup lang="ts">
import { createPagination } from 'vue-rex'

const usePage = createPagination({ listKey: 'data.list', totalKey: 'data.total' })

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async ({ page, pageSize }: { page: number, pageSize: number }) => {
  const total = 50
  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const list = Array.from({ length: end - start }, (_, i) => start + i + 1)
  await asyncAwait(300)
  return { data: { list, total } }
}

const { list, page, pageSize, total, totalPage } = usePage(getFakeData, {
  addedMode: true,
})
</script>

<template>
  <div>
    <div class="container">
      <p v-for="item in list" :key="item">
        {{ item }}
      </p>
      <p v-if="list.length === total">
        没有更多了
      </p>
    </div>
    <p>当前分页:{{ page }}  当前分页数量:{{ pageSize }}  总数:{{ total }}  分页总数:{{ totalPage }}</p>
    <button @click="page += 1">
      加载更多
    </button>
  </div>
</template>

<style lang="scss" scoped>
button {
  background: #5e7aeb;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  margin-right: 10px;
}
.container{
  display: block;

  p{
    text-align: center;
    border-bottom: 1px solid var(--vp-c-divider);
    margin: 0;
    padding: 10px;
  }
}
</style>
