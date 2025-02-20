---
outline: deep
---

# 概述

项目内内置了有两种权限控制方式。

* `web`：前端配置路由表，通过用户角色来过滤路由，自动生成菜单 （适合角色固定的系统）
* `service`：后端通过用户角色返回路由表，前端通过路由表自动生成菜单

```ts
type RouteAuthMode = 'web' | 'service'
```

**更改权限控制**

在`src/store/modules/auth/index.ts`文件中,修改属性`routeAuthMode`。

## `web`-前端权限控制

在`src/store/modules/auth/index.ts`文件中,将属性`routeAuthMode`修改为`web`。

前端配置路由表，通过用户角色来过滤路由，自动生成菜单 （适合角色固定的系统）。

在`src/enums/auth.ts`文件中配置`固定角色`。

```ts
export enum RoleEnum {
    // 超级管理员
    SUPER = 'Super',
    // 管理员
    ADMIN = 'Admin',
    // 测试
    TEST = 'Test'
}
```

给路由设置权限，如果无需权限不设置`roles`即可。

```ts {7}
export default {
    path: '/user',
    component: 'basic-view',
    meta: {
        title: '用户管理',
        // SUPER角色可见
        roles: [ RoleEnum.SUPER ]
    }
} satisfies AppRouteRecordRaw
```
通过`useAuthStore`的`initFrontRouteAuth`方法初始化前端路由
```ts
initFrontRouteAuth() {
    // 获取用户路由
    this.routes = RouterUtils.getUserRouteList(this.roles)
    // 自定义路由转Vue路由
    const vueRoutes = RouterUtils.transformCustomRoutesToVueRoutes(this.routes)
    // 添加路由
    vueRoutes.forEach(route => router.addRoute(route))
    this.isGeneratedRoutes = true
}
```
> 代码位置：`src/store/modules/auth/index.ts`

## `service`-后台权限控制

后端通过用户角色返回路由表，前端通过路由表自动生成菜单。

前端需要与后端定义好数据结构，最好让后端返回[AppRouteRecordRaw](/frontEndGuide/basis/routeAndMenu#路由类型)类型的数据结构。
,然后通过`transformCustomRoutesToVueRoutes`将自定义路由转成vue路由，使用`router`的`addRoute`方法添加路由

> `transformCustomRoutesToVueRoutes`代码位置：`src/router/utils/tool.ts`

::: info 注意
如果后台返回的不是[AppRouteRecordRaw](/frontEndGuide/basis/routeAndMenu#路由类型)数据结构，前端需要将后台返回的数据结构转成[AppRouteRecordRaw](/frontEndGuide/basis/routeAndMenu#路由类型)
:::
获取用户路由
```ts
// 获取用户路由
async getUserRoutes() {
    const [ result, error ] = await UserApi.getRoutes()
    if (error) {
        this.initAuthStore()
        return Promise.reject('用户路由获取失败')
    }
    this.routes = result
}
```

通过`useAuthStore`的`initServerRouteAuth`方法初始化前端路由
```ts
async initServerRouteAuth() {
    // 获取用户路由
    await this.getUserRoutes()
    // 自定义路由转Vue路由
    const vueRoutes = RouterUtils.transformCustomRoutesToVueRoutes(this.routes)
    // 添加路由
    vueRoutes.forEach(route => router.addRoute(route))
    this.isGeneratedRoutes = true
}
```
> 代码位置：`src/store/modules/auth/index.ts`

## 细粒度权限
