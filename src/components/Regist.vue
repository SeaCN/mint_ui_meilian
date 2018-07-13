<template>
  <div class="R">
    <div id="regist">
      <mt-field placeholder="请输入昵称(字母开头+数字/字母/下划线)" v-model="nickname"></mt-field>
      <mt-button type="default" size="large" @click.native="regist">
        确定
      </mt-button>
    </div>
  </div>
</template>

<script>
  import Constant from '../assets/constant.js'
  import constant from "../assets/constant";
  export default {
    name: "Regist",
    data(){
        return {
          nickname: ""
        }
    },
    methods: {
      regist: function () {
        //正则验证用户昵称是否合法
        let reg = /^[A-Za-z][A-Za-z1-9_-]+$/;
        if(reg.test(this.nickname)){
          //用户注册
          this.$ajax({
            url: Constant.path + '/regist',
            method: 'post',
            data: {
              nickname: this.nickname
            }
          }).then(response=>{
            if (response.status === 200) {
              let data = response.data;
              if (data.code == 200) {
                this.$toast({
                  message: data.message,
                  duration: 1000
                })
                //重定向到原先的访问的页面
                // this.$router.push(constant.path + this.$route.query.desPath)
                location.href = constant.path + this.$route.query.desPath
              }else {
                this.$toast({
                  message: data.message,
                  duration: 1000
                })
              }
            }
          })
        }else {
          this.$toast({
            message: '昵称格式不正确',
            duration: 1000
          })
        }
      }
    }
  }
</script>

<style scoped>
  #regist{
    position:fixed;
    top:50%;
    left:50%;
    width: 100%;
    transform:translateX(-50%) translateY(-50%)
  }
</style>
