<template>
  <div class="suggest">
    <!--<mt-header title="请输入标题"></mt-header>-->
    <mt-field  type="input" v-model="title" label="标题"></mt-field>
    <!--<mt-header title="请输入内容"></mt-header>-->
    <mt-field  type="textarea" rows="6" v-model="content" label="内容"></mt-field>
    <!--<mt-header title="上传图片"></mt-header>-->

    <form action="" style="display:none">
      <input type="file" id="upfile" @change="fileclick">
    </form>

    <div class="imgcontainer">
      <img :src="imgsrc" v-show="isshow" class="imgstyle" @click="handleClick"/>
    </div>
    <mt-button type="primary" size="large" @click.native="submit">提交</mt-button>
  </div>
</template>

<script>
  import upload from '../assets/upload.png'
  import Constant from '../assets/constant.js'
  import axios from 'axios'
  export default {
    name: "",
    data() {
      return {
        title: "",
        content: "",
        imgsrc: upload,
        isshow: true
      }
    },
    methods: {
      handleClick: function () {
        var file = document.getElementById("upfile")
        // console.log($("#upfile"))
        file.click();
      },
      fileclick: function (event) {
        let file = $("#upfile")[0].files[0];
        if(!/image\/\w+/.test(file.type)){
          alert("看清楚，这个需要图片！");
          return false;
        }
        var reader = new FileReader();
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);
        reader.onload = (e)=>{
          this.imgsrc=e.target.result
          this.isshow=true
        }
      },
      submit: function () {
        //验证输入是否合法
        if(!(this.title && $.trim(this.title).length != 0)){
          this.$toast({
            className: 'errormsg',
            message: '请输入标题'
          });
          return false;
        }
        if(!(this.content && $.trim(this.content).length != 0)){
          this.$toast({
            className: 'errormsg',
            message: '请输入内容'
          });
          return false;
        }
        axios(
          {
            url: Constant.path + '/suggestion/addSugg',
            method: 'post',
            data: {
              img: this.imgsrc,
              title: this.title,
              content: this.content,
              userid: 1
            }
          }
        ).then(response=>{
          if(response.status === 200){
            let data = response.data;
            if(data.code == 200){
              this.$toast({
                className: 'successmsg',
                message: '操作成功',
                iconClass: 'icon icon-happy2'
              });
            }else{
              this.$toast({
                className: 'errormsg',
                message: '操作失败',
                iconClass: 'icon icon-sad2'
              });
            }
          }else{
            this.$toast({
              className: 'errormsg',
              message: '操作失败',
              iconClass: 'icon icon-sad2'
            });
          }
        })
      }
    }
  }
</script>

<style >
  .imgcontainer {
    width: 100%;
    /*background-color: rgba(198, 217, 46, 0.22);*/
    text-align: center;
  }
  .imgstyle{
    width: 80%;
 /*   min-height: 100px;*/
  }
  .suggest {
    text-align: left;
    margin-top: 50px;
  }
  .errormsg{
    color: rgba(255, 107, 98, 0.97) !important;
  }
  .successmsg{
    color: #5daf34;
  }
</style>
