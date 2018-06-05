<template>
  <div class="page-loadmore-wrapper" ref="wrapper" :style="{height: wrapperHeight + 'px'}">
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="bottomAllLoaded" ref="loadmore" @bottom-status-change="handleBottomChange" :auto-fill="false">
      <div  v-for="item in topics">
        <h4> {{item.title}}</h4>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'IForManage',
    data () {
      return {
        searchKey: {
          currentPage: 1,
          pageSize:10,
          limit: 10
        },
        topics:[],
        bottomAllLoaded:false,
        wrapperHeight: 0
      }
    },
    methods:{
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadBottom() {
/*        setTimeout(() => {
          this.searchKey.currentPage++;
          this.getTopics();
          this.$refs.loadmore.onBottomLoaded();
        }, 1000);*/
        this.searchKey.currentPage++;
        this.getTopics();
        this.$refs.loadmore.onBottomLoaded();
      },
      getTopics() {
        let params = "currentPage="+this.searchKey.currentPage+"&pageSize="+this.searchKey.pageSize;
        axios.get('http://www.devqz.club/meilian_qa/suggestion/suggestionByPage?' + params).then(response => {
          console.log(response.data)
          this.topics = this.topics.concat(response.data.data);
          if(response.data.data.length<this.searchKey.limit){
            this.bottomAllLoaded=true;
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted: function(){
      this.getTopics();
      console.log(this.$refs)
      this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
    }
  }


</script>

<style>
  .page-loadmore-wrapper {
    overflow: scroll
  }

</style>
