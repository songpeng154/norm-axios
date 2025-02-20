---
outline: deep
---

# 浏览器缓存

项目内基于[store2](https://github.com/nbubna/store)与[js-cookie](https://github.com/js-cookie/js-cookie)简单的封装了缓存方法。

> 缓存文件：`@src/store/caches.ts` 项目中所有的`浏览器缓存`都在这个文件

## 缓存模板

> 代码位置：`@/src/utils/cache.ts`

### 缓存类型

* `local`：本地缓存
* `session`：会话缓存
* `cookie`：`cookie`缓存

```ts
type CacheType = 'local' | 'session' | 'cookie'
```

### 缓存模板

```ts
interface CacheTemplate<T> {
    // 缓存名称
    key: string

    /**
     * 设置缓存
     * @param value 缓存的值
     * @param expires 过期时间，缓存类型为 Cookie 的时候有效
     */
    set(value: T, expires?: number): void

    // 获取缓存
    get(): T | null

    // 删除缓存
    remove(): void

    // 是否存在
    isExist(): boolean
}
```

### 创建缓存

```ts
type createCache = <T>(key: string, type: CacheType = 'local') => CacheTemplate<T>
```

#### key

* 类型：`string`

缓存的key。

#### type

* 类型：[CacheType](/frontEndGuide/basis/localCache#缓存类型)
* 默认：`local`

缓存类型。

## 使用方式

### 创建本地缓存

```ts
import { createCache } from '@/utils/cache.ts'

interface Userinfo {
    name: string
}

// 创建本地缓存
const userinfoCache = createCache<Userinfo>('userinfo', 'local')

// 获取
const userinfo = userinfoCache.get()
console.log(userinfo) // Userinfo | undefined

// 设置
userinfoCache.set({ name: 'admin' })

// 删除
userinfoCache.remove()

// 是否存在
const isExist = userinfoCache.isExist();
console.log(isExist) // boolean
```

> 查看缓存方式：在浏览器中按下`F12`-`Application(应用)`-`Local storage(本地存储空间)`，然后找对应的`key`即可

### 创建会话缓存

```ts
import { createCache } from '@/utils/cache.ts'

// 创建
const nameCache = createCache<string>('name', 'session')

// 获取
const name = nameCache.get()
console.log(name) // string | undefined

// 设置
nameCache.set('admin')

// 删除
nameCache.remove()

// 是否存在
const isExist = nameCache.isExist();
console.log(isExist) // boolean
```

> 查看缓存方式：在浏览器中按下`F12`-`Application(应用)`-`Session storage(会话存储空间)`，然后找对应的`key`即可

### 创建Cookie缓存

```ts
import { createCache } from '@/utils/cache.ts'

// 创建
const tokenCache = createCache<string>('token', 'cookie')

// 获取
const token = tokenCache.get()
console.log(token) // string | undefined

// 设置token,并且4小时后过期
tokenCache.set('xxxx', 1 / 24 * 4)

// 删除
tokenCache.remove()

// 是否存在
const isExist = tokenCache.isExist();
console.log(isExist) // boolean
```

> 查看缓存方式：在浏览器中按下`F12`-`Application(应用)`-`Cookies`，然后找对应的`key`即可 
