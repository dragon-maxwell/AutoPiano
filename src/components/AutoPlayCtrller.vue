<style lang="less">
@import url('../assets/style/variable.less');
.component-auto-play-ctrller { width: 50%; min-height: 40px; padding: 5px 0; margin: 10px auto 0px 20px; text-align: left;
  .sheet-music-name {font-size: 30px; margin: 5px auto 10px auto}
  .ctrl-btns { display: inline-block; width: 100px; text-align: center; font-size:20px; font-weight:bold; line-height: 30px; margin: 0px auto 40px auto; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
    &:hover { background-color: #CCFFFF; } }
  .progress-bar {background-color: rgb(13, 61, 65); border: 1px solid blue; border-radius: 25px;}
}
</style>

<template>
  <div class="component-auto-play-ctrller">
    <div class="sheet-music-name">{{CurrentSheetMusicNameLabelText}}</div>
    <div class="ctrl-btns" @click="onPlayBtnClick">{{PlayBtnTxt}}</div> 
    <div class="ctrl-btns" @click="onStopBtnClick">{{StopBtnTxt}}</div>
    <vue-slider class="progress-bar" ref="slider" v-model="slider.value" v-bind="slider.options"></vue-slider>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import Observe from 'observe'
import { ScoreNum, ScoreXml, OBEvent } from 'config'
export default {
  name: 'AutoPlayCtrller',
  data() {
    return {
      slider: {
        value: 0,
        options: {
          data: null,
          eventType: 'auto',
          width: 'auto',
          height: 6,
          dotSize: 16,
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
          tooltipDir: 'top',
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
          labelStyle: null,
          labelActiveStyle: null
        },
      },
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      CurrentSheetMusicTimeSignature: [],
      PlayBtnTxt: '▶',
      StopBtnTxt: '■',
      IsPlaying: false,
      // 实际播放进度
      progress:0
    }
  },
  mounted() {
    Observe.$on(OBEvent.AUTO_PLAY_STOPPED, () => {
      this.IsPlaying = false
      this.PlayBtnTxt = '▶'
    })
    Observe.$on(OBEvent.AUTO_PLAY_STARTED, (curBar, curQnIdx) => {
      this.IsPlaying = true
      this.PlayBtnTxt = '❙ ❙'
      this.slider.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
    })
    Observe.$on(OBEvent.SHEET_MUSIC_LOADED, (sheetMusic) => {
      this.CurrentSheetMusicNameLabelText = '当前播放：' + sheetMusic.name
      this.CurrentSheetMusicTimeSignature = sheetMusic.timeSignature
      this.slider.options.min = 1
      this.slider.options.max = sheetMusic.notes.length * sheetMusic.timeSignature[0]
      this.slider.value = 1
    })
    Observe.$on(OBEvent.PLAY_PROGRESS_UPDATE, (curBar, curQnIdx) => {
      this.slider.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
      this.progress = this.slider.value
    })
  },
  updated() {
    if (this.slider.value != this.progress) {
      Observe.$emit(OBEvent.SET_AUTO_PLAY_PROGRESS, this.slider.value)
    }
  },
  methods: {
    onPlayBtnClick () {
      if (this.IsPlaying) Observe.$emit(OBEvent.PAUSE_AUTO_PLAY)
      else Observe.$emit(OBEvent.START_AUTO_PLAY)
    },
    onStopBtnClick () {
        Observe.$emit(OBEvent.STOP_AUTO_PLAY)
    },
    callbackRange (val) {
      if (val && val != this.progress) { 
        Observe.$emit(OBEvent.SET_AUTO_PLAY_PROGRESS, val)
      }
    },
  },
  components: {
    vueSlider
  },
}
  
</script>