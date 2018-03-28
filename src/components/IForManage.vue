<template>
  <div class="hello">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">所有建议</mt-tab-item>
      <mt-tab-item id="2">历史回复</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <mt-cell v-for="item in list" :title='item.title' :label="item.createTime" @click.native="cellclick">
          <input class="itemC" type="hidden" v-model="item.content">
        </mt-cell>
        <mt-cell v-show="isshow">
          正在获取更多<mt-spinner :type="0"></mt-spinner>
        </mt-cell>

      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-cell v-for="n in 11" title="n"></mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>

  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        selected: "1",
        list: [],
        isshow: false,
        dynamicDiv: {}
      }
    },
    methods: {
      cellclick: function (e) {
        let closeA = $(e.target).closest('a.mint-cell')
        console.log(closeA.find(':hidden'))
        this.dynamicDiv.html(closeA.find('.itemC').val())
        closeA.append(this.dynamicDiv)
        this.dynamicDiv.removeClass('divhidden')
      }
    },
    created: function () {
      this.dynamicDiv = $('<div></div>');
      this.dynamicDiv.addClass('divhidden')
      //初始化数据，读取数据库
      $.ajax({
        url: 'http://localhost/wechat_meilian/suggestion/suggestionByPage',
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
  .hello{
    text-align: left;
  }
</style>
