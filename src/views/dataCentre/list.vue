<!-- 组件说明 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号">
                <a-input v-decorator="['note']" placeholder=""/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="data"></a-table>
    </a-card>
  </page-header-wrapper>

</template>

<script>
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
  data () {
    return {
      data,
      columns,
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  }
}
</script>
<style></style>
