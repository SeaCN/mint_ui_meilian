import Vue from 'vue'
import Router from 'vue-router'
import Suggest from '@/components/Suggest'
import Reply from '@/components/Reply'
import AdminPage from '@/components/AdminPage'
import Regist from '@/components/Regist'
import test from '@/components/test'
import CommonUserPage from '@/components/CommonUserPage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/Regist',
      name: 'Regist',
      component: Regist
    },{
      path: '/test',
      name: 'test',
      component: test,
      meta: {requiresAuth: true}
    }, {
      path: '/Suggest',
      name: 'Suggest',
      meta: {requiresAuth: true},
      component: Suggest
    }, {
      path: '/Reply',
      name: 'Reply',
      meta: {requiresAuth: true},
      component: Reply
    }, {
      path: '/AdminPage',
      name: 'AdminPage',
      meta: {requiresAuth: true},
      component: AdminPage
    }, {
      path: '/CommonUserPage',
      name: 'CommonUserPage',
      meta: {requiresAuth: true},
      component: CommonUserPage
    }
  ]
})
