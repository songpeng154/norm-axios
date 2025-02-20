<p align="center">
  <img width="300px" src="https://user-images.githubusercontent.com/10731096/95823103-9ce15780-0d5f-11eb-8010-1bd1b5910d4f.png">
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

## 为什么写 Coven Fetch

在业务项目中我们可能还遇到多个后台服务，这些后台服务的数据结构可能不一致，这就导致了一些问题

1. 前端开发人员需要编写额外的逻辑来处理这些差异。 例如，一个服务可能返回 `{ data: { ... } }`另一个返回 `{ result: { ... } }` 。
2. 代码重复和冗余。 例如，每个请求都需要处理不同的数据结构。
3. 开发体验差。每次请求数据时，开发人员需要去关注和处理不同的返回结构，代码变得不够清晰和易于理解。开发人员往往需要频繁地查阅文档或后端代码，以确保正确地处理接口返回的数据，降低了开发体验。


[//]: # ()

[//]: # (1. 数据结构混乱，不统一，数据处理的复杂性增加。)

[//]: # (2. 重复的请求逻辑，重复的数据处理逻辑。)

[//]: # (3. TypeScript 类型不好处理。)

[//]: # (#### 例如)

[//]: # (```typescript)

[//]: # (import axios from 'axios')

[//]: # ()

[//]: # (// 服务 A 返回的数据格式如下)

[//]: # (interface ResultA<TData> {)

[//]: # (  code: number,)

[//]: # (  msg: string)

[//]: # (  data: TData)

[//]: # (})

[//]: # ()

[//]: # (// 服务 B 返回的数据格式如下)

[//]: # (interface ResultB<TData> {)

[//]: # (  status: number,)

[//]: # (  message: string)

[//]: # (  result: TData)

[//]: # (})

[//]: # ()

[//]: # (// 模拟响应数据类型 A)

[//]: # (interface ApiA {)

[//]: # (  name: string)

[//]: # (})

[//]: # ()

[//]: # (// 模拟响应数据类型 B)

[//]: # (interface ApiB {)

[//]: # (  title: string)

[//]: # (})

[//]: # ()

[//]: # (// axios 实例 1)

[//]: # (const instance_1 = axios.create&#40;{)

[//]: # (  baseURL: 'http://api-1.com',)

[//]: # (}&#41;)

[//]: # ()

[//]: # (// axios 实例 2)

[//]: # (const instance_2 = axios.create&#40;{)

[//]: # (  baseURL: 'http://api-2.com',)

[//]: # (}&#41;)

[//]: # ()

[//]: # (// 请求服务 A)

[//]: # (const apiA = async &#40;&#41; => {)

[//]: # (  const res = await instance_1.get<ResultA<ApiA>>&#40;'/api'&#41;)

[//]: # (  return res.data.data)

[//]: # (})

[//]: # (```)

[//]: # ()

[//]: # (这会使得每个请求的数据处理都需要不同的解析逻辑，增加了代码的复杂性。)

## 特性

* 统一多后端服务的数据结构
* 强大的 useFetch 和 usePagination 钩子函数
* 支持 Typescript，具有强大的类型提示

## 文档

[xxxx](https://songpeng154.github.io/coven-fetch/)

## 快速开始

```shell
# 使用 npm 安装 
npm install axios coven-fetch

or

# 使用 pnpm 安装 
pnpm add axios coven-fetch
```

## 定义后台数据结构

```typescript
// 服务 A 返回的数据格式如下
interface ResultA<TData> {
   code: number,
   msg: string
   data: TData
}

// 服务 B 返回的数据格式如下
interface ResultB<TData> {
   status: number,
   message: string
   result: TData
}
````

## 创建服务实例
`NormFetch` 是一个基于 `Axios` 实现的请求请求类，它可以帮助我们统一多个后台服务的数据结构。


`NormFetch` 的`构造函数`接收一个配置对象，配置对象的属性和 `Axios` 的配置对象一致,并且将 `Axios` 的拦截器的方法抽取到了`interceptor`中，强制了响应成功、响应失败的返回类型，统一要求返回 `ResponseContent` 类型。
```typescript
import { NormFetch,ResponseContent } from 'coven-fetch'

const server_1 = new NormFetch<ResultA>({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  interceptor: {
    // 处理请求之前（比如请求头、token）
    onBeforeRequest(config) {
      return config
    },
    // 处理响应
    onResponse: (response) => {
      // 服务 A 的响应数据
      const { code, msg, data } = response.data
      // 统一的响应结果
      const responseContent: ResponseContent<Result, typeof result> = [ data, undefined, response ]

      // 处理响应错误 (假设 code 不等于 200 为错误)
      if (code !== 200) {
        // 设置错误的响应内容
        responseContent[1] = { code, msg }
      }

      return responseContent
    },
    // 处理响应错误
    onResponseError: (error) => {
      const responseContent: ResponseContent = [undefined, undefined, err.response]

      // 处理响应后的错误
      if (err.response) {
        // 请求已发出，但服务器响应的状态码错误
        responseContent[1] = { code: err.response.status, msg: '请求错误' }
      }
      // 处理请求时的错误
      else {
        responseContent[1] = { code: err.code as number, msg: '请求错误', axiosError: err }
      }
      
      return responseContent
    },
  },
})
```
