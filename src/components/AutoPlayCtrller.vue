<template>
  <!--<div class="component-test-comp" ref="TestComponent">-->
    <div>
    {{CurrentSheetMusicNameLabelText}}
    <div @click="onPlayBtnClick">{{PlayBtnTxt}}</div>
    <div @click="onStopBtnClick">{{StopBtnTxt}}</div>
    <!-- <div @oninput="onChange()"> <input id="autoPlayProgress" type="range" min="0" max="1" value="0" step = 0.000001 /> </div> -->
    </div>
  <!-- </div> -->
</template>

<script>
import Observe from 'observe'
import { ScoreNum, ScoreXml, OBEvent } from 'config'
export default {
  name: 'AutoPlayCtrller',
  data() {
    return {
      CurrentSheetMusicNameLabelText: '当前播放：没有乐谱',
      PlayBtnTxt: 'Play',
      StopBtnTxt: 'Stop',
      IsPlaying: false,
    }
  },
  mounted() {
    Observe.$on(OBEvent.AUTO_PLAY_STOPPED, () => {
      this.IsPlaying = false
      this.PlayBtnTxt = 'Play'
    })
    Observe.$on(OBEvent.AUTO_PLAY_STARTED, () => {
      this.IsPlaying = true
      this.PlayBtnTxt = 'Pause'
    })
    Observe.$on(OBEvent.SHEET_MUSIC_LOADED, (sheetMusicName) => {
      this.CurrentSheetMusicNameLabelText = '当前播放：' + sheetMusicName
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
  }
}
  
</script>