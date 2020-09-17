<!-- 组件说明 -->
<template>
  <div class="layout">
    <div class="right">
      <TestCaseTree />
    </div>
    <div class="left">
      <caseTable />
    </div>
  </div>
</template>

<script>
import TestCaseTree from '@/views/list/TestCaseTree.vue'
import caseTable from '@/views/list/caseTable'
export default {
  components: {
    TestCaseTree,
    caseTable
  }
}
</script>
<style>
.layout{
  display: flex;
  width: 100%;
}
.right {
  float: left;
  width: 25%;
}
.left {
  margin: 0 20px;
  flex: 1;
}
</style>
