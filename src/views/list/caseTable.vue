<template>
  <div class="warper">
    <div class="top">
      <h2 class="css-1ngm5ko-CaseHeading-heading">全部用例</h2>
      <div style="margin-left: 10px; width: 400px">
        <a-input-group compact>
          <a-select default-value="全部等级">
            <a-select-option value="Zhejiang">
              Zhejiang
            </a-select-option>
          </a-select>
          <a-input style="width: 50%"/>
        </a-input-group>
      </div>
      <a-button style="margin-left: auto;" icon="snippets" type="primary" @click="addCase">创建用例</a-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <addCaseModel :modalVisible="visible" :title="type" @changeVisible="changeVisible"/>
  </div>
</template>
<script>
import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import addCaseModel from '@/views/list/addCaseModel'
Vue.use(Table)
Vue.use(TableColumn)

export default {
  components: {
    addCaseModel
  },
  data () {
    return {
      visible: false,
      type: '',
      tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
              id: 31,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              id: 32,
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
          }, {
              id: 999999999,
              date: '',
              name: '',
              address: '' }
            ]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        tableData1: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          hasChildren: true
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    }
  },

  methods: {
    addCase () {
      // 打开弹窗 新增用例
      this.type = '新增用例'
      this.visible = !this.visible
    },
    // 弹窗事件
    changeVisible (value) {
      this.visible = value
    }
  }
}
</script>
<style>
  .warper {
    margin-left: 20xp;
  }
  .top {
    margin: 0 16px;
    display: flex;
  }
  .css-1ngm5ko-CaseHeading-heading {
    font-size: 20px;
    font-weight: bold;
    /* width: 100%; */
    padding-right: 200px;
    height: 32px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    transition: opacity 300ms linear 0s;
    opacity: 1;
  }
</style>
