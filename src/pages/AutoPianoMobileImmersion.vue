<style lang="less">
@import url('../assets/style/variable.less');

#page-mobile.page-mobile { width: 100%; height: 100%; padding: 1px; font-family: 'Avenir', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #2c3e50; position: absolute; top: 0; left: 0; overflow-x: hidden;
  .app-bg { width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -100; opacity: 0.5; background-size: cover; }
  .app-content { width: 100%; height: 100%; overflow-x: hidden; overflow-y: scroll; font-size: 30px; position: relative;
    .mobile-tip { padding: 5px; float: right; background: #fff; color: @c-red; font-size: 30px; }

    .trade-mark { width: 600px;
      .icon-piano { transform: scale(1); }
      .trade-mark-txt { font-size: 50px;
        .trade-mark-txt--en { font-size: 40px; }
      }
    }
    .menu { display: none; }
    .piano-wrap { width: 220%; margin-top: 20px;
      .piano-band { height: 55px; line-height: 55px; background-size: 260px 70px;
        .piano-tip { display: none; }
      }
      .piano-key-wrap { height: 800px !important;
        .bkey { height: calc(400px * 0.65) !important; border-radius: 0 0 10px 10px; }
        .wkey { border-radius: 0 0 12px 12px; }
      }
      .keytip { font-size: 30px; }
    }
  }
  .hero-bkg-animated {
  background: gray url(../assets/images/congruent_pentagon.png) repeat 0 0;
  -webkit-animation: slide 40s linear infinite;
  }
  @-webkit-keyframes slide {
    from { background-position: 0 0; }
    to { background-position: 0 -400px; }
  }
}
</style>

<template>
  <div id="page-mobile" class="page-mobile">
    <div class="app-bg hero-bkg-animated"></div>
    <div class="app-content">
      <Piano></Piano>
    </div>
  </div>
</template>

<script>
import Piano from '@/components/Piano'

export default {
  name: 'AutoPianoMobileImmersion',
  components: {
    Piano
  },
  data() {
    return {
      appBgStyle: ''
    }
  },
  beforeMount() {
    // this.setWallPaper()
    if (window.isMobile) {
      // alert('为了您更好的浏览体验，请在电脑端浏览器访问: \n www.autopiano.cn')
      this.horizontalScreen('body')
    }
  },
  mounted() {
    window.onorientationchange = () => {
      this.horizontalScreen('body')
    }
  },
  methods: {
    // 背景壁纸 移动端不需要设随机壁纸
    setWallPaper() {
      // 埃菲尔铁塔背景
      let src = 'https://i.loli.net/2019/04/28/5cc5bbb4c3a7b.jpg'
      this.appBgStyle = `background: url(${src}) no-repeat; background-size: cover;`
    },
    /*强制横屏*/
    horizontalScreen(className) {
      // transform 强制横屏
      var conW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var conH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      var dpr = window.devicePixelRatio;
      // transform: rotate(90deg); width: 667px; height: 375px;transform-origin:28% 50%;
      //var iosTopHe = 0;//若有其他样式判断，写于此
      if (conW > conH) {
        $(className).css({
          "transform":"rotate(0deg)",
          "width":"100%",
          "height":"100%"
        })
        return;
      }
      $(className).css({
          "transform": "rotate(90deg) translate("+((conH-conW)/2)+"px,"+((conH-conW)/2)+"px)",
          "width": conH+"px",
          "height": conW+"px",
          //"margin-top":iosTopHe+"px",
          // "border-left":iosTopHe+"px solid #000",
          "transform-origin":"center center",
          "-webkit-transform-origin": "center center"
      });
    }
  }
}
</script>

