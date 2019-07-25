// Mixin 说明：按照自定义简谱格式，触发piano组件的自动播放
// 简谱英文 numbered musical notation
import { ScoreNum } from 'config'
const autoKeyActiveStyle = 'auto-key-active'
export default {
  data () {
    return {
      ScoreNum,
      playTimers: [],
      // 目前只有C调和 D调，待完善调整
      StepMap: {
        'C': {  '1>>': 'C2','2>>': 'D2','3>>': 'E2','4>>': 'F2','5>>': 'G2','6>>': 'A2','7>>': 'B2',
                '1>': 'C3','2>': 'D3','3>': 'E3','4>': 'F3','5>': 'G3','6>': 'A3','7>': 'B3',
                '1': 'C4','2': 'D4','3': 'E4','4': 'F4','5': 'G4','6': 'A4','7': 'B4',
                '1<': 'C5', '2<': 'D5', '3<': 'E5', '4<': 'F5', '5<': 'G5', '6<': 'A5', '7<': 'B5',
                '1<<': 'C6', '2<<': 'D6', '3<<': 'E56', '4<<': 'F6', '5<<': 'G6', '6<<': 'A6', '7<<': 'B6'
              },
        'D': {  '1>>':'D2','2>>':'E2','3>>':'F#2','4>>':'G2','5>>':'A2','6>>':'B2','7>>':'C#3',
                '1>':'D3','2>':'E3','3>':'F#3','4>':'G3','5>':'A3','6>':'B3','7>':'C#4',
                '1':'D4','2':'E4','3':'F#4','4':'G4','5':'A4','6':'B4','7':'C#5',
                '1<':'D5','2<':'E5','3<':'F#5','4<':'G5','5<':'A5','6<':'B5','7<':'C#6',
                '1<<':'D6','2<<':'E6','3<<':'F#6','4<<':'G6','5<<':'A6','6<<':'B6','7<<':'C#7'
              },
        'E': {
          1:'C4', 2:'D4', 3:'E4', 4:'F4', 5:'G4',
          6:'A4', 7:'B4', 8:'C5', 9:'D5', 10:'E5',
          11:'F5', 12:'G5', 13:'A5', 14:'B5', 15:'C6'
        },
      },
    }
  },
  methods: {

      // 将简谱numNotation映射为notename
    mapNum2NoteName(stepname = '', numNotation = '') {
        let pitch = numNotation.match(/[#b]*[0-7][\<\>]*/g)[0]
   
        if (pitch && stepname && this.StepMap[stepname])  {
           let curStep = this.StepMap[stepname]
       if (curStep && curStep[pitch]) {
            let notename = curStep[pitch]
             return notename
           }
         }
         return ''
        },
  
    // 将简谱numNotation映射为notename
    mapNum2NoteName2(stepname = '', numNotation = 0) {
      //let pitch = numNotation.match(/[#b]*[0-7][\<\>]*/g)[0]

      if (numNotation && stepname && this.StepMap[stepname])  {
        let curStep = this.StepMap[stepname]
        if (curStep && curStep[numNotation]) {
          let notename = curStep[numNotation]
          return notename
        }
      }
      return ''
    },
    // 获取音符持续时长
    getNoteDuration(numNotation, timeUnit) {
      let factor = 1
      if ( numNotation.match(/\([0-9.]*\)/g) ) {
        factor = numNotation.match(/\([0-9.]*\)/g)[0].replace(/[\)\(]/g, '')
      }
      return timeUnit * (+factor)
    },
    // // 自动播放简谱
    // autoPlayNumberScore (step = 'C', musicScore, speed = 75) {
    //   $('.piano-key').removeClass(autoKeyActiveStyle)
    //   let timeUnit = (60 * 1000) / speed
    //   let startStmp = new Date()
    //   let i = 0
    //   let playedTime = 0
    //   let pressedNote

    //   let loop = () => {
    //     let curStmp = new Date()
    //     let deltaTime = curStmp - startStmp
    //     //console.log(testTimer)
    //     if (deltaTime > playedTime) {
    //       // 播放下一个音符
    //       if (pressedNote) {
    //         $(`[data-keyCode=${pressedNote.keyCode}]`).removeClass(autoKeyActiveStyle);
    //       }
    //       let numNotation = musicScore[i]
    //       let notename = this.mapNum2NoteName(step, numNotation)
    //       pressedNote = this.getNoteByName(notename)
    //       if (pressedNote) $(`[data-keyCode=${pressedNote.keyCode}]`).addClass(autoKeyActiveStyle)
    //       this.playNote(notename)
    //       playedTime += this.getNoteDuration(numNotation, timeUnit)
    //       i++
    //       if (i >= musicScore.length) {
    //         setTimeout(() => {
    //           $(`.piano-key`).removeClass(autoKeyActiveStyle)
    //         }, 1000)
    //         clearInterval(loopTimer)
    //         return
    //       }
    //     }
    //   }
    //   let loopTimer = setInterval(() => {
    //     loop()
    //   }, 20)

    //   this.playTimers.push(loopTimer)
    // },
    // 点击简谱列表播放音乐
    playScoreByName(name = '天空之城') {
      let targetScore
      for (let k in this.ScoreNum) {
        let score = this.ScoreNum[k]
        if (score.name == name) {
          targetScore = score
          break
        }
      }
      if (targetScore) {
        this.pauseAutoPlay()
        this.autoPlaySheet(targetScore.notes)

        // let step = targetScore.step
        // let speed = targetScore.speed
        // if (this.StepMap[step]) {
        //   this.autoPlayNumberScore(step, targetScore.mainTrack, speed)
        //   if (targetScore.backingTrack) {
        //     this.autoPlayNumberScore(step, targetScore.backingTrack, speed)
        //   }
        // }
      }
    },

    // sky sheet music
    autoPlaySheet (notes) {
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

      let totalBar = notes.length
      let curBarItor = 0
      let curBar
      //let curNoteInBar = 0
      let curNoteInBar = [0,0,0,0,0]
      // 琶音队列
      let notes2Play = []
      // 按下的键
      let pressedNotes = {}
      pressedNotes.notes = []
      pressedNotes.releaseTime = Number.MAX_VALUE

      //console.log('Bar num:' + totalBar)

      let playNote = (noteName, channel) => {
        // if (pressedNote[channel]) {
        //   $(`[data-keyCode=${pressedNote[channel].keyCode}]`).removeClass(autoKeyActiveStyle);
        // }
        //pressedNote[channel] = this.getNoteByName(noteName)
            //if (pressedNote[channel]) $(`[data-keyCode=${pressedNote[channel].keyCode}]`).addClass(autoKeyActiveStyle)
            this.playNote(noteName)
      }
      let loop = () => {
        let curStmp = new Date()
        let curTime = curStmp - startStmp

        let curPosInBar = Math.floor(PosPerBar * (curTime - curBarItor * 3.5 * 1000) / (3.5 * 1000))
        //console.log('curPosInBar: ' + curPosInBar)
        
        if (curTime >= pressedNotes.releaseTime) {
          for (let i in pressedNotes.notes) {
            $(`[data-keyCode=${pressedNotes.notes[i].keyCode}]`).removeClass(autoKeyActiveStyle);
          }
          pressedNotes.notes = []
          pressedNotes.releaseTime = Number.MAX_VALUE
        }
        
        if (curPosInBar >= PosPerBar) {
          curBarItor++
          if (curBarItor >= totalBar) {
            setTimeout(() => {
              $(`.piano-key`).removeClass(autoKeyActiveStyle)
            }, 1000)
            clearInterval(loopTimer)
            return
          } else {
            curNoteInBar = [0,0,0,0]
            curBar = notes[curBarItor]
          }
        }
        
        let nextMinPos = PosPerBar
        let notePosPlayedInThisFrame = -1
        for (let channel = ChannelCnt - 1; channel >= 0; channel--) {
          
          if (curNoteInBar[channel] < curBar[channel].length) {
            let nextNotePos = Math.floor(curBar[channel][curNoteInBar[channel]] / 10000)
            if (curPosInBar >= nextNotePos) {
              let notename = this.mapNum2NoteName2('E', curBar[channel][curNoteInBar[channel]] % 100)
          
              // 第一音轨不算入琶音中
              if (channel == 0) {
                playNote(notename, channel)
              } else {
                notes2Play.push([notename, channel])
                //console.log('push to' + notename + ' play queue')
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
          //.log('1: ' + nextMinPos)
          // 在下一个最近音符的前32分音符个位置释放按键
          nextMinPos -= noteDur[32]
          //console.log('2: ' + nextMinPos)
          // 如果按键时长超过一个四分音符，则设置为一个四分音符
          if (nextMinPos - notePosPlayedInThisFrame > noteDur[4]) nextMinPos = notePosPlayedInThisFrame + noteDur[4]
          //console.log('3: ' + nextMinPos)
          // 最短为16分音符时长
          if (nextMinPos - notePosPlayedInThisFrame < noteDur[16]) nextMinPos = notePosPlayedInThisFrame + noteDur[16]
          //console.log('4: ' + nextMinPos)
          pressedNotes.releaseTime = (curBarItor + nextMinPos / PosPerBar) * 3.5 * 1000
        }

        // 处理琶音
        if (frameCnt >= 0) frameCnt++
        if (((frameCnt % 3) == 0 || frameCnt < 0) && notes2Play.length != 0) {
          //console.log('Play note: ' + curBar[channel][curNoteInBar[channel]] + '..' + notename)
          let note2Play = notes2Play.shift()
          //console.log('play ' + note2Play)
          playNote(note2Play[0], note2Play[1])
          if (notes2Play.length == 0) {
            frameCnt = -1
          }
          else if (frameCnt < 0) {
            frameCnt = 0
          }
        }
      }


      curBar = notes[curBarItor]
      let loopTimer = setInterval(() => {
        loop()
      }, 20)

      this.playTimers.push(loopTimer)
    },

    
    pauseAutoPlay() {
      $(`.piano-key`).removeClass(autoKeyActiveStyle)
      this.playTimers.forEach((timer) => {
        clearInterval(timer)
        timer = null
      })
      this.playTimers.splice(0)
    }
  }
}
