<style lang="less">
@import url('../assets/style/variable.less');
.sheet-import { width: 40%; min-width: 500px; padding-bottom: 50%; font-size: 14px; overflow: hidden; background: rgba(255, 255, 255, .6); border-radius: 5px; border: solid 1px #ddd; position: relative;}
</style>

<template>
    <div class="sheet-import">
    <input type="text" v-model="msg" placeholder="edit me">
    </div>
</template>

<script>
import Observe from 'observe'
import OBEvent from 'config'

export default {
  name: 'SheetImport',
  data() {
    return {
        msg: ''
    }
  },
  methods: {
  }
}
</script>