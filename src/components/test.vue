<template>
  <div class="hello">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">所有建议</mt-tab-item>
      <mt-tab-item id="2">历史回复</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="autoFill">
          <mt-cell-swipe v-for="item in list" :key='item.id'
                         :title="item.title" :label="item.createTime"
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
        </mt-loadmore>
      </mt-tab-container-item>

      <mt-tab-container-item id="2">
        <mt-loadmore :bottom-method="loadBottom1" :bottom-all-loaded="allLoaded1" ref="loadmore1" :autoFill="autoFill1">
          <mt-cell-swipe v-for="item in fblist" :key='item.id'
                         :title="item.title" :label="item.createTime"
                         @click.native="fbShowDetail"
          >
            <input id="itemCC" type="hidden" v-model="item.content">
            <input id="itemII" type="hidden" v-model="item.img">
            <input id="itemIdd" type="hidden" v-model="item.id">
          </mt-cell-swipe>
        </mt-loadmore>
      </mt-tab-container-item>
    </mt-tab-container>


  </div>
</template>

<script>
  import Constant from '../assets/constant.js'
  import axios from "axios"
    export default {
      name: "",
      data(){
        return{
          selected: "1",
          list: [],
          fblist: [],
          count: 0,
          count1: 0,
          autoFill: false,
          autoFill1: false,
          allLoaded: false,
          allLoaded1: false,
          currentPage: 1,
          pageSize: 10,
          dynamicDiv: {},
          fbdynamicDiv: {},
          fbpageSize: 10,
          fbcurrentPage: 1
        }
      },
      methods: {
        loadBottom: function() {
          this.loadPageList();
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        },
        loadBottom1: function() {
          this.loadPageList1();
          this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        },
        loadPageList:function (){
          $.ajax({
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
              }else{console.log("over")
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
        },
        loadPageList1:function (){
          $.ajax({
            url: Constant.path + "/feedback/selectByUserid",
            data: {
              currentPage: this.fbcurrentPage++,
              pageSize: this.fbpageSize,
              userId: 1
            },
            type: "post",
            dataType: "json",
            async: false,
            success: (response)=> {
              if(response.data.length != 0){console.log(response.data)
                this.fblist = this.fblist.concat(response.data)
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
        /*建议列表初始化*/
        this.dynamicDiv = $('<div class="animateDiv"></div>');
        this.dynamicDiv.css({'display': 'none', 'padding': '0 10px', 'font-style': 'italic', 'font-family': 'arial, sans-serif'})
        this.dynamicDiv.slideUp()
        $.ajax({
          url: Constant.path + '/suggestion/suggestionByPage',
          type: 'POST',
          async: false,
          dataType: 'json',
          data: {
            currentPage: this.currentPage++,
            pageSize: this.pageSize
          },
          success: (response)=>{
            if(response.code === "200"){
              this.list = response.data
            }
          }
        })

        /*回复列表初始化*/
        this.fbdynamicDiv = $('<div class="animateDiv"></div>');
        this.fbdynamicDiv.css({'display': 'none', 'padding': '0 10px', 'font-style': 'italic', 'font-family': 'arial, sans-serif'})
        this.fbdynamicDiv.slideUp()
        $.ajax({
          url: Constant.path + "/feedback/selectByUserid",
          data: {
            currentPage: this.fbcurrentPage++,
            pageSize: this.fbpageSize,
            userId: 1
          },
          type: "post",
          dataType: "json",
          async: false,
          success: (response)=> {
            if(response.data.length != 0){console.log(response.data)
              this.fblist = this.fblist.concat(response.data)
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
  margin-top: 46px!important;
}
.hello{
  text-align: left;
}
</style>
