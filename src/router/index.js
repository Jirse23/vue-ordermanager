import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../pages/Login'
import { checktoken } from '@/api/apis'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    //默认加载 加载的时候会加载全部的页面
    component: Login,
    // beforeEnter: (to, from, next) => {
    //   // to是去哪里
    //   // from是来自哪里
    //   if (to.path != '/') {
    //     // 验证用户是否登录
    //     checktoken(localStorage.token).then(res => {
    //       // code等于0在登录状态
    //       // if (res.data.code == 0)
    //       //   next()
    //       // else
    //       //   next('')
    //       console.log(res)
    //     })
    //   } else
    //     next()
    // }
  },
  {
    path: '/main',
    name: 'main',
    //懒加载 只有再锚点匹配的时候才会加载 大大地提升了速度
    component: () => import('../pages/Main'),
    // 子路由
    children: [
      // 首页
      {
        path: '/index',
        name: 'index',
        component: () => import('../pages/main/Index'),
        // 自定义函数
        meta: { breaklist: ["首页"] }
      },
      // 订单管理
      {
        path: '/manage',
        name: 'manage',
        component: () => import('../pages/main/manage'),
        // 自定义函数
        meta: { breaklist: ["订单管理"] }
      },
      //销售统计
      {
        path: '/shops',
        name: 'shops',
        component: () => import('../pages/main/ShopManager'),
        // 自定义函数
        meta: { breaklist: ["店铺管理"] }
      },
      //--------------------------------------账号管理--------------------------------------------------//
      {
        path: '/useradd',//添加账号
        name: 'useradd',
        component: () => import('../pages/users/UserAdd'),
        // 自定义函数
        meta: { breaklist: ["账号管理", "添加账号"] }
      },
      {
        path: '/useredit',//账号编辑
        name: 'useredit',
        component: () => import('../pages/users/UserEdit'),
        // 自定义函数
        meta: { breaklist: ["账号管理", "账号编辑"] }
      },
      {
        path: '/userlist',//账号列表
        name: 'userlist',
        component: () => import('../pages/users/UserList'),
        // 自定义函数
        meta: { breaklist: ["账号管理", "账号列表"] }
      },
      //--------------------------------------商品管理--------------------------------------------------//
      {
        path: '/itemsadd',//商品添加
        name: 'itemsadd',
        component: () => import('../pages/items/ItemsAdd'),
        // 自定义函数
        meta: { breaklist: ["商品管理", "商品添加"] }
      },
      {
        path: '/itemslist',//商品列表
        name: 'itemslist',
        component: () => import('../pages/items/ItemsList'),
        // 自定义函数
        meta: { breaklist: ["商品管理", "商品列表"] }
      },
      {
        path: '/itemstype',//商品分类
        name: 'itemstype',
        component: () => import('../pages/items/ItemsType'),
        // 自定义函数
        meta: { breaklist: ["商品管理", "商品分类"] }
      },
      //--------------------------------------销售统计--------------------------------------------------//
      {
        path: '/salecount',//销售统计
        name: 'salecount',
        component: () => import('../pages/count/SaleCount'),
        // 自定义函数
        meta: { breaklist: ["销售统计", "销售统计"] }
      },
      {
        path: '/ordercount',//订单统计
        name: 'ordercount',
        component: () => import('../pages/count/OrderCount'),
        // 自定义函数
        meta: { breaklist: ["销售统计", "订单统计"] }
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',  //#性能更高
  base: process.env.BASE_URL,
  routes
})


// 路由守卫可以写在main.js不过写在路由里面更好
// 在切换路由前
router.beforeEach((to, from, next) => {
  //to 去哪里
  // from来自哪里
  // next下一跳的地址   不写参数就直接通过  不写就会空白被拦截
  // 不是默认路由地址,都要开启路由验证
  if (to.path != '/') {
    // 验证用户是否登录
    checktoken(localStorage.token).then(res => {
      // code等于0在登录状态
      if (res.data.code == 0)
        next()
      else
        next('/')
    })
  } else
    next()
})

export default router


