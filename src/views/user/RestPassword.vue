<template>
<div class="main">
  <a-form class="user-layout-login"  :form="form"  @submit="handleSubmit">
    <a-form-item>
      <a-input
        v-decorator="[
          'user',
          { rules: [{ required: true, message: '请输入用户名' }] },
        ]"
        placeholder="Username"
      >
        <!-- <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" /> -->
      </a-input>
    </a-form-item>
     <a-form-item>
        <a-auto-complete
          type="text"
          placeholder="email"
          @change="handleChange"
          v-decorator="['email', {rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}]"
        >
          <template slot="dataSource">
            <a-select-option v-for="website in autoCompleteResult" :key="website">
              {{ website }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" class="login-button">
        发送邮件
      </a-button>
    </a-form-item>
  </a-form>
</div>
</template>

<script>
import { forgetPassword } from '@/api/interface'
export default {
  name: 'RestPassword',
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      autoCompleteResult: []
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          forgetPassword(values).then(res => {
            console.log(res.data, 'data')
          })
        }
      })
    },
    // email 输入提示
    handleChange (value) {
      console.log(value, '22')
      let autoCompleteResult
      if (!value) {
        autoCompleteResult = []
      } else {
        autoCompleteResult = ['@daddylab.com', '@qq.com', '@163.com'].map(domain => `${value}${domain}`)
      }
      this.autoCompleteResult = autoCompleteResult
    }
  }
}
</script>
<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
