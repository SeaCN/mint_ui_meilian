// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from 'axios'

axios.defaults.withCredentials=true;
Vue.prototype.$ajax = axios
Vue.use(Mint)

Vue.config.productionTip = false
/* eslint-disable no-new */
router.beforeEach((to, from, next)=>{//判断登陆
  if(to.path == '/Regist'){
    next()
  }else {
    axios({
      url: 'http://java.devqz.club/meten/checkLogin'
    }).then(response=>{
      if (response.status === 200) {
        if(response.data.data == 1){//用户已经登陆
          next();
        }else {//没有登陆
          location.href = 'http://java.devqz.club/meten/getCode?to=' + to.path
        }
      } else{
        this.$toast({
          className: 'errormsg',
          message: '无服务'
        })
      }
    })
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
