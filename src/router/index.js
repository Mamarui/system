import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Login from '../views/password/index.vue';

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
 * constantRouterMap
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRouterMap = [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      name: '首页',
      children: [{ 
        path: 'dashboard', 
        component: () => import('@/views/index') ,
        meta: { title: '首页' }
      }]
    },
    {
      path: '/password',
      name:'password',
      hidden: false,
      component: Layout,
      redirect: '/password',
      meta: { title: '密码', icon: 'dashboard' },
      children: [
        {
          path: 'forgetPassword',
          name: 'forgetPassword',
          component: () => import('@/views/password/forgetPassword'),
          meta: { title: '重置密码', icon: 'dashboard' },
          hidden:false
        },
        {
          path: 'renewPayPassword',
          name: 'renewPayPassword',
          component: () => import('@/views/password/renewPayPassword'),
          meta: { title: '重置交易密码', icon: 'dashboard' },
          hidden:false
        }
      ]
    },
  
    {
      path: '/deviceManage',
      name: 'deviceManage',
      component: Layout,
      redirect: '/deviceManage',
      meta: { title: '设备管理', icon: 'dashboard' },
      children: [
        {
          path: 'deviceDistribute',
          name: 'deviceDistribute',
          component: () => import('@/views/deviceManage/deviceDistribute'),
          meta: { title: '设备分配', icon: 'dashboard' }
        },
        {
          path: 'deviceBind',
          name: 'deviceBind',
          component: () => import('@/views/deviceManage/deviceBind'),
          meta: { title: '设备绑定', icon: 'dashboard' }
        }
      ]
    },
  
    {
      path: '/userManage',
      name: 'userManage',
      component: Layout,
      redirect: '/userManage',
      meta: { title: '用户管理', icon: 'dashboard' },
      children: [
        {
          path: 'businessManage',
          name: 'businessManage',
          component: () => import('@/views/userManage/businessManage'),
          meta: { title: '商家管理', icon: 'dashboard' }
        },
        {
          path: 'orderUser',
          name: 'orderUser',
          component: () => import('@/views/userManage/orderUser'),
          meta: { title: '订单用户', icon: 'dashboard' }
        },
      ]
    },
  
    {
      path: '/orderManage',
      component: Layout,
      redirect: '/orderManage',
      meta: { title: '订单管理', icon: 'dashboard' },
      children: [
        {
          path: 'orderManage',
          name: 'orderManage',
          component: () => import('@/views/orderManage'),
          meta: { title: '订单管理', icon: 'dashboard' }
        },
      ]
    },
  
    {
      path: '/financeManage',
      name: 'financeManage',
      component: Layout,
      redirect: '/financeManage',
      meta: { title: '资金管理', icon: 'dashboard' },
      children: [
        {
          path: 'platFinance',
          name: 'platFinance',
          component: () => import('@/views/financeManage/platFinance'),
          meta: { title: '平台资金', icon: 'dashboard' }
        },
        {
          path: 'platIncome',
          name: 'platIncome',
          component: () => import('@/views/financeManage/platIncome'),
          meta: { title: '平台收入', icon: 'dashboard' }
        },
        {
          path: 'businessIncome',
          name: 'businessIncome',
          component: () => import('@/views/financeManage/businessIncome'),
          meta: { title: '商家收入', icon: 'dashboard' }
        },
        {
          path: 'mediumRakeback',
          name: 'mediumRakeback',
          component: () => import('@/views/financeManage/mediumRakeback'),
          meta: { title: '中介返佣', icon: 'dashboard' }
        },
        {
          path: 'platCashout',
          name: 'platCashout',
          component: () => import('@/views/financeManage/platCashout'),
          meta: { title: '商家提现', icon: 'dashboard' }
        },
        {
          path: 'mediumManage',
          name: 'mediumManage',
          component: () => import('@/views/financeManage/mediumManage'),
          meta: { title: '中介管理', icon: 'dashboard' }
        },
        {
          path: 'rakebackSet',
          name: 'rakebackSet',
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

]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
