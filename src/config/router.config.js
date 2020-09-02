// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    // ccc: '000',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: [ 'dashboard' ] }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },

      // forms
      {
        path: '/api',
        redirect: '/api/api-test',
        component: RouteView,
        hidden: true,
        meta: { title: '接口测试', icon: 'api', permission: [ 'form' ] },
        children: [
          // {
          //   path: '/api/api-test',
          //   name: 'BaseForm',
          //   component: () => import('@/views/form/basicForm'),
          //   hideChildrenInMenu: true,
          //   meta: { title: '接口自动化', keepAlive: true, permission: [ 'form' ] },
          //   children: [
          //     {
          //       path: '/api/interface-list',
          //       name: 'Interface',
          //       component: () => import('@/views/form/basicForm/list'),
          //       hidden: true,
          //       meta: { title: '接口列表', keepAlive: false, permission: [ 'form' ] }
          //     },
          //     {
          //       path: '/api/interface-info',
          //       name: 'InterfaceInfo',
          //       component: () => import('@/views/form/basicForm/info'),
          //       hidden: true,
          //       meta: { title: '接口详情', keepAlive: false, permission: [ 'form' ] }
          //     },
          //     {
          //       path: '/api/case-list',
          //       name: 'case-list',
          //       component: () => import('@/views/form/basicForm/caseList'),
          //       hidden: true,
          //       meta: { title: '用例列表', keepAlive: false, permission: [ 'form' ] }
          //     },
          //     {
          //       path: '/api/case-info',
          //       name: 'case-info',
          //       component: () => import('@/views/form/basicForm/case_info'),
          //       hidden: true,
          //       meta: { title: '用例详情', keepAlive: false, permission: [ 'form' ] }
          //     }
          //   ]
          // }
        ]
      },

      // list
      {
        path: '/project',
        name: 'project',
        component: RouteView,
        redirect: '/project/project-list',
        meta: { title: '项目管理', icon: 'desktop', permission: [ 'table' ] },
        children: [
          {
            path: '/project/project-list',
            name: 'project-list',
            // hidden: true,
            component: () => import('@/views/list/ProjectList'),
            meta: { title: '项目列表', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/project/project-info',
            name: 'project-info',
            hidden: true,
            component: () => import('@/views/list/projectInfo'),
            meta: { title: '项目详情', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/project/report',
            name: 'report',
            hidden: true,
            component: () => import('@/views/list/reportList'),
            meta: { title: '报告中心', icon: 'project', permission: [ 'form' ] }
          },
          {
            path: '/project/report-detail',
            name: 'report-detail',
            hidden: true,
            component: () => import('@/views/list/reportdetail'),
            meta: { title: '报告详情', icon: 'dashboard', permission: [ 'form' ] }
          },
          {
            path: '/api/api-test',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm/index'),
            hidden: true,
            meta: { title: '接口自动化', keepAlive: true, permission: [ 'form' ] },
            children: [
              {
                path: '/api/interface-list',
                name: 'Interface',
                component: () => import('@/views/form/basicForm/list'),
                hidden: true,
                meta: { title: '接口列表', keepAlive: false, permission: [ 'form' ] }
              },
              {
                path: '/api/interface-info',
                name: 'InterfaceInfo',
                component: () => import('@/views/form/basicForm/info'),
                hidden: true,
                meta: { title: '接口详情', keepAlive: false, permission: [ 'form' ] }
              },
              {
                path: '/api/case-list',
                name: 'case-list',
                component: () => import('@/views/form/basicForm/caseList'),
                hidden: true,
                meta: { title: '用例列表', keepAlive: false, permission: [ 'form' ] }
              },
              {
                path: '/api/case-info',
                name: 'case-info',
                component: () => import('@/views/form/basicForm/case_info'),
                hidden: true,
                meta: { title: '用例详情', keepAlive: false, permission: [ 'form' ] }
              }
            ]
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        // hidden: true,
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: () => import('@/views/user/RestPassword')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
