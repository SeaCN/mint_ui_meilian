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
                         @click.native="showDetail(item)"
          >
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
          selected: "-1",
          list: [],
          autoFill: false,
          allLoaded: false,
          currentPage: 1,
          pageSize: 10,
          dynamicDiv: {},
          wrapperHeight: 0,
          item: {}
        }
      },
      watch:{
        selected: function (val, oldVal) {
          if(val == 1 && this.list.length == 0){
            this.dynamicDiv = $('<div class="animateDiv"></div>');
            this.dynamicDiv.css({'display': 'none', 'padding': '0 10px', 'font-style': 'italic', 'font-family': 'arial, sans-serif'})
            this.dynamicDiv.slideUp()
            $.ajax({
              xhrFields:{
                withCredentials:true
              },
              url: Constant.path + "/suggestion/suggestionByPage",
              data: {
                currentPage: this.currentPage++,
                pageSize: this.pageSize
              },
              type: "post",
              dataType: "json",
              async: true,
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
            xhrFields:{
              withCredentials:true
            },
            url: Constant.path + "/suggestion/suggestionByPage",
            data: {
              currentPage: this.currentPage++,
              pageSize: this.pageSize
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
        showDetail: function (item) {
          //打开一个新页面展示建议详情和回复信息
          this.$router.push({
            name: "SuggDetail",
            params: item
          })
        }
      },
      created: function () {
        this.selected = this.$route.query.selected
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
  .img{
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
