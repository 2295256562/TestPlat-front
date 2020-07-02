<template>
  <div style="height: 100%">
    <a-card :body-style="{ padding: '24px 32px', height: '100%'}" :bordered="true">
      <a-tabs default-active-key="1" @change="callback" style="height: 100%">
        <a-tab-pane key="1" tab="预览">
          <div style="display:flex">
            <div class="head" style="float:left"></div>
            <div class="font">基本信息</div>
          </div>
          <div class="info">
            <div>接口名称：{{ apiName }}</div>
            <div>请求方法：{{ apiMethod }}</div>
            <div>接口路径：{{ apiAddr }}</div>
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
          <div style="margin-top: 10px;text-align: center">
            <a-radio-group v-model="Reqvalue" button-style="solid" @change="onChange">
              <a-radio-button value="body">
                Body
              </a-radio-button>
              <a-radio-button value="query">
                Query
              </a-radio-button>
              <a-radio-button value="headrs">
                Headrs
              </a-radio-button>
            </a-radio-group>
          </div>
          <div style="margin-top:10px;background-color:Gainsboro;height:auto">
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
                  <a-select v-model="item.type" placeholder="类型" style="width: 120px" @change="handleChange">
                    <a-select-option v-for="em in typeList" :value="em" :key="em">
                      {{ em }}
                    </a-select-option>
                  </a-select>
                  <a-input v-model="item.data" placeholder="参数示例" style="width:30%" />
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
                <a-select v-model="item.type" placeholder="类型" style="width: 120px" @change="handleChange">
                  <a-select-option v-for="qt in typeList" :key="qt">
                    {{ qt }}
                  </a-select-option>
                </a-select>
                <a-input v-model="item.data" placeholder="参数示例" style="width:30%" />
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
            <div style="float:left;width:80%">
              <a-input v-model="apiAddr">
                <a-select slot="addonBefore" default-value="Http://" style="width: 90px;background-color: darkgray;color: #333333">
                  <a-select-option value="Http://">
                    Http://
                  </a-select-option>
                  <a-select-option value="Https://">
                    Https://
                  </a-select-option>
                </a-select>
                <a-select slot="addonBefore" default-value="Http://" style="width: 300px;margin-left:14px">
                  <a-select-option value="Http://">
                    Http://
                  </a-select-option>
                  <a-select-option value="Https://">
                    Https://
                  </a-select-option>
                </a-select>
              </a-input>
            </div>
            <a-button type="primary" style="margin-left:20px">
              发送
            </a-button>
            <a-button type="primary" style="margin-left:20px">
              保存
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
// import Vue from 'vue'
import JsonEditor from '@/views/form/basicForm/json.vue'
// import VJsoneditor from 'v-jsoneditor/src/index'
import { allModel, apicaseInfo } from '@/api/interface'
const jsonData = `{}`
const typeList = ['string', 'number', 'float', 'bool']
// Vue.use(VJsoneditor)
export default {
  components: { JsonEditor },
  data () {
    return {
      jsonEditor: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      Reqvalue: 'body',
      BodyValue: 'form',
      jsonStr: JSON.stringify(JSON.parse(jsonData), null, 2),
      // formatData: { 'name': '222', 'age': 11 },
      queryList: [{ key: '', type: '', data: '', desc: '' }],
      formList: [{ key: '', type: '', data: '', desc: '' }],
      apiName: '',
      apiMethod: '',
      apiAddr: '',
      apiTag: '',
      apiTime: '',
      apiUser: '',
      typeList,
      classfiyList: [],
      projectId: this.$route.query.projectId,
      modelId: this.$route.query.modelId,
      apiId: this.$route.query.apiId
    }
  },
  created () {
    console.log('JINLAI')
    this.HandleGetProjectClassfiy()
    this.HandleGetApiInfo()
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        const obj = {
          ...values,
          'class': this.Reqvalue,
          'type': this.BodyValue,
          'data': this.BodyValue === 'form' ? this.formList : this.jsonStr,
          'params': this.queryList
        }
        if (!err) {
          console.log('Received values of form: ', obj)
        }
      })
    },
    onChange (e) {
      console.log(`checked = ${e.target.value}`)
    },
    onChangeBody (e) {
      console.log('radio checked', e.target.value)
    },
    handleAddQuery () {
      this.queryList.push(
        { key: '', type: '', data: '', desc: '' }
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
    // 添加form参数
    handleAddForm () {
      this.formList.push(
        { key: '', type: '', data: '', desc: '' }
      )
    },
    // 删除 form参数
    DeleteForm (index) {
      this.formList.splice(index, 1)
    },
    // 获取api信息
    HandleGetApiInfo (id) {
      apicaseInfo(this.apiId).then(res => {
        console.log(res.data)
        const resp = res.data
        this.apiName = resp.name
        this.apiMethod = resp.method
        this.apiAddr = resp.url
        this.apiTime = resp.create_time
        this.apiUser = resp.create_user
        this.form.setFieldsValue({ name: resp.name })
        this.form.setFieldsValue({ method: resp.method })
        this.form.setFieldsValue({ url: resp.url })
        this.form.setFieldsValue({ model: resp.model })
      })
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
</style>
