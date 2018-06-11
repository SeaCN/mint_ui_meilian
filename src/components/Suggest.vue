<template>
  <div class="suggest">
    <!--<mt-header title="请输入标题"></mt-header>-->
    <mt-field type="input" v-model="title" label="标题"></mt-field>
    <!--<mt-header title="请输入内容"></mt-header>-->
    <mt-field type="textarea" rows="6" v-model="content" label="内容"></mt-field>
    <!--<mt-header title="上传图片"></mt-header>-->

    <form action="" style="display:none">
      <input type="file" id="upfile" @change="fileclick">
    </form>
    <div class="imgcontainer">
      <img :src="imgsrc" v-show="isshow" class="imgstyle" @click="handleClick"/>
    </div>
    <!--录音-->
    <span class="icon icon-play" @click.native="playAudio"></span>
    <mt-progress :value="progress" :barHeight="5">
      <div slot="start">0%</div>
      <div slot="end">100%</div>
    </mt-progress>
    {{result}}
    <mt-button type="primary" size="large" @click.native="start"  plain>开始录音</mt-button>
    <mt-button type="primary" size="large" @click.native="end"  plain>结束录音</mt-button>
    <mt-button type="primary" size="large" @click.native="submit">提交</mt-button>
  </div>
</template>

<script>
  import upload from '../assets/upload.png'
  import Constant from '../assets/constant.js'
  import constant from "../assets/constant";
  import wx from 'weixin-js-sdk'

  export default {
    name: "",
    data() {
      return {
        title: "",
        content: "",
        imgsrc: upload,
        isshow: true,
        START: null,
        END: null,
        recordTimer: null,
        voice: {
          localId: null
        },
        progress: 0,
        progresshandler: {},
        result: ''
      }
    },
    methods: {
      handleClick: function () {
        var file = document.getElementById("upfile")
        file.click();
      },
      fileclick: function (event) {
        let file = $("#upfile")[0].files[0];
        if (!/image\/\w+/.test(file.type)) {
          alert("看清楚，这个需要图片！");
          return false;
        }
        var reader = new FileReader();
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.imgsrc = e.target.result
          this.isshow = true
        }
      },
      submit: function () {
        //验证输入是否合法
        if (!(this.title && $.trim(this.title).length != 0)) {
          this.$toast({
            className: 'errormsg',
            message: '请输入标题'
          });
          return false;
        }
        if (!(this.content && $.trim(this.content).length != 0)) {
          this.$toast({
            className: 'errormsg',
            message: '请输入内容'
          });
          return false;
        }
        axios(
          {
            url: Constant.path + '/suggestion/addSugg',
            method: 'post',
            data: {
              img: this.imgsrc,
              title: this.title,
              content: this.content,
              userid: 1
            }
          }
        ).then(response => {
          if (response.status === 200) {
            let data = response.data;
            if (data.code == 200) {
              this.$toast({
                className: 'successmsg',
                message: '操作成功',
                iconClass: 'icon icon-happy2'
              });
            } else {
              this.$toast({
                className: 'errormsg',
                message: '操作失败',
                iconClass: 'icon icon-sad2'
              });
            }
          } else {
            this.$toast({
              className: 'errormsg',
              message: '操作失败',
              iconClass: 'icon icon-sad2'
            });
          }
        })
      },
      getConfig: function () {
        let url = location.href.split("#")[0]//获取锚点之前的链接
        $.ajax({
          url: Constant.path + "/jssdk/sign",
          data: {
            url: url
          },
          method: 'post',
          async: false,
          dataType: "json",
          success: (response) => {
            let res = response.data;
            this.wxInit(res);
          }
        })
      },
      wxInit: function (res) {
        let url = location.href.split("#")[0]//获取锚点之前的链接
        wx.config({
          debug: true,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.noncestr,
          signature: res.sign,
          jsApiList: constant.jsApiList
        });

      },
      /*按下，开始录音*/
      start: function () {
        wx.checkJsApi({
          jsApiList: ['stopRecord'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: (res)=> {
            this.result = JSON.stringify(res)
          }
        });

        event.preventDefault();
        wx.startRecord({
          success: ()=> {
            /*处理进度条问题*/
            this.progresshandler = setInterval(()=> {
              this.result="进入progress"
              this.progress++
            },600)
            localStorage.rainAllowRecord = 'true';
          },
          cancel: function () {
            alert('用户拒绝授权录音');
          },
          fail: (res)=> {
            this.result="进入startRecord fail， res:"+JSON.stringify(res)
          }
        });
        /*this.START = new Date().getTime();
        this.recordTimer = setTimeout(()=> {
          wx.startRecord({
            success: ()=> {
              /!*处理季度条问题*!/
              this.progresshandler = setInterval(()=> {
                this.progress++
              },600)
              localStorage.rainAllowRecord = 'true';
            },
            cancel: function () {
              alert('用户拒绝授权录音');
            }
          });
        }, 300);*/
      },
      /*松开，停止录音*/
      end: function () {
        event.preventDefault();
        wx.stopRecord({
          success: (res)=> {
            this.result="进入stopRecord"
            clearTimeout(this.progresshandler)
            this.voice.localId = res.localId;
            this.uploadVoice();
          },
          fail: (res)=> {
            this.result="进入stopRecord fail， res:"+JSON.stringify(res)
          }
        });
        /*this.END = new Date().getTime();
        clearTimeout(this.progresshandler)

        if ((this.END - this.START) < 300) {
          this.END = 0;
          this.START = 0;
          //小于300ms，不录音
          clearTimeout(this.recordTimer);
        } else {
          wx.stopRecord({
            success: (res)=> {
              this.voice.localId = res.localId;
              this.uploadVoice();
            },
            fail: function (res) {
              alert(JSON.stringify(res));
            }
          });
        }*/
      },
      /*播放录音*/
      playAudio: function () {
        console.log("begin play...")
        if(this.voice.localId){
          wx.playVoice({
            localId: this.voice.localId // 需要播放的音频的本地ID，由stopRecord接口获得
          });
        }
      }
      ,
      uploadVoice: function () {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器
        //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        /*wx.uploadVoice({
          localId: this.voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
            $.ajax({
              url: '后端处理上传录音的接口',
              type: 'post',
              data: JSON.stringify(res),
              dataType: "json",
              success: function (data) {
                alert('文件已经保存到七牛的服务器');//这回，我使用七牛存储
              },
              error: function (xhr, errorType, error) {
                console.log(error);
              }
            });
          }
        });*/
      }
    },
    mounted() {
      this.$nextTick(()=> {
        this.getConfig()
        wx.ready(()=> {
          this.result="wx.ready"
        })
        wx.error((res)=> {
          this.result="wx.error:"+JSON.stringify(res)
        });
      })
    }
  }
</script>

<style>
  .imgcontainer {
    width: 100%;
    /*background-color: rgba(198, 217, 46, 0.22);*/
    text-align: center;
  }

  .imgstyle {
    width: 80%;
    /*   min-height: 100px;*/
  }

  .suggest {
    text-align: left;
    margin-top: 50px;
  }

  .errormsg {
    color: rgba(255, 107, 98, 0.97) !important;
  }

  .successmsg {
    color: #5daf34;
  }
</style>
