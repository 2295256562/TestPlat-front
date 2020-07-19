<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
      >
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
  },
  {
    title: '任务类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '消耗时间(sec)',
    dataIndex: 'spendTimeInSec',
    key: 'spendTimeInSec'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
    // scopedSlots: { customRender: 'status' }
  },
  {
    title: '启动时间',
    dataIndex: 'start_time',
    key: 'start_time'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
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
      project_id: localStorage.getItem('project_id')
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
      this.visible = true
      this.mdl = { ...record }
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
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 获取测试报告
    handleGetReport (page, pagesize) {
      const obj = {
        'page': page,
        'page_size': pagesize,
        'project_id': this.project_id
      }
      reportlist(obj).then(res => {
        this.loadData = res.data.results
        console.log(this.loadData, 'data')
      })
    }
  }
}
</script>
