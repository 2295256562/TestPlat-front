<template>
  <div class="json-editor">
    <textarea ref="textarea"/>
  </div>
</template>
<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/darcula.css'
// require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data () {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value (value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  mounted () {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: false,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      matchBrackets: true,
      lint: true
      })
    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue () {
      return this.jsonEditor.getValue()
    }
  }
}
</script>
<style scoped>
.json-editor {
  height: 100%;
  position: relative;
}
.json-editor >>> .CodeMirror {
  height: auto;
  min-height: 180px;
}
.json-editor >>> .CodeMirror-scroll {
  min-height: 180px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
