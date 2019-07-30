<style lang="less">
@import url('../assets/style/variable.less');

.component-autopiano { width: 100%; position: relative; color: #000;
  #audioEffectCanvas { display: none; }
  .piano-scroll-wrap { width: 100%; overflow: visible; }
  .piano-wrap.visible { opacity: 1; }
  .piano-wrap { width: 90%; margin: 20px auto; box-shadow: 5px 5px 20px 5px #888; border-radius: 5px; position: relative; overflow: hidden; opacity: 0;
    .piano-key-wrap { width: 100%; height: 300px; overflow: hidden; position: relative;
      .piano-key {
        &:hover { cursor: pointer; }
      }

      .wkey { display: inline-block; width: 8%; height: 30%; margin: 8px 8px; background:hsla(0,0%,100%,.25) border-box;  border:1px solid #ccc; box-shadow:inset 0 1px 0px #fff,inset 0 -1px 0px #fff,inset 1px 0px 0px #fff,inset -1px 0px 0px #fff,0 4px 3px rgba(0,0,0,0.7); border-radius: 0 0 5px 5px; position: relative;

        
        // &:active:before { content:""; border-width:80px 5px 0px; border-style:solid; border-color:transparent rgba(0,0,0,0.1) transparent transparent; position: absolute; right: 0; bottom: 0; }
        // &:active:after { content:""; border-width:80px 5px 0px; border-style:solid; border-color:transparent rgba(0,0,0,0.1) transparent transparent; position: absolute; right: 0; bottom: 0; }

        .keytip { width: 100%; color: @c-black; text-align: center; font-size: 14px; position: absolute; bottom: 5%;
          .keyname { margin-bottom: 5px; }
          .notename { color: @c-blue; font-weight: bold; }
        }
      }
      .wkey-active { width: 8%; height: 30%; box-shadow:0 2px 2px rgba(255,0,0,0.4); top: -1%;  background: #FF8C00;
        // &:before { content:""; border-width:250px 5px 0px; border-style:solid; border-color:transparent transparent transparent rgba(0,0,0,0.1); position: absolute; left: 0; bottom: 0; }
        // &:after { content:""; border-width:250px 5px 0px; border-style:solid; border-color:transparent rgba(0,0,0,0.1) transparent transparent; position: absolute; right: 0; bottom: 0; }

        // &:active:before { content:""; border-width:80px 5px 0px; border-style:solid; border-color:transparent rgba(0,0,0,0.1) transparent transparent; position: absolute; right: 0; bottom: 0; }
        // &:active:after { content:""; border-width:80px 5px 0px; border-style:solid; border-color:transparent rgba(0,0,0,0.1) transparent transparent; position: absolute; right: 0; bottom: 0; }
      }

      .bkey { display: inline-block; width: 10%; height: 70%; background:linear-gradient(-20deg,#333,#000,#333); border-width:1px 2px 7px; border-style:solid; border-color:#666 #222 #111 #555; border-radius:0 0 2px 2px; box-shadow:inset 0px -1px 2px rgba(255,255,255,0.4),0 2px 3px rgba(0,0,0,0.4); position: absolute; top: 0; overflow: hidden;
        &:active { height:101%; border-bottom-width:2px; box-shadow:inset 0px -1px 1px rgba(255,255,255,0.4),0 1px 0px rgba(0,0,0,0.8),0 2px 2px rgba(0,0,0,0.4),0 -1px 0px #000; }
        .keytip { width: 100%; color: #fff; position: absolute; left: 0; bottom: 5%; font-size: 14px; overflow: hidden;
          .keyname { width: 100%; text-align: center; }
        }
      }
      .bkey-active { height:101%; border-bottom-width:2px; box-shadow:inset 0px -1px 1px rgba(255,255,255,0.4),0 1px 0px rgba(0,0,0,0.8),0 2px 2px rgba(0,0,0,0.4),0 -1px 0px #000; }

      .wkey.auto-key-active { width: 8%; height: 30%; box-shadow:0 2px 2px rgba(255,0,0,0.4); top: -1%;  background: #FF8C00;
        &:before { content:""; border-width:250px 5px 0px; border-style:solid; border-color:transparent transparent transparent rgba(0,0,0,0.1); position: absolute; top: 0; left: 0; }
        &:after { content:""; border-width:250px 5px 0px; border-style:solid; border-color:transparent rgba(0,0,0,0.1) transparent transparent; position: absolute; right: 0; left: 0; }
      }
      .bkey.auto-key-active { height:101%; border-bottom-width:2px; box-shadow:inset 0px -1px 1px rgba(255,255,255,0.4),0 1px 0px rgba(0,0,0,0.8),0 2px 2px rgba(0,0,0,0.4),0 -1px 0px #000; background: @c-yellow !important; }

      .bkey:nth-child(1) { left: 9%; }
      .bkey:nth-child(2) { left: 23%; }
      .bkey:nth-child(3) { left: 50%; }
      .bkey:nth-child(4) { left: 65%; }
      .bkey:nth-child(5) { left: 79%; }

      .bkey-wrap { width: 20%; height: 0; position: absolute; top: 0; }
      .bkey-wrap1 { left: 0; }
      .bkey-wrap2 { left: 19.5%; }
      .bkey-wrap3 { left: 39%; }
      .bkey-wrap4 { left: 58.3%; }
      .bkey-wrap5 { left: 77.7%; }
    }
  }

  .piano-options { width: 90%; height: 50px; margin: 0px auto 15px; padding: 0; position: relative;
    .option-item-wrap { position: absolute; left: 1%; }
    .option-item { display: inline-block; height: 50px; line-height: 50px; margin: 0 15px;
      .label {
        // Hide the ugly checkbox
        > input { display: none; }
        // New beautiful checkbox
        i { display: inline-block; margin-left: 5px; padding: 2px; width: 40px; height: 20px; border-radius: 13px; vertical-align: middle; transition: .25s .09s; position: relative; background: #d8d9db; box-sizing: initial;
          &:after { content: " "; display: block; width: 20px; height: 20px; border-radius: 50%; background: #fff; position: absolute; left: 2px; transition: .25s; }
        }
        // Checked-state
        > input:checked + i { background: @c-green; }
        > input:checked + i:after { transform: translateX(20px); }
        // Label-hover
        &:hover { cursor: pointer; }
      }
    }
  }

  .key-scale-animation{
      animation:scale-keyframes 0.05s linear 1;
  }
  @-webkit-keyframes scale-keyframes{
    0%{transform: scale(1);}
    50%{transform: scale(0.6);}
    100%{transform: scale(1);}
  }

  .key-rotate-animation{
    animation:rotate-keyframes 0.375s linear 1;
  }
  @-webkit-keyframes rotate-keyframes{
    0%{-webkit-transform:rotateY(0deg) rotateZ(45deg);}
    25%{-webkit-transform:rotateY(90deg) rotateZ(45deg);}
    50%{-webkit-transform:rotateY(180deg) rotateZ(45deg);}
    75%{-webkit-transform:rotateY(270deg) rotateZ(45deg);}
    100%{-webkit-transform:rotateY(360deg) rotateZ(45deg);}
  }

  .diamonds{
    width: 30%;
    border: 1px solid orange;
    box-shadow: 0px 0px 15px orange inset,0px 0px 15px orange;
    transform:rotateZ(45deg);
    -ms-transform:rotateZ(45deg); /* Internet Explorer */
    -moz-transform:rotateZ(45deg); /* Firefox */
    -webkit-transform:rotateZ(45deg); /* Safari 和 Chrome */
    -o-transform:rotateZ(45deg); /* Opera */
    margin: 25px auto;/*让菱形浏览器上居中*/
    &:after {
      content: '';
      display: block;
      margin-top: 100%; //margin 百分比相对父元素宽度计算
    }
  }

  .circle {
    width: 30%;
    border: 1px solid orange;
    box-shadow: 0px 0px 15px orange inset,0px 0px 15px orange;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    margin: 25px auto;/*让菱形浏览器上居中*/
    &:after {
      content: '';
      display: block;
      margin-top: 100%; //margin 百分比相对父元素宽度计算
    }
 }
}

</style>

<template>
  <div class="component-autopiano" ref="PianoComponent">
    <div class="piano-scroll-wrap">
      <div class="piano-wrap responsive-section-a" :class="{'visible': pianoShow}">
        <!-- <div class="piano-band">
          <img class="piano-band-img" :src="bandImg" alt="">
          <div class="piano-tip">⇧ 代表 shift 键</div>
        </div> -->
        <div class="piano-key-wrap">
          <div class="piano-key wkey key-scale-animation" v-for="(note,index) in Notes" :key="note.keyCode" :data-keyCode="note.keyCode"
            :data-name="note.name" v-if="index<=4 && index>=0" @click.stop="clickPianoKey($event, note.keyCode)" 
            @mousedown="clickPianoKeyDown($event, note.keyCode)" @mouseup="clickPianoKeyUp($event, note.keyCode)" 
            @touchstart="touchPianoKeyDown($event, note.keyCode)" @touchend="touchPianoKeyUp($event, note.keyCode)">
            <div class="key-rotate-animation" :class="(index%2 ==0) ? 'diamonds' : 'circle'" :data-keyCode="note.keyCode+'rotate'"></div>
            <div class="keytip">
              <div class="keyname" v-show="showKeyName">{{note.key}}</div>
              <div class="notename" v-show="showNoteName">{{note.name}}</div>
            </div>
          </div>
          <div></div>
          <div class="piano-key wkey key-scale-animation" v-for="(note,index) in Notes" :key="note.keyCode" :data-keyCode="note.keyCode"
            :data-name="note.name" v-if="index<=9 && index>=5" @click.stop="clickPianoKey($event, note.keyCode)" 
            @mousedown="clickPianoKeyDown($event, note.keyCode)" @mouseup="clickPianoKeyUp($event, note.keyCode)" 
            @touchstart="touchPianoKeyDown($event, note.keyCode)" @touchend="touchPianoKeyUp($event, note.keyCode)">
            <div class="key-rotate-animation" :class="(index%2 ==0) ? 'diamonds' : 'circle'" :data-keyCode="note.keyCode+'rotate'"></div>
            <div class="keytip">
              <div class="keyname" v-show="showKeyName">{{note.key}}</div>
              <div class="notename" v-show="showNoteName">{{note.name}}</div>
            </div>
          </div>
          <div></div>
          <div class="piano-key wkey key-scale-animation" v-for="(note,index) in Notes" :key="note.keyCode" :data-keyCode="note.keyCode"
            :data-name="note.name" v-if="index<=14 && index>=10" @click.stop="clickPianoKey($event, note.keyCode)" 
            @mousedown="clickPianoKeyDown($event, note.keyCode)" @mouseup="clickPianoKeyUp($event, note.keyCode)" 
            @touchstart="touchPianoKeyDown($event, note.keyCode)" @touchend="touchPianoKeyUp($event, note.keyCode)">
            <div class="key-rotate-animation" :class="(index%2 ==0) ? 'diamonds' : 'circle'" :data-keyCode="note.keyCode+'rotate'"></div>
            <div class="keytip">
              <div class="keyname" v-show="showKeyName">{{note.key}}</div>
              <div class="notename" v-show="showNoteName">{{note.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="piano-options responsive-section-a">

      <div class="option-item-wrap">
        <div class="option-item">
          <label class="label">
            显示按键提示
            <input type="checkbox" id="keyname" v-model="showKeyName" />
            <i></i>
          </label>
        </div>

        <div class="option-item">
          <label class="label">
            显示音名
            <input type="checkbox" id="notename" v-model="showNoteName" />
            <i></i>
          </label>
        </div>
      </div>
    </div>

    <canvas id="audioEffectCanvas" ref="audioEffectCanvas">您的浏览器不支持<pre>Canvas</pre>。请升级到最新版的chrome、firefox、edge等浏览器。</canvas>

  </div>
</template>

<script>
import Vue from 'vue'
import Tone from 'tone'
import Observe from 'observe'
import { Notes, OBEvent } from 'config'
import { MusicKeyMap } from '@/config/notes'
import SmapleLibrary from '@/lib/Tonejs-Instruments'
import { debounce } from '@/lib/wutils'

import pianoAutoPlayMixin from '@/mixins/pianoAutoPlayMixin'
import xmlAutoPlayMixin from '@/mixins/xmlAutoPlayMixin'

export default {
  name: 'Piano',
  mixins: [pianoAutoPlayMixin, xmlAutoPlayMixin],
  components: {},
  data() {
    return {
      DEV: false,
      pianoShow: false,
      bandImg: require('../assets/images/band.png'),
      enableBlackKey: false, // 启用黑色按键
      showKeyName: true, // 显示键名
      showNoteName: true, // 显示音符名
      Notes: Notes,
      synth: null,
      keydownTimer: null,
      keyLock: false,
      lastKeyCode: '',
      lastKeyTime: 0,
      curMusicKey: 0,
    }
  },
  mounted() {
    this.initPiano()
  },
  beforeDestroy() {
    this.keydownTimer = null
  },
  methods: {
    // 钢琴初始化
    async initPiano() {
      setTimeout(() => {
        this.computeEleSize()
        this.pianoShow = true
      }, 300)
      this.bindKeyBoradEvent()
      this.setListener()

      this.synth = SmapleLibrary.load({
        instruments: "piano"
      }).toMaster()

      this.loadSheetMusicByName('大鱼')

      // this.synth = new Tone.PolySynth( 10 ).toMaster()
    },
    computeEleSize() {
      let wkey_width = $('.piano-key-wrap').width() / 36;
      let wkey_height = wkey_width * 7;
      // let bkey_height = wkey_height * 0.7;
      $('.piano-key-wrap').height(wkey_height);
      // $('.bkey').height(bkey_height);
    },
    setListener() {
      window.onresize = this.computeEleSize
      window.onorientationchange = this.computeEleSize

      // 载入乐谱
      Observe.$on(OBEvent.LOAD_SHEET_MUSIC, (sheetMusicName, beginPlayAfterLoad) => {
        this.loadSheetMusicByName(sheetMusicName, beginPlayAfterLoad)
      })
      // 播放乐谱
      Observe.$on(OBEvent.START_AUTO_PLAY, () => {
        this.startAutoPlay()
      })
      // 暂停自动播放
      Observe.$on(OBEvent.PAUSE_AUTO_PLAY, (scoreItem) => {
        this.pauseAutoPlay(scoreItem)
        // this.pauseXMLPlay()
      })
      // 停止自动播放
      Observe.$on(OBEvent.STOP_AUTO_PLAY, () => { this.stopAutoPlay() })
      // 拖动播放进度条
      Observe.$on(OBEvent.SET_AUTO_PLAY_PROGRESS, (progressPos) => { this.setAutoPlayProgress(progressPos) })
      Observe.$on(OBEvent.SET_PIANO_KEY, () => {
        this.curMusicKey++
        if (this.curMusicKey < 0 || this.curMusicKey >= MusicKeyMap.length) {
          this.curMusicKey = 0
        }
        Observe.$emit(OBEvent.PIANO_KEY_CHANGED, MusicKeyMap[this.curMusicKey].keyName)
      })

      Observe.$on(OBEvent.SET_AUTO_PLAY_BPM, (bpm) => { this.setBpm(bpm) })
      Observe.$on(OBEvent.START_RECORDING, (bpm) => { this.startRecording() })
      Observe.$on(OBEvent.STOP_RECORDING, (bpm) => { this.stopRecording() })
      Observe.$on(OBEvent.SAVE_RECORD_FILE, () => { this.exportRecordData() })
    },
    // 根据keyCode返回音符名称
    getNoteNameByKeyCode(keyCode) {
      for (let i = 0; i < this.Notes.length; i++) {
        if (this.Notes[i].keyCode == keyCode) {
          return this.getNoteNameByInstrumentKeyIdx(i)
        }
      }
      return ''
    },
    // 根据虚拟按键编码[0,14]返回音符名称
    getNoteNameByInstrumentKeyIdx(instrumentKeyIdx) {
      for (let i = 0; i < MusicKeyMap.length; i++) {
        let musicKey = MusicKeyMap[i]
        if (musicKey.keyName == this.getCurMusicKeyName()) {
          return musicKey.nameMap[instrumentKeyIdx]
        }
      }
      return ''
    },
    getKeyCodeByInstrumentKeyIdx(instrumentKeyIdx) {
      // 改为更高性能的写法
      if (instrumentKeyIdx >= 0 && this.Notes.length > instrumentKeyIdx) {
        return this.Notes[instrumentKeyIdx].keyCode
      } else { return -1 }
    },
    getInstrumentKeyIdxByKeyCode(keyCode) {
      for (let i = 0; i < this.Notes.length; i++) {
        if (this.Notes[i].keyCode == keyCode) {
          return i
        }
      }
      return -1
    },

    getCurMusicKeyName () {
      return MusicKeyMap[this.curMusicKey].keyName
    },

    setCurMusicKey (musicKey) {
      this.curMusicKey = 0
      for (let i = 0; i < MusicKeyMap.length; i++) {
        if (MusicKeyMap[i].keyName == musicKey) {
          this.curMusicKey = i
          break
        }
      }
      Observe.$emit(OBEvent.PIANO_KEY_CHANGED, MusicKeyMap[this.curMusicKey].keyName)
    },

    // 键盘操作 核心代码
    bindKeyBoradEvent() {
      const ShiftKeyCode = 16
      document.addEventListener('keydown', (e) => {
        let keyCode = e.keyCode;
        if (this.DEV) console.log('keydown', keyCode);
        // 按住Shfit键，则启用黑色按键
        if (keyCode == ShiftKeyCode) {
          this.enableBlackKey = true
        }
        if (this.enableBlackKey) keyCode = 'b' + keyCode

        if (keyCode == this.lastKeyCode) {
          // 连续触发同一个键时，应节流 + 延音
          if (!this.keyLock) {
            this.playNoteByKeyCode(keyCode)
            // 这里应该延音，解决中...
            this.lastKeyCode = keyCode
            this.keyLock = true
          }
          if (this.keydownTimer) {
            clearTimeout(this.keydownTimer)
            this.keydownTimer = null
          }
          this.keydownTimer = setTimeout(() => {
            this.keyLock = false
          }, 120)
        } else {
          this.playNoteByKeyCode(keyCode)
          this.lastKeyCode = keyCode
        }
      }, false)
      // document.addEventListener('keydown', debounce((e) => {
      //   let keyCode = e.keyCode;
      //   let time = +new Date()
      //   if (this.DEV) console.log('keydown', keyCode);
      //   // 按住Shfit键，则启用黑色按键
      //   if (keyCode == ShiftKeyCode) {
      //     this.enableBlackKey = true
      //   }
      //   if (this.enableBlackKey) keyCode = 'b' + keyCode
      //   this.playNoteByKeyCode(keyCode)
      //   this.lastKeyCode = keyCode
      //   this.lastKeyTime = +new Date()
      // }, 100, { leading: true, trailing: false }), false)

      document.addEventListener('keyup', (e) => {
        // console.log('keyup');
        let keyCode = e.keyCode;
        // 松开Shfit键，则禁用黑色按键
        if (keyCode == ShiftKeyCode) {
          this.enableBlackKey = false;
        }
        $(`.wkey`).removeClass('wkey-active')
        // $(`.bkey`).removeClass('bkey-active')
        if (this.isRecording) {
          this.addRecordRelease(keyCode)
        }
      }, false)
    },

    // 鼠标操作，点击按键播放
    clickPianoKey(e, keyCode) {
      if(!window.isMobile){
        let pressedNoteName = this.getNoteNameByKeyCode(keyCode)
        if (pressedNoteName) {
          if (this.isRecording) {
            this.addRecordPress(keyCode)
          }
          this.playNote(pressedNoteName)
        }
      }
    },

    // 鼠标操作，mousedown
    clickPianoKeyDown(e, keyCode) {
      if(!window.isMobile){
        let pressedNoteName = this.getNoteNameByKeyCode(keyCode)
        if (pressedNoteName) {
          // $(`[data-keyCode=${keyCode}]`).addClass('wkey-active');
          $(`[data-keyCode=${pressedNote.keyCode}]`).css('animation', 'scale-keyframes 0.05s linear 1');
          let rotateDataKeyCode = pressedNote.keyCode+'rotate';
          $(`[data-keyCode=${rotateDataKeyCode}]`).css('animation', 'rotate-keyframes 0.375s linear 1');
        }
      }
    },

    // 鼠标操作，mouseup
    clickPianoKeyUp(e, keyCode) {
      if(!window.isMobile){
        let pressedNoteName = this.getNoteNameByKeyCode(keyCode)
        if (pressedNoteName) {
          // $(`.wkey`).removeClass('wkey-active');
          if (this.isRecording) {
            this.addRecordRelease(keyCode)
          }
        }
      }
    },

    // 触摸操作，touchdown
    touchPianoKeyDown(e, keyCode) {
      if(window.isMobile){
        let pressedNoteName = this.getNoteNameByKeyCode(keyCode)
        if (pressedNoteName) {
          if (this.isRecording) {
            this.addRecordPress(keyCode)
          }
          this.playNote(pressedNoteName)
          // $(`[data-keyCode=${keyCode}]`).addClass('wkey-active');
          $(`[data-keyCode=${pressedNote.keyCode}]`).css('animation', 'scale-keyframes 0.05s linear 1');
          let rotateDataKeyCode = pressedNote.keyCode+'rotate';
          $(`[data-keyCode=${rotateDataKeyCode}]`).css('animation', 'rotate-keyframes 0.375s linear 1');
          // 振动
          if (navigator.vibrate) {
              navigator.vibrate(100);
          } else if (navigator.webkitVibrate) {
              navigator.webkitVibrate(100);
          }
        }
      }
    },

    // 触摸操作，touchup
    touchPianoKeyUp(e, keyCode) {
      if(window.isMobile){
        let pressedNoteName = this.getNoteNameByKeyCode(keyCode)
        if (pressedNoteName) {
          $(`.wkey`).removeClass('wkey-active');
          if (this.isRecording) {
            this.addRecordRelease(keyCode)
          }
        }
      }
    },

    // 根据键值播放音符
    playNoteByKeyCode(keyCode) {
      let pressedNoteName = this.getNoteNameByKeyCode(keyCode)
      if (pressedNoteName) {
        if (this.isRecording) {
          this.addRecordPress(keyCode)
        }
        this.playNote(pressedNoteName)
        // let keyType = pressedNote.type;
        // if (keyType == 'white') {
          $(`[data-keyCode=${keyCode}]`).addClass('wkey-active');
        // } else if (keyType == 'black') {
        //   $(`[data-keyCode=${pressedNote.keyCode}]`).addClass('bkey-active');
        // }
      }
    },
    // 触发单个音符播放
    playNote(notename = 'C4', duration = '1n') {
      if (!this.synth) return
      try {
        this.synth.triggerAttackRelease(notename, duration);
      } catch (e) {}
    }
  }
}

window.onload=function(){
  $(".key-scale-animation").each(function() {
    $(this)[0].addEventListener("animationend",function(){
        $(this).css("animation","none");
    });
  });

  $(".key-rotate-animation").each(function() {
    $(this)[0].addEventListener("animationend",function(){
        $(this).css("animation","none");
    });
  });
}
</script>
