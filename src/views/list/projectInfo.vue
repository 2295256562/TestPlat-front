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
          <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit" :tab-position="tabPosition">
            <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
              {{ pane.content }}
            </a-tab-pane>
          </a-tabs>
        </a-tab-pane>
        <a-tab-pane key="3" tab="请求配置">
          Content of Tab Pane 3
        </a-tab-pane>
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
                v-decorator="['task', { rules: [{ required: true, message: '请输入swagger json地址' }] }]"
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
                v-decorator="['env_name', { rules: [{ required: true, message: '请选择项目地址' }] }]"
              />
            </a-form-item>
            <a-form-item label="自动获取token">
              <a-switch checked-children="开" un-checked-children="关" default-checked />
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
            <a-form-item label="token有效期(小时)">
              <a-input-number
                oninput="value=value.replace(/[^\d]/g,)"
                v-decorator="['interval', { rules: [{ required: true, message: '请输入必填项！' }] }]"
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
       const panes = [
          { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
          { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
          { title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false }
        ]
       return {
          id: null,
          tabPosition: 'left',
          formLayout: 'horizontal',
          activeKey: panes[0].key,
          panes,
          newTabIndex: 0,
          Tokenform: this.$form.createForm(this, { name: 'coordinated' }),
          Swagegerform: this.$form.createForm(this, { name: 'coordinated' }),
          Projectform: this.$form.createForm(this, { name: 'coordinated' })
       }
    },
    created () {
      this.id = this.$route.query.id
      console.log('router id :', this.id)
      this.handleGetPjInfo()
    },
    methods: {
      // 获取项目详情
      handleGetPjInfo () {
        projectInfo(this.id).then(res => {
          console.log(res)
          this.Projectform.setFieldsValue({ project_name: res.data.project_name })
          this.Projectform.setFieldsValue({ project_desc: res.data.project_desc })
          // this.Projectform = res.data
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
      //
      onEdit (targetKey, action) {
        this[action](targetKey)
      }
    }
}
</script>
