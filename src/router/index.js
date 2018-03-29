import Vue from 'vue'
import Router from 'vue-router'
import IForManage from '@/components/IForManage'
import Suggest from '@/components/Suggest'
import test from '@/components/test'
import Reply from '@/components/Reply'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IForManage',
      component: IForManage
    }, {
      path: '/Suggest',
      name: 'Suggest',
      component: Suggest
    }, {
      path: '/test',
      name: 'test',
      component: test
    }, {
      path: '/Reply',
      name: 'Reply',
      component: Reply
    }
  ]
})
