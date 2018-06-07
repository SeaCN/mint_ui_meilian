import Vue from 'vue'
import Router from 'vue-router'
import Suggest from '@/components/Suggest'
import Reply from '@/components/Reply'
import AdminPage from '@/components/AdminPage'
import test from '@/components/test'
import CommonUserPage from '@/components/CommonUserPage'
import SuggView from '@/components/SuggView'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'test',
      component: test
    }, {
      path: '/Suggest',
      name: 'Suggest',
      component: Suggest
    }, {
      path: '/Reply',
      name: 'Reply',
      component: Reply
    }, {
      path: '/AdminPage',
      name: 'AdminPage',
      component: AdminPage
    }, {
      path: '/CommonUserPage',
      name: 'CommonUserPage',
      component: CommonUserPage
    }
  ]
})
