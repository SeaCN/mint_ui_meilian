<template>
  <div class="hello">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">所有建议</mt-tab-item>
      <mt-tab-item id="2">历史回复</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <mt-cell-swipe v-for="item in list" :key='item.id' :title="item.title" :label="item.createTime"
          @click.native="showDetail"
          :right="[{
            content: '回复',
            style: { background: '#6eff2a', color: '#fff' },
            handler: reply
          }]"
        >
          <input id="itemC" type="hidden" v-model="item.content">
          <input id="itemI" type="hidden" v-model="item.img">
          <input id="itemId" type="hidden" v-model="item.id">
        </mt-cell-swipe>
        <mt-cell v-show="isshow">
          <span class="loadingfont">正在获取更多</span><mt-spinner :type="2"></mt-spinner>
        </mt-cell>

      </mt-tab-container-item>
    </mt-tab-container>
    <mt-tab-container v-model="selected">
        12
    </mt-tab-container>
  </div>
</template>

<script>
  import Constant from '../assets/constant.js'
  import axios from "axios"
    export default {
      name: "AdminPage",
      data() {
        return {
          loading: false,
          selected : "1",
          list: [

          ],
          isshow: false,
          dynamicDiv: {},
          currentPage: 1,
          pageSize: 10,
          toEnd: false
        }
      },
      methods:{
        loadMore: function() {
          this.loading = true;
          if (this.toEnd){
            this.isshow = false;
            return;
          }else{
            this.isshow = true
          }
          setTimeout(() => {
            this.getSuggs();
            this.loading = false;
          }, 1000);
        },
        /*获取建议列表*/
        getSuggs: function(){
          //查询数据库
          $.ajax({
            url: Constant.path + "/suggestion/suggestionByPage",
            data: {
              currentPage: ++this.currentPage,
              pageSize: this.pageSize
            },
            type: "post",
            dataType: "json",
            async: false,
            success: (response)=> {
              if(response.data.length != 0){
                this.list = this.list.concat(response.data)
              }else{
                this.toEnd = true
                this.$toast({
                  message: '暂无数据',
                  duration: 2000,
                  className: "over"
                });
              }
            }
          })
        },
        reply: function () {
          let closeA = $(event.target).closest('a.mint-cell')
          let itemid = closeA.find('#itemId').val()
          this.$router.push({path: 'Reply', query: {suggesstionid: itemid}})
        },
        showDetail: function (e) {
          let closeA = $(e.target).closest('a.mint-cell')
          if(closeA.find('div.animateDiv').length !== 0
            && closeA.find('div.animateDiv').css('display') != 'none'){
            this.dynamicDiv.hide()
            return;
          }
          this.dynamicDiv.hide()
          this.dynamicDiv.html("")
          this.dynamicDiv.append($('<p></p>'))
          this.dynamicDiv.find('p').html(closeA.find('#itemC').val())
          let imgdata = closeA.find('#itemI').val()
          this.dynamicDiv.find('p').after($("<p><img src='" + imgdata +"'/></p>"))
          closeA.append(this.dynamicDiv)
          this.dynamicDiv.fadeIn(1000)
        }
      },
      created: function () {
        this.dynamicDiv = $('<div class="animateDiv"></div>');
        this.dynamicDiv.css({'display': 'none', 'padding': '0 10px', 'font-style': 'italic', 'font-family': 'arial, sans-serif'})
        this.dynamicDiv.slideUp()
        //初始化数据，读取数据库
        $.ajax({
          url: Constant.path + '/suggestion/suggestionByPage',
          type: 'POST',
          async: false,
          dataType: 'json',
          data: {

          },
          success: (response)=>{
            if(response.code === "200"){
              this.list = response.data
              console.log(this.list)
            }
          }
        })
      }
    }
</script>

<style scoped>
/*  .mint-tab-container{
    margin-top: 46px!important;
  }*/
  .hello{
    text-align: left;
  }
  .loadingfont{
    color: #2dbe60;
    font-size: 15px;
    font-style: oblique;
  }
</style>
