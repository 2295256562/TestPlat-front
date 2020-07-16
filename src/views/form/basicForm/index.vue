<template>
  <page-header-wrapper content="自动化测试工程">
    <a-card :body-style="{padding: '24px 32px', display: 'flex'}" :bordered="true">
      <div class="page_left">
        <div class="tab flex-row">
          <div
            class="tab_btn"
            v-for="item in tabs"
            :key="item.title"
            @click="handleTab(item)"
            :class="{is_active: acticeTab === item.title}"
          >{{ item.title }}</div>
        </div>
        <div class="flex-row search">
          <a-input placeholder="搜索接口" class="mr20" />
          <a-button type="primary" @click="HandleAddClassify">{{ acticeTab === '测试集合' ? '添加集合' : '添加分类' }}</a-button>
        </div>
        <div class="contain">
          <a-tree multiple :defaultSelectedKeys="['1']" :defaultExpandedKeys="['1-1']" @select="onSelect" @expand="onExpand">
            <a-tree-node v-for="(item) in this.responseData" :key="item.id + ''" :ryDm="item.name">
              <div slot="title" style="display:flex">
                <span>{{ item.name }}</span>
                <span class="flo">
                  <!-- <a-icon type="edit" style="margin-left:20%" @click.stop="editQzmc(item)"/> -->
                  <a-icon type="delete" style="margin-left:150px" @click.stop="deleteclassify(item)"></a-icon>
                </span>
              </div>
              <a-tree-node v-for="(it) in item.data" :key="item.id + '-' + it.id" :title="it.name" is-leaf>
                <!-- <a-tree-node v-for="(i) in it.data" :key="item.id + '-' + it.id + '-' +i.id" :title="i.name" is-leaf /> -->
              </a-tree-node>
            </a-tree-node>
          </a-tree>
        </div>
      </div>
      <div class="page_right">
        <router-view />
      </div>
    </a-card>
    <a-modal v-model="visible" title="新建分类" @ok="handleOk" :destroyOnClose="true">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item :label="acticeTab === '测试集合' ? '集合名称' : '分类名称'">
          <a-input
            v-decorator="['model_name', { rules: [{ required: true, message: '请输入分类名称!' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
  import { addModel, InterfaceList, rallyList } from '@/api/interface'
import Vue from 'vue'
import { Tree } from 'ant-design-vue'
Vue.use(Tree)
const tabs = [{ title: '接口列表' }, { title: '测试集合' }]
export default {
  name: 'BaseForm',
  data () {
    return {
      tabs,
      list: [],
      acticeTab: '接口列表',
      responseData: [],
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      modelList: [],
      data: [],
      project_id: localStorage.getItem('project_id')
    }
  },
  created () {
    // 获取所有的接口
    this.handleGetInterface()
    this.onSelect(['1'])
  },
  methods: {
    // // 获取所有项目
    // handleGetProjectList () {
    //   projectList().then(res => {
    //     this.data = res.data.results
    //     console.log(this.data)
    //   })
    // },

    // 添加分类
    HandleAddClassify () {
      this.visible = true
      // this.handleGetProjectList()
    },
    handleOk (e) {
      console.log(e)
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const obj = {
            ...values,
            'project_id': this.project_id
          }
          if (this.acticeTab === '接口列表') {
              addModel(obj).then(res => {
              this.$message.success(res.message)
              this.visible = false
              this.handleGetInterface()
            })
          } else {
            console.log('添加集合')
          }
        }
      })
      // this.$router.go(0)
    },
    handleSelectChange (value) {
      console.log(value)
    },
    // 获取接口列表 返回当前项目接口列表
    handleGetInterface () {
      InterfaceList(this.project_id).then(res => {
        this.responseData = res.data
        console.log(this.responseData)
      })
    },
    onSelect (keys, event) {
      console.log('Trigger Select', keys, event)
      var first = keys.shift()
      var str = first.split('-')
      var apiId = str[1]
      var modelId = str[0]
      if (str.length > 1) {
        console.log('详情')
        this.$router.push({ path: '/api/interface-info', query: { 'modelId': modelId, 'apiId': apiId } })
      } else {
        console.log('列表', modelId)
        this.$router.push({ path: '/api/interface-list', query: { 'modelId': modelId } })
      }
      // console.log(first)
      // console.log(typeof first)
      // console.log(str)
    },
    onExpand () {
      console.log('Trigger Expand')
    },

    // 接口和用例的切换
    handleTab (item) {
      console.log(item.title)
      this.acticeTab = item.title
      if (item.title === '测试集合') {
        this.handleGetTestRally()
      } else {
        this.handleGetInterface()
      }
    },

    // 获取项目的测试集合
    handleGetTestRally () {
      rallyList(this.project_id).then(res => {
        console.log(res.data)
        this.responseData = res.data
      })
    },
    // 删除项目分类
    deleteclassify (item) {
      console.log(item, '1111')
    }
    // 获取接口列表
    // handleGetInterfaceList (obj) {
    //   projectInterList(obj).then(res => {
    //     console.log(res.daat)
    //   })
    // }
  }
}
</script>
<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}
.page {
  justify-content: center;
  align-items: flex-start;
  padding: 32px;
  height: 600px;
}
.page_left {
  width: 280px;
  /*height: 100%;*/
  background: #fff;
  border: 1px solid #ebeef5;
}
.page_right {
  flex: 1;
  margin-left: 20px;
  background: #fff;
  height: 100%;
  min-height: 80vh;
  border: 1px solid #ebeef5;
}
.tab {
  width: 100%;
}
.tab_btn {
  flex: 1;
  color: #333;
  font-size: 17px;
  text-align: center;
  padding: 14px;
  cursor: pointer;
}
.tab_btn:hover {
  opacity: 0.8;
}
.is_active {
  background: #c8c8c8;
}
.search {
  width: 100%;
  padding: 15px 20px;
  background: #c8c8c8;
}
.mr20 {
  margin-right: 20px;
}
.ant-tree li {
  text-align: left;
}
.ant-tree-title {
  width: 100%;
}
</style>
