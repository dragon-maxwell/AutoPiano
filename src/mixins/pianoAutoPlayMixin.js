// Mixin 说明：按照自定义简谱格式，触发piano组件的自动播放
// 简谱英文 numbered musical notation
import { ScoreNum, OBEvent } from 'config'
import { MusicKeyMap } from '@/config/notes'
import Observe from 'observe'
import Piano from '@/components/Piano'

const autoKeyActiveStyle = 'auto-key-active'
const PosPerBar = 96
const ChannelCnt = 5
// 最大允许录音小节数
const MaxRecordBarCnt = 999
export default {
  data () {
    return {
      ScoreNum,
      playTimer: null,
      playingSheet: null,
      keyMap: {
        'C': {
          1:'C4', 2:'D4', 3:'E4', 4:'F4', 5:'G4',
          6:'A4', 7:'B4', 8:'C5', 9:'D5', 10:'E5',
          11:'F5', 12:'G5', 13:'A5', 14:'B5', 15:'C6'
        },
      },
      isRecording: false,
      recordData: null,
      // 播放控制信息
      // 当前小节
      curBarIdx: 0,
      // 当前在小节内的位置
      curPosInBar: 0,
      // 当前小节的音符
      curBar: [],
      // 当前各小节的待播放音符序号
      curNoteInBar: [],
      // 开始播放时的时间戳
      startStmp: null,
      // 当前播放的拍子编号
      prevQnIdx: 0,
      // 各种音符的时长（单位：细分位置）
      noteDur: null,
      // 当前按下的按键
      pressedInstrumentKeys: null,
      // 当前播放的速度
      curPlayBpm: 100,
    }
  },
  methods: {
    // 计算一个小节的时长
    millisecondsPerBar() {
      if (this.playingSheet) {
        return this.playingSheet.timeSignature[0] * 60000 / this.curPlayBpm
      } else {
        return 2400
      }
    },

    // sky sheet music
    autoPlaySheet () {
      if (!this.playingSheet) return

      let notes = this.playingSheet.notes
      let totalBar = notes.length

      let loop = () => {
        let curStmp = new Date()
        let curTime = curStmp - this.startStmp

        // 播放时会实时调整播放bmp，所以要每次循环计算
        let timePerBar = this.millisecondsPerBar()
        this.curPosInBar = Math.floor(PosPerBar * (curTime - this.curBarIdx * timePerBar) / timePerBar)
        
        if (curTime >= this.pressedInstrumentKeys.releaseTime) {
          for (let i in this.pressedInstrumentKeys.keyCodes) {
            $(`[data-keyCode=${this.pressedInstrumentKeys.keyCodes[i]}]`).removeClass(autoKeyActiveStyle);
          }
          this.pressedInstrumentKeys.keyCodes.splice(0)
          this.pressedInstrumentKeys.releaseTime = Number.MAX_VALUE
        }
        
        if (this.curPosInBar >= PosPerBar) {
          this.curBarIdx++
          this.curPosInBar -= PosPerBar
          if (this.curBarIdx >= totalBar) {
            this.stopAutoPlay()
            return
          } else {
            this.curNoteInBar = [0,0,0,0,0]
            this.curBar = notes[this.curBarIdx]
          }
          this.prevQnIdx = 0
          Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, this.prevQnIdx + 1)
        } else {
          // 小节内拍子序号
          let qnIdx = Math.floor(this.curPosInBar / this.noteDur[this.playingSheet.timeSignature[0]])
          if (this.prevQnIdx != qnIdx) {
            this.prevQnIdx = qnIdx
            Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, this.prevQnIdx + 1)
          }
        }
        
        let nextMinPos = PosPerBar
        let notePosPlayedInThisFrame = -1
        for (let channel = ChannelCnt - 1; channel >= 0; channel--) {
          
          if (this.curNoteInBar[channel] < this.curBar[channel].length) {
            let nextNotePos = Math.floor(this.curBar[channel][this.curNoteInBar[channel]] / 10000)
            if (this.curPosInBar >= nextNotePos) {
              let instrumentKeyIdx = this.curBar[channel][this.curNoteInBar[channel]] % 100 - 1
              let notename = this.getNoteNameByInstrumentKeyIdx(instrumentKeyIdx)
          
              this.playNote(notename)

              this.curNoteInBar[channel] ++
              notePosPlayedInThisFrame = nextNotePos
              let pressedKeyCode = this.getKeyCodeByInstrumentKeyIdx(instrumentKeyIdx)
              this.pressedInstrumentKeys.keyCodes.push(pressedKeyCode)
              if (pressedKeyCode) $(`[data-keyCode=${pressedKeyCode}]`).addClass(autoKeyActiveStyle)

            }
            if (nextNotePos < nextMinPos) nextMinPos = nextNotePos
          }
        }

        if (notePosPlayedInThisFrame >= 0) {
          // 在下一个最近音符的前32分音符个位置释放按键
          nextMinPos -= this.noteDur[32]
          // 如果按键时长超过一个四分音符，则设置为一个四分音符
          if (nextMinPos - notePosPlayedInThisFrame > this.noteDur[4]) nextMinPos = notePosPlayedInThisFrame + this.noteDur[4]
          // 最短为16分音符时长
          if (nextMinPos - notePosPlayedInThisFrame < this.noteDur[16]) nextMinPos = notePosPlayedInThisFrame + this.noteDur[16]
          this.pressedInstrumentKeys.releaseTime = (this.curBarIdx + nextMinPos / PosPerBar) * timePerBar
        }
      }


      this.playTimer = setInterval(() => {
        loop()
      }, 20)
      Observe.$emit(OBEvent.AUTO_PLAY_STARTED, this.curBarIdx + 1, 1 + Math.floor(this.curPosInBar / this.noteDur[this.playingSheet.timeSignature[0]]))
    },

    autoPlayRecord () {
      if (!this.playingSheet) return

      let notes = this.playingSheet.notes
      let totalBar = notes.length

      let loop = () => {
        let curStmp = new Date()
        let curTime = curStmp - this.startStmp

        // 播放时会实时调整播放bmp，所以要每次循环计算
        let timePerBar = this.millisecondsPerBar()
        this.curPosInBar = Math.floor(PosPerBar * (curTime - this.curBarIdx * timePerBar) / timePerBar)
        // if (curTime >= this.pressedInstrumentKeys.releaseTime) {
        //   for (let i in this.pressedInstrumentKeys.keyCodes) {
        //     $(`[data-keyCode=${this.pressedInstrumentKeys.keyCodes[i]}]`).removeClass(autoKeyActiveStyle);
        //   }
        //   this.pressedInstrumentKeys.keyCodes.splice(0)
        //   this.pressedInstrumentKeys.releaseTime = Number.MAX_VALUE
        // }
        
        
        if (this.curPosInBar >= PosPerBar) {
          this.curBarIdx++
          this.curPosInBar -= PosPerBar
          // 要把小节内剩余的操作记录播完
          while (this.curNoteInBar[0] < this.curBar.length) {
            let instrumentKeyIdx = this.curBar[this.curNoteInBar[0]] % 100 - 1
            // 如果是按下记录
            if (this.curBar[this.curNoteInBar[0]] < 100000) {
              let notename = this.getNoteNameByInstrumentKeyIdx(instrumentKeyIdx)
              this.playNote(notename)
              let keyCode = this.getKeyCodeByInstrumentKeyIdx(instrumentKeyIdx)
              $(`[data-keyCode=${keyCode}]`).addClass(autoKeyActiveStyle)
            } else {
              this.pressedInstrumentKeys.push(instrumentKeyIdx)
            }
            this.curNoteInBar[0] ++
          }
          if (this.curBarIdx >= totalBar) {
            this.stopAutoPlay()
            return
          } else {
            this.curNoteInBar = [0,0,0,0,0]
            this.curBar = notes[this.curBarIdx]
          }
          this.prevQnIdx = 0
          Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, this.prevQnIdx + 1)
        } else {
          // 小节内拍子序号
          let qnIdx = Math.floor(this.curPosInBar / this.noteDur[this.playingSheet.timeSignature[0]])
          if (this.prevQnIdx != qnIdx) {
            this.prevQnIdx = qnIdx
            Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, this.prevQnIdx + 1)
          }
        }
        while (this.pressedInstrumentKeys.length > 0 && this.curPosInBar >= Math.floor(this.pressedInstrumentKeys[0] / 100)) {
            let keyCode = this.getKeyCodeByInstrumentKeyIdx(this.pressedInstrumentKeys[0] % 100)
            if (keyCode > 0) {
              $(`[data-keyCode=${keyCode}]`).removeClass(autoKeyActiveStyle);
            }
            this.pressedInstrumentKeys.shift()
        }
        while (this.curNoteInBar[0] < this.curBar.length && this.curPosInBar >= Math.floor((this.curBar[this.curNoteInBar[0]] % 100000) / 100)) {
          let instrumentKeyIdx = this.curBar[this.curNoteInBar[0]] % 100 - 1
          // 如果是按下记录
          if (this.curBar[this.curNoteInBar[0]] < 100000) {
            let notename = this.getNoteNameByInstrumentKeyIdx(instrumentKeyIdx)
            this.playNote(notename)
            let keyCode = this.getKeyCodeByInstrumentKeyIdx(instrumentKeyIdx)
            // console.log('press keycode: ' + keyCode + ' curBarIdx: ' + this.curBarIdx + ' curNoteInBar: ' + this.curNoteInBar[0] + ' curPosInBar: ' + this.curPosInBar)
            $(`[data-keyCode=${keyCode}]`).addClass(autoKeyActiveStyle)
          } else {
            this.pressedInstrumentKeys.push(instrumentKeyIdx)
            // console.log('release instrumentKeyIdx: ' + instrumentKeyIdx)
          }
          this.curNoteInBar[0] ++
        }
      }
      this.playTimer = setInterval(() => {
        loop()
      }, 20)
      Observe.$emit(OBEvent.AUTO_PLAY_STARTED, this.curBarIdx + 1, 1 + Math.floor(this.curPosInBar / this.noteDur[this.playingSheet.timeSignature[0]]))
    },

    // 录制输入
    recordInput () {
      let timePerBar = this.millisecondsPerBar()
      let loop = () => {
        let curStmp = new Date()
        let curTime = curStmp - this.startStmp
        this.curPosInBar = Math.floor(PosPerBar * (curTime - this.curBarIdx * timePerBar) / timePerBar)
        // console.log('curBar: ' + this.curBarIdx + ' curPosInBar: ' + this.curPosInBar)
        if (this.curPosInBar >= PosPerBar) {
          this.curBarIdx++
          this.curPosInBar -= PosPerBar
          if (this.curBarIdx >= MaxRecordBarCnt) {
            this.stopRecording()
            return
          } else {
            
          }
          this.prevQnIdx = 0
          Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, this.prevQnIdx + 1)
        } else {
          // 小节内拍子序号
          let qnIdx = Math.floor(this.curPosInBar / this.noteDur[this.playingSheet.timeSignature[0]])
          if (this.prevQnIdx != qnIdx) {
            this.prevQnIdx = qnIdx
            Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, this.prevQnIdx + 1)
          }
        }
      }
      this.playTimer = setInterval(() => {
        loop()
      }, 20)
    },

    initPlayParam () {
      this.startStmp = new Date()
      // 推测出正确的开始时间
      this.startStmp -= (this.curBarIdx + this.curPosInBar / PosPerBar) * this.millisecondsPerBar()
      this.curBar = this.playingSheet.notes[this.curBarIdx]
      this.curNoteInBar = [0,0,0,0,0]
      if (this.playingSheet.record) {
        while (this.curNoteInBar[0] < this.curBar.length &&
          Math.floor(this.curBar[this.curNoteInBar[0]] / 10000) < this.curPosInBar) {
            this.curNoteInBar[0]++
        }
      } else {
        // 初始化到当前播放位置
        for (let channel = 0; channel < ChannelCnt; channel++) {
          while (this.curNoteInBar[channel] < this.curBar[channel].length &&
            Math.floor(this.curBar[channel][this.curNoteInBar[channel]] / 10000) < this.curPosInBar) {
              this.curNoteInBar[channel]++
          }
        }
      }
      $('.piano-key').removeClass(autoKeyActiveStyle)
      
      if (this.playingSheet.record) {
        this.pressedInstrumentKeys = []
      } else {
        // 按下的键
        this.pressedInstrumentKeys = {}
        this.pressedInstrumentKeys.keyCodes = []
        this.pressedInstrumentKeys.releaseTime = Number.MAX_VALUE
      }
    },
    
    // 根据名字载入乐谱，根据参数决定是否在载入后开始播放
    loadSheetMusicByName (name, beginPlayAfterLoad = false) {
      let targetSheetMusic
      for (let k in this.ScoreNum) {
        if (this.ScoreNum[k].name == name) {
          targetSheetMusic = this.ScoreNum[k]
          break
        }
      }
      if (this.playingSheet != targetSheetMusic) {
        this.playingSheet = targetSheetMusic
        this.setCurMusicKey(targetSheetMusic.key)
        this.curPlayBpm = this.playingSheet.bpm
        // 音符时长，单位为 小节位置数量
        this.noteDur = {1:PosPerBar * this.playingSheet.timeSignature[1] / this.playingSheet.timeSignature[0]}
        for (let i = 2; i <= 32; i *= 2) {
          this.noteDur[i] = this.noteDur[1] / i
        }
        this.pauseAutoPlay()
        this.rewindPlayPos()
        if (beginPlayAfterLoad) {
          this.startAutoPlay()
        }

        Observe.$emit(OBEvent.SHEET_MUSIC_LOADED, this.playingSheet)
      }
    },

    startAutoPlay() {
      if (this.playingSheet) {
        this.initPlayParam()
        if (this.playingSheet.record) {
          this.autoPlayRecord()
        } else {
          this.autoPlaySheet()
        }
      }
    },
    pauseAutoPlay() {
      this.clearAutoPlayTimerAndStyle()
    },

    stopAutoPlay() {
      this.clearAutoPlayTimerAndStyle()
      this.playTimer = null
      this.rewindPlayPos()
    },

    setAutoPlayProgress (progressPos) {
      if (this.playingSheet) {
        this.curBarIdx = Math.floor((progressPos - 1) / this.playingSheet.timeSignature[0])
        this.prevQnIdx = (progressPos - 1) % this.playingSheet.timeSignature[0]
        this.curPosInBar = this.prevQnIdx * this.noteDur[this.playingSheet.timeSignature[1]]
        this.initPlayParam()
      }
    },

    setBpm (bpm) {
      this.curPlayBpm = bpm
      this.startStmp = new Date()
      // 推测出正确的开始时间
      this.startStmp -= (this.curBarIdx + this.curPosInBar / PosPerBar) * this.millisecondsPerBar()
    },

    // 清除自动播放计时器，清除按键样式
    clearAutoPlayTimerAndStyle () {
      $(`.piano-key`).removeClass(autoKeyActiveStyle)
      if (this.playTimer) {
        clearInterval(this.playTimer)
        this.playTimer = null
      }
      Observe.$emit(OBEvent.AUTO_PLAY_STOPPED)
    },

    rewindPlayPos () {
      this.curBarIdx = 0
      this.curPosInBar = 0
      this.prevQnIdx = 0
      Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1, 1)
    },

    startRecording () {
      this.stopAutoPlay()
      this.startStmp = new Date()
      // this.recordData.splice(0)
      this.recordData = {
        record: true,
        name: '演奏录音',
        key: this.getCurMusicKeyName(),
        timeSignature: [4,4],
        bpm: this.curPlayBpm,
        notes: []
      }
      // this.recordData.notes[0].push(1)
      // this.recordData.notes[0].push(2)
      // this.recordData.notes.push([])
      // this.recordData.notes[1].push(4)
      // console.log('this.recordData: ' + this.recordData.notes[1])
      this.isRecording = true
      this.recordInput()
      Observe.$emit(OBEvent.RECORDING_STARTED)
      Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, 1, 1)
    },

    stopRecording () {
      this.stopAutoPlay()
      this.isRecording = false
      Observe.$emit(OBEvent.RECORDING_FINISHED, this.recordData)
      // console.log('this.recordData: ' + this.recordData.notes)
      // 删除头部的空白数据
      while (this.recordData.notes.length > 1 && this.recordData.notes[0].length == 0) {
        this.recordData.notes.shift()
      }
      while (this.recordData.notes.length > 1 && this.recordData.notes[this.recordData.notes.length - 1].length == 0) {
        this.recordData.notes.pop()
      }
      this.playingSheet = this.recordData
      this.setCurMusicKey(this.playingSheet.key)
      this.curPlayBpm = this.playingSheet.bpm
      // 音符时长，单位为 小节位置数量
      this.noteDur = {1:PosPerBar * this.playingSheet.timeSignature[1] / this.playingSheet.timeSignature[0]}
      for (let i = 2; i <= 32; i *= 2) {
        this.noteDur[i] = this.noteDur[1] / i
      }
      this.pauseAutoPlay()
      this.rewindPlayPos()
      // if (beginPlayAfterLoad) {
      //   this.startAutoPlay()
      // }

      Observe.$emit(OBEvent.SHEET_MUSIC_LOADED, this.playingSheet)
    },

    addRecordPress (keyCode) {
      let instrumentKeyIdx = this.getInstrumentKeyIdxByKeyCode(keyCode)
      if (instrumentKeyIdx >= 0) {
        while (this.curBarIdx >= this.recordData.notes.length && this.curBarIdx < MaxRecordBarCnt) {
          this.recordData.notes.push([])
        }
        this.recordData.notes[this.curBarIdx].push(this.curPosInBar * 100 + instrumentKeyIdx + 1)
      }
    },
    addRecordRelease (keyCode) {
      let instrumentKeyIdx = this.getInstrumentKeyIdxByKeyCode(keyCode)
      if (instrumentKeyIdx >= 0) {
        while (this.curBarIdx >= this.recordData.notes.length && this.curBarIdx < MaxRecordBarCnt) {
          this.recordData.notes[this.curBarIdx] = []
        }
        this.recordData.notes[this.curBarIdx].push(100000 + this.curPosInBar * 100 + instrumentKeyIdx + 1)
      }
    },

    loadRecord (recordObj) {
      this.playingSheet = recordObj
      this.setCurMusicKey(this.playingSheet.key)
      this.curPlayBpm = this.playingSheet.bpm
      // 音符时长，单位为 小节位置数量
      this.noteDur = {1:PosPerBar * this.playingSheet.timeSignature[1] / this.playingSheet.timeSignature[0]}
      for (let i = 2; i <= 32; i *= 2) {
        this.noteDur[i] = this.noteDur[1] / i
      }
      this.pauseAutoPlay()
      this.rewindPlayPos()

      Observe.$emit(OBEvent.SHEET_MUSIC_LOADED, this.playingSheet)
    },
  }
}
