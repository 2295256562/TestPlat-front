<template>
  <a-modal
    title="高级参数设置"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>{{ ModalText }}</p>
  </a-modal>
</template>

<script>
  export default {
    // name: 'modfiyPasswordDialog',
    props: {
      visible: {
        type: Boolean,
        defalut: false
      }
    },
    data () {
      return {
        ModalText: '111'
      }
    },
    methods: {
      handleOk () {},
      handleCancel () {
        this.$emit('visible', !this.visible)
      }
    }

  }
</script>

<style scoped>

</style>
