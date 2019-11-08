import router from './router'
import asyncRouter from '@/router/asyncRouterMap'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
var isF5 = false; //判断是否为刷新
// main.js
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
    if(isF5 == false){  //防止刷新
      isF5 = true;
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      // next('/login'); // 否则全部重定向到登录页
        // router.addRoutes(asyncRouter) // 动态添加可访问路由表
        // store.commit("user/SET_ROUTERS",asyncRouter)		//将筛选出来的路由  加入路由表
      next();
    }
  }
});



router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
