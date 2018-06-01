<template>
  <div class="hello">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">所有建议</mt-tab-item>
      <mt-tab-item id="2">历史回复</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="autoFill">
          <ul>
            <li v-for="item in list">{{ item }}</li>
          </ul>
        </mt-loadmore>
      </mt-tab-container-item>

      <mt-tab-container-item id="2">
        <mt-loadmore :bottom-method="loadBottom1" :bottom-all-loaded="allLoaded1" ref="loadmore1" :autoFill="autoFill1">
          <ul>
            <li v-for="item in list1">{{ item }}</li>
          </ul>
        </mt-loadmore>
      </mt-tab-container-item>
    </mt-tab-container>


  </div>
</template>

<script>
    export default {
      name: "",
      data(){
        return{
          selected: "1",
          list: [1,2,3,4,5,6,7,8,9,0],
          list1: [1,2,3,4,5,6,7,8,9,0],
          count: 0,
          count1: 0,
          autoFill: false,
          autoFill1: false,
          allLoaded: false,
          allLoaded1: false
        }
      },
      methods: {
        loadBottom: function() {console.log("触发")
          this.loadPageList();
          this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        },
        loadBottom1: function() {console.log("触发1")
          this.loadPageList1();
          this.$refs.loadmore1.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
        },
        loadPageList:function (){
          // 查询数据
          /*this.api.PageList(this.searchCondition).then(data =>{
            // 是否还有下一页，加个方法判断，没有下一页要禁止上拉
            this.isHaveMore(data.result.haveMore);
            this.pageList = data.result.pageList;
            this.$nextTick(function () {
              // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
              // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
              // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
              this.scrollMode = "touch";
            });
          });*/
          if (this.count > 200){
            this.allLoaded = true
            return;
          }
          for(var i=0; i<10; i++){
            this.list.push(++this.count)
          }
        },
        loadPageList1:function (){
          if (this.count1 > 200){
            this.allLoaded1 = true
            return;
          }
          for(var i=0; i<10; i++){
            this.list1.push(++this.count1)
          }
        }
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
