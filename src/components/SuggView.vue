<template>
    <div id="suggView">
      <mt-tab-container-item id="1">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="autoFill"
                     @bottom-status-change="statusChange">
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
    </div>
</template>

<script>
    export default {
      name: "SuggView",
      data(){
        return{
          allLoaded: false,
          autoFill: false
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
      }
    }
</script>

<style scoped>

</style>
