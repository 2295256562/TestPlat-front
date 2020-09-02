<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :dataSource="loadData"
        :pagination="pagination"
        @change="pageChange"
      >
        <span slot="type" slot-scope="text, record">
          <template>
            <span v-if="record.type == 1">
              即时任务
            </span>
            <span v-else>
              定时任务
            </span>
          </template>
        </span>
        <span slot="status" slot-scope="text, record">
          <template>
            <span v-if="record.status == 3">
              <a-badge status="success" text="已完成"/>
            </span>
          </template>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">查看报告</a>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import { getRoleList } from '@/api/manage'
import { reportlist } from '@/api/interface'

const columns = [
  {
    title: '报告编号',
    dataIndex: 'number',
    key: 'number'
    // width: '250px'
  },
  {
    title: '任务类型',
    dataIndex: 'type',
    key: 'type',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '消耗时间(sec)',
    dataIndex: 'spendTimeInSec',
    key: 'spendTimeInSec'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '启动时间',
    dataIndex: 'start_time',
    key: 'start_time'
  },
  {
    title: '执行人员',
    dataIndex: 'create_user',
    key: 'create_user'
  },
  {
    title: '操作',
    dataIndex: 'action',
    // width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      page: 1,
      page_size: 10,
      loadData: [],
      // // 加载数据方法 必须为 Promise 对象
      // loadData: parameter => {
      //   const requestParameters = Object.assign({}, parameter, this.queryParam)
      //   console.log('loadData request parameters:', requestParameters)
      //   return reportlist(requestParameters.pageNo,this.project_id requestParameters.pageSize)
      //     .then(res => {
      //       return res.result
      //     })
      // },
      selectedRowKeys: [],
      selectedRows: [],
      project_id: localStorage.getItem('project_id'),
      count: 0,
      // page: 1,
      pagination: {
        pageSize: 10,
        total: 0,
        showTotal: count => `共有 ${count} 数据`, // 显示总数
        change: (a, b, c) => this.pageChange(a, b, c) // 改变每页数量时更新显示
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    console.log(111)
    this.handleGetReport(this.page, this.page_size)
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      // this.visible = true
      // this.mdl = { ...record }
      console.log('111', record, 'number', record.number)
      this.$router.push({ 'path': '/project/report-detail', query: { 'number': record.number } })
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 获取测试报告
    handleGetReport () {
      const { pagesize, page } = this
      const obj = {
        'page': page,
        'page_size': pagesize,
        'project_id': this.project_id
      }
      reportlist(obj).then(res => {
        this.loadData = res.data.results
        console.log(this.loadData, 'data')
        // this.count = res.data.count
        this.pagination = {
          ...this.pagination,
          total: res.data.count
        }
      })
    },

    // 分页
    pageChange (page) {
      this.page = page.current
      this.handleGetReport()
    }
  }
}
</script>
