<template>
  <div style="height: 100%">
    <a-card :body-style="{ padding: '24px 32px'}" :bordered="true">
      <div style="display: flex;">
        <span style="font-size: 20px;margin-bottom: 10px;">测试用例{{ count }}个</span>
        <a-button type="primary" @click="RunHandler" style="margin-left: auto">执行用例</a-button>
      </div>
      <!-- :customRow="aaa"
        :rowClassName="bbb"
        :columns="columns" -->
      <a-table :data-source="TableData" :columns="columns" :pagination="pagination" style="margin-top:10px" @change="pageChange">
        <!-- <a-table-column prop="name" label="用例名称"></a-table-column> -->
        <a slot="name" slot-scope="record" @click="handleName(record)">{{ record }}</a>
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
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '接口地址',
    dataIndex: 'interface_url',
    key: 'interface_url',
    width: 300
  },
  {
    title: '用例集合',
    dataIndex: 'case_model',
    key: 'case_model',
    ellipsis: true
  },
  {
    title: '创建人员',
    dataIndex: 'create_user',
    key: 'create_user',
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
      console.log('11111', parseInt(this.caseModel))
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
    pageChange () {},

    // 用例名称点击
    handleName (record) {
      console.log('222222', record)
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
