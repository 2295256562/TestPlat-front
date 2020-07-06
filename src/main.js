// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import JsonView from 'vue-json-viewer'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import CodeEditor from 'bin-code-editor'
import { AutoComplete } from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// import 'bin-code-editor/lib/style/index.css'
// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
// import './permission' // permission control
import './utils/filter' // global filter
import './global.less'

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(CodeEditor)
Vue.use(VueAxios)
Vue.use(JsonView)
Vue.use(VueCodemirror)
Vue.use(AutoComplete)
// Vue.use(Antd)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
