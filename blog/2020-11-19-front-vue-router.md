---
slug: front-vue-router
title: 2020-11-11-前端-vue 路由详解
author: Lin
author_title: apem789
author_url: https://github.com/apem789
author_image_url: https://himg.bdimg.com/sys/portrait/item/642de68993e59da63535359f30.jpg
tags: [前端, ]
---

## vue-router 4.0 路由基础
[vue-router](https://next.router.vuejs.org/)


## 创建路由
```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = []
/** 单条路由记录 */
const routeTemp: RouteRecordRaw = {
  path: '路由地址',
  name: '路由名',
  component: '路由对应的组件',
  alias: '可选,string|string[],路由别名',
  redirect: '可选,重定向地址',
  children: '可选,子路由数组',
  meta: '可选,元字段-参数',
  props: '可选,开启动态路由传值',
  beforeEnter: '可选,进入该路由前执行什么操作'
}

const router = createRouter({
  history: createWebHistory(), // 路由模式
  routes: routes // 路由记录
})
export default router
```


## addRoute() 添加新的路由配置项
一般用于：后端返回动态路由配置数据,前端根据数据渲染对应路由配置的需求
```typescript
addRoute(route: RouteRecordRaw): () => void
```


## removeRoute() 删除现有的路由项
```typescript
removeRoute(name: string | symbol): void
```


## 动态路由与404的匹配
```typescript
// 动态路由
{ path: '/users/:id', component: User },
// => 页面接收 :id
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
  setup(){
    const id = useRoute().params.id
  }
}

// 404 页面路由匹配
const routes = [
  // 匹配所有的东西并把它放在下面`$route.params.pathMatch路径匹配`
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  // 匹配以'/user-'开头的任何内容并将其置于`$route.params.afterUser之后`
  { path: '/user-:afterUser(.*)', component: UserGeneric },
]
```



## createRouter 可以设置3种路由模式
1. createWebHistory 浏览器记录模式
  https://example.com/
  生产环境下, hostory模式需要后台协助配置转发才能访问(白屏、404)

2. createWebHashHistory hash值记录模式
  https://example.com/#/
  生产环境下, '哈希'模式可以正常访问

3. createMemoryHistory 主要目的是处理SSR


## 全局路由守卫
1. beforeEach() 每次进入一个路由前
```typescript
// main.ts
router.beforeEach((to, from, next) => {
  // 逻辑处理,最后 next()
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```
2. afterEach() 上一个路由切换完成时,下一个路由加载前
```typescript
// main.ts
router.afterEach((to, from, failure) => {
  // 判断路由切换状态、重定向等需求操作
  if (!failure) sendToAnalytics(to.fullPath)
})
```


## beforeResolve() 
vue 2 之前有一个bug,当前路由跳转到当前路由会报异常
```typescript
// main.ts
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... handle the error and then cancel the navigation
        return false
      } else {
        // unexpected error, cancel the navigation and pass the error to the global handler
        throw error
      }
    }
  }
})
```


## 组件内的路由守卫API
1. beforeRouteEnter() 进入路由前
2. beforeRouteUpdate() 当前路由更新时
3. beforeRouteLeave() 离开路由后


## 组件缓存、路由动画效果
`<router-view>, <keep-alive>, and <transition>`
```typescript
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```
