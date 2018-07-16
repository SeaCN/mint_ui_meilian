// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from 'axios'
import wx from 'weixin-js-sdk'
import Constant from './assets/constant.js'

axios.defaults.withCredentials=true;
Vue.prototype.$ajax = axios
Vue.use(Mint)

Vue.config.productionTip = false
/* eslint-disable no-new */
router.beforeEach((to, from, next)=>{//判断登陆
  if(!(to.meta.requiresAuth)){
    next()
  }else {
    axios({
      url: 'http://java.devqz.club/meten/checkLogin'
    }).then(response=>{
      if (response.status === 200) {
        if(response.data.data == 1){//用户已经登陆
          next();
        }else {//没有登陆
          location.href = 'http://java.devqz.club/meten/getCode?to=' + to.fullPath;
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



$(function () {
  wx.ready(()=> {

  })
  wx.error((res)=> {
    alert("注入失败")
  });
  getConfig()
})

function getConfig() {
  let url = location.href.split("#")[0]//获取锚点之前的链接
  $.ajax({
    xhrFields:{
      withCredentials:true
    },
    url: Constant.path + "/jssdk/sign",
    data: {
      url: url
    },
    method: 'post',
    async: false,
    dataType: "json",
    success: (response) => {
      let res = response.data;
      wxInit(res);
    }
  })
}
function wxInit (res) {
  let url = location.href.split("#")[0]//获取锚点之前的链接
  wx.config({
    debug: false,
    appId: res.appId,
    timestamp: res.timestamp,
    nonceStr: res.noncestr,
    signature: res.sign,
    // jsApiList: constant.jsApiList
    jsApiList: ['startRecord','stopRecord',
      'onVoiceRecordEnd','playVoice','pauseVoice','stopVoice',
      'translateVoice','uploadVoice','chooseImage','uploadImage']
  });

}
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
