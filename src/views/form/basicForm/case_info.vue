<template>
  <a-card :body-style="{ padding: '24px 32px', min_height: '80vh'}" :bordered="true">
    <div>
      <div style="display: flex">
        <a-input v-model="name" style="width: 80%;font-size: 18px" />
        <a @click="linkInterface(interface_id)" style="line-height: 32px;margin-left: 20px">对应接口</a>
      </div>
      <div style="dispaly:flex; margin-top: 20px">
        <div style="float:left;width:70%">
          <a-input v-model="interface_url" disabled>
            <a-select slot="addonBefore" v-model="method" style="width: 90px;background-color: #c8c8c8;color: #333333">
              <a-select-option value="GET">
                GET
              </a-select-option>
              <a-select-option value="POST">
                POST
              </a-select-option>
              <a-select-option value="PUT">
                PUT
              </a-select-option>
              <a-select-option value="DELETE">
                DELETE
              </a-select-option>
            </a-select>
            <a-select slot="addonBefore" style="width: 300px;margin-left:14px" v-model="envinfo" @change="handleChangeEnv">
              <a-select-option v-for="it in envList" :key="it.id" :value="it.id">
                {{ it.name + '  ' + it.address }}
              </a-select-option>
            </a-select>
          </a-input>
        </div>
        <div style="flex: 1">
          <a-button type="primary" style="margin-left:20px" @click="HandleSendRequest">
            调试
          </a-button>
          <a-button type="primary" style="margin-left:20px" @click="handleUpdateTest">
            更新
          </a-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <a-collapse v-model="activeKey1" expand-icon-position="left">
          <a-collapse-panel key="1" header="请求参数" class="icon" style="background-color: #CFCFCF">
            <div v-if="this.request_type === 'form'">
              <div v-for="(it, index) in paramters" :key="index" style="display:flex; margin: 8px 0">
                <a-input placeholder="参数名" v-model="it.key" style="width: 30%;" disabled />
                <span style="line-height: 32px;margin: 0 20px">=</span>
                <div style="margin-bottom: 16px;width: 100%">
                  <a-input placeholder="参数值" v-model="it.value" style="width: 100%;margin-right: 10px">
                    <a-icon slot="addonAfter" type="form" @click="HandleShowModal" />
                  </a-input>
                </div>
              </div>
            </div>
            <div v-if="this.request_type === 'json'">
              <b-code-editor v-model="paramters" :auto-format="false" ref="editor" />
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="请求头部" class="icon" style="background-color: #CFCFCF">
            <div v-for="(it, index) in headerList" :key="index" style="display:flex;padding-bottom: 8px;">
              <a-input placeholder="key" v-model="it.key" style="width: 30%" />
              <span style="line-height: 32px; margin: 0px 10px">=</span>
              <a-input placeholder="value" v-model="it.value" />
            </div>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="参数校验" class="icon" style="background-color: #CFCFCF">
            <a-tabs v-model="checkType">
              <a-tab-pane key="data" tab="响应断言">
                <a-textarea
                  placeholder="请输入响应断言"
                  :auto-size="{ minRows: 4, maxRows: 20 }"
                  v-model="validate_data"
                />
              </a-tab-pane>
              <a-tab-pane key="jsonpath" tab="JsonPath断言">
                <div v-for="(it, index) in jsonpathList" :key="index" style="display:flex; margin: 8px 0px">
                  <a-input placeholder="断言点描述" v-model="it.desc" style="width: 25%;margin-right: 10px"/>
                  <a-input placeholder="定义规则 jsonpath表达式" v-model="it.regulation" style="width: 30%;margin-right: 10px" />
                  <a-select placeholder="对比方式" v-model="it.manner" style="width: 15%; margin-right: 10px" @change="handleMannerChange">
                    <a-select-option v-for="item in mannerList" :key="item.type">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <a-input placeholder="预期值" v-model="it.expected" style="width: 20%"/>
                  <a-icon @click="handleDelJsonpath(index)" type="delete" class="icon-sty" />
                  <a-icon type="plus-circle" v-if="index===(jsonpathList.length-1)" class="icon-sty" @click="handleAddJsonPath" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-collapse-panel>
          <a-collapse-panel key="4" header="参数提取" class="icon" style="background-color: #CFCFCF">
            <a-tabs v-model="extract_type" @change="callbackExtract">
              <a-tab-pane v-for="item in options" :key="item.value" :tab="item.label">
                <div v-if="item.value != 'no'">
                  <div v-for="(it, index) in extractList" :key="index" style="display:flex; margin: 8px 0">
                    <a-input placeholder="定义变量名称" v-model="it.name" style="width: 40%;"/>
                    <span style="line-height: 32px;margin: 0 20px">=</span>
                    <a-input placeholder="变量提取表达式" v-model="it.value" style="width: 48%;margin-right: 10px"/>
                    <a-icon type="delete" @click="handleDeleteextractList(index)" class="icon-sty" />
                    <a-icon type="plus-circle" v-if="index===(extractList.length-1)" @click="handleAddextractList" class="icon-sty" />
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div style="margin-top: 20px">
        <a-tabs default-active-key="1" style="margin-top: 20px;">
          <a-tab-pane key="1" tab="Response">
            <div style="width: 100%;height: 32px;background-color: #32CD32; margin-bottom: 10px;line-height:32px;color: #FFFAF0;padding-left:20px;font-size:16px" v-if="response_code !== null && response_code === 200">{{ response_code }} OK</div>
            <div style="display: flex">
              <div style="float: left; width: 36%;">
                <div style="font-size: 18px;margin: 6px">Headers</div>
                <json-viewer
                  :value="response_header"
                  :expand-depth="5"
                  copyable
                  boxed
                  sort
                  style="min-height: 300px;margin-right: 20px">
                </json-viewer>
              </div>
              <div style="flex: 1">
                <div style="font-size: 18px;margin: 6px">Response</div>
                <json-viewer
                  :value="response_data"
                  :expand-depth="5"
                  copyable
                  boxed
                  sort
                  style="min-height: 300px;">
                </json-viewer>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Test">
            <div v-for="item in test_data" :key="item">{{ item }}</div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <modelsss :visible="visible" @visible="visible=false"></modelsss>
  </a-card>
