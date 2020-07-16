<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="(key) => {
      this.tabActiveKey = key
    }"
    content
  >
    <div class="gutter-example">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="6">
          <a-button class="new-btn" type="dashed" @click="addProject">
            <a-icon type="plus" />新增产品
          </a-button>
        </a-col>
        <a-col class="gutter-row" :span="6" v-for="item in dataSource" :key="item.id" style="margin-bottom:20px">
          <a-card :hoverable="true" @click="projectClick(item)" >
            <a-card-meta>
              <a slot="title">{{ item.project_name }}</a>
              <a-avatar class="card-avatar" slot="avatar" :src="avatar" size="large" />
              <div class="meta-content" slot="description">{{ item.project_desc }}</div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a @click="projectClick(item)">编辑</a>
              <a @click="deleteHandler(item)">删除</a>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div>
      <a-modal
        title="新增项目"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        @width="600"
      >
        <a-form
          :form="form"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="项目名称">
            <a-input
              placeholder="请输入项目名称"
              v-decorator="['project_name', { rules: [{ required: true, message: '请输入项目名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="项目描述">
            <a-textarea
              placeholder="请输入项目描述"
              :auto-size="{ minRows: 2, maxRows: 20 }"
              v-decorator="['project_desc', { rules: [{ required: true, message: '请输入项目描述!' }] }]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </page-header-wrapper>
</template>

<script>
import { projectList, addProject } from '@/api/interface'
// import { aaa } from '@/layouts/BasicLayout'
// const dataSource = []
// dataSource.push({})
// for (let i = 1; i < 32; i++) {
//   dataSource.push({
//     id: i,
//     title: 'Alipay' + i,
//     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
//     content:
//       '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
//   })
// }
export default {
  name: 'CardList',
  data () {
    this.tabList = [{ key: 'tab1', tab: '项目列表' }]
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      tabActiveKey: 'tab1',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      dataSource: [],
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  created () {
    // 获取所有项目
    this.ProjectGetList()
  },
  methods: {
    addProject () {
      this.visible = true
    },
    // 确认事件
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        // 验证通过
        if (!err) {
          // 调新增接口
          addProject(values).then(res => {
            console.log(res.message)
            this.$message.success(res.message)
          })
          this.ProjectGetList()
          this.visible = false
          this.confirmLoading = false
          this.form.resetFields()
          return false
        } else {
          console.log('error submit!!')
          this.confirmLoading = false
          return false
        }
      })
    },
    // 取消按钮事件
    handleCancel (e) {
      console.log('点击取消按钮')
      this.visible = false
    },
    // 编辑事件
    // editHandler (item) {
    //   this.$message.success('编辑')
    //   console.log('id:', item.id)
    //   this.$router.push({ path: '/project/project-info', query: { id: item.id } })
    // },
    // 删除事件
    deleteHandler (item) {
      this.$message.success('删除')
      console.log('id:', item.id)
    },
    // 编辑事件
    projectClick (item) {
      console.log('点击', item.id)
      // this.$store.commit('SET_ROUTERS', aaa)
      // console.log(this.$store, '@@@')
      this.$router.push({ path: '/project/project-info', query: { id: item.id } })
      // 存项目id进入localStorage
      localStorage.setItem('project_id', item.id)
    },
    // 获取项目列表
    ProjectGetList () {
      projectList().then(res => {
        console.log(res)
        this.dataSource = res.data.results
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';

.card-list {
  /deep/ .ant-card-body:hover {
    .ant-card-meta-title > a {
      color: @primary-color;
    }
  }

  /deep/ .ant-card-meta-title {
    margin-bottom: 12px;

    & > a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  /deep/ .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    margin-bottom: 1em;
  }
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.ant-card-actions {
  background: #f7f9fa;

  li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.45);
    width: 50%;

    &:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }

    a {
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      display: inline-block;
      width: 100%;
      &:hover {
        color: @primary-color;
      }
    }
  }
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 142px;
}
</style>
