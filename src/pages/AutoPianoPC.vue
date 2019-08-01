<style lang="less">
@import url('../assets/style/variable.less');
.page-pc { width: 100%; min-width: 1280px; height: 100%; padding: 1px; font-family: 'Avenir', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #2c3e50; position: absolute; top: 0; left: 0; overflow-x: scroll;
  .app-bg { width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: -100; opacity: 1; background-size: cover; background-repeat: no-repeat; transition: all .5s linear; }
  .app-content { width: 100%; height: 100%; overflow-y: scroll; position: relative;
    .piano-scroll-wrap { overflow: hidden; }
    .score-section { width: 100%; left: 25%; margin: 0 auto; position: relative; display: flex; align-items: center; justify-content: space-between; }
    .right-drawer { width: 500px; height: 100%; position: fixed; top: 0; right: -500px; z-index: 100; border-left: solid 1px #ccc; transition: all .3s ease-in-out;
      .trigger { width: 30px; height: 86px; font-size: 16px; text-align: center; padding-top: 7px;  position: absolute; top: 50%; left: -32px; background: @c-red; color: #fff; cursor: pointer; z-index: 101; }
      // .trigger::before { content: ''; width: 8px; height: 8px; background: #f00;; position: absolute; top: -2px; right: -2px; border-radius: 50%; }
      .close { width: 20px; height: 20px; line-height: 20px; text-align: center; position: absolute; top: 10px; right: 15px; background: @c-red; color: #fff; cursor: pointer; z-index: 101; }
      .component-manual-list { width: 100%; height: 100%; background: rgba(255, 255, 255, .9);  border-radius: 0; border: none;
        // .list-item a { color: #fff; }
      }
    }
    .right-drawer.show { right: 0; }
    .wkey { margin: 3px 3px !important; }
    .ctrller-wrap { left: 25%; }
    .piano-wrap { left: 25%; }
    .piano-options { left: 25%; }
    .skytitle {
      width: 900px;
      height: 96px;
      margin: 20px auto;
      -moz-background-size:100% 100%;
      background-size:100% 100%;
      background-image: url("../assets/images/skytitle.png");
    }
  }
  .hero-bkg-animated {
  background: gray url(../assets/images/congruent_pentagon.png) repeat 0 0;
  -webkit-animation: slide 60s linear infinite;
  }
  @-webkit-keyframes slide {
    from { background-position: 0 0; }
    to { background-position: 600px -600px; }
  }
}
</style>

<template>
  <div class="page-pc">
    <div class="app-bg hero-bkg-animated" ></div>

    <div class="app-content">
      <PageHeader></PageHeader>
      <div class="skytitle"></div>
      <!-- <RandomLyric></RandomLyric> -->
      <AutoPlayCtrller></AutoPlayCtrller>
      <Piano></Piano>
      <div class="score-section responsive-section-a">
        <!-- <ManualPlayScoreList></ManualPlayScoreList> -->
        <AutoPlayScoreList></AutoPlayScoreList>
      </div>
      <SheetShare></SheetShare>
      <!-- <div class="right-drawer" :class="{'show': rightDrawerShow}">
        <div class="trigger" @click="toggleRightDrawer">歌曲列表</div>
        <div class="close" @click="hideRightDrawer">X</div>
        <ManualPlayScoreList></ManualPlayScoreList>
      </div> -->
      <div class="blank-page-pc" style="height: 200px;"></div>
      <!-- <PageFooter></PageFooter> -->
    </div>

  </div>
</template>

<script>
import Observe from 'observe'

import PageHeader from '@/components/PageHeader'
import PageFooter from '@/components/Footer'
import RandomLyric from '@/components/RandomLyric'
import Piano from '@/components/Piano'
import ManualPlayScoreList from '@/components/ManualPlayScoreList'
import AutoPlayScoreList from '@/components/AutoPlayScoreList'
import AutoPlayCtrller from '@/components/AutoPlayCtrller'
import SheetShare from '@/components/SheetShare'


import { mapActions, mapGetters } from 'vuex'
import { OBEvent, Wallpaper } from '@/config'

export default {
  name: 'AutoPianoPC',
  components: {
    PageHeader,
    PageFooter,
    RandomLyric,
    Piano,
    ManualPlayScoreList,
    AutoPlayScoreList,
    AutoPlayCtrller,
    SheetShare,
  },
  data() {
    return {
      percent: 0,
      rightDrawerShow: false
    }
  },
  computed: {
		...mapGetters([
			'$currentWallpaper'
    ]),
    appBgStyle() {
      // return `background: gray url(../assets/images/floor-tile.png) repeat 0 0;`
      return `background: url(../../static/img/wheat.png) repeat 0 0;`
    }
  },
  mounted() {
    // setTimeout(() => {
    //   let winHeight = window.innerHeight
    //   document.documentElement.style.height = winHeight + 'px'
    // }, 0)
  },
  methods: {
    toggleRightDrawer() {
      this.rightDrawerShow = !this.rightDrawerShow
    },
    hideRightDrawer() {
      this.rightDrawerShow = false
    }
  }
}
</script>
