import $axios from '../api/axiosRequest'
import axios from '@/utils/request'
import qs from 'qs'

// 登陆
// export const login = params => { return axios({ method:'post', url:'/login/', data: params }) };
export const login = params => {
  return axios.post('login/', params)
}

// 注册
export const register = params => {
  return axios.post('reg/', params)
}

// 数据表
export const Datareport = params => {
  return $axios.get('count/')
}

// 添加项目
export const addProject = params => {
  return axios({ method: 'post', url: 'add_project/', data: params })
}

// 项目列表
export const projectList = params => {
  return axios({ method: 'get', url: 'project_list/' })
}

// 项目详情
export const projectInfo = params => {
  return axios({ method: 'get', url: '/project_info/' + params })
}

// 项目修改
export const updateProject = (id, params) => {
  return axios({ method: 'put', url: `/update_project/${id}/`, data: params })
}

// 项目删除
export const Delproject = params => {
  return $axios({ method: 'delete', url: '/del/' + params })
}

// 项目搜索
export const seachProject = params => {
  return $axios({ method: 'get', url: '/project_list/?search=' + params })
}

// 项目列表
export const sourceprojectList = params => {
  return $axios({ method: 'get', url: '/ListProject' })
}

// 添加模块
export const addModel = params => {
  return axios({ method: 'post', url: 'AddModel', data: params })
}

// 模块列表
export const modelList = params => {
  return $axios.get('modelList?page=' + params)
}

// 删除模块
export const delModel = params => {
  return $axios.delete('delMod/' + params)
}

// 模块详情
export const modelInfo = params => {
  return $axios.get('modelInfo/' + params)
}

// 调试接口用例
export const SendInterface = params => {
  return axios.post('send/', params)
}

// 通过项目id查询所有模块
export const allModel = params => {
  return axios.get('allModel/' + params)
}

// 接口测试用例保存
export const addApiCase = params => {
  return $axios.post('addApiCase', params)
}

// 接口列表
export const ListApicase = params => {
  return $axios.get('ListApicase?page=' + params)
}

// 接口用例搜索
export const searchCase = params => {
  return $axios.get('ListApicase/', { params })
}

// 接口详情 InterfaceInfo/{id}/
export const apicaseInfo = params => {
  return axios.get('GpInterface/' + params)
}

// 接口用例多选
export const listAPiInter = params => {
  return $axios.get('caselist/', {
    params: { id: params },
      paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 搜索请求头
export const filterHeader = params => { return $axios.get('Filterheader/search/?=' + params) }

// 执行测试任务
export const runCase = params => {
  return axios.post('run/', params)
}

// 用例搜索接口
export const search = params => { return $axios.get('ListApicase/?search=' + params) }

// 接口用例修改
export const updateCase = params => { return axios.put('updateCase/' + params.id, params) }

// 请求头列表
export const headerslist = params => { return $axios.get('headerslist/page=' + params) }

// 请求头详情
export const headersinfo = params => { return $axios.get('headersinfo/' + params) }

// 报告列表
export const reportlist = params => { return axios.get('reportList/?page=' + params.page + '&project_id=' + params.project_id) }

// 报告详情
export const reportinfo = params => { return axios.get('report_detail/?number=' + params) }
export const report = params => { return axios.get('report/?number=' + params) }

// 报告case详情
export const caseReport = params => { return $axios.get('caseReport/?case_report=' + params) }

// 添加定时任务
export const addTimeTask = params => { return $axios.post('addTimeTask/', params) }

// 定时任务列表
export const TimeTaskList = params => { return $axios.get('TimeTaskList?page=' + params) }

// 任务详情
export const TaskInfo = params => { return $axios.get('TaskInfo/' + params) }

export const API = params => { return axios.get('apilist/') }

// 接口table
export const tablist = params => { return $axios.get('ListApiTab/project=' + params.project + '&tag=' + params.tag) }

// 获取接口数据
export const Getapi = params => { return $axios.get('get_api/' + params) }

// 获取接口列表
export const InterfaceList = params => { return axios.get(`InterfaceList/?project_id=${params}`) }

// 添加接口
export const AddInterface = params => { return axios.post('add_api/', params) }

// token配置
export const setToken = params => { return axios.post('set_token/', params) }

// 各项目接口列表
export const projectInterList = params => {
  const str = params.modelId ? `&model=${params.modelId}` : ''
  return axios.get('List/?' + 'project=' + params.projectId + '&page=' + params.page + str)
}

// 编辑interface
export const UpInter = params => { return axios.post('UpInterface/', params) }

// 获取当前项目的所有环境
export const EnvList = params => { return axios.get('list_env/' + params) }

// 添加项目环境
export const AddEnv = params => { return axios.post('add_env/', params) }

// 删除项目环境
export const DelEnv = params => { return axios.post('del_env/', params) }

// 用例集合列表
export const rallyList = params => { return axios.get(`rally_list/?project_case=${params}`) }

// 添加测试集合
export const AddRally = params => { return axios.post('add_rally/', params) }

// 添加测试用例
export const addCase = params => { return axios.post('add_case/', params) }

// 用例列表
export const caseList = params => {
  const str = params.caseModel ? `&case_model=${params.caseModel}` : ''
  return axios.get('case_list/?' + '&page=' + params.page + str)
}

// 自动获取token
export const autoToken = params => { return axios.post('auto_token/', params) }

// swagger
export const swagger = params => { return axios.post('swagger/', params) }
