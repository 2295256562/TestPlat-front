<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div style="height: 200px;display:flex">
        <div style="float:left">
          <h1 style="font-family: Microsoft YaHei">接口测试报告</h1>
          <p class="attribute">
            <strong>测试人员 :</strong> 张三
          </p>
          <p class="attribute">
            <strong>开始时间 :</strong> 2020-07-15 14:37:03
          </p>
          <p class="attribute">
            <strong>合计耗时 :</strong> 0:00:00.060468
          </p>
          <p class="attribute">
            <strong>测试结果 :</strong> 共 1，错误 1，通过率= 0.00%
          </p>
          <p id="show_detail_line">
            <a-tag color="#00FF00">通过{ 0 }</a-tag>
            <a-tag color="#FF3030">失败{ 0 }</a-tag>
            <a-tag color="#ed9c28">错误{ 1 }</a-tag>
            <a-tag color="#39b3d7">所有{ 1 }</a-tag>
          </p>
        </div>
        <div style="float: right" id="c1"></div>
      </div>
    </a-card>
    <a-card class="card-p" :bordered="false" style="margin-top:20px;width:55%">
      <a-collapse v-model="activeKey" :bordered="false">
        <a-collapse-panel key="1" header="This is panel header 1">
          <p>{{ text }}</p>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="This is panel header 2" :disabled="false">
          <p>{{ text }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { Collapse } from 'ant-design-vue'
import Vue from 'vue'
Vue.use(Collapse)
export default {
  data () {
    return {
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      activeKey: ['1']
    }
  },
  watch: {
    activeKey (key) {
      console.log(key)
    }
  }
}
</script>
<style>
</style>
