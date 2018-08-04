import VueRouter from 'vue-router'
import List from './components/List'
import Item from './components/Item'

require('./bootstrap')

window.Vue = require('vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/list',
    component: List,
    children: [
      {
        path: 'item/:id',
        component: Item,
        beforeEnter (to, from, next) {
          if (from.path == '/list') {
            next()
          } else {
            next({
              name: 'item',
              params: to.params
            })
          }
        }
      }
    ]
  },
  {
    path: '/list/item/:id',
    name: 'item',
    component: Item
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
  data: {
    showModal: false
  }
}).$mount('#app')
