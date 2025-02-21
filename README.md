<p align="center">

[//]: # (  <img width="300px" src="https://user-images.githubusercontent.com/10731096/95823103-9ce15780-0d5f-11eb-8010-1bd1b5910d4f.png">)
</p>
<p align="center" style="font-size: 3em">
<b>Coven Fetch</b>
</p>
<p align="center">
  <a href="https://www.npmjs.org/package/coven-fetch">
    <img src="https://img.shields.io/npm/v/coven-fetch.svg" />
  </a>
  <a href="https://github.com/songpeng154/coven-fetch">
    <img src="https://img.shields.io/badge/node-%20%3E%3D%2018-47c219" />
  </a>
  <a href="https://npmcharts.com/compare/coven-fetch?minimal=true">
    <img src="https://img.shields.io/npm/dm/coven-fetch.svg" />
  </a>
  <br>
</p>
<p align="center">
Coven Fetch 是一个基于 Axios 的约定式请求库
</p>

## Coven Fetch 解决了什么问题

* 解决了多个后台服务，后台服务的数据结构可能不一致的问题
* 简化了数据获取流程，自动处理请求状态，减少了冗余代码。
* 简化了分页处理，自动管理分页状态，减少了手动编写分页逻辑的麻烦。


## 特性
* 🌐 统一多后端服务的数据结构
* ⚡  响应式数据
* 🔄 轮询请求
* ♻️ 自动处理错误重试
* 💾 内存缓存策略
* ⏳ 节流、防抖请求
* 🔍 聚焦页面时自动重新请求
* 📊 强大的分页钩子
* ⚙️ 全局配置（包含插件）
* 🟢 支持 Vue3
* 📘 支持 TypeScript，具有强大的类型提示

## 文档

[详细文档](https://songpeng154.github.io/coven-fetch/)

[//]: # (## 快速开始)

[//]: # ()
[//]: # (```shell)

[//]: # (# 使用 npm 安装 )

[//]: # (npm install axios coven-fetch)

[//]: # ()
[//]: # (or)

[//]: # ()
[//]: # (# 使用 pnpm 安装 )

[//]: # (pnpm add axios coven-fetch)

[//]: # (```)

[//]: # ()
[//]: # (## 定义后台数据结构)

[//]: # ()
[//]: # (```typescript)

[//]: # (interface Result<TData> {)

[//]: # (  code: number,)

[//]: # (  msg: string)

[//]: # (  data: TData)

[//]: # (})

[//]: # (````)

[//]: # ()
[//]: # (## 创建服务实例)

[//]: # ()
[//]: # (`NormFetch` 是一个基于 `Axios` 实现的请求请求类，它可以帮助我们统一多个后台服务的数据结构。)

[//]: # ()
[//]: # (`NormFetch` 的`构造函数`接收一个配置对象，配置对象的属性和 `Axios` 的配置对象一致。)

[//]: # ()
[//]: # (`NormFetch` 将 `Axios` 的拦截器的方法抽取到了`interceptor`中，强制了响应成功、响应失败的返回类型，统一要求返回)

[//]: # (`ResponseContent` 类型)

[//]: # ()
[//]: # (> 不要在拦截器中返回异步异常这类操作： `Promise.reject&#40;responseContent&#41;`，因为下层请求接受不到该异常，请把异常设置到)

[//]: # (`responseContent[1]`中。)

[//]: # ()
[//]: # (```typescript)

[//]: # (import { NormFetch, ResponseContent } from 'coven-fetch')

[//]: # ()
[//]: # (const server = new NormFetch<Result>&#40;{)

[//]: # (  baseURL: 'https://api.example.com',)

[//]: # (  timeout: 10000,)

[//]: # (  interceptor: {)

[//]: # (    // 处理请求之前（比如请求头、token）)

[//]: # (    onBeforeRequest&#40;config&#41; {)

[//]: # (      return config)

[//]: # (    },)

[//]: # (    // 处理响应)

[//]: # (    onResponse&#40;response&#41; {)

[//]: # (      // 服务响应数据)

[//]: # (      const { code, msg, data } = response.data)

[//]: # (      // 统一的响应结果)

[//]: # (      const responseContent: ResponseContent<Result, typeof result> = [ data, undefined, response ])

[//]: # ()
[//]: # (      // 处理响应错误 &#40;假设 code 不等于 200 为错误&#41;)

[//]: # (      if &#40;code !== 200&#41; {)

[//]: # (        // 设置错误的响应内容)

[//]: # (        responseContent[1] = { code, msg })

[//]: # (      })

[//]: # ()
[//]: # (      return responseContent)

[//]: # (    },)

[//]: # (    // 处理响应错误)

[//]: # (    onResponseError&#40;error&#41; {)

[//]: # (      const responseContent: ResponseContent = [ undefined, undefined, err.response ])

[//]: # ()
[//]: # (      // 处理响应后的错误)

[//]: # (      if &#40;err.response&#41; {)

[//]: # (        // 请求已发出，但服务器响应的状态码错误)

[//]: # (        responseContent[1] = { code: err.response.status, msg: '请求错误' })

[//]: # (      })

[//]: # (      // 处理请求时的错误)

[//]: # (      else {)

[//]: # (        responseContent[1] = { code: err.code as number, msg: '请求错误', axiosError: err })

[//]: # (      })

[//]: # ()
[//]: # (      return responseContent)

[//]: # (    },)

[//]: # (  },)

[//]: # (}&#41;)

[//]: # (```)

[//]: # ()
[//]: # (## 定义Api)

[//]: # ()
[//]: # (```typescript)

[//]: # (interface Userinfo {)

[//]: # (  name: string)

[//]: # ()
[//]: # (  age: number)

[//]: # (})

[//]: # ()
[//]: # (const getUserinfo = &#40;id&#41; => server.get<Userinfo>&#40;'/userinfo', { id }&#41;)

[//]: # ()
[//]: # (const getUserList = &#40;params&#41; => server.post<Userinfo[]>&#40;'/userlist',params&#41;)

[//]: # (```)

[//]: # ()
[//]: # (## 搭配 useFetch 使用)

[//]: # ()
[//]: # (```vue)

[//]: # (<template>)

[//]: # (  <div>)

[//]: # (    <div v-if="loading">loading...</div>)

[//]: # (    <div v-if="error">failed to fetch</div>)

[//]: # (    <div v-if="data">Hey! {{ data }}</div>)

[//]: # (  </div>)

[//]: # (</template>)

[//]: # (<script lang="ts" setup>)

[//]: # (  import { useFetch } from 'coven-fetch')

[//]: # (  )
[//]: # (  const { data, loading, error } = useFetch&#40;getUserinfo&#41;;)

[//]: # (</script>)

[//]: # (```)

[//]: # ()
[//]: # (## 使用 usePagination 获取分页数据)

[//]: # ()
[//]: # (```typescript)

[//]: # (import { usePagination } from 'coven-fetch')

[//]: # ()
[//]: # (const { data, loading, error, refetch } = usePagination&#40;pagination=>getUserList&#40;{}&#41;&#41;)

[//]: # (```)

## 致谢
* [vue reuquest](https://github.com/attojs/vue-request)
* [vue hook plus](https://github.com//InhiblabCore/vue-hooks-plus)
* [ahooks](https://github.com/alibaba/hooks)
* [alova](https://github.com/alovajs/alova.git)
