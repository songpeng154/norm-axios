<script setup lang="ts">
import type { PaginationResponse, ResponseContent } from 'vue-rex'
import { usePagination } from 'vue-rex'

interface User {
  name: string
  age: number
  address: string
  time: number
}

const asyncAwait = async (millisecond: number) => new Promise(resolve => setTimeout(resolve, millisecond))

// 获取假数据
const getFakeData = async ({ page, pageSize }: { page: number, pageSize: number }): Promise<ResponseContent<PaginationResponse<User>>> => {
  const total = 50

  const list: User[] = Array.from({ length: pageSize }, (_, i) => {
    const id = (page - 1) * pageSize + i + 1
    return {
      name: `用户 ${id}`,
      age: 20 + (id % 10),
      address: `城市 ${id}`,
      time: Date.now() + id * 1000,
    }
  }).filter((_, i) => (page - 1) * pageSize + i < total) // 避免超出 total

  await asyncAwait(300) // 模拟接口延迟

  return [
    {
      list,
      total,
    },
    undefined,
  ]
}

const { list, loading, page, pageSize, total, totalPage } = usePagination(getFakeData)

const previousPage = () => {
  if (page.value === 1) return
  page.value -= 1
}
const nextPage = () => {
  if (totalPage.value === page.value) return
  page.value += 1
}
const addPageSize = (num: number) => {
  pageSize.value += num
}

const lowerPageSize = (num: number) => {
  pageSize.value -= num
}
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>地址</th>
          <th>日期</th>
        </tr>
      </thead>
      <tbody v-if="!loading">
        <tr v-for="(item, index) in list" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.time }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4">
            加载中...
          </td>
        </tr>
      </tbody>
    </table>
    <p>当前分页:{{ page }}  当前分页数量:{{ pageSize }}  总数:{{ total }}  分页总数:{{ totalPage }}</p>
    <button @click="previousPage">
      上一页
    </button>
    <button @click="nextPage">
      下一页
    </button>
    <button @click="addPageSize(10)">
      分页数量 +10
    </button>
    <button @click="lowerPageSize(10)">
      分页数量 -10
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
</style>
