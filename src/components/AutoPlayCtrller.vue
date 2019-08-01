<style lang="less">
@import url('../assets/style/variable.less');
.component-auto-play-ctrller { width: 100%; min-height: 40px; padding: 5px 0;
  .ctrller-wrap { width: 90%; height: 100%; margin: 0 auto; position: relative; overflow: hidden;
    // .logo-imge {width: 200px; display:block}
    .horizontal-split {display: inline-block}
    .sheet-music-name {color:rgb(0, 86, 142); width:100%; font-size: 30px; margin: 30px auto 10px auto}
    .ctrl-btns { display: inline-block; width: 10.3%; word-spacing: 10px; text-align: center; font-size:20px; font-weight:bold; line-height: 50px; margin: 10px auto 20px auto; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
      &:hover { background-color: rgb(13, 61, 65); color: rgb(193, 243, 255);} }
    .progress-bar {margin: 10px 0 0 0; width:43.8%}
    .bpm-txt {color:rgb(0, 86, 142); font-size: 20px; margin-left:80px}
    .bpm-bar {margin: 0 0 -18px 0; }
    // .slider-tool-tip {border: 0px; color:rgb(255, 255, 255); background-color: rgb(0, 0, 0); font-size:20px; font-weight:bold; line-height: 22px; }
    .record-beat-tip1 {background-color: rgb(255, 174, 0);
      &:hover { background-color: rgb(255, 174, 0); color: rgb(193, 243, 255);} }
    .record-beat-tip2 {background-color: rgb(255, 234, 201);
      &:hover { background-color: rgb(255, 234, 201); color: rgb(193, 243, 255);} }
    .hide-btn {display: none}
  }
}
</style>

<template>
  <div class="component-auto-play-ctrller">
    <div class="ctrller-wrap responsive-section-a">
      <!--<img src="../assets/images/skylogo.png" alt="" class="logo-imge">-->
      <div class="horizontal-split">
        <div class="sheet-music-name">{{CurrentSheetMusicNameLabelText}}</div>
      </div>
      <div class="horizontal-split">
        <div class="bpm-txt">音乐速度:</div>
      </div>
      <div class="horizontal-split">
        <vue-slider class="bpm-bar" ref="bpmBar" @drag-start="onBpmSliderDragStart" @drag-end="onBpmSliderDragEnd" @callback="onBpmSliderCallback" v-model="bpmSlider.value" v-bind="bpmSlider.options"></vue-slider>
      </div>
      <div>
        <div class="ctrl-btns" @click="onPlayBtnClick">{{PlayBtnTxt}}</div>
        <div class="ctrl-btns" @click="onStopBtnClick">{{StopBtnTxt}}</div>
        <div class="ctrl-btns" @click="onKeyBtnClick">{{KeyBtnTxt}}</div>
        <div class="ctrl-btns" id="record-btn" @click="onRecordBtnClick">{{RecordBtnTxt}}</div>
        <div class="ctrl-btns hide-btn" id="metronome-switch-btn" @click="onMetronomeBtnClick">{{MetronomeBtnTxt}}</div>
      </div>
      <div class="progress-bar" >
        <vue-slider ref="progressBar" @drag-start="onProgressDragStart" @drag-end="onProgressDragEnd" @callback="onProgressCallback" v-model="progressBar.value" v-bind="progressBar.options"></vue-slider>
      </div>
    </div>
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
          disabled: false,
          eventType: 'auto',
          height: 30,
          dotSize: 30,
          min: 0,
          max: 100,
          interval: 1,
          show: true,
          speed: 0.5,
          tooltip: 'always',
          tooltipDir: 'top',
          tooltipClass: null,
        },
      },
      bpmSlider: {
        value: 80,
        isDrag: false,
        options: {
          disabled: false,
          width: 150,
          height:20,
          dotSize: 30,
          min: 25,
          max: 250,
          interval: 1,
          show: true,
          speed: 0.5,
          tooltip: 'always',
          tooltipDir: 'top',
          tooltipClass: null,
        },
      },
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      CurrentSheetMusicTimeSignature: [],
      PlayBtnTxt: '播放',
      StopBtnTxt: '停止',
      KeyBtnTxt: '调性: C',
      RecordBtnTxt: '开始录音',
      MetronomeBtnTxt: '关闭节拍器',
      IsPlaying: false,
      IsRecording: false,
      metronomeOn: true,
      // 实际播放进度
      progress:0
    }
  },
  mounted() {
    Observe.$on(OBEvent.AUTO_PLAY_STOPPED, () => {
      this.IsPlaying = false
      this.PlayBtnTxt = '播放'
    })
    Observe.$on(OBEvent.AUTO_PLAY_STARTED, (curBar, curQnIdx) => {
      this.IsPlaying = true
      this.PlayBtnTxt = '暂停'
      this.progressBar.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
    })
    Observe.$on(OBEvent.SHEET_MUSIC_LOADED, (sheetMusic) => {
      this.CurrentSheetMusicNameLabelText = '当前播放：' + sheetMusic.name
      this.CurrentSheetMusicTimeSignature = sheetMusic.timeSignature
      this.progressBar.options.min = 1
      this.progressBar.options.max = sheetMusic.notes.length * sheetMusic.timeSignature[0]
      if (this.progressBar.options.max < 2) {
        this.progressBar.options.max = 2
      }
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
      this.KeyBtnTxt = '调性: ' + newkey
    })
    Observe.$on(OBEvent.RECORDING_STARTED, () => {
      this.IsRecording = true
      this.RecordBtnTxt = '停止录音'
      this.CurrentSheetMusicNameLabelText = '正在录音...'
      this.progressBar.options.disabled = true
      this.bpmSlider.options.disabled = true
      this.metronomeOn = true
      this.MetronomeBtnTxt = '关闭节拍器'
      document.getElementById("metronome-switch-btn").classList.remove("hide-btn")
    })
    Observe.$on(OBEvent.RECORDING_FINISHED, (recordData) => {
      this.IsRecording = false
      this.RecordBtnTxt = '开始录音'
      this.progressBar.options.disabled = false
      this.bpmSlider.options.disabled = false
      document.getElementById("metronome-switch-btn").classList.add("hide-btn")
    })
  },
  methods: {
    onPlayBtnClick () {
      if (this.IsRecording) return
      if (this.IsPlaying) Observe.$emit(OBEvent.PAUSE_AUTO_PLAY)
      else Observe.$emit(OBEvent.START_AUTO_PLAY)
    },
    onStopBtnClick () {
      if (this.IsRecording) return
        Observe.$emit(OBEvent.STOP_AUTO_PLAY)
    },

    onKeyBtnClick () {
        if (this.IsRecording) return
        Observe.$emit(OBEvent.SET_PIANO_KEY)
    },
    onRecordBtnClick () {
      if (this.IsRecording) {
        Observe.$emit(OBEvent.STOP_RECORDING)
      } else {
        Observe.$emit(OBEvent.START_RECORDING)
      }
    },
    onMetronomeBtnClick () {
      if (this.metronomeOn) {
        Observe.$emit(OBEvent.METRONOME_SWITCH, false)
        this.MetronomeBtnTxt = '开启节拍器'
        this.metronomeOn = false
      } else {
        Observe.$emit(OBEvent.METRONOME_SWITCH, true)
        this.MetronomeBtnTxt = '关闭节拍器'
        this.metronomeOn = true
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
