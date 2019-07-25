// Mixin 说明：按照自定义简谱格式，触发piano组件的自动播放
// 简谱英文 numbered musical notation
import { ScoreNum, OBEvent } from 'config'
import Observe from 'observe'

const autoKeyActiveStyle = 'auto-key-active'
export default {
  data () {
    return {
      ScoreNum,
      playTimer: null,
      playingSheet: null,
      stepMap: {
        'C': {
          1:'C4', 2:'D4', 3:'E4', 4:'F4', 5:'G4',
          6:'A4', 7:'B4', 8:'C5', 9:'D5', 10:'E5',
          11:'F5', 12:'G5', 13:'A5', 14:'B5', 15:'C6'
        },
      },
      // 播放控制信息
      curBarIdx: 0,
      curPosInBar: 0,

    }
  },
  methods: {
    // 将简谱numNotation映射为notename
    mapNum2NoteName(stepname = '', numNotation = 0) {
      if (numNotation && stepname && this.stepMap[stepname])  {
        let curStep = this.stepMap[stepname]
        if (curStep && curStep[numNotation]) {
          let notename = curStep[numNotation]
          return notename
        }
      }
      return ''
    },

    // sky sheet music
    autoPlaySheet (sheet) {
      // if (sheet) this.playingSheet = sheet
      if (!this.playingSheet) return

      let notes = this.playingSheet.notes

      let frameCnt = -1
      const PosPerBar = 96
      const ChannelCnt = 5
      $('.piano-key').removeClass(autoKeyActiveStyle)
      // 音符时长
      let noteDur = {
        1:PosPerBar,
        2:PosPerBar/2,
        4:PosPerBar/4,
        8:PosPerBar/8,
        16:PosPerBar/16,
        32:PosPerBar/32,
      }

      let startStmp = new Date()
      // 推测出正确的开始时间
      startStmp -= (this.curBarIdx + this.curPosInBar / PosPerBar) * 3.5 * 1000
      let totalBar = notes.length
      let curBar
      curBar = notes[this.curBarIdx]
      let curNoteInBar = [0,0,0,0,0]
      // 初始化到当前播放位置
      for (let channel = 0; channel < ChannelCnt; channel++) {
        while (curNoteInBar[channel] < curBar[channel].length &&
          Math.floor(curBar[channel][curNoteInBar[channel]] / 10000) < this.curPosInBar) {
            curNoteInBar[channel]++
        }
      }
      // 琶音队列
      let notes2Play = []
      // 按下的键
      let pressedNotes = {}
      pressedNotes.notes = []
      pressedNotes.releaseTime = Number.MAX_VALUE
      

      let loop = () => {
        let curStmp = new Date()
        let curTime = curStmp - startStmp

        this.curPosInBar = Math.floor(PosPerBar * (curTime - this.curBarIdx * 3.5 * 1000) / (3.5 * 1000))
        
        if (curTime >= pressedNotes.releaseTime) {
          for (let i in pressedNotes.notes) {
            $(`[data-keyCode=${pressedNotes.notes[i].keyCode}]`).removeClass(autoKeyActiveStyle);
          }
          pressedNotes.notes.splice(0)
          pressedNotes.releaseTime = Number.MAX_VALUE
        }
        
        if (this.curPosInBar >= PosPerBar) {
          this.curBarIdx++
          if (this.curBarIdx >= totalBar) {
            this.clearAutoPlayTimerAndStyle()
            return
          } else {
            curNoteInBar = [0,0,0,0]
            curBar = notes[this.curBarIdx]
          }
          Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1)
        }
        
        let nextMinPos = PosPerBar
        let notePosPlayedInThisFrame = -1
        for (let channel = ChannelCnt - 1; channel >= 0; channel--) {
          
          if (curNoteInBar[channel] < curBar[channel].length) {
            let nextNotePos = Math.floor(curBar[channel][curNoteInBar[channel]] / 10000)
            if (this.curPosInBar >= nextNotePos) {
              let notename = this.mapNum2NoteName('C', curBar[channel][curNoteInBar[channel]] % 100)
          
              // 第一音轨不算入琶音中
              if (channel == 0) {
                this.playNote(notename)
              } else {
                notes2Play.push([notename, channel])
              }
              curNoteInBar[channel] ++
              notePosPlayedInThisFrame = nextNotePos
              let pressedNote = this.getNoteByName(notename)
              pressedNotes.notes.push(pressedNote)
              if (pressedNote) $(`[data-keyCode=${pressedNote.keyCode}]`).addClass(autoKeyActiveStyle)

            }
            if (nextNotePos < nextMinPos) nextMinPos = nextNotePos
          }
        }

        if (notePosPlayedInThisFrame >= 0) {
          // 在下一个最近音符的前32分音符个位置释放按键
          nextMinPos -= noteDur[32]
          // 如果按键时长超过一个四分音符，则设置为一个四分音符
          if (nextMinPos - notePosPlayedInThisFrame > noteDur[4]) nextMinPos = notePosPlayedInThisFrame + noteDur[4]
          // 最短为16分音符时长
          if (nextMinPos - notePosPlayedInThisFrame < noteDur[16]) nextMinPos = notePosPlayedInThisFrame + noteDur[16]
          pressedNotes.releaseTime = (this.curBarIdx + nextMinPos / PosPerBar) * 3.5 * 1000
        }

        // 处理琶音
        if (frameCnt >= 0) frameCnt++
        if (((frameCnt % 3) == 0 || frameCnt < 0) && notes2Play.length != 0) {
          let note2Play = notes2Play.shift()
          this.playNote(note2Play[0])
          if (notes2Play.length == 0) {
            frameCnt = -1
          }
          else if (frameCnt < 0) {
            frameCnt = 0
          }
        }
      }


      this.playTimer = setInterval(() => {
        loop()
      }, 20)
      Observe.$emit(OBEvent.AUTO_PLAY_STARTED)
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
        this.pauseAutoPlay()
        this.rewindPlayPos()
        if (beginPlayAfterLoad) {
          this.startAutoPlay()
        }

        Observe.$emit(OBEvent.SHEET_MUSIC_LOADED, this.playingSheet)
      }
    },

    startAutoPlay() {
      this.autoPlaySheet(this.playingSheet)
    },
    pauseAutoPlay() {
      this.clearAutoPlayTimerAndStyle()
    },

    stopAutoPlay() {
      this.clearAutoPlayTimerAndStyle()
      this.playTimer = null
      this.rewindPlayPos()
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
      Observe.$emit(OBEvent.PLAY_PROGRESS_UPDATE, this.curBarIdx + 1)
    },
  }
}
