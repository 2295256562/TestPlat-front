<template>
  <div class="warper">
    <div class="top">
      <h2 class="css-1ngm5ko-CaseHeading-heading">全部用例</h2>
      <div style="margin-left: auto;">
        <a-input-group compact>
          <a-select id="select" class="mag" default-value="5" style="width: 100px" @change="handleChangeLevel">
            <a-select-option value="5">
              <div class="css-1r39inl-PriorityWrapper">
                <span>全部等级</span>
              </div>
            </a-select-option>
            <a-select-option value="1">
              <div class="css-1r39inl-PriorityWrapper">
                <div class="css-1ok1vvp-PriorityIcon"></div>
                <span>P0</span>
              </div>
            </a-select-option>

            <a-select-option value="2">
              <div class="css-1r39inl-PriorityWrapper">
                <div class="css-1lg18e4-PriorityIcon"></div>
                <span>P1</span>
              </div>
            </a-select-option>
            <a-select-option value="3">
              <div class="css-1r39inl-PriorityWrapper">
                <div class="css-74z9al-PriorityIcon"></div>
                <span>P2</span>
              </div>
            </a-select-option>
            <a-select-option value="4">
              <div class="css-1r39inl-PriorityWrapper">
                <div class="css-i579lm-PriorityIcon"></div>
                <span>P3</span>
              </div>
            </a-select-option>
          </a-select>
          <a-input style="width: 60%"/>
        </a-input-group>
      </div>
      <a-button icon="snippets" type="primary" @click="addCase">创建用例</a-button>
    </div>

    <!-- 列表 -->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="#" type="index" width="80px"></el-table-column>
      <el-table-column
        prop="name"
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="level"
        label="等级"
      >
      </el-table-column>
      <el-table-column
        prop="num"
        label="次数"
      >
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
      tableData: [
        { name: '1212', level: '1', num: '2' }
      ]
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
