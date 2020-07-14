import BasicLayout from '@/layouts/BasicLayout'
// import Test from './test'
const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}
const aaa = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    children: [
      {
        path: '/cc',
        redirect: '/cc/api-test',
        component: RouteView,
        hideInMenu: false,
        meta: { title: '接口测试11', icon: 'api', permission: [ 'form' ] },
        children: [
          {
            path: '/cc/api-test',
            name: 'BaseForm',
            component: () => import('./test'),
            hideChildrenInMenu: true,
            meta: { title: '接口自动化', keepAlive: true, permission: [ 'form' ] }
          }
        ]
      }
    ]
  }
]
// /**
//  * 向后端请求用户的菜单，动态生成路由
//  */
// const aaa = [
//   {
//     path: '/',
//     name: 'index',
//     component: BasicLayout,
//     meta: { title: 'menu.home' },
//     redirect: '/dashboard/workplace',
//     children: [

//       // profile
//       {
//         path: '/api',
//         redirect: '/api/api-test',
//         component: <Test />,
//         hideInMenu: true,
//         meta: { title: '接口测试', icon: 'api', permission: [ 'form' ] }
//       }
// ]
//   }
// ]
// // import { generatorDynamicRouter } from '@/router/generator-routers'

const router = {
  state: {
    routers: aaa,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    // GenerateRoutes ({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { token } = data
    //     generatorDynamicRouter(token).then(routers => {
    //       commit('SET_ROUTERS', routers)
    //       resolve()
    //     })
    //   })
    // }
  }
}

export default router
