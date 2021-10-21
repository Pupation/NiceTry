import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import paths from './paths'

Vue.use(Router)

// Create a new router
const router = new Router({
  base: '/',
  mode: 'history',
  routes: paths,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
})

// Route guard checks to see if you are logged in, if not reroutes to login
// to is where you are going, matched.some is to find which routes have requiresAuth
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/authorized']) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router
