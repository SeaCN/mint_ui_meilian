<template>
    <div class="reply">
      <mt-field placeholder="回复内容" type="textarea" rows="10" v-model="fbcontent"></mt-field>
      <mt-button type="primary" size="large" @click.native="subFB">提交</mt-button>
    </div>
</template>

<script>
    import Constant from '../assets/constant.js'
    import axios from 'axios'
    export default {
      name: "",
      data(){
        return {
          fbcontent: '',
          suggestionId: ''
        }
      },
      methods: {
        subFB: function () {
          this.$indicator.open();
          axios.post(
            Constant.path + '/feedback/addFeedback',
            {
                suggestionid: this.suggestionId,
                content: this.fbcontent,
                userid: 1
            }
          ).then(response=>{
            if(response.status === 200){
              this.$indicator.close();
              this.$toast({
                message: '操作成功',
                duration: 1500,
                className: 'successClass'
              })
              this.$router.go(-1)
            }else {
              this.$toast({
                message: '操作失败',
                duration: 1500,
                className: 'errorClass'
              })
            }
          })
        }
      },
      created: function(){
       this.suggestionId = this.$route.query.suggesstionid
      }
    }
</script>

<style >
  .successClass{
    background-color: green;
  }
  .errorClass{
    background-color: red;
  }

</style>
