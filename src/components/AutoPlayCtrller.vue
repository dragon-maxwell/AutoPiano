<style lang="less">
@import url('../assets/style/variable.less');
.component-auto-play-ctrller { width: 1000px; min-height: 40px; padding: 5px 0; margin: 10px auto 0px 20px; text-align: left;
  .logo-imge {width: 200px; display:block}
  .horizontal-split {display: inline-block}
  .sheet-music-name {width: 400px; font-size: 30px; margin: 5px auto 10px auto}
  .ctrl-btns { display: inline-block; width: 150px; word-spacing: 10px; text-align: center; font-size:20px; font-weight:bold; line-height: 50px; margin-bottom: 10px; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
    &:hover { background-color: rgb(13, 61, 65); color: rgb(193, 243, 255);} }
  .progress-bar {background-color: rgb(13, 61, 65); border: 1px solid blue; border-radius: 2px;box-shadow: 2px 2px 2px #888888;}
  .bpm-txt {font-size: 25px;}
  .bpm-bar {margin: 0 0 -10px 0; background-color: rgb(13, 61, 65); border: 1px solid blue; border-radius: 2px;box-shadow: 2px 2px 2px #888888;}
  .slider-tool-tip {border: 0px; color:rgb(255, 255, 255); background-color: rgb(0, 0, 0); font-size:20px; font-weight:bold; line-height: 22px; }
  .record-beat-tip1 {background-color: rgb(255, 0, 0);
    &:hover { background-color: rgb(255, 0, 0); color: rgb(193, 243, 255);} }
  .record-beat-tip2 {background-color: rgb(255, 190, 190);
    &:hover { background-color: rgb(255, 190, 190); color: rgb(193, 243, 255);} }
}
</style>

<template>
  <div class="component-auto-play-ctrller">
    <img src="../assets/images/skylogo.png" alt="" class="logo-imge">
    <div class="horizontal-split">
        <div class="sheet-music-name">{{CurrentSheetMusicNameLabelText}}</div>
    </div>
    <div class="horizontal-split">
      <div class="bpm-txt">BPM:</div>
    </div>
    <div class="horizontal-split">
      <vue-slider class="bpm-bar" ref="bpmBar" @drag-start="onBpmSliderDragStart" @drag-end="onBpmSliderDragEnd" @callback="onBpmSliderCallback" v-model="bpmSlider.value" v-bind="bpmSlider.options"></vue-slider>
    </div>
    <div>
      <div class="ctrl-btns" @click="onPlayBtnClick">{{PlayBtnTxt}}</div> 
      <div class="ctrl-btns" @click="onStopBtnClick">{{StopBtnTxt}}</div>
      <div class="ctrl-btns" @click="onKeyBtnClick">{{KeyBtnTxt}}</div>
      <div class="ctrl-btns" id="record-btn" @click="onRecordBtnClick">{{RecordBtnTxt}}</div>
    </div>
    <vue-slider class="progress-bar" ref="progressBar" @drag-start="onProgressDragStart" @drag-end="onProgressDragEnd" @callback="onProgressCallback" v-model="progressBar.value" v-bind="progressBar.options"></vue-slider>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import Observe from 'observe'
import Piano from '@/components/Piano'
import { ScoreNum, ScoreXml, OBEvent } from 'config'
export default {
  name: 'AutoPlayCtrller',
  data() {
    return {
      progressBar: {
        value: 0,
        isDrag: false,
        options: {
          eventType: 'auto',
          width: 616,
          height: 30,
          dotSize: 30,
          min: 0,
          max: 100,
          interval: 1,
          show: true,
          speed: 0.5,
          tooltip: 'always',
          tooltipDir: 'right',
          tooltipClass: 'slider-tool-tip',
        },
      },
      bpmSlider: {
        value: 80,
        isDrag: false,
        options: {
          width: 150,
          height: 20,
          dotSize: 30,
          min: 25,
          max: 250,
          interval: 1,
          show: true,
          speed: 0.5,
          tooltip: 'always',
          tooltipDir: 'right',
          tooltipClass: 'slider-tool-tip',
        },
      },
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      CurrentSheetMusicTimeSignature: [],
      PlayBtnTxt: 'PLAY',
      StopBtnTxt: 'STOP',
      KeyBtnTxt: 'KEY: C',
      RecordBtnTxt: 'RECORD',
      IsPlaying: false,
      IsRecording: false,
      // 实际播放进度
      progress:0
    }
  },
  mounted() {
    Observe.$on(OBEvent.AUTO_PLAY_STOPPED, () => {
      this.IsPlaying = false
      this.PlayBtnTxt = 'PLAY'
    })
    Observe.$on(OBEvent.AUTO_PLAY_STARTED, (curBar, curQnIdx) => {
      this.IsPlaying = true
      this.PlayBtnTxt = 'PAUSE'
      this.progressBar.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
    })
    Observe.$on(OBEvent.SHEET_MUSIC_LOADED, (sheetMusic) => {
      this.CurrentSheetMusicNameLabelText = '当前播放：' + sheetMusic.name
      this.CurrentSheetMusicTimeSignature = sheetMusic.timeSignature
      this.progressBar.options.min = 1
      this.progressBar.options.max = sheetMusic.notes.length * sheetMusic.timeSignature[0]
      this.progressBar.value = 1
      this.bpmSlider.value = sheetMusic.bpm
    })
    Observe.$on(OBEvent.PLAY_PROGRESS_UPDATE, (curBar, curQnIdx) => {
      if (this.IsRecording) {
        // 重拍
        if (curQnIdx == 1) {
          document.getElementById("record-btn").classList.add("record-beat-tip1")
          setTimeout(() => { document.getElementById("record-btn").classList.remove("record-beat-tip1") }, 150)
        } else {
          document.getElementById("record-btn").classList.add("record-beat-tip2")
          setTimeout(() => { document.getElementById("record-btn").classList.remove("record-beat-tip2") }, 150)
        }
      } else {
        this.progressBar.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
        this.progress = this.progressBar.value
      }
    })
    Observe.$on(OBEvent.PIANO_KEY_CHANGED, (newkey) => {
      this.KeyBtnTxt = 'KEY: ' + newkey
    })
    Observe.$on(OBEvent.RECORDING_STARTED, () => {
      this.IsRecording = true
      this.RecordBtnTxt = 'FINISH'
      this.CurrentSheetMusicNameLabelText = '正在录音'
    })
    Observe.$on(OBEvent.RECORDING_FINISHED, () => {
      this.IsRecording = false
      this.RecordBtnTxt = 'RECORD'
    })
  },
  methods: {
    onPlayBtnClick () {
      if (this.IsPlaying) Observe.$emit(OBEvent.PAUSE_AUTO_PLAY)
      else Observe.$emit(OBEvent.START_AUTO_PLAY)
    },
    onStopBtnClick () {
        Observe.$emit(OBEvent.STOP_AUTO_PLAY)
    },

    onKeyBtnClick () {
        Observe.$emit(OBEvent.SET_PIANO_KEY)
    },
    onRecordBtnClick () {
      if (this.IsRecording) {
        Observe.$emit(OBEvent.STOP_RECORDING)
      } else {
        Observe.$emit(OBEvent.START_RECORDING)
      }
    },
    onProgressCallback (val) {
      if (!this.progressBar.isDrag) {
        Observe.$emit(OBEvent.SET_AUTO_PLAY_PROGRESS, val)
      }
    },
    onProgressDragStart (context) {
      this.progressBar.isDrag = true
    },
    onProgressDragEnd (context) {
      this.progressBar.isDrag = false
      Observe.$emit(OBEvent.SET_AUTO_PLAY_PROGRESS, context.val)
    },
    onBpmSliderCallback (val) {
      Observe.$emit(OBEvent.SET_AUTO_PLAY_BPM, val)
    },
    onBpmSliderDragStart (context) {
      // Observe.$emit(OBEvent.SET_AUTO_PLAY_BPM, context.val)
    },
    onBpmSliderDragEnd (context) {
      Observe.$emit(OBEvent.SET_AUTO_PLAY_BPM, context.val)
    },
  },
  components: {
    vueSlider
  },
}
  
</script>