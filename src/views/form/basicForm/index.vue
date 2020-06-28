<template>
  <page-header-wrapper content="自动化测试工程">
    <a-card :body-style="{padding: '24px 32px', display: 'flex'}" :bordered="true">
      <div class="page_left">
        <div class="tab flex-row">
          <div
            class="tab_btn"
            v-for="item in tabs"
            :key="item.title"
            @click="acticeTab = item.title"
            :class="{is_active: acticeTab === item.title}"
          >{{ item.title }}</div>
        </div>
        <div class="flex-row search">
          <a-input placeholder="搜索接口" class="mr20" />
          <a-button type="primary" @click="HandleAddClassify">添加分类</a-button>
        </div>
        <div class="contain">
          <a-directory-tree multiple :defaultSelectedKeys="['0']" :defaultExpandedKeys="['0']" @select="onSelect" @expand="onExpand">
            <a-tree-node v-for="(item, idx) in list" :key="idx + ''" :title="item.key">
              <a-tree-node v-for="(it, val) in item.data" :key="idx + ',' + val" :title="it.data" />
            </a-tree-node>
          </a-directory-tree>
        </div>
      </div>
      <div class="page_right">
        <router-view />
      </div>
    </a-card>
    <a-modal v-model="visible" title="新建分类" @ok="handleOk" :destroyOnClose="true">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名称">
          <a-input
            v-decorator="['model_name', { rules: [{ required: true, message: '请输入分类名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="所属项目">
          <a-select
            v-decorator="[
              'project_id',
              { rules: [{ required: true, message: '所属项目必填!' }] },
            ]"
            placeholder="请选择所属项目"
            @change="handleSelectChange"
          >
            <a-select-option :key="item.id" :value="item.id" v-for="item in data">
              {{ item.project_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { projectList, addModel, InterfaceList } from '@/api/interface'
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
      data: []
    }
  },
  created () {
    // 获取所有的接口
    this.handleGetInterface()
  },
  methods: {
    initData () {
      this.list = this.responseData.map(it => {
        const obj = {}
        console.log(it, '1111111')
        for (const key in it) {
          console.log(it, '2222222')
          obj.key = key
          if (it[key] instanceof Array) {
            it[key] = it[key].map(item => {
              const newObj = {}
              for (const val in item) {
                newObj.key = val
                newObj.data = item[val]
              }
              return newObj
            })
          }
          obj.data = it[key]
        }
        return obj
      })
      console.log(this.list, '=======')
    },
    initArray (obj1) {
      const obj = {}
      for (const key in obj1) {
        obj.key = key
        obj.data = obj1[key]
      }
      return obj
    },

    // 获取所有项目
    handleGetProjectList () {
      projectList().then(res => {
        this.data = res.data.results
        console.log(this.data)
      })
    },

    // 添加分类
    HandleAddClassify () {
      this.visible = true
      this.handleGetProjectList()
    },
    handleOk (e) {
      console.log(e)
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          addModel(values).then(res => {
            this.$message.success(res.message)
          })
        }
      })
      this.visible = false
      this.handleGetInterface()
    },
    handleSelectChange (value) {
      console.log(value)
    },
    handleGetInterface () {
      InterfaceList().then(res => {
        this.responseData = res.data
        this.initData()
      })
    },
    onSelect (keys, event) {
      console.log('Trigger Select', keys, event)
      if (!keys[0]) return
        let key = ''
        let obj = null
        const arr = keys[0].split(',')
        arr.forEach(it => {
          if (!obj) {
            obj = this.list[it]
          } else {
            obj = obj.data[it]
          }
          key += obj.key + ','
        })
        console.log(key, 'key', obj.id)
        if (obj.id) {
          console.log('跳转详情页', obj.id)
          this.$router.push({ name: 'apiInfo',
          query: {
            id: obj.id
          } })
        } else {
          console.log('跳转列表页')
          this.$router.push({ name: 'Interface',
          query: {
            project: key
           } })
        }
    },
    onExpand () {
      console.log('Trigger Expand')
    }
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
