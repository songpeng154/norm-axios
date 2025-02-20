<p align="center">
  <img width="300px" src="https://user-images.githubusercontent.com/10731096/95823103-9ce15780-0d5f-11eb-8010-1bd1b5910d4f.png">
</p>
<p align="center">
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

[//]: # ()
[//]: # (1. 数据结构混乱，不统一，数据处理的复杂性增加。)

[//]: # (2. 重复的请求逻辑，重复的数据处理逻辑。)

[//]: # (3. TypeScript 类型不好处理。)

前端开发人员需要编写额外的逻辑来处理这些差异。

#### 例如
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


```

这会使得每个请求的数据处理都需要不同的解析逻辑，增加了代码的复杂性。

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

## 定义后台

## 创建服务实例
```typescript
import { NormFetch } from 'coven-fetch'

const server = new NormFetch({
  baseURL: 'https://api.example.com',
  timeout: 10000,
})
```
