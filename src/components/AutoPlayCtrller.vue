<style lang="less">
@import url('../assets/style/variable.less');
.component-auto-play-ctrller { width: 50%; min-height: 40px; padding: 5px 0; margin: 10px auto 0px 20px; text-align: left;
  .horizontal-split {display: inline-block}
  .sheet-music-name {font-size: 30px; margin: 5px auto 10px auto}
  .ctrl-btns { display: inline-block; width: 150px; word-spacing: 10px; text-align: center; font-size:20px; font-weight:bold; line-height: 50px; margin-bottom: 10px; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
    &:hover { background-color: rgb(13, 61, 65); color: rgb(193, 243, 255);} }
  .progress-bar {background-color: rgb(13, 61, 65); border: 1px solid blue; border-radius: 2px;box-shadow: 2px 2px 2px #888888;}
  .bmp-bar {width:100px; min-height:100px; background-color: rgb(13, 61, 65); border: 1px solid blue; border-radius: 2px;box-shadow: 2px 2px 2px #888888;}
  .slider-tool-tip {border: 0px; color:rgb(255, 255, 255); background-color: rgb(0, 0, 0); font-size:20px; font-weight:bold; line-height: 22px; }
}
</style>

<template>
  <div class="component-auto-play-ctrller">
    <div class="horizontal-split">
      <div class="sheet-music-name">{{CurrentSheetMusicNameLabelText}}</div>
      <div class="ctrl-btns" @click="onPlayBtnClick">{{PlayBtnTxt}}</div> 
      <div class="ctrl-btns" @click="onStopBtnClick">{{StopBtnTxt}}</div>
      <div class="ctrl-btns" @click="onKeyBtnClick">{{KeyBtnTxt}}</div>
    </div>
    <div class="horizontal-split">
      <vue-slider class="bmp-bar" ref="bmpBar" @drag-start="onBmpSliderDragStart" @drag-end="onBmpSliderDragEnd" @callback="onBmpSliderCallback" v-model="bmpSlider.value" v-bind="bmpSlider.options"></vue-slider>
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
          data: null,
          eventType: 'auto',
          width: 'auto',
          height: 30,
          dotSize: 30,
          dotHeight: null,
          dotWidth: null,
          min: 0,
          max: 100,
          interval: 1,
          show: true,
          speed: 0.5,
          disabled: false,
          piecewise: false,
          useKeyboard: false,
          enableCross: true,
          piecewiseStyle: false,
          piecewiseLabel: false,
          tooltip: 'always',
          tooltipDir: 'right',
          reverse: false,
          data: null,
          clickable: true,
          realTime: false,
          lazy: false,
          formatter: null,
          bgStyle: null,
          sliderStyle: null,
          processStyle: null,
          piecewiseActiveStyle: null,
          piecewiseStyle: null,
          tooltipStyle: null,
          tooltipClass: 'slider-tool-tip',
          labelStyle: null,
          labelActiveStyle: null
        },
      },
      bmpSlider: {
        value: 0,
        isDrag: false,
        options: {
          direction: 'vertical',
          eventType: 'auto',
          width: 'auto',
          height: 30,
          dotSize: 30,
          dotHeight: null,
          dotWidth: null,
          min: 0,
          max: 100,
          interval: 1,
          show: true,
          speed: 0.5,
          disabled: false,
          piecewise: false,
          useKeyboard: false,
          enableCross: true,
          piecewiseStyle: false,
          piecewiseLabel: false,
          tooltip: 'always',
          tooltipDir: 'right',
          reverse: false,
          data: null,
          clickable: true,
          realTime: false,
          lazy: false,
          formatter: null,
          bgStyle: null,
          sliderStyle: null,
          processStyle: null,
          piecewiseActiveStyle: null,
          piecewiseStyle: null,
          tooltipStyle: null,
          tooltipClass: 'slider-tool-tip',
          labelStyle: null,
          labelActiveStyle: null
        },
      },
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      CurrentSheetMusicTimeSignature: [],
      PlayBtnTxt: 'PLAY',
      StopBtnTxt: 'STOP',
      KeyBtnTxt: 'KEY: C',
      IsPlaying: false,
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
    })
    Observe.$on(OBEvent.PLAY_PROGRESS_UPDATE, (curBar, curQnIdx) => {
      this.progressBar.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
      this.progress = this.progressBar.value
    })
    Observe.$on(OBEvent.PIANO_KEY_CHANGED, (newkey) => {
      this.KeyBtnTxt = 'KEY: ' + newkey
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
    onBmpSliderCallback (val) {
    },
    onBmpSliderDragStart (context) {
    },
    onBmpSliderDragEnd (context) {
    },
  },
  components: {
    vueSlider
  },
}
  
</script>