<template>
    <div id="suggDetail">
      <div class="sugg">
        <h2>{{item.title}}</h2>
        <p>{{item.content}}</p>
        <p v-if="item.img"><img :src="item.img" class="img" alt="点击显示图片"/></p>
        <p v-if="item.wavPath">
          <audio :src="item.wavPath" controls="controls">
            您的浏览器不支持 audio 标签。.
          </audio>
        </p>
      </div>
      <div class="feedback">
        user:{{feedback[0].nickname}}
        reply:{{feedback[0].content}}
        replyTime:{{feedback[0].createTime}}
      </div>
    </div>
</template>

<script>
    import Constant from '../assets/constant.js'
    export default {
      name: "sugg-detail",
      data(){
        return {
          item: {},
          feedback:[]
        }
      },
      methods: {

      },
      created: function () {
        this.item = this.$route.params
        if(this.item.wavPath){
          this.item.wavPath = Constant.path + this.item.wavPath
        }
        if(this.item.img){
          this.item.img = Constant.path + this.item.img
        }

        $.ajax({
          url:Constant.path + '/feedback/selectBySugg',
          data:{
            suggestionid: this.item.id
          },
          async: false,
          dataType: "json",
          success: response=>{
            if(response.code == "200"){
              this.feedback = response.data;
            }
          }
        })
      }
    }
</script>

<style scoped>
  #suggDetail{
    text-align: left;
  }
  .img{
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    min-height: 100px;
  }
</style>
