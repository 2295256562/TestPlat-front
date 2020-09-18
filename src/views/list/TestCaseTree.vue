<!-- 组件说明 -->
<template>
  <div style="height:100%; background:#FFF">
    <h3 style="color:rgb(32, 45, 64); font-size: 20px;font-weight: bold; padding:10px 16px">用例管理</h3>
    <a-input-search placeholder="搜索分组" style="border: none !important; padding: 0px 16px" @search="onSearch" />
    <div class="casual">
      <span class="rootSection">
        <a-icon type="database" />
        <span style="margin-left: 8px;font-size: 20px">全部用例</span>
      </span>
      <div class="css-1avq18a-actionGroup">
        <a-icon type="diff" />
        <a-icon type="copy" />
      </div>
      <div class="css-1avq18a-actionGroup">
        <a-icon type="plus-circle"/>
      </div>
    </div>
    <el-tree
      :data="data"
      style="min-height:70vh; padding: 10px 16px"
      node-key="id"
      :default-expanded-keys="[1]"
      :default-checked-keys="[1]"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
    </h3></div>
</template>

<script>
import Vue from 'vue'
import { Tree, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Tree)
Vue.use(Button)

let id = 1000
export default {
  data () {
    const data = [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }]
      return {
        data: JSON.parse(JSON.stringify(data)),
        Classify: ''
      }
      },

      methods: {
        append (data) {
        const newChild = { id: id++, label: 'testtest', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      }
  }
}
</script>
<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
.casual {
  display: flex;
  flex-shrink: 0;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  height: 40px;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 0px 0px;
}
.rootSection {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  height: 100%;
  flex: 1 0 76px;
  padding: 0px 16px;
  cursor: default;
}
.css-1avq18a-actionGroup {
    position: relative;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 0px 8px;
    height: 32px;
    font-size: 24px
}
</style>
