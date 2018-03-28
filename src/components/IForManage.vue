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
        <mt-cell v-for="item in list" :title='item.title' is-link>
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
        list: [
          {title: 'titile1'},{title: 'titile2'},{title: 'titile3'},{title: 'titile4'},{title: 'titile5'}
          ,{title: 'titile6'},{title: 'titile7'},{title: 'titile8'},{title: 'titile9'},{title: 'titile10'}
        ],
        isshow: false
      }
    },
    methods: {
      loadMore: function() {
        this.isshow=true
        this.loading = true;
        setTimeout(() => {
          let last = this.list[this.list.length - 1];
          for (let i = 1; i <= 10; i++) {
            this.list.push({title: 'newtitle'+i});
          }
          this.loading = false;
          this.isshow=false
        }, 3000);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
