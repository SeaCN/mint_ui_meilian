<template>
  <div class="hello">
    <mt-navbar v-model="selected" fixed>
      <mt-tab-item id="1">我的建议</mt-tab-item>
      <mt-tab-item id="2">提交建议</mt-tab-item>
    </mt-navbar>

    <mt-tab-container v-model="selected" swipeable>
      <mt-tab-container-item id="1">
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="autoFill">
          <mt-cell v-for="item in list">
              <!--<p>{{item.content}}</p>-->
            <h1 slot="title">{{item.title}}</h1>
            <p>{{item.content}}</p>
          </mt-cell>
        </mt-loadmore>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-cell>
          2
        </mt-cell>
      </mt-tab-container-item>
    </mt-tab-container>

  </div>
</template>

<script>
    export default {
      name: "test",
      data(){
        return {
          selected: "1",
          list: [
            {title: "1", content:"oneadadaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"},
            {title: "2", content:"one"},
            {title: "3", content:"one"}
          ],
          allLoaded: false,
          autoFill: true
        }
      },
      methods: {
        loadBottom: function () {
          setTimeout(()=> {
            let k = this.list[this.list.length-1]
            for (var i=0; i<10; i++){
              this.list.push(++k)
            }
            this.$refs.loadmore.onBottomLoaded();
          }, 1000)

        }
      }
    }
</script>

<style scoped>
.hello{
  text-align: left;
  /*overflow: auto*/
}
.mint-tab-container{
  margin-top: 50px!important;
}
</style>
