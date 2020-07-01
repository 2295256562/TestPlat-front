<template>
  <page-header-wrapper
    content
  >
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="项目配置">
          <a-form :form="Projectform" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" @submit="handlePJSubmit">
            <a-form-item label="项目名称">
              <a-input
                v-decorator="['project_name', { rules: [{ required: true, message: '请选择项目地址' }] }]"
              />
            </a-form-item>
            <a-form-item label="项目描述">
              <a-textarea
                :auto-size="{ minRows: 3, maxRows: 6 }"
                v-decorator="['project_desc']"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
              <a-button type="primary" html-type="submit">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="环境配置" force-render>
          <div style="display:flex">
            <div style="width: 12%;float: left;">
              <div class="env-div">
                <span>环境列表</span>
                <a-icon type="plus-circle" @click="addEnvList" style="float:right;line-height: 40px;margin-right: 20px;" />
              </div>
              <a-list bordered :data-source="envList">
                <a-list-item :class="focusIndex === index ? 'focus-sty': ''" @click="changeFocus(index, item)" slot="renderItem" slot-scope="item, index">
                  {{ item.name }}
                  <a-icon type="delete" @click="HandleDel" style="float:right;" />
                </a-list-item>
              </a-list>
            </div>
            <div style="flex:1">
              <a-form :form="envForm" ref="envFormR" layout="vertical" style="padding-left:10px" @submit="handleEnvSubmit">
                <a-form-item label="环境名称">
                  <a-input
                    v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
                  />
                </a-form-item>
                <a-form-item label="环境域名">
                  <a-input
                    v-decorator="['address', { rules: [{ required: true, message: 'Please input your note!' }] }]">
                    <a-select
                      slot="addonBefore"
                      v-decorator="['method', { initialValue: 'http' }]"
                      style="width: 90px"
                    >
                      <a-select-option value="http">
                        http
                      </a-select-option>
                      <a-select-option value="https">
                        https
                      </a-select-option>
                    </a-select>
                  </a-input>
                </a-form-item>
                <div style="color:rgba(0, 0, 0, 0.85)">请求Header头部</div>
                <div v-for="(item, index) in headersList" :key="index + 'headersList'" style="display:flex;padding-bottom: 8px;margin-top:20px">
                  <a-input v-model="item.key" placeholder="key" style="width:20%" />
                  <a-input v-model="item.value" placeholder="value" style="width:30%;margin-left:40px" />
                  <a-icon type="plus-circle" style="line-height: 32px;font-size: 20px;padding-left: 10px;" @click="handleAddHeaderList" />
                  <a-icon v-if="headersList.length >1" type="delete" style="line-height: 30px;font-size: 20px;padding-left: 10px;" @click="HandleDelete(index)"/>
                </div>
                <div style="color:rgba(0, 0, 0, 0.85);margin-top:20px">全局变量</div>
                <div v-for="(item, index) in globalsList" :key="index + 'globalsList'" style="display:flex;padding-bottom: 8px;margin-top:20px">
                  <a-input v-model="item.key" placeholder="key" style="width:20%" />
                  <a-input v-model="item.value" placeholder="value" style="width:30%;margin-left:40px" />
                  <a-icon type="plus-circle" style="line-height: 32px;font-size: 20px;padding-left: 10px;" @click="handleAddGlobalsList" />
                  <a-icon v-if="globalsList.length >1" type="delete" style="line-height: 30px;font-size: 20px;padding-left: 10px;" @click="HandleGlobaDelete(index)"/>
                </div>
              </a-form>
            </div>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="3" tab="请求配置">
          Content of Tab Pane 3
        </a-tab-pane> -->
        <a-tab-pane key="4" tab="Swagger文档">
          <a-form :form="Swagegerform" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" @submit="handleSWSubmit">
            <a-form-item label="是否自动同步">
              <a-switch checked-children="开" un-checked-children="关" default-checked />
            </a-form-item>
            <a-form-item label="数据同步方式">
              <a-select
                v-decorator="[
                  'type',
                  { rules: [{ required: true, message: 'Please select your gender!' }] },
                ]"
              >
                <a-select-option value="male">
                  普通模式
                </a-select-option>
                <a-select-option value="female">
                  智能合并
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="项目swagger json地址">
              <a-input
                v-decorator="['swagger', { rules: [{ required: true, message: '请输入swagger json地址' }] }]"
              />
            </a-form-item>
            <a-form-item label="定时任务(cron)">
              <a-input
                style="letter-spacing:10px;"
                v-decorator="['task', { rules: [{ required: true, message: '请输入cron表达式' }] }]"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
              <a-button type="primary" html-type="submit">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="5" tab="token配置">
          <a-form :form="Tokenform" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" @submit="handleTOSubmit">
            <a-form-item label="环境名称">
              <a-input
                v-decorator="['env', { rules: [{ required: true, message: '请选择项目地址' }] }]"
              />
            </a-form-item>
            <a-form-item label="自动获取token">
              <a-switch v-decorator="['status', { valuePropName: 'checked' }]" />
            </a-form-item>
            <a-form-item label="获取token地址">
              <a-input
                v-decorator="['address', { rules: [{ required: true, message: '请输入必填项！' }] }]">
                <a-select v-decorator="['method', { initialValue: 'POST' }]" slot="addonBefore" style="width: 90px">
                  <a-select-option value="GET">
                    GET
                  </a-select-option>
                  <a-select-option value="POST">
                    POST
                  </a-select-option>
                </a-select>
                <a-button type="primary">
                  调试
                </a-button>
              </a-input>
            </a-form-item>
            <a-form-item label="参数类型">
              <a-radio-group v-decorator="['type', { rules: [{ required: true, message: '请选择参数类型!' }] }]">
                <a-radio value="form">
                  form
                </a-radio>
                <a-radio value="json">
                  json
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="参数">
              <a-textarea
                :auto-size="{ minRows: 3, maxRows: 12 }"
                v-decorator="['parameters', { rules: [{ required: true, message: '请输入参数!' }] }]"
              />
            </a-form-item>
            <a-form-item label="token有效期(小时)">
              <a-input-number
                oninput="value=value.replace(/[^\d]/g,)"
                v-decorator="['validity', { rules: [{ required: true, message: '请输入必填项！' }] }]"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
              <a-button type="primary" html-type="submit">
                保存
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { projectInfo, updateProject } from '@/api/interface'
export default {
    data () {
       return {
          id: null,
          tabPosition: 'left',
          formLayout: 'horizontal',
          // activeKey: panes[0].key,
          // panes,
          newTabIndex: 0,
          // data: [],
          Tokenform: this.$form.createForm(this, { name: 'coordinated' }),
          Swagegerform: this.$form.createForm(this, { name: 'coordinated' }),
          Projectform: this.$form.createForm(this, { name: 'coordinated' }),
          envForm: this.$form.createForm(this, { name: 'coordinated' }),
          envList: [{
            name: 'local'
          }],
          headersList: [{ key: '', value: '' }],
          globalsList: [{ key: '', value: '' }],
          focusIndex: 0
       }
    },
    created () {
      this.id = this.$route.query.id
      console.log('router id :', this.id)
      this.handleGetPjInfo()
    },
    watch: {
      'envForm.name': {
        deep: true,
        handler (v) {
          console.log('12112324431343413', v)
          this.envList[this.focusIndex].name = v
        }

      }

    },
    methods: {
      // 获取项目详情
      handleGetPjInfo () {
        projectInfo(this.id).then(res => {
          console.log(res)
          this.Projectform.setFieldsValue({ project_name: res.data.project_name })
          this.Projectform.setFieldsValue({ project_desc: res.data.project_desc })
        })
      },
      // 获取项目配置
      handleGetPjEnvSettings () {},
      // 获取项目Swagger
      handleGetPjSwagger () {},
      // 获取项目token
      handleGetPjToken () {},
      callback (key) {
        switch (key) {
          case '1':
            console.log('今天好大雨')
            break
          case '2':
            console.log('今天好太阳')
            break
          default:
            break
        }
        // console.log(key)
      },
      // token form
      handleTOSubmit (e) {
        e.preventDefault()
        this.Tokenform.validateFields((err, values) => {
          if (!err) {
            // setToken(values).then(res => {   })
            console.log('Received values of form: ', values)
          }
        })
      },
      // swagger form
      handleSWSubmit (e) {
        e.preventDefault()
        this.Swagegerform.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
      },
      // env form
      handleEnvSubmit (e) {},
      // project form
      handlePJSubmit (e) {
        e.preventDefault()
        this.Projectform.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            const id = this.id
            updateProject(id, values).then(res => {
              console.log('修改', res)
            })
          }
        })
      },
      // 添加环境列表
      addEnvList () {
        this.envList.push({
          name: 'dev'
        })
        this.envForm.setFieldsValue({
          name: `dev`
        })
        this.focusIndex = this.envList.length - 1
      },
      //
      onEdit (targetKey, action) {
        this[action](targetKey)
      },
      // Header list 增加
      handleAddHeaderList () {
        // console.log('add header')
        this.headersList.push({ key: '', value: '' })
      },
      // header list 删除
      HandleDelete (index) {
        console.log(index, '111')
        this.headersList.splice(index, 1)
      },
      // Globals List 增加
      handleAddGlobalsList () {
        this.globalsList.push({ key: '', value: '' })
      },
      // Globals List 删除
      HandleGlobaDelete (index) {
        this.globalsList.splice(index, 1)
      },
      changeFocus (index, item) {
        this.focusIndex = index
        // console.log(v)
        this.Updata(item.name)
      },
      // 删除环境
      HandleDel () {
        console.log('删除')
      },
      Updata (name) {
        // const lot = this.$refs.envFormR
        this.envForm.setFieldsValue({ name })
        // console.log(this.envForm, '111')
      }
    }
}
</script>
<style>
.env-div {
    background-color: #C0C0C0;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
}
.focus-sty{
  background: red;
}

</style>
