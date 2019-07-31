// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import SweetModal from 'sweet-modal-vue/src/plugin.js'
// // 添加Fastclick移除移动端点击延迟
// import FastClick from 'fastclick'
// //FastClick的ios点击穿透解决方案
// FastClick.prototype.focus = function (targetElement) {
//     let length;
//     if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
//         length = targetElement.value.length;
//         targetElement.focus();
//         targetElement.setSelectionRange(length, length);
//     } else {
//         targetElement.focus();
//     }
// };
// FastClick.attach(document.body)

Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
Vue.use(SweetModal)
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   template: '<App/>',
//   components: { App }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app', true)

