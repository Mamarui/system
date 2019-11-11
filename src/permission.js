import router from './router'
import asyncRouter from '@/router/asyncRouterMap'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import { isLogin } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist


// main.js
router.beforeEach((to, from, next) => {
  NProgress.start()
  const hasLogin = isLogin()
	if (hasLogin) {     //判断是否登录
      if (to.path === '/login') {
          next({ path: '/' })
          NProgress.done()
      } else {
          if(store.getters.token){	//验证是否获取到token
              next()
              NProgress.done()
          }else{	//本地环境 不验证权限
              next()
          }
      }
  } else {
      /* 未登录*/
      if (whiteList.indexOf(to.path) !== -1) {
          // in the free login whitelist, go directly
          next()
      } else {
          // other pages that do not have permission to access are redirected to the login page.
          next(`/login?redirect=${to.path}`)
          NProgress.done()
      }
	}
});



router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