</template>

<script>
import { Collapse } from 'ant-design-vue'
import { caseInfo, debugtestCase, EnvList, updateApicase } from '@/api/interface'
import modelsss from '../../../components/User/modfiyPasswordDialog'

import Vue from 'vue'
Vue.use(Collapse)
const typeList = ['string', 'number', 'float', 'bool']
const mannerList = [
  { name: '值等于=', type: '=' },
  { name: '值不等于', type: '!=' },
  { name: '值包含', type: 'in' },
  { name: '值不包含', type: 'not in' }
]
const options = [
  { label: '不提取', value: 'no' },
  { label: 'jsonpath提取', value: 'jsonpath' }
  // { label: '正则提取', value: 'regx' }
]
export default {
  // name: 'case_info',
  components: {
    modelsss
  },
  data () {
    return {
      typeList,
      mannerList,
      options,
      visible: false,
      id: null,
      activeKey1: ['1', '2', '3', '4'],
      checkType: '',
      data: [],
      name: '',
      method: '',
      interface_url: '',
      interface_id: null,
      apiId: '',
      jsonpathList: [{ regulation: '', manner: '', expected: null, desc: '' }],
      paramters: [{ key: '', type: undefined, value: '', desc: '' }],
      request_type: '',
      headerList: [{ key: '', value: '' }],
      extractList: [{ name: '', value: '' }],
      validate_data: '',
      extract_type: '',
      response_code: null,
      response_data: '',
      response_header: '',
      test_data: [],
      envList: [],
      projectId: localStorage.getItem('project_id'),
      envinfo: '',
      envId: null
    }
  },
  created () {
    this.id = this.$route.query.case
    this.HandleGetEnvList(this.projectId)
  },
  watch: {
    activeKey1 (key) {
      console.log(key)
    },
    '$route': {
      immediate: true,
      deep: true,
      handler (v) {
        this.HandleGetCaseInfo(v.query.case)
        this.id = v.query.case
      }
    }
  },
  methods: {
    callback (key) {
      console.log(key)
    },

    // 获取用例详情
    async HandleGetCaseInfo (id) {
      const res = await caseInfo(id)
      console.log(res, 'res')
      this.envinfo = res.data.env
      this.method = res.data.interface_method
      this.interface_url = res.data.interface_url
      this.interface_id = res.data.interface
      this.name = res.data.name
      this.apiId = res.data.interface
      this.checkType = res.data.checkType
      this.jsonpathList = this.checkType === 'jsonpath' ? res.data.check : [{ regulation: '', manner: '', expected: undefined, desc: '' }]
      this.validate_data = this.checkType === 'data' ? res.data.check : ''
      this.headerList = res.data.env_headers
      this.request_type = res.data.request_type
      this.paramters = this.request_type === 'form' ? res.data.parameter : JSON.stringify(res.data.parameter, null, 2)
      this.extract_type = res.data.extract_type
      this.extractList = this.extract_type === 'jsonpath' ? res.data.extract : [{ name: '', value: '' }]
    },

    // 发送用例
    HandleSendRequest () {
      const obj = {
        'case_id': this.id
      }
      debugtestCase(obj).then(res => {
        console.log(res.data, 'data')
        this.response_data = JSON.parse(res.data.responseData)
        this.response_header = res.data.request_headers
        this.test_data = JSON.parse(res.data.testCaseDetail.checkRecord)
      })
    },

    // 更新测试用例
    async handleUpdateTest () {
      const obj = {
          'checkType': this.checkType,
          'check': this.validate_type === 'data' ? this.validate_data : this.jsonpathList,
          'env': this.envinfo,
          'parameter': this.request_type === 'form' ? this.parameter : JSON.parse(this.paramters.replace(/[\r\n]/g, '').replace(/ +/g, '')),
          'interface': this.apiId,
          'extract': this.extract_type === 'jsonpath' ? this.extractList : null,
          'name': this.name,
          'case_id': this.id
        }
      const res = await updateApicase(obj)
      this.$message.success(res.data)
    },

    // 对接接口点击事件
    linkInterface (id) {
      console.log(id, 'iiii')
      this.$router.push({ path: '/api/interface-info', query: { 'apiId': id } })
    },

    // 新建jsonpath断言
    handleAddJsonPath () {
      this.jsonpathList.push(
          { regulation: '', manner: undefined, expected: '', desc: '' }
      )
    },

    // 删除jsonpath断言
    handleDelJsonpath (index) {
      this.jsonpathList.splice(index, 1)
      if (this.jsonpathList.length === 0) {
        this.jsonpathList.push({ regulation: '', manner: undefined, expected: '', desc: '' })
      }
    },

    // 添加extractList参数
    handleAddextractList () {
      this.extractList.push(
        { name: '', value: '' }
      )
    },
    // 删除extractList参数
    handleDeleteextractList (index) {
      this.extractList.splice(index, 1)
      if (this.extractList.length === 0) {
        this.extractList.push({ name: '', value: '' })
      }
    },

    // extract tab 回调
    callbackExtract (key) {
      this.extract_type = key
    },

    // 对比方式change事件
    handleMannerChange (value) {
      console.log(value)
    },

    // 打开modal
    HandleShowModal () {
      console.log('modelVisible', !this.visible)
      this.$nextTick(() => {
        console.log('123344')
        this.visible = !this.visible
      })
    },

    // 获取当前项目的所有环境
    HandleGetEnvList () {
      EnvList(this.projectId).then(res => {
        console.log(res.data)
        this.envList = res.data
      })
    },

    // 环境下拉框
    handleChangeEnv (value) {
      const it = this.envList.find(it => it.id === value)
      this.headerList = it.headers
      this.envinfo = it.method + it.address
      this.envId = it.id
    }
  }
}
</script>

<style scoped>
.icon-sty {
  font-size: 16px;
  line-height: 32px;
  margin: 0px 6px;
}
</style>
