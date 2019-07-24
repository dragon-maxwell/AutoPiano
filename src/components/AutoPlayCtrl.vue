<style lang="less">
@import url('../assets/style/variable.less');
.component-autoplay-contrl { width: 100%; min-height: 40px; padding: 5px 0; margin: 0 auto; text-align: center;
  .lyric { display: inline; line-height: 30px; font-size: 18px; font-style: italic; color: @c-blue-d; cursor: pointer; text-shadow: 2px 2px 8px #fff;
    &:hover { color: @c-blue; }
  }
}
</style>

<template>
  <div class="component-autoplay-contrl">
    <!--外层容器-->
    <div id="wrapper">
        <!--填充块-->
        <div id="fill"></div>
        <!--滑块-->
        <div id="progressSlider"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutoPlayCtrl',
  data() {
    return {
    }
  },
  computed: {},
  mounted() {
  },
  beforeDestroy() {
  },
  watch: {},
  methods: {
    
  }
}
</script>
