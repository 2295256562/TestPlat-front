<!-- 组件说明 -->
<template>
  <a-modal
    title="新增关键字"
    :visible.sync="visi"
    width="60%"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div style="margin-bottom: 20px">
      <span style="font-size:14px">自定义名称:</span>
      <a-input v-model="name" placeholder="请给你的关键字输入名称" style="width: 300px;margin-left:10px" />
    </div>
    <div>
      <div class="tool-bar">
        <span>请选择主题</span>
        <a-select v-model="cmTheme" placeholder="请选择" style="width: 120px; margin-left:10px">
          <a-select-option v-for="item in cmThemeOptions" :key="item" :label="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>

        <span style="margin-left: 20px">请选择编辑模式</span>
        <a-select
          v-model="cmEditorMode"
          placeholder="请选择"
          style="width:120px; margin-left: 10px"
          @change="onEditorModeChange"
        >
          <a-select-option
            v-for="item in cmEditorModeOptions"
            :key="item"
            :label="item"
            :value="item"
          >{{ item }}</a-select-option>
        </a-select>
        <!-- <a-button type="primary" style="margin-left:10x" @click="setStyle">修改样式</a-button> -->
        <a-button type="primary" style="margin-left:10px" @click="getValue">获取内容</a-button>
        <a-button type="primary" style="margin-left:10px" @click="setValue">修改内容</a-button>
        <codeEditor
          style="margin-top: 20px"
          ref="cmEditor"
          :cmTheme="cmTheme"
          :cmMode="cmMode"
          :autoFormatJson="autoFormatJson"
          :jsonIndentation="jsonIndentation"
        ></codeEditor>
      </div>
    </div>
  </a-modal>
</template>

<script>
import codeEditor from '@/views/dataCentre/codeEditor'
import { debugPy } from '@/api/interface'
export default {
  components: {
    codeEditor
  },
  props: {
    visi: Boolean
  },
  data () {
    return {
      name: '',
      cmTheme: '3024-day', // codeMirror主题
      // codeMirror主题选项
      cmThemeOptions: [
        // 'default',
        'panda-syntax',
        '3024-day',
        '3024-night',
        'ambiance'
      ],
      cmEditorMode: 'python', // 编辑模式
      cmEditorModeOptions: [
                'json',
                'sql',
                'javascript',
                // 'css',
                // 'xml',
                // 'html',
                'yaml',
                // 'markdown',
                'python'
            ],
            cmMode: 'application/json', // codeMirror模式
            jsonIndentation: 2, // json编辑模式下，json格式化缩进 支持字符或数字，最大不超过10，默认缩进2个空格
            autoFormatJson: true // json编辑模式下，输入框失去焦点时是否自动格式化，true 开启， false 关闭
    }
  },
  methods: {
    handleOk () {
      // 获取代码
      const content = this.$refs.cmEditor.getValue()
      console.log(content)
      // 判断名称是否为空
      if (this.name === '' || null) {
        this.$message.error('请输入自定义名称')
        return
      }
      if (content === '' || null) {
        this.$message.error('关键字不可为空')
      }
    },
    handleCancel (e) {
      this.$emit('changeVisible', false)
    },

    // 切换编辑模式事件处理函数
    onEditorModeChange (value) {
      switch (value) {
        case 'json':
            this.cmMode = 'application/json'
            break
        case 'sql':
            this.cmMode = 'sql'
            break
        case 'javascript':
            this.cmMode = 'javascript'
            break
        case 'xml':
            this.cmMode = 'xml'
            break
        case 'css':
            this.cmMode = 'css'
            break
        case 'html':
            this.cmMode = 'htmlmixed'
            break
        case 'yaml':
            this.cmMode = 'yaml'
            break
        case 'markdown':
            this.cmMode = 'markdown'
            break
        case 'python':
            this.cmMode = 'python'
            break
        default:
            this.cmMode = 'application/json'
          }
        },

        // 获取内容
        getValue () {
            const content = this.$refs.cmEditor.getValue()
            console.log(content)
            const obj = {
              'code': content
            }
            debugPy(obj).then(res => {
              console.log(res)
            })
        },
        // 修改内容
        setValue () {
            const jsonValue = {
                name: 'laiyu',
                addr: '广东省深圳市',
                other: 'nothing',
                tel: '168888888',
                intro: [{ item1: 'item1' }]
            }
            this.$refs.cmEditor.setValue(JSON.stringify(jsonValue))
        }
    }
  }
</script>
<style>
.CodeMirror {
  /* height: auto; */
}
.code-mirror-div {
  position: absolute;
  top: 0px;
  left: 2px;
  right: 5px;
  bottom: 0px;
  padding: 2px;
}
</style>
