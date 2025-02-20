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

[//]: # ()
[//]: # (## 介绍)

[//]: # (Coven Fetch 是一个基于 Axios 的约定式请求库，为什么要写这个库？)

[//]: # ()
[//]: # (* 多个后端服务数据结构不一致的问题)


## 特性
* 统一多后端服务的数据结构
* 强大的 useFetch 和 usePagination
* 完全使用 Typescript 编写，具有强大的类型提示


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

### 创建服务实例
```typescript
import { NormFetch } from 'coven-fetch'

 const server = new NormFetch({
  baseURL: 'https://api.example.com',
  timeout: 10000,
 })
```
