<template>
  <div class="commonUser">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">我的建议</mt-tab-item>
      <mt-tab-item id="2">提交建议</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected" swipeable>
      <mt-tab-container-item id="1">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="autoFill">
          <mt-cell v-for="item in list" :key='item.id'
                         :title="item.title" :label="item.createTime"
                         @click.native="showDetail"
          >
            <span style="font-size: 15px">by：{{item.nickname}}</span>

            <span style="font-size: 10px; color:#ff7257" v-if="item.fcontent">/有回复<mt-badge type="error">1</mt-badge></span>
            <input id="itemC" type="hidden" v-model="item.content">
            <input id="itemI" type="hidden" v-model="item.img">
            <input id="itemId" type="hidden" v-model="item.id">
          </mt-cell>
        </mt-loadmore>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <Suggest></Suggest>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
    import Constant from '../assets/constant.js'
    import Suggest from '@/components/Suggest'
    export default {
      name: "CommonUserPage",
      components: {
        Suggest
      },
      data() {
        return {
          selected: "1",
          list: [],
          autoFill: false,
          allLoaded: false,
          currentPage: 1,
          pageSize: 10,
          dynamicDiv: {},
          wrapperHeight: 0
        }
      },
      methods: {
        loadBottom: function() {
          setTimeout(()=>{
            this.loadPageList();
            this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
          }, 1000)
        },
        loadPageList:function (){
          $.ajax({
            url: Constant.path + "/feedback/selectByUserid",
            data: {
              currentPage: this.currentPage++,
              pageSize: this.pageSize,
              userId: 1
            },
            type: "post",
            dataType: "json",
            async: false,
            success: (response)=> {
              if(response.data.length != 0){
                this.list = this.list.concat(response.data)
                if(response.data.length < this.pageSize){
                  this.allLoaded = true
                  this.$toast({
                    message: '没有更多数据了',
                    duration: 2000,
                    className: "over"
                  });
                }
              }else{
                this.allLoaded = true
                this.$toast({
                  message: '暂无数据',
                  duration: 2000,
                  className: "over"
                });
              }
            }
          })
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
        },
        fbShowDetail: function (e) {
          let closeA = $(e.target).closest('a.mint-cell')
          if(closeA.find('div.animateDiv').length !== 0
            && closeA.find('div.animateDiv').css('display') != 'none'){
            this.fbdynamicDiv.hide()
            return;
          }
          this.fbdynamicDiv.hide()
          this.fbdynamicDiv.html("")
          this.fbdynamicDiv.append($('<p></p>'))
          this.fbdynamicDiv.find('p').html(closeA.find('#itemCC').val())
          let imgdata = closeA.find('#itemII').val()
          this.fbdynamicDiv.find('p').after($("<p><img src='" + imgdata +"'/></p>"))
          closeA.append(this.fbdynamicDiv)
          this.fbdynamicDiv.fadeIn(1000)
        }
      },
      created: function () {
        this.selected = this.$route.query.selected
        this.dynamicDiv = $('<div class="animateDiv"></div>');
        this.dynamicDiv.css({'display': 'none', 'padding': '0 10px', 'font-style': 'italic', 'font-family': 'arial, sans-serif'})
        this.dynamicDiv.slideUp()
        $.ajax({
          url: Constant.path + "/feedback/selectByUserid",
          data: {
            currentPage: this.currentPage++,
            pageSize: this.pageSize,
            userId: 1
          },
          type: "post",
          dataType: "json",
          async: false,
          success: (response)=> {
            if(response.data.length != 0){
              this.list = this.list.concat(response.data)
              if(response.data.length < this.pageSize){
                this.allLoaded = true
                this.$toast({
                  message: '没有更多数据了',
                  duration: 2000,
                  className: "over"
                });
              }
            }else{
              this.allLoaded = true
              this.$toast({
                message: '暂无数据',
                duration: 2000,
                className: "over"
              });
            }
          }
        })
      }
    }
</script>

<style scoped>
  .mint-tab-container{
    margin-top: 50px!important;
  }
  .commonUser{
    text-align: left;
  }
</style>
