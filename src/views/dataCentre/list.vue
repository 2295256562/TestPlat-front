<!-- 组件说明 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <div style="display: flex;">
          <a-form layout="inline">
            <a-form-item label="名称">
              <a-input v-decorator="['name']" placeholder=""/>
            </a-form-item>
          </a-form>
        </div>
        <a-button type="primary" @click="HandlerAddKey" style="margin-left: auto">添加关键字</a-button>
      </div>
      <a-table :columns="columns" :data-source="data"></a-table>
    </a-card>

    <dataModel :visi="visible" @changeVisible="changeVisible"></dataModel>
  </page-header-wrapper>
</template>

<script>
import dataModel from '@/views/dataCentre/dataModel'
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  }]
const data = [
{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer']
}]
export default {
  components: {
    dataModel
  },
  data () {
    return {
      data,
      columns,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      visible: false
    }
  },
  methods: {
      HandlerAddKey () {
        this.visible = !this.visible
      },
      changeVisible (value) {
        console.log(value)
        this.visible = value
      }
    }
}
</script>
<style></style>
