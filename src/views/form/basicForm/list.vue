<template>
  <div style="height: 100%">
    <a-card :body-style="{ padding: '24px 32px'}" :bordered="true">
      <div style="display: flex;">
        <span style="font-size: 20px;margin-bottom: 10px;" v-if="case_model === null">全部接口共{{ count }}个</span>
        <span style="font-size: 20px;margin-bottom: 10px;" v-else >全部用例{{ count }}个</span>
        <a-button type="primary" @click="addHandler" style="margin-left: auto">添加接口</a-button>
      </div>
      <a-table
        :customRow="aaa"
        :rowClassName="bbb"
        :columns="columns"
        :data-source="TableData"
        :pagination="pagination"
        style="margin-top:10px"
        @change="pageChange"
      >
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </a-card>
    <a-modal v-model="visible" title="新增接口" @ok="handleOk">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
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
        <a-form-item label="接口名称">
          <a-input
            placeholder="请输入接口名称"
            v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' }] }]"
          />
        </a-form-item>
        <a-form-item label="接口路径">
          <a-input placeholder="/" v-decorator="['url', { rules: [{ required: true, message: '请输入必填项！' }] }]">
            <a-select
              v-decorator="['method', { initialValue: 'GET' }]"
              slot="addonBefore"
              style="width: 90px"
            >
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { allModel, AddInterface, projectInterList, caseList } from '@/api/interface'
const columns = [
  {
    title: '接口名称',
    dataIndex: 'name',
    key: 'name',
    width: 160,
    visible: false
  },
  {
    title: '接口地址',
    dataIndex: 'url',
    key: 'url',
    width: 500
  },
  {
    title: '接口分组',
    dataIndex: 'model_name',
    key: 'model_name',
    ellipsis: true
  }
]
export default {
  data () {
    return {
      columns,
      TableData: [],
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      id: 1,
      classfiyList: [],
      projectId: localStorage.getItem('project_id'),
      modelId: null,
      case_model: null,
      count: 0,
      page: 1,
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: count => `共有 ${count} 数据`, // 显示总数
        change: (a, b, c) => this.pageChange(a, b, c) // 改变每页数量时更新显示
      }
    }
  },
  watch: {
    '$route': {
      immediate: true,
      deep: true,
      handler (v) {
        // this.projectId = v.query.projectId
        this.modelId = v.query.modelId
        this.caseModel = v.query.case_model
        if (v.query.case_model) {
          this.handleGetCaseList()
        } else {
          this.handleGetInterfaceList()
        }
      }
    }
  },
  created () {
  },
  methods: {
    pageChange (page) {
      console.log(page, 'vbbbb')
      this.page = page.current
      this.handleGetInterfaceList()
    },
    // 添加接口
    addHandler () {
      this.visible = true
      this.HandleGetProjectClassfiy()
    },
    handleOk (e) {
      // console.log(e)
      this.visible = false
      e.preventDefault()
      this.form.validateFields((err, values) => {
      var key = 'project'
      var value = this.projectId
      values[key] = value
        if (!err) {
          console.log('Received values of form: ', values)
          AddInterface(values).then(res => {
            this.$message.success(res.message)
          })
          // 刷新列表
          this.handleGetInterfaceList()
          // console.log('Received values of form: ', obj)
        }
      })
      this.form.setFieldsValue({ model: '' })
      this.form.resetFields()
    },
    // 获取当前项目的所有分类
    HandleGetProjectClassfiy () {
      allModel(this.projectId).then(res => {
        this.classfiyList = res.data
      })
    },
    handleSelectChange () {},
    // 获取接口列表
    handleGetInterfaceList () {
      const { projectId, modelId, page } = this
      projectInterList({
        projectId,
        modelId,
        page
      }).then(res => {
        console.log(res.data.results)
        this.TableData = res.data.results
        this.count = res.data.count
        this.pagination = {
          ...this.pagination,
          total: res.data.count
        }
        console.log(this.count, 'count')
      })
    },

    // 获取case列表
    handleGetCaseList () {
      const { caseModel, page } = this
      caseList({
        caseModel,
        page
      }).then(res => {
         this.TableData = res.data.results
      })
    },
    // 表格整行点击事件
    rowclick () {
      console.log('22222')
    },
    aaa (record) {
      return {
        on: {
          click: (event) => {
            this.$router.push({ path: '/api/interface-info', query: { 'projectId': record.project, 'modelId': record.model, 'apiId': record.id } })
          }
        }
      }
    },
    bbb (record) {
      return 'cur'
    }
  }
}
</script>

<style >
.ant-card-bordered {
  border: 0;
}
.cur {
  cursor: pointer;
}
</style>
