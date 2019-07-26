<style lang="less">
@import url('../assets/style/variable.less');
.component-auto-play-ctrller { width: 50%; min-height: 40px; padding: 5px 0; margin: 10px auto 0px 20px; text-align: left;
  .sheet-music-name {font-size: 30px; margin: 5px auto 10px auto}
  .ctrl-btns { display: inline-block; width: 100px; text-align: center; font-size:20px; font-weight:bold; line-height: 30px; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
    &:hover { background-color: #CCFFFF; } }
  .progress-bar {margin: 0px 0px 0px 10px}
}
</style>

<template>
  <div class="component-auto-play-ctrller">
    <div class="sheet-music-name">{{CurrentSheetMusicNameLabelText}}</div>
    <div class="ctrl-btns" @click="onPlayBtnClick">{{PlayBtnTxt}}</div> 
    <div class="ctrl-btns" @click="onStopBtnClick">{{StopBtnTxt}}</div>
    <VueSlideBar ref="apctrller"
      v-model="slider.value"
      :min="slider.minValue"
      :max="slider.maxValue"
      :range="slider.range"
      :lineHeight=10
      :processStyle="{ backgroundColor: '#66CCFF' }"
      :tooltipStyles="{ color: '#FFFF99', backgroundColor: '#0099CC', borderColor: '#669999' }"
      @callbackRange="callbackRange">
    </VueSlideBar>
  </div>
</template>

<script>
import VueSlideBar from 'vue-slide-bar'
import Observe from 'observe'
import { ScoreNum, ScoreXml, OBEvent } from 'config'
export default {
  name: 'AutoPlayCtrller',
  data() {
    return {
      slider: {
        minValue: 1,
        maxValue: 100,
        value: 1,
        range: [1]
      },
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      CurrentSheetMusicTimeSignature: [],
      PlayBtnTxt: '▶',
      StopBtnTxt: '■',
      IsPlaying: false,
      progress:0
    }
  },
  mounted() {
    Observe.$on(OBEvent.AUTO_PLAY_STOPPED, () => {
      this.IsPlaying = false
      this.PlayBtnTxt = '▶'
      for(let i = 2; i < 1000; i++) this.slider.range.push(i)
    })
    Observe.$on(OBEvent.AUTO_PLAY_STARTED, (curBar, curQnIdx) => {
      this.IsPlaying = true
      this.PlayBtnTxt = '❙ ❙'
      this.slider.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
    })
    Observe.$on(OBEvent.SHEET_MUSIC_LOADED, (sheetMusic) => {
      this.CurrentSheetMusicNameLabelText = '当前播放：' + sheetMusic.name
      this.CurrentSheetMusicTimeSignature = sheetMusic.timeSignature
      this.slider.minValue = 1
      this.slider.maxValue = sheetMusic.notes.length * sheetMusic.timeSignature[0]
      setTimeout(()=>{this.slider.value = 1},100)
    })
    Observe.$on(OBEvent.PLAY_PROGRESS_UPDATE, (curBar, curQnIdx) => {
      this.slider.value = (curBar - 1) * this.CurrentSheetMusicTimeSignature[0] + curQnIdx
      this.progress = this.slider.value
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
    callbackRange (val) {
      if (val && val != this.progress) { 
        // console.log('val: ' + val + 'value: ' + this.slider.value)
        Observe.$emit(OBEvent.SET_AUTO_PLAY_PROGRESS, val)
      }
    },
  },
  components: {
    VueSlideBar
  },
}
  
</script>