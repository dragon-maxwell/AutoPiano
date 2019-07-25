<style lang="less">
@import url('../assets/style/variable.less');
.component-auto-play-ctrller { width: 50%; min-height: 40px; padding: 5px 0; margin: 10px auto 0px 10px; text-align: left;
  .sheet-music-name {font-size: 30px; margin: 5px auto 10px auto}
  // .btns { width:200px;
  .ctrl-btns { display: inline-block; width: 100px; text-align: center; font-size:20px; font-weight:bold; line-height: 30px; background-color: #FFFFFF; color: @c-blue-d; border: 1px solid blue; border-radius: 25px; box-shadow: 2px 2px 2px #888888; cursor: pointer;
    &:hover { background-color: #CCFFFF; } }
  .progress-bar {margin: 0px 0px 0px 10px}
  // }
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
      :data="slider.data"
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
        maxValue: 48,
        value: 45,
      },
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      PlayBtnTxt: '▶',
      StopBtnTxt: '■',
      IsPlaying: false,
    }
  },
  mounted() {
    Observe.$on(OBEvent.AUTO_PLAY_STOPPED, () => {
      this.IsPlaying = false
      this.PlayBtnTxt = '▶'
    })
    Observe.$on(OBEvent.AUTO_PLAY_STARTED, () => {
      this.IsPlaying = true
      this.PlayBtnTxt = '❙ ❙'
    })
    Observe.$on(OBEvent.SHEET_MUSIC_LOADED, (sheetMusic) => {
      this.CurrentSheetMusicNameLabelText = '当前播放：' + sheetMusic.name
      this.slider.minValue = 1
      this.slider.maxValue = sheetMusic.notes.length
      this.slider.value = 1
    })
    Observe.$on(OBEvent.PLAY_PROGRESS_UPDATE, (curPos) => {
      this.slider.value = curPos
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
    onChange () {
      // let value = document.getElementById("autoPlayProgress").value;
      console.log('asdasd');
    },
    // getPlayBtnText () {
    //   if (this.IsPlaying) return 'Pause'
    //   else return 'Play'
    // },
    callbackRange (val) {
    this.rangeValue = val
    },
    testMethod() {
      console.log('wewe')
    }
  },
  components: {
    VueSlideBar
  },
}
  
</script>