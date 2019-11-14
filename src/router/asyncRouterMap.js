import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const asyncRouterMap = [
    {
      path: '/password',
      name:'password',
      hidden: true,
      component: Layout,
      redirect: '/password',
      meta: { title: '密码', icon: 'dashboard' },
      children: [
        {
          path: 'forgetPassword',
          name: 'forgetPassword',
          component: () => import('@/views/password/forgetPassword'),
          meta: { title: '忘记密码', icon: 'dashboard' }
        },
        {
          path: 'renewPayPassword',
          name: 'renewPayPassword',
          component: () => import('@/views/password/renewPayPassword'),
          meta: { title: '重置交易密码', icon: 'dashboard' }
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
    }
  ]


export default asyncRouterMap