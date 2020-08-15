<template>
  <div style="min-height: 80vh">
    <a-card :body-style="{ padding: '24px 32px', height: '100%'}" :bordered="true">
      <a-tabs default-active-key="1" @change="callback" style="height: 100%">
        <a-tab-pane key="1" tab="预览">
          <div style="display:flex">
            <div class="head" style="float:left"></div>
            <div class="font">基本信息</div>
          </div>
          <div class="info">
            <div>接口名称：{{ apiName }}</div>
            <div>接口路径：
              <a-tag color="MediumAquamarine" v-if="apiMethod === 'GET'">
                {{ apiMethod }}
              </a-tag>
              <a-tag color="DeepSkyBlue" v-if="apiMethod === 'POST'">
                {{ apiMethod }}
              </a-tag>
              {{ apiAddr }}</div>
            <div>tag：{{ apiTag }}</div>
            <div>创建时间：{{ apiTime }}</div>
            <div>创建人员：{{ apiUser }}</div>
          </div>
          <div style="display:flex;margin-top:30px">
            <div class="head" style="float:left"></div>
            <div class="font">请求信息</div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="编辑" force-render>
          <div style="display: flex;">
            <div style="width: 5px;height: 40px;background-color: #00CDCD"></div>
            <div class="font">基础设置</div>
          </div>
          <div style="height:200px; background-color:Gainsboro;margin-top:10px">
            <a-form
              :form="form"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }"
              @submit="handleSubmit"
            >
              <a-form-item label="接口名称">
                <a-input
                  placeholder="请输入接口名称"
                  v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                />
              </a-form-item>
              <a-form-item label="接口分类">
                <a-select
                  v-decorator="[
                    'model',
                    { rules: [{ required: true, message: '分类必填!' }] },
                  ]"
                  placeholder="请选择分类"
                  @change="handleSelectChange"
                >
                  <a-select-option v-for="item in classfiyList" :key="item.id" :value="item.id">{{ item.model_name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="接口路径">
                <a-input
                  placeholder="请输入接口地址"
                  v-decorator="[
                    'url',
                    {
                      rules: [{ required: true, message: 'Please input your phone number!' }],
                    },
                  ]"
                  style="width: 100%"
                >
                  <a-select
                    slot="addonBefore"
                    v-decorator="['method', { initialValue: 'GET' }]"
                    style="width: 90px"
                  >
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
                </a-input>
              </a-form-item>
            </a-form>
          </div>
          <div style="display: flex; margin-top:10px">
            <div style="width: 5px;height: 40px;background-color: #00CDCD"></div>
            <div class="font">请求参数设置</div>
          </div>
          <div style="margin-top: 10px;margin-left:40%">
            <a-radio-group v-model="Reqvalue" button-style="solid" @change="onChange">
              <a-radio-button value="query" v-if="this.form.getFieldValue('method') === 'GET' ">
                Query
              </a-radio-button>
              <a-radio-button value="body" >
                Body
              </a-radio-button>
              <a-radio-button value="headrs">
                Headrs
              </a-radio-button>
            </a-radio-group>
          </div>
          <div style="margin-top:10px;background-color:Gainsboro;height:auto;padding-left:14%">
            <div v-if="this.Reqvalue === 'body'">
              <a-radio-group style="margin:8px" v-model="BodyValue" @change="onChangeBody">
                <a-radio value="form">
                  form
                </a-radio>
                <a-radio value="raw">
                  raw
                </a-radio>
              </a-radio-group>
              <div v-if="this.BodyValue === 'form'">
                <a-button type="primary" style="margin:8px" @click="handleAddForm">
                  添加form参数
                </a-button>
                <div v-for="(item, index) in formList" :key="index" style="display:flex;margin-left:8px;padding-bottom: 8px;">
                  <a-input v-model="item.key" placeholder="参数" style="width:20%" />
                  <a-select v-model="item.type" default-value="string" placeholder="类型" style="width: 120px" @change="handleChange">
                    <a-select-option v-for="em in typeList" :value="em" :key="em">
                      {{ em }}
                    </a-select-option>
                  </a-select>
                  <a-input v-model="item.value" placeholder="参数示例" style="width:30%" />
                  <a-input v-model="item.desc" placeholder="备注" style="width:20%" />
                  <a-icon v-if="formList.length >1" type="delete" style="line-height: 30px;font-size: 20px;padding-left: 10px;" @click="DeleteForm(index)"/>
                </div>
              </div>
              <div v-if="this.BodyValue === 'raw'">
                <b-code-editor v-model="jsonStr" :auto-format="false" ref="editor" />
                <!-- <json-editor ref="jsonEditor" v-model="value"/> -->
              </div>
            </div>
            <div v-if="this.Reqvalue === 'query'">
              <a-button type="primary" style="margin:8px" @click="handleAddQuery">
                添加query参数
              </a-button>
              <div v-for="(item, index) in queryList" :key="index" style="display:flex;margin-left:8px;padding-bottom: 8px;">
                <a-input v-model="item.key" placeholder="参数" style="width:20%" />
                <a-select v-model="item.type" default-value="string" style="width: 120px" @change="handleChange" placeholder="类型">
                  <a-select-option v-for="qt in typeList" :key="qt">
                    {{ qt }}
                  </a-select-option>
                </a-select>
                <a-input v-model="item.value" placeholder="参数示例" style="width:30%" />
                <a-input v-model="item.desc" placeholder="备注" style="width:20%" />
                <a-icon v-if="queryList.length >1" type="delete" style="line-height: 30px;font-size: 20px;padding-left: 10px;" @click="Delete(index)"/>
              </div>
            </div>
          </div>
          <a-button type="primary" style="margin-left: 40%;margin-top: 20px;" html-type="submit" @click="handleSubmit">
            Submit
          </a-button>
        </a-tab-pane>
        <a-tab-pane key="3" tab="运行">
          <div style="dispaly:flex">
            <div style="float:left;width:74%">
              <a-input v-model="apiAddr">
                <a-select slot="addonBefore" v-model="apiMethod" style="width: 90px;background-color: #c8c8c8;color: #333333">
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
                发送
              </a-button>
              <a-button type="primary" style="margin-left:20px" @click="handleAddTest">
                保存
              </a-button>
            </div>
          </div>
          <div style="margin-top: 20px">
            <a-collapse v-if="this.apiMethod === 'GET'" v-model="act" expand-icon-position="right">
              <a-collapse-panel key="1" header="Query" class="icon" style="background-color: #c8c8c8">
                <div v-for="(item, index) in queryList" :key="index" style="display:flex;margin-left:8px;padding-bottom: 8px;">
                  <a-input v-model="item.key" placeholder="参数" style="width:30%;margin-right: 10px" />
                  <!-- <a-select v-model="item.type" placeholder="类型" style="width: 120px;margin-right: 10px" @change="handleChange" >
                    <a-select-option v-for="qt in typeList" :key="qt">
                      {{ qt }}
                    </a-select-option>
                  </a-select> -->
                  <span style="margin-right:10px;line-height: 32px;"> = </span>
                  <a-input v-model="item.value" placeholder="参数示例" style="width:40%;margin-right: 10px" />
                  <!-- <a-input v-model="item.desc" placeholder="备注" style="width:20%;margin-right: 10px" /> -->
                  <a-icon v-if="queryList.length >1" type="delete" style="line-height: 30px;font-size: 20px;padding-left: 10px;margin-right: 10px" @click="Delete(index)"/>
                </div>
                <a-icon slot="extra" type="setting" @click="handleClick"/>
              </a-collapse-panel>
            </a-collapse>
            <a-collapse v-if="this.BodyValue === 'form' && this.apiMethod === 'POST'" expand-icon-position="right">
              <a-collapse-panel key="1" header="Form" class="icon" style="background-color: #CFCFCF">
                <div v-for="(item, index) in formList" :key="index" style="display:flex;margin-left:8px;padding-bottom: 8px;">
                  <a-input v-model="item.key" placeholder="参数" style="width:20%;margin-right: 10px" />
                  <!-- <a-select v-model="item.type" placeholder="类型" style="width: 120px;margin-right: 10px" @change="handleChange" >
                    <a-select-option v-for="qt in typeList" :key="qt">
                      {{ qt }}
                    </a-select-option>
                  </a-select> -->
                  <a-input v-model="item.value" placeholder="参数示例" style="width:30%;margin-right: 10px" />
                  <!-- <a-input v-model="item.desc" placeholder="备注" style="width:20%;margin-right: 10px" /> -->
                  <a-icon v-if="queryList.length >1" type="delete" style="line-height: 30px;font-size: 20px;padding-left: 10px;margin-right: 10px" @click="Delete(index)"/>
                </div>
                <a-icon slot="extra" type="setting" @click="handleClick"/>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <div style="margin-top: 20px">
            <a-collapse v-if="this.BodyValue === 'raw' && this.apiMethod === 'POST'" expand-icon-position="right">
              <a-collapse-panel key="1" header="Json" class="icon" style="background-color: #CFCFCF">
                <b-code-editor v-model="jsonStr" :auto-format="false" ref="editor" />
              </a-collapse-panel>
            </a-collapse>
          </div>
          <div style="margin-top: 20px">
            <a-collapse expand-icon-position="right">
              <a-collapse-panel key="1" header="Header" class="icon" style="background-color: #CFCFCF">
                <div v-for="(it, index) in headerList" :key="index" style="display:flex;padding-bottom: 8px;">
                  <a-input placeholder="key" v-model="it.key" style="width: 30%" />
                  <span style="line-height: 32px; margin: 0px 10px">=</span>
                  <a-input placeholder="value" v-model="it.value" />
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <!-- <a-tabs default-active-key="setUp" style="margin-top: 30px;">
            <a-tab-pane key="setUp" tab="前置">
              <div style="display: flex">
                <div style="float: left;font-size: 16px;">前置SQL：</div>
                <div style="flex: 1">
                  <SqlEditor ref="sqleditor" :value="basicInfoForm.beforeSql" @changeTextarea="changeTextarea($event)"/>
                  <a-button type="primary" size="small" class="sql-btn" @click="formaterSql (basicInfoForm.sqlMain)">格式化sql</a-button>
                </div>
              </div>
              <div style="display: flex;margin-top: 20px">
                <div style="width: 80px;line-height: 32px;font-size: 16px;">前置用例：</div>
                <a-input placeholder="请输入前置用例" v-model="rely" style="width: 80%"/>
              </div>
            </a-tab-pane>
            <a-tab-pane key="tearDown" tab="后置">
              <div style="display: flex">
                <div style="float: left;font-size: 16px;">前置SQL：</div>
                <div style="flex: 1">
                  <SqlEditor ref="sqleditor" :value="basicInfoForm.afterSql" @changeTextarea="changeTextarea($event)"/>
                  <a-button type="primary" size="small" class="sql-btn" @click="formaterSql (basicInfoForm.sqlMain)">
                    格式化sql
                  </a-button>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs> -->
          <!-- extract 参数提取 -->
          <a-tabs :default-active-key="extract" @change="callbackExtract" style="margin-top: 20px">
            <a-tab-pane v-for="item in options" :key="item.value" :tab="item.label">
              <div v-if="item.value != 'no'">
                <div v-for="(it, index) in extractList" :key="index" style="display:flex; margin: 8px 0">
                  <a-input placeholder="定义变量名称" v-model="it.name" style="width: 40%;"/>
                  <span style="line-height: 32px;margin: 0 20px">=</span>
                  <a-input placeholder="变量提取表达式" v-model="it.value" style="width: 55%;margin-right: 10px"/>
                  <a-icon type="plus-circle" @click="handleAddextractList" class="icon-sty" />
                  <a-icon type="minus-circle" @click="handleDeleteextractList(index)" class="icon-sty" />
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
          <!--validate-->
          <a-tabs default-active-key="data" @change="callbackValidate" style="margin-top: 30px;">
            <a-tab-pane key="data" tab="响应断言">
              <a-textarea
                placeholder="请输入响应断言"
                :auto-size="{ minRows: 4, maxRows: 20 }"
                v-model="validate_data"
              />
            </a-tab-pane>
            <a-tab-pane key="jsonpath" tab="jsonpath断言">
              <div v-for="(it, index) in jsonpathList" :key="index" style="display:flex; margin: 8px 0px">
                <a-input placeholder="断言点描述" v-model="it.desc" style="width: 25%;margin-right: 10px"/>
                <a-input placeholder="定义规则 jsonpath表达式" v-model="it.regulation" style="width: 30%;margin-right: 10px" />
                <a-select v-model="it.manner" style="width: 15%; margin-right: 10px" @change="handleChange" placeholder="对比方式">
                  <a-select-option v-for="item in mannerList" :key="item.type">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
                <a-input placeholder="预期值" v-model="it.expected" style="width: 26%"/>
                <a-icon type="plus-circle" class="icon-sty" @click="handleAddJsonPath" />
                <a-icon v-if="jsonpathList.length >1" @click="handleDelJsonpath(index)" type="delete" class="icon-sty" />
              </div>
            </a-tab-pane>
          </a-tabs>
          <!--respnse-->
          <a-tabs default-active-key="1" style="margin-top: 30px;">
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
          </a-tabs>
        </a-tab-pane>
        <a-modal v-model="Testvisible" title="保存测试用例" @ok="handleOk">
          <a-form :form="Testform" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="用例名称">
              <a-input
                placeholder="请输入测试用例名称"
                v-decorator="['name', { rules: [{ required: true, message: '请填写用例名称' }] }]"
              />
            </a-form-item>
            <a-form-item label="用例集合" has-feedback>
              <a-select
                v-decorator="['case_model',{ rules: [{ required: true, message: '请选择测试用例集合' }] },]"
                placeholder="请选择测试集合"
              >
                <a-select-option v-for="item in TestModelList" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
// import Vue from 'vue'
import JsonEditor from '@/views/form/basicForm/json.vue'
import sqlFormatter from 'sql-formatter'
import SqlEditor from '@/views/form/basicForm/Sqleditor'
// import VJsoneditor from 'v-jsoneditor/src/index'
import { allModel, apicaseInfo, UpInter, EnvList, SendInterface, rallyList, addCase } from '@/api/interface'
import { Collapse } from 'ant-design-vue'
import Vue from 'vue'
import TagSelectOption from '../../../components/TagSelect/TagSelectOption'
Vue.use(Collapse)
const jsonData = `{}`
const typeList = ['string', 'number', 'float', 'bool']
const mannerList = [
  { name: '值等于=', type: '=' },
  { name: '值不等于', type: '!=' },
  { name: '值包含', type: 'in' },
  { name: '值不包含', type: 'not in' }
]
const options = [
  { label: '不提取', value: 'no' },
  { label: 'jsonpath提取', value: 'jsonpath' },
  { label: '正则提取', value: 'regx' }
]
// Vue.use(VJsoneditor)
export default {
  components: {
    TagSelectOption,
    JsonEditor,
    SqlEditor,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data () {
    return {
      basicInfoForm: { beforeSql: '', afterSql: '' },
      jsonEditor: false,
      Testvisible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      Testform: this.$form.createForm(this, { name: 'coordinated' }),
      Reqvalue: 'query',
      BodyValue: 'form',
      jsonStr: JSON.stringify(JSON.parse(jsonData), null, 2),
      queryList: [{ key: '', type: undefined, value: '', desc: '' }],
      formList: [{ key: '', type: '', value: '', desc: '' }],
      headerList: [{ key: '', value: '' }],
      apiName: '',
      apiMethod: '',
      apiAddr: '',
      apiTag: '',
      apiTime: '',
      apiUser: '',
      typeList,
      classfiyList: [],
      projectId: localStorage.getItem('project_id'),
      modelId: this.$route.query.modelId,
      apiId: this.$route.query.apiId,
      envList: [],
      jsonpathList: [{ regulation: '', manner: '', expected: null, desc: '' }],
      extractList: [{ name: '', value: '' }],
      mannerList,
      options,
      response_code: null,
      response_data: '',
      response_header: '',
      validate_data: null,
      validate_type: 'data',
      envinfo: '',
      envId: null,
      TestModelList: [],
      rely: '',
      act: ['1'],
      extract: 'no'
    }
  },
  watch: {
    activeKey (key) {
      console.log(key)
    },
    '$route': {
      immediate: true,
      deep: true,
      handler (v) {
        // console.log(v.query.apiId, '2800')
        this.HandleGetApiInfo(v.query.apiId)
      }
    }
  },
  created () {
    this.HandleGetProjectClassfiy()
    this.HandleGetEnvList()
  },
  methods: {
    callback (key) {
      console.log(key, '1100')
    },
    // 编辑接口信息
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        const obj = {
          ...values,
          'kind': this.Reqvalue,
          'type': this.BodyValue,
          'data': this.BodyValue === 'form' ? this.formList : this.jsonStr,
          'params': this.queryList,
          'project': this.projectId,
          'apiId': this.apiId
        }
        if (!err) {
          console.log('Received values of form: ', obj)
          UpInter(obj).then(res => {
            console.log(res.data)
            this.$message.success(res.data)
          })
        }
      })
    },

    handleClick (event) {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation()
    },

    onChange (e) {
      console.log(`checked = ${e.target.value}`)
    },

    onChangeBody (e) {
      console.log('radio checked', e.target.value)
    },

    handleAddQuery () {
      this.queryList.push(
        { key: '', type: '', value: '', desc: '' }
      )
    },

    Delete (index) {
      console.log('delete', index)
      this.queryList.splice(index, 1)
    },

    onError () {
      console.log('error')
    },

    handleChange (value) {
      console.log(value)
    },

    handleSelectChange () {},

    // 获取当前项目的所有分类
    HandleGetProjectClassfiy () {
      allModel(this.projectId).then(res => {
        this.classfiyList = res.data
      })
    },

    // 环境下拉框
    handleChangeEnv (value) {
      const it = this.envList.find(it => it.id === value)
      this.headerList = it.headers
      this.envinfo = it.method + it.address
      this.envId = it.id
    },

    // 接口调试
    HandleSendRequest () {
      const obj = {
        'url': this.apiAddr,
        'method': this.apiMethod,
        'env': this.envinfo,
        'data': this.BodyValue === 'form' ? this.formList : this.jsonStr.replace(/[\r\n]/g, '').replace(/ +/g, ''),
        'params': this.apiMethod === 'GET' ? this.queryList : null,
        'headers': this.headerList,
        'validate_type': this.validate_type,
        'validate_data': this.validate_type === 'data' ? this.validate_data : this.jsonpathList
      }
      SendInterface(obj).then(res => {
        console.log(res.data)
        this.response_code = res.data.code
        this.response_data = JSON.parse(res.data.response)
        this.response_header = res.data.response_header
      })
      console.log(obj)
    },

    // 添加form参数
    handleAddForm () {
      this.formList.push(
        { key: '', type: '', value: '', desc: '' }
      )
    },

    // 删除 form参数
    DeleteForm (index) {
      this.formList.splice(index, 1)
    },

    // 添加extractList参数
    handleAddextractList () {
      this.extractList.push(
        { name: '', value: '' }
      )
    },
    // 删除extractList参数
    handleDeleteextractList (index) {
      this.formList.splice(index, 1)
    },

    // 获取api信息
    HandleGetApiInfo (id) {
      apicaseInfo(id).then(res => {
        console.log(res.data)
        const resp = res.data
        this.apiName = resp.name
        this.apiMethod = resp.method
        this.apiAddr = resp.url
        this.apiTime = resp.create_time
        this.apiUser = resp.create_user
        this.form.setFieldsValue({ name: resp.name, method: resp.method, url: resp.url, model: resp.model })
        this.Reqvalue = resp.result[0].kind
        this.BodyValue = resp.result[0].type
        if (resp.result[0].type === 'form') {
          this.formList = resp.result[0].data
        } else {
          this.jsonStr = JSON.stringify(resp.result[0].data, null, 2)
        }
        this.queryList = resp.result[0].params
      })
    },

    // 获取当前项目的所有环境
    HandleGetEnvList () {
      EnvList(this.projectId).then(res => {
        console.log(res.data)
        this.envList = res.data
      })
    },

    // 断言类型
    callbackValidate (key) {
      this.validate_type = key
      console.log(this.validate_type)
    },

    // 新建jsonpath断言
    handleAddJsonPath () {
      this.jsonpathList.push(
          { regulation: '', manner: '', expected: '', desc: '' }
      )
    },

    // 删除jsonpath断言
    handleDelJsonpath (index) {
      this.jsonpathList.splice(index, 1)
    },

    // sql
    changeModalTextarea (val) {
      this.$set(this.basicInfoForm, 'sqlMain', val)
    },
    formaterSql (val) {
      const dom = this.$refs.sqleditor
      dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()))
    },

    // 保存测试用例对话框
    handleAddTest () {
      this.Testvisible = true
      this.handleGetTestRally()
    },

    // 对话框确认按钮事件
    handleOk (e) {
      e.preventDefault()
      this.Testform.validateFields((err, values) => {
        const obj = {
          ...values,
          // 'name': this.Testform,
          'project_id': this.projectId,
          'before_Sql': this.basicInfoForm.beforeSql,
          'after_Sql': this.basicInfoForm.afterSql,
          'rely': this.rely,
          'checkType': this.validate_type,
          'check': this.validate_type === 'data' ? this.validate_data : this.jsonpathList,
          'env': this.envId,
          'parameter': this.Reqvalue === 'body' && this.BodyValue === 'raw' ? JSON.parse(this.jsonStr.replace(/[\r\n]/g, '').replace(/ +/g, '')) : this.formList || this.Reqvalue === 'query' ? this.queryList : null,
          'interface': this.apiId,
          'extract': this.extract === 'jsonpath' ? this.extractList : null
        }
        if (!err) {
          console.log('Received values of form: ', obj)
          addCase(obj).then(res => {
            console.log(res.data)
            this.$message.success(res.message)
            this.Testvisible = false
          })
          // UpInter(obj).then(res => {
          //   console.log(res.data)
          //   this.$message.success(res.data)
          // })
        }
      })
    },

    // 新增测试文件夹
    addItem () {
      console.log('新建')
      // this.TestfileName.push(`New item ${ index++ }`);
    },

    // 添加集合
    handleAddRally () {
      console.log('111')
    },

    // 获取测试集合列表
    handleGetTestRally () {
      rallyList(this.projectId).then(res => {
        console.log(res.data, '测试集合')
        this.TestModelList = res.data
      })
    },

    // 参数提取radio
    onChange2 (e) {
      console.log('radio2 checked', e.target.value)
    },

    callbackExtract (key) {
      this.extract = key
      console.log(this.extract)
    }
  }
}
</script>
<style>
.ant-card-bordered {
  border: 0;
  height: 100%;
}
.jib {
  height: 200px;
  background-color: cornsilk;
}
.info {
  display: grid;
  grid-template-columns: 46% 46%;
  grid-template-rows: 60px 60px;
  margin-left: 40px;
  margin-top: 20px;
  font-size: 16px;
}
.head {
  border: #00cdcd 2px solid;
  height: 40px;
  width: 2px;
}
.font {
  align-items: center;
  line-height: 40px;
  color: #00CDCD;
  font-size: 20px;
  padding-left: 8px;
}
.icon-sty {
  font-size: 16px;
  line-height: 32px;
  margin: 0px 6px;
}
.sql-btn {
  float: right;
}
</style>
