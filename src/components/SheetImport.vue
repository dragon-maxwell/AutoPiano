<style lang="less">
@import url('../assets/style/variable.less');
.sheet-import { width: 32%; min-width: 500px; height:400px; margin: 20px auto auto 5%; font-size: 14px; overflow: hidden; background: rgba(255, 255, 255, .6); border-radius: 5px; border: solid 1px #ddd; position: relative;
.list-view { width: 100%; height: 100%; position: absolute; top: 0; left: 0; padding: 20px 15px; overflow-y: scroll;  }
  .component-title { margin: 20px 0 10px 15px; font-size: 18px; font-weight: bold; line-height: 26px; position: relative;
    .music-img { display: inline-block; width: 26px; vertical-align: middle; }
    .title { vertical-align: middle; margin-left: 5px; }
  }
.btn-bar {margin: -10px auto 2% 2%;}
.ctrl-btns { display: inline-block; width: 150px; word-spacing: 10px; text-align: center; font-size:15px; font-weight:bold; line-height: 30px; margin-bottom: 10px; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
    &:hover { background-color: rgb(13, 61, 65); color: rgb(193, 243, 255);} }
.text-input { resize: none; width: 96%; height: 300px; font-size: 15px;align-items: center; margin: -10px auto 2% 2%; overflow-Y: scroll;}
}
</style>
<template>
  <div class="sheet-import">
    
  <sweet-modal ref="smodal">This is an alert.</sweet-modal>

  <p class="component-title">
    <img src="../assets/images/music_cd.png" alt="" class="music-img">
    <span class="title">演奏录音</span>
  </p>
  <div class="btn-bar">
    <div class="ctrl-btns" @click="onLoadBtn">播放下方内容</div>
    <div class="ctrl-btns" @click="onSaveBtnClick">下载录音存档</div>
    <div class="ctrl-btns" 
      v-clipboard:copy="message"
      v-clipboard:success="onCopySuccess"
      v-clipboard:error="onCopyError">复制到剪贴板分享</div>
  </div>

  <textarea class="text-input" v-model="message" placeholder="请点击进度条上方的录音按钮开始录音，录下的内容会显示在这里~"></textarea>
  </div>
</template>

<script>
import { OBEvent } from 'config'
import Observe from 'observe'

export default {
  name: 'SheetImport',
  data() {
      return {
          message: ''
    }
  },
  mounted () {
    Observe.$on(OBEvent.RECORDING_FINISHED, (recordData) => {
      this.message = JSON.stringify(recordData, null, 2)
    })
  },
  methods: {
    onLoadBtn () {
      let recordObj = null
      try {
        recordObj = JSON.parse(this.message);
      } catch (e) {
          alert('加载录音失败，请检查复制的内容是否完整')
          return
      }
      // 检查内容完整性
      if (recordObj == null || !("name" in recordObj) || !("key" in recordObj) || !("timeSignature" in recordObj) || !("bpm" in recordObj) || !("notes" in recordObj)) {
        alert('加载录音失败，请检查复制的内容是否完整')
        return
      }
      Observe.$emit(OBEvent.LOAD_RECORD_TEXT, recordObj)
    },
    onSaveBtnClick () {
      let recordObj = null
      try {
        recordObj = JSON.parse(this.message);
      } catch (e) {
          alert('保存录音失败，请检查内容是否完整')
          return
      }
      // 检查内容完整性
      if (recordObj == null || !("name" in recordObj) || !("key" in recordObj) || !("timeSignature" in recordObj) || !("bpm" in recordObj) || !("notes" in recordObj)) {
        alert('保存录音失败，请检查内容是否完整')
        return
      }
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([this.message])
  
      //生成url对象
      let  urlObject = window.URL || window.webkitURL || window	
      let url = urlObject.createObjectURL(content)	
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download =recordData.name+".txt"
      //必须点击否则不会下载
      el.click()		
      //移除链接释放资源		
      urlObject.revokeObjectURL(url)
      alert('已下载txt文件到默认下载文件夹，快发给小伙伴们听听吧~')
    },
    onCopySuccess () {
      this.$refs.smodal.open
      alert('已复制录音数据到剪贴板，快发给小伙伴们听听吧~')
    },
    onCopyError () {
      alert('复制失败，我也不知道为什么')
    },
  },
}
</script>