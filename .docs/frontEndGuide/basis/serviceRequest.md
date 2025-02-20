---
outline: deep
---

# 服务请求

本模块会介绍如何使用服务调用。

## 服务配置

配置服务地址或者代理地址

### 类型

```ts
// 代理类型
type ProxyType = [ string, string ];

// 多服务配置
interface ServiceConfig {
    // 数据模拟
    fake: string | ProxyType

    // 主服务
    main: string | ProxyType

    // 其他服务
    other: string | ProxyType
}
```

> 代码位置：`types/service/service.d.ts`

### 服务地址 & 代理配置

以`JSON`的形式配置多个服务,`key`是服务名，`value`是服务地址或者代理地址需要代理就写 `"[前缀,Url]"` 不需要就写
`"api地址"` 。

* `key`：服务名
* `value`：需要代理就写 `[匹配路径,代理地址]`，不需要就写 `api地址`

```.env.development
VITE_SERVICE_CONFIG = `{
  "fake": "/fake",

  "main": ["/dev", "http://localhost:3000"],

  "other": "http://localhost:3000"
}`
```

> 代码位置：`.env.development`

::: warning 注意
`代理`功能仅在开发环境有效
:::

### 定义响应结构

根据自己的后台自行添加或修改。

```ts
// 后台响应结构
declare interface Result<Data = any> {
    // 系统状态
    code: number

    // 系统状态信息
    msg: string

    // data
    result?: Data
}

// 其他后台响应结构
declare interface OtherResult<Data = any> {
    // 系统状态
    status: number

    // 系统状态信息
    message: string

    // data
    data?: Data
}
```

> 代码位置：`types/service/service.d.ts`

## Axios

项目内二次封装了[axios](https://github.com/axios/axios),封装的目的是为了统一响应结构，不管是响应成功还是失败都返回固定的格式。

### 类型

```ts
import { AxiosError, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from 'axios'

// 响应错误
export interface ResponseError {
    code: number | string

    msg: string

    axiosError?: AxiosError
}

// 响应内容
export type ResponseContent<T = any, D = any> = [ T, ResponseError?, AxiosResponse<T, D>? ]

// axios拦截器
export interface AxiosInterceptor<T = any> {
    // 请求之前拦截器
    onBeforeRequest?(config: AxiosRequestConfig): void | Promise<void>

    // 响应拦截器
    onResponse?(response: AxiosResponse<T>): ResponseContent<T> | Promise<ResponseContent<T>>

    // 响应错误
    onResponseError?(error: AxiosError): ResponseContent | Promise<ResponseContent>
}

// axios配置
export interface AxiosConfig<T = any> extends CreateAxiosDefaults {
    // 拦截器
    interceptor?: AxiosInterceptor<T>
}
```

> 代码位置：`src/services/request/axios/types.ts`

### 获取服务地址

通过`getServiceAddress`方法获取服务地址，`getServiceAddress`会根据[ServiceConfig](#多服务配置)的`key`
获取对应的服务地址，如果使用了[代理](#服务地址-代理配置)
就会获取[匹配路径](#服务地址-代理配置)。

```ts
type getServiceAddress = (key: keyof ServiceConfig, apiConfig?: ServiceConfig) => string | undefined

const address = getServiceAddress('main')
```

### 创建服务

通过`CreateAxios`类创建服务，在`onResponse`、`onResponseError`拦截器中返回正确的响应内容[ResponseContent](#类型定义-1)

```ts
import ServicesConfig from '@/config/services'
import CreateAxios from '@/services/request/axios'
import { handleAxiosError, handleResponseError } from '@/services/request/utils'
import { ResponseContent } from '@/services/request/axios/types'
import { getServiceAddress } from '@/utils/env'

const mainService = new CreateAxios<Result>({
    // getServiceAddress('main') 获取主服务地址
    baseURL: getServiceAddress('main'),
    timeout: 10000,
    interceptor: {
        // 请求之前
        onBeforeRequest(config) {
            console.log(config)
        },
        // 响应成功
        onResponse(response) {
            const { code, msg, result } = response.data
            const responseContent: ResponseContent<Result> = [ result, undefined, response ]

            // 处理响应状态码错误
            if (ServicesConfig.SUCCESS_CODE !== code) {
                // 错误的响应内容
                responseContent[1] = { code, msg }
                // 处理响应错误
                return handleResponseError(code, responseContent, response.config)
            }

            return responseContent
        },
        // 响应失败
        async onResponseError(error) {
            // 处理Axios错误
            return handleAxiosError(error)
        },
    }
})

export default mainService
```

> 代码位置：`src/services/request/serves/main.ts`

#### Get & Delete请求

```ts
import mainService from '@/services/request/serves/main.ts'

const getUserinfoApi = (id: number) => mainService.get<UserModal.UserinfoModel>('/getUserinfo', { id });

const deleteUserApi = (id: number) => mainService.delete('/deleteUserinfo', { id });
```

#### Post & Put请求

```ts
import mainService from '@/services/request/serves/main.ts'

const createUserApi = (data) => mainService.post('/createUser', data);

const updateUserApi = (data) => mainService.put('/updateUser', data);
```

#### 调用接口

```ts
const getUserinfo = async () => {
    const [ data, err, response ] = await getUserinfoApi(1)
    // 处理错误
    if (err) return
    // 响应内容
    console.log(data)
    // Axios原始响应
    console.log(response)
};
```

### 自定义请求配置

```ts
import 'axios'

declare module 'axios' {
    // 自定义请求配置
    interface AxiosRequestConfig {
        // 是否取消消息提示
        isCancelMessagePrompt?: boolean
    }
}
```

> 代码位置：`types/service/axios.d.ts`

## 数据模拟-`Fake`

数据模拟用到的插件有[vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server)
和[faker](https://github.com/faker-js/faker)。

### 配置`Fake`基础路径

在 `.env.[环境模式]`文件中修改`VITE_SERVICE_CONFIG`配置的`fake`属性。默认是`/fake`

```.env
VITE_SERVICE_CONFIG = `{
  "fake": "/fake", // [!code focus]

  "main": ["/dev", "http://localhost:3000"],

  "other": "http://localhost:3000"
}`
```

### 创建`FakeRoute`

在`/fake`目录中创建`user.fake.ts`文件

```ts
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { rSuccess } from './utils'
import { faker } from '@faker-js/faker/locale/zh_CN'

export default defineFakeRoute([
    {
        url: '/getUserList',
        method: 'get',
        response: (processedRequest, req, res) => {
            console.log(processedRequest, req, res)
            return rSuccess(Array.from({ length: 500 }, () => {
                return {
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    avatar: faker.image.avatar()
                }
            }));
        }
    }
])
```

> 代码位置：/fake/user.fake.ts

### 使用方式

引入`fakeService`,定义接口函数。

```ts
import fakeService from '@/services/request/serves/fake'

const getUserinfoApi = () => fakeService.get('/getUserinfo')

const getUserinfo = async () => {
    const [ data, err, response ] = await getUserinfoApi()
    // 处理错误
    if (err) return
    // 响应内容
    console.log(data)
    // Axios原始响应
    console.log(response)
};
```

### 打包后使用

在 `.env.[环境模式]`文件中将`VITE_USE_FAKE`设置为`true`。
```.env 
# 是否开启fake
VITE_USE_FAKE = true
```

::: danger 注意
不推荐在生产环境使用
:::

## 最佳实践
使用`@tanstack/vue-query`进行异步管理。具体请看[异步解决方案]()