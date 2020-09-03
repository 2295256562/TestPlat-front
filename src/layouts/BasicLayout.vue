<template>
  <pro-layout
    :title="title"
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :logo="logoRender"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <setting-drawer :settings="settings" @change="handleSettingChange" />
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
// import GlobalFooter from '@/components/GlobalFooter'
import LogoSvg from '../../public/logo.svg?inline'
import { asyncRouterMap } from '@/config/router.config.js'
// import { SET_ROUTERS } from '@/store/mutation-types'
// import BasicLayout from '@/layouts/BasicLayout'
// import Test from './test'
const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}
export const aaa = [
  {
    path: '/',
    name: 'index',
    component: RouteView,
    children: [
      {
        path: '/api/interface-list',
        name: 'Interface',
        component: () => import('@/views/form/basicForm/list'),
        hideInMenu: false,
        meta: { title: '接口测试', icon: 'api', permission: [ 'form' ] }
      },
      {
        path: '/api/interface-info',
        name: 'InterfaceInfo',
        component: () => import('@/views/form/basicForm/info'),
        hidden: true,
        // hideInMenu: false,
        meta: { title: '接口详情', keepAlive: false, permission: [ 'form' ] }
      },
      {
        path: '/project/report',
        name: 'report',
        hideInMenu: false,
        component: () => import('@/views/list/reportList'),
        meta: { title: '报告列表', icon: 'dashboard', permission: [ 'form' ] }
      },
      {
        path: '/project/project-info',
        name: 'project-info',
        hideInMenu: false,
        component: () => import('@/views/list/projectInfo'),
        meta: { title: '项目详情', icon: 'project', permission: [ 'form' ] }
      }
    ]
  }
]
export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent
    // GlobalFooter
  },
  data () {
    return {
      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // 定宽: true / 流式: false
        contentWidth: defaultSettings.layout === 'sidemenu' ? false : defaultSettings.contentWidth === 'Fixed',
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.routers,
      topMenu: state => state.router.routers
    })
  },
  watch: {
    '$route': {
      immediate: true,
      deep: true,
      handler (v) {
        // console.log(v, '========', this.mainMenu, 'xxxxxxx')
        if (v.path === '/api/interface-info' || v.path === '/project/project-info' || v.path === '/api/interface-list' || v.path === '/project/report' || v.path === '/project/report-detail' || v.path === '/api/interface-info' || v.path === '/api/case-list' || v.path === '/api/case-info') {
          this.$store.commit('SET_ROUTERS', aaa)
        } else {
          this.$store.commit('SET_ROUTERS', asyncRouterMap)
        }
      }
    },
    mainMenu: {
      immediate: true,
      deep: true,
      handler (v) {
        this.menus = this.mainMenu.find((item) => item.path === '/').children
      }
    }
  },

  created () {
    // const routes = this.mainMenu.find(item => item.path === '/')
    console.log(asyncRouterMap)

    // this.menus = this.topMenu.find((item) => item.path === '/').children
    // this.menus = (routes && routes.children) || []
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    // first update color
    updateTheme(this.settings.primaryColor)
  },
  methods: {
    i18nRender,
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = false
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value === 'Fixed'
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = false
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = true
          }
          break
      }
    },
    logoRender () {
      return <LogoSvg />
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
