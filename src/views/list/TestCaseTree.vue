<!-- 组件说明 -->
<template>
  <div style="height:100%; background:#FFF">
    <h3 style="color:rgb(32, 45, 64); font-size: 20px;font-weight: bold; padding:10px">用例管理</h3>
    <!-- <a-input v-model="Classify" style="margin:10px 0"></a-input> -->
    <el-tree
      :data="data"
      style="height:100%"
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
</style>
