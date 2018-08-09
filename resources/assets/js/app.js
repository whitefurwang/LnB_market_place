import VueRouter from 'vue-router'
import MarketPlace from './components/MarketPlace'
import Loan from './components/Loan'
import store from './store'

require('./bootstrap')

window.Vue = require('vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/market-place',
    component: MarketPlace,
    children: [
      {
        path: 'loan/:serial',
        component: Loan,
        beforeEnter (to, from, next) {
          if (from.path === '/market-place' || from.path === '/market-place/') {
            next()
          } else {
            next({
              name: 'loan',
              params: to.params
            })
          }
        }
      }
    ]
  },
  {
    path: '/market-place/loan/:serial',
    name: 'loan',
    component: Loan
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

const app = new Vue({
  router,
  store
}).$mount('#app')
