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
    <mt-progress :value="progress" :barHeight="5">
      <div slot="start">0%</div>
      <div slot="end">100%</div>
    </mt-progress>
    <!--播放录音-->

    <mt-button type="default" plain size="normal" @touchstart.native="start" @touchend.native="end"> <span class="icon icon-mic"></span>录音 </mt-button>
    <mt-button type="default" plain size="normal"  @click.native="playAudio"> <span class="icon icon-play2"></span>试听 </mt-button>
    <mt-button type="primary" size="large" @click.native="submit">提交</mt-button>
  </div>
</template>

<script>
  import upload from '../assets/upload.png'
  import Constant from '../assets/constant.js'
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
        voiceText: '按下开始录音',
        wavPath: ''
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
        this.$ajax(
          {
            url: Constant.path + '/suggestion/addSugg',
            method: 'post',
            data: {
              title: this.title,
              content: this.content,
              img: this.imgsrc,
              wavPath: this.wavPath
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
          xhrFields:{
            withCredentials:true
          },
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
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.noncestr,
          signature: res.sign,
          // jsApiList: constant.jsApiList
          jsApiList: ['startRecord','stopRecord',
            'onVoiceRecordEnd','playVoice','pauseVoice','stopVoice',
            'translateVoice','uploadVoice']
        });

      },
      /*按下，开始录音*/
      start: function () {this.content="开始录音！"
        event.preventDefault();
        this.START = new Date().getTime();
        this.recordTimer = setTimeout(()=> {
          wx.startRecord({
            success: ()=> {
              this.voiceText = "正在录音..."
              /*处理季度条问题*/
              this.progresshandler = setInterval(()=> {
                let passedTime = new Date().getTime()-this.START//录音持续的时间
                this.progress = passedTime/600
                // this.progress++
              },200)
              localStorage.rainAllowRecord = 'true';
            },
            cancel: function () {
              alert('你将无法使用录音功能');
            }
          });
        }, 300);
      },
      /*松开，停止录音*/
      end: function () {this.content="触发停止！"
        event.preventDefault();
        this.END = new Date().getTime();
        if ((this.END - this.START) < 300) {
          this.END = 0;
          this.START = 0;
          //小于300ms，不录音
          clearTimeout(this.recordTimer);
        } else {
          wx.stopRecord({
            success: (res)=> {
              this.voiceText = "重新录音..."
              clearTimeout(this.progresshandler)//停止录音进度条
              this.voice.localId = res.localId;
              this.uploadVoice();
            },
            fail: function (res) {
                alert(JSON.stringify(res))
            }
          });
        }
      },
      /*播放录音*/
      playAudio: function () {
        this.content='begin play...'
        if(this.voice.localId){
          wx.playVoice({
            localId: this.voice.localId // 需要播放的音频的本地ID，由stopRecord接口获得
          });
        }
      }
      ,
      uploadVoice: function () {
        //调用微信的上传录音接口把本地录音先上传到微信的服务器,不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
        wx.uploadVoice({
          localId: this.voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
            $.ajax({
              xhrFields:{
                withCredentials:true
              },
              url: Constant.path + '/jssdk/getAudio',
              type: 'post',
              data: res,
              dataType: "json",
              xhrFields:{
                withCredentials: true
              },
              success:  (data)=> {
                console.log(data.data.wavPath)
                if(data.code == "200"){
                  this.content = JSON.stringify(data)
                  this.wavPath = data.data.wavPath
                }
              },
              error: function (xhr, errorType, error) {
                console.log(error);
              }
            });
          },
          fail: function (res) {
            alert(JSON.stringify(res))
          }
        });
      }
    },
    mounted() {
      this.$nextTick(()=> {
        wx.ready(()=> {
          wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: (res)=> {
              this.voiceText = "重新录音..."
              this.voice.localId = res.localId;
              clearTimeout(this.progresshandler)//停止录音进度条
            }
          });
        })
        wx.error((res)=> {
          this.content="wx.error:"+JSON.stringify(res)
        });
        this.getConfig()
      })
    }
  }
</script>

<style scoped>
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
  }

  .errormsg {
    color: rgba(255, 107, 98, 0.97) !important;
  }

  .successmsg {
    color: #5daf34;
  }
  .icon{
    font-size: 40px;
  }
</style>
