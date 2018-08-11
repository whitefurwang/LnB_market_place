import VueRouter from 'vue-router'
import MarketPlace from './components/MarketPlace'
import Loan from './components/Loan'

require('./bootstrap')

window.myApp = window.myApp || {}
myApp.apis = {
  'market-place': {
    type: 'GET',
    'url': 'https://paris.robowebtech.tw/api/market-place'
    // url: '//localhost:3000/market-place'
  },
  'order': {
    type: 'POST',
    url: 'https://paris.robowebtech.tw/api/market-place/order'
    // type: 'GET',
    // url: '//localhost:3000/order'
  }
}

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
  linkActiveClass: 'active',
  routes
})

const app = new Vue({
  router
}).$mount('#app')
