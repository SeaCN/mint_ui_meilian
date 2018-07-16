<template>
    <div id="uploadImg">
      <img :src="localId" alt="点击插入图片" @click="chooseImg">
    </div>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import constant from "../assets/constant";
  export default {
    name: "UploadImg",
    data(){
      return {
        img: "",
        localId: ""
      }
    },
    methods: {
      passImg: function () {
        this.$emit('receiveImg', this.img)
      },
      chooseImg: function () {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res)=> {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            this.localId = localIds
            // $("img")[0].src=localIds
            this.toWechatServer(localIds[0])
          }
        });
      },
      toWechatServer: function (localId) {
        wx.uploadImage({
          localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: (res)=> {
            var serverId = res.serverId; // 返回图片的服务器端ID
            this.downToServer(serverId)
          }
        });
      },
      downToServer: function (serverId) {
        //下载到meten服务器，返回图片的保存路径
        this.$ajax({
          url: constant.path + "/material/getTemp",
          method: 'post',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          params: {
              media_id: serverId
          }
        }).then(response=>{
          if(response.status == 200){
            let data = response.data;
            if (data.code == 200) {
              this.img = data.data.resUrl
              this.passImg()
            } else {
              this.$toast({
                className: 'errormsg',
                message: '下载失败',
                iconClass: 'icon icon-sad2'
              });
            }
          }else {
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

<style scoped>

  img{
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
