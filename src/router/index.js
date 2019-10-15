import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/',
    name: '首页',
    component: Layout,
    redirect: '/index',
    meta: { title: '首页', icon: 'dashboard' },
    children: [
      {
        path: 'index',
        name: '首页',
        component: () => import('@/views/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    component: Layout,
    redirect: '/login',
    meta: { title: '登录', icon: 'dashboard' },
    children: [
      {
        path: 'login',
        name: '登录',
        component: () => import('@/views/login/index'),
        meta: { title: '登录', icon: 'dashboard' }
      },
      {
        path: 'forgetPassword',
        name: '忘记密码',
        component: () => import('@/views/login/forgetPassword'),
        meta: { title: '忘记密码', icon: 'dashboard' }
      },
      {
        path: 'renewPassword',
        name: '重置密码',
        component: () => import('@/views/login/renewPassword'),
        meta: { title: '重置密码', icon: 'dashboard' }
      },
      {
        path: 'fixPayPassword',
        name: '修改交易密码',
        component: () => import('@/views/login/fixPayPassword'),
        meta: { title: '修改交易密码', icon: 'dashboard' }
      },
      {
        path: 'renewPayPassword',
        name: '重置交易密码',
        component: () => import('@/views/login/renewPayPassword'),
        meta: { title: '重置交易密码', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/deviceManage',
    name: '设备管理',
    component: Layout,
    redirect: '/deviceManage',
    meta: { title: '设备管理', icon: 'dashboard' },
    children: [
      {
        path: 'deviceDistribute',
        name: '设备分配',
        component: () => import('@/views/deviceManage/deviceDistribute'),
        meta: { title: '设备分配', icon: 'dashboard' }
      },
      {
        path: 'deviceType',
        name: '设备型号',
        component: () => import('@/views/deviceManage/deviceType'),
        meta: { title: '设备型号', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/user-business',
    name: '用户管理-商家管理',
    component: Layout,
    redirect: '/user-business',
    meta: { title: '用户管理-商家管理', icon: 'dashboard' },
    children: [
      {
        path: 'orderUser',
        name: '订单用户',
        component: () => import('@/views/user-business/orderUser'),
        meta: { title: '订单用户', icon: 'dashboard' }
      },
      {
        path: 'orderUserDetail',
        name: '订单用户详情',
        component: () => import('@/views/user-business/orderUserDetail'),
        meta: { title: '订单用户详情', icon: 'dashboard' }
      },
    ]
  },

  {
    path: '/orderManage',
    name: '订单管理',
    component: Layout,
    redirect: '/orderManage',
    meta: { title: '订单管理', icon: 'dashboard' },
    children: [
      {
        path: 'orderManage',
        name: '订单管理',
        component: () => import('@/views/orderManage'),
        meta: { title: '订单管理', icon: 'dashboard' }
      },
    ]
  },

  {
    path: '/financeManage',
    name: '资金管理',
    component: Layout,
    redirect: '/financeManage',
    meta: { title: '资金管理', icon: 'dashboard' },
    children: [
      {
        path: 'platIncome',
        name: '平台收入',
        component: () => import('@/views/financeManage/platIncome'),
        meta: { title: '平台收入', icon: 'dashboard' }
      },
      {
        path: 'businessIncome',
        name: '商家收入',
        component: () => import('@/views/financeManage/businessIncome'),
        meta: { title: '设备管理', icon: 'dashboard' }
      },
      {
        path: 'managerRakeback',
        name: '管理员返佣',
        component: () => import('@/views/financeManage/managerRakeback'),
        meta: { title: '管理员返佣', icon: 'dashboard' }
      },
      {
        path: 'rakebackSet',
        name: '返佣设置',
        component: () => import('@/views/financeManage/rakebackSet'),
        meta: { title: '返佣设置', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
