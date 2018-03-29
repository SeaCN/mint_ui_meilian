<template>
  <div class="hello">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">所有建议</mt-tab-item>
      <mt-tab-item id="2">历史回复</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="selected"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="10">
      <mt-tab-container-item id="1">
        <mt-cell-swipe
          :right="[
            {
              content: '回复',
              style: { background: '#6eff2a', color: '#fff' },
              handler: reply
            }
          ]"
          v-for="item in list" :key='item.id' :title='item.title' :label="item.createTime" @click.native="cellclick">
          <input id="itemC" type="hidden" v-model="item.content">
          <input id="itemI" type="hidden" v-model="item.img">
          <input id="itemId" type="hidden" v-model="item.id">
        </mt-cell-swipe>
        <mt-cell v-show="isshow">
          正在获取更多<mt-spinner :type="0"></mt-spinner>
        </mt-cell>

      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-cell title="1"></mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>

  </div>
</template>

<script>
  import Constant from '../assets/constant.js'
  import axios from "axios"
  export default {
    name: 'HelloWorld',
    data () {
      return {
        selected: "1",
        list: [],
        isshow: false,
        dynamicDiv: {},
        currentPage: 1,
        pageSize: 10,
        toEnd: false
      }
    },
    methods: {
      loadMore: function() {
        if(this.toEnd){
          this.isshow = false
        }else{
          this.isshow = true
        }
        this.loading = true;
        setTimeout(() => {
          //查询数据库
          $.ajax({
            url: Constant.path + "wechat_meilian/suggestion/suggestionByPage",
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
                console.log(this.list)
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
          this.isshow = false
          this.loading = false;
        }, 2500);
      },
      cellclick: function (e) {
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
      reply: function () {console.log(event.target)
        let closeA = $(event.target).closest('a.mint-cell')
        let itemid = closeA.find('#itemId').val()
        this.$router.push({path: 'Reply', query: {suggesstionid: itemid}})
      }
    },
    created: function () {
      this.dynamicDiv = $('<div class="animateDiv"></div>');
      this.dynamicDiv.css({'display': 'none', 'padding': '0 10px', 'font-style': 'italic', 'font-family': 'arial, sans-serif'})
      this.dynamicDiv.slideUp()
      //初始化数据，读取数据库
      $.ajax({
        url: Constant.path + 'wechat_meilian/suggestion/suggestionByPage',
        type: 'POST',
        async: false,
        dataType: 'json',
        data: {

        },
        success: (response)=>{
          if(response.code === "200"){
            this.list = response.data
          }
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mint-tab-container{
    margin-top: 46px!important;
  }
  .divhidden{
    display: none;
  }
  .divpad{
    padding: 0 10px;
    font-style: italic;
    font-family: arial, sans-serif;
  }
  .hello{
    text-align: left;
  }
  .over{
    font-family: 04b_21;
    color: #6eff2a !important;
  }
</style>
