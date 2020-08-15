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
          <!-- <a-tree multiple :defaultSelectedKeys="[1]" @select="onSelect" @expand="onExpand">
            <a-tree-node v-for="(item) in this.responseData" :key="item.id + ''" :ryDm="item.name">
              <div slot="title" style="display:flex" @click="treeList(item)">
                <span>{{ item.name }}</span>
                <span class="flo">
                  <a-icon type="delete" style="margin-left:30%" @click.stop="deleteclassify(item)"></a-icon>
                </span>
              </div>
              <a-tree-node v-for="(it) in item.data" :key="item.id + '-' + it.id" :lll="it.name" is-leaf >
                <div slot="title" style="display:flex" @click="treeinfo(it)">
                  <span>{{ it.name }}</span>
                </div>
              </a-tree-node>
            </a-tree-node>
          </a-tree> -->
          <!-- <ul id="com_headtop">
            <li class="first-menu" v-for="nav in responseData" :key="nav.id" @click="treeList(nav)">
              <div class="felx">
                <a-icon type="folder" style="font-size:18px;margin-right:10px" />
                <span>{{ nav.name }}</span>
              </div>
              <ul class="second-menu" v-show="showTag">
                <li v-for="item in nav.data" :key="item.id" @click="treeinfo(item)">
                  <div class="felx">
                    <a-tag color="Green" v-if="item.method === 'GET'">
                      GET
                    </a-tag>
                    <a-tag color="Orange" v-if="item.method === 'POST'">
                      POST
                    </a-tag>
                    <span>{{ item.name }}</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul> -->
          <a-tree
            :draggable="true"
            ref="tree"
            :default-selected-keys="currentNodekey"
            :default-checked-keys="currentNodekey"
            :default-expanded-keys="expandedkeys"
            @select="onSelect"
          >
            <a-tree-node v-for="qzlb in responseData" :key="qzlb.id" :ryDm="qzlb.ryDm">
              <div slot="title" class="qz-title" @click="treeList(qzlb)">
                <span style="width: 14vw">{{ qzlb.name }}</span>
                <span class="icon-box">
                  <a-icon type="plus" @click="editQzmc(qzlb)" />
                  <a-icon type="delete" style="margin-left: 10px" @click="deleteQzBtn(qzlb)" />
                </span>
              </div>
              <a-tree-node v-if="qzlb.data.length>0" v-for="child in qzlb.data" :key="child.id" :ryDm="child.ryDm">
                <div slot="title" class="qy-title" @click="treeinfo(child)">
                  <a-tag color="MediumAquamarine" v-if="child.method === 'GET'">
                    {{ child.method }}
                  </a-tag>
                  <a-tag color="DeepSkyBlue" v-if="child.method === 'POST'">
                    {{ child.method }}
                  </a-tag>
                  <span>{{ child.name }}</span>
                  <span class="icon-box">
                    <a-icon type="delete" @click="deleteQzBtn(child)"></a-icon>
                  </span>
                </div>
              </a-tree-node>
            </a-tree-node>
          </a-tree>
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
  import { addModel, InterfaceList, rallyList, AddRally } from '@/api/interface'
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
      showTag: false,
      visible: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      modelList: [],
      data: [],
      project_id: localStorage.getItem('project_id'),
      currentNodekey: [],
      expandedkeys: [] // 默认展开的节点树
    }
  },
  watch: {
    deptTreeData (val) {
      if (val) {
        this.$nextTick(() => {
                document.querySelector('.a-tree-node__content').click()
            })
      }
    }
  },
  created () {
    // 获取所有的接口
    this.handleGetInterface()
  },
  methods: {
    // 添加分类
    HandleAddClassify () {
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
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
            const obj = {
            'name': values.model_name,
            'project': this.project_id
          }
            AddRally(obj).then(res => {
              this.$message.success(res.message)
              this.visible = false
              this.handleGetTestRally()
            })
          }
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
    },
    // 获取接口列表 返回当前项目接口列表
    handleGetInterface () {
      InterfaceList(this.project_id).then(res => {
        this.responseData = res.data
        console.log(this.responseData, '147852')
      })
      if (this.responseData.length > 0) {
        this.currentNodekey = [this.responseData[0].id]
        this.expandedkeys.push(this.responseData[0].id)
        // this.$refs.tree.setCurrentKey(this.currentNodekey)// 一定要加这个选中了否则样式没有出来
      }
      console.log(this.currentNodekey, 'curr')
    },
    onSelect (keys, event) {
      console.log('selected', keys, event)
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
      if (this.responseData.length > 0) {
        this.currentNodekey = [this.responseData[0].id]
        this.expandedkeys.push(this.responseData[0].id)
        // this.$refs.tree.setCurrentKey(this.currentNodekey)// 一定要加这个选中了否则样式没有出来
      }
    },
    // 删除项目分类 调二次确认
    deleteclassify (item) {
      console.log(item, '1111')
    },

    treeList (item) {
      if (this.acticeTab === '接口列表') {
        this.$router.push({ path: '/api/interface-list', query: { 'modelId': item.id } })
      } else {
        this.$router.push({ path: '/api/case-list', query: { 'case_model': item.id } })
      }
    },
    treeinfo (it) {
      if (this.acticeTab === '接口列表') {
        this.$router.push({ path: '/api/interface-info', query: { 'apiId': it.id } })
      } else {
        this.$router.push({ path: '/api/case-info', query: { 'case': it.id } })
      }
    },
    showNav (e) {
      //  console.log('111111', e.currentTarget)
       this.showTag = !this.showTag
     },
     editQzmc (qzlb) {
      console.log('修改', qzlb)
    },
    deleteQzBtn (qzlb) {
      console.log('删除', qzlb)
    },
    checkable (v) {
      console.log(v, 'checkable')
    },
    selectList (qzlb) {
      console.log('liebiao', qzlb, qzlb.id)
    },
    checkedQzKeys (v) {
      console.log(v, '123')
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
  width: 15vw;
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
/* .contain ul > li{
  padding:10px;
  border-bottom:dotted 1px #dedede;
  font-size:15px;
  color:#999;
}
.contain ul > li i{
  margin-left:5px;
}
.contain ul > li ul li{
  border-bottom:0;
  font-size:14px;
  color:#333;
} */
.contain ul li.first-menu{
  /* overflow: hidden; */
}
.li-st {
  border: #c8c8c8 1px silver;
}
.first-menu {
  margin-left: -10%;
  /* margin-top: 10px; */
}
.second-menu {
  margin-left: -5%;
}
.ul{
  padding-inline-start: 0px
}
.felx {
  display: flex;
  margin: 10px 0;
}
.contain >li:focus{
  background-color: #FF9148;
  outline-style: none;
}
.felx:hover {
  background-color: LightBLue;
}
#com_headtop >li:focus {
  background-color: #FF9148;
  outline-style: none;
}
.icon-box {
  /*margin-left: 60%;*/
  float: right;
}
.qz-title {
  width: 12vw;
  display: flex;
}
.qy-title {
  width: 11vw;
}
.ant-tree li .ant-tree-node-content-wrapper {
  width: 90%;
}
</style>
