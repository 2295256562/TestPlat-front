<template>
  <div style="height: 100%">
    <a-card :body-style="{ padding: '24px 32px'}" :bordered="true">
      <div style="display: flex;">
        <span style="font-size: 20px;margin-bottom: 10px;">测试用例{{ count }}个</span>
        <a-button type="primary" @click="RunHandler" style="margin-left: auto">执行用例</a-button>
      </div>
      <a-table :data-source="TableData" :columns="columns" :pagination="pagination" style="margin-top:10px" @change="pageChange">
        <span slot="id" slot-scope="text">{{ text }}</span>
        <a slot="name" slot-scope="text, record" @click="handleName(record)">{{ text }}</a>
        <a slot="interface_url" slot-scope="text, record" @click="handleInterface(record)">
          <template>
            <a-tag color="DeepSkyBlue" v-if="record.interface_method === 'POST'">
              {{ record.interface_method }}
            </a-tag>
            <a-tag color="MediumAquamarine" v-if="record.interface_method === 'GET'">
              {{ record.interface_method }}
            </a-tag>
            {{ text }}
          </template>
        </a>
        <span slot="create_user" slot-scope="text, record">
          <template>
            <a-button type="primary" shape="circle" v-if="text[2]">
              {{ text[1] }}{{ text[2] }}
            </a-button>
            <a-button type="primary" shape="circle" v-else>
              {{ text[0] }}{{ text[1] }}
            </a-button>
            {{ record.create_user }}
          </template>
        </span>
        <span slot="model_name" slot-scope="text,record">
          <template>
            <a-dropdown>
              <span class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{ record.model_name }} <a-icon type="down" />
              </span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">1st menu item</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>

          </template>
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { caseList, runCase } from '@/api/interface'
const columns = [
  {
    title: '用例名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '接口地址',
    dataIndex: 'interface_url',
    key: 'interface_url',
    width: 300,
    ellipsis: true,
    scopedSlots: { customRender: 'interface_url' }
  },
  {
    title: '用例集合',
    dataIndex: 'case_model',
    key: 'case_model',
    ellipsis: true,
    scopedSlots: { customRender: 'model_name' }
  },
  {
    title: '创建人员',
    dataIndex: 'create_user',
    key: 'create_user',
    ellipsis: true,
    scopedSlots: { customRender: 'create_user' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    ellipsis: true
  }
]
export default {
  data () {
    return {
      TableData: [],
      count: 0,
      page: 1,
      columns,
      case_model: null,
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: count => `共有 ${count} 数据`, // 显示总数
        change: (a, b, c) => this.pageChange(a, b, c) // 改变每页数量时更新显示
      },
      project_id: localStorage.getItem('project_id')
    }
  },

  watch: {
    '$route': {
      immediate: true,
      deep: true,
      handler (v) {
        console.log(v, 'vvvvvvvvvvvvvvvvvvvv')
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
  methods: {
    // 执行测试用例
    RunHandler () {
      // console.log('11111', parseInt(this.caseModel))
      const obj = {
        'ids': [parseInt(this.caseModel)],
        'project_id': this.project_id
      }
      runCase(obj).then(res => {
        console.log(res.data)
        if (res.code === '000000') {
          this.openNotificationWithIcon('success', res.data.report_id, res.data.msg)
        } else {
          this.openNotificationWithIcon('error', '错误', res.data)
        }
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
         this.count = res.data.count
         this.pagination = {
          ...this.pagination,
          total: res.data.count
        }
      })
    },
    // 分页切换
    pageChange (page) {
      this.page = page.current
      this.handleGetCaseList()
    },

    // 用例名称点击跳用例详情
    handleName (record) {
      console.log(record)
      this.$router.push({ path: '/api/case-info', query: { 'case': record.id } })
    },
    // 接口地址点击跳接口详情
    handleInterface (record) {
      this.$router.push({ path: '/api/interface-info', query: { 'apiId': record.interface } })
    },
    openNotificationWithIcon (type, message, description) {
      this.$notification[type]({
        message: message,
        description: description
      })
    }
  }
}
</script>
