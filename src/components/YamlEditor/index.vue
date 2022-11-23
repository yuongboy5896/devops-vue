<template>
  <div >
    <textarea ref="textarea"  cols="30" rows="10"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import "codemirror/addon/selection/active-line"; // 代码高亮
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/yaml-lint';
import "codemirror/mode/xml/xml"; 
import 'codemirror/addon/hint/xml-hint'
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/brace-fold";

window.jsyaml = require('js-yaml') // 引入js-yaml为codemirror提高语法检查核心支持

export default {
  name: 'YamlEditor',
  // eslint-disable-next-line vue/require-prop-types
 // props: ['value'],
  props: {
    value: {
      type: String,
      default: "- hosts: all\n  become: yes\n  become_method: sudo\n  gather_facts: no\n\n  tasks:\n  - name: \"install {{ package_name }}\"\n    package:\n      name: \"{{ package_name }}\"\n      state: \"{{ state | default('present') }}\"",
    },
    mode: {
      type: String,
      default: "text/yaml", // yaml / application/json
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      yamlEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.yamlEditor.getValue()
      if (value !== editorValue) {
        this.yamlEditor.setValue(this.value)
      }
    }
  },
  mounted() {
    this.yamlEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true, // 显示行号
      mode: 'text/x-yaml', // 语法model
      styleActiveLine: true, // 设置光标所在行高亮
      lineWrapping: true, // 自动换行
      gutters: ['CodeMirror-lint-markers'],  // 语法检查器
      theme: 'monokai', // 编辑器主题
      lint: true, // 开启语法检查
      autoRefresh: true,
      scrollbarStyle: "overlay",
    })

    this.yamlEditor.setValue(this.value)
    this.yamlEditor.on('change', (cm) => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.yamlEditor.getValue()
    }
  }
}
</script>

<style scoped>
.yaml-editor{
  height: 100%;
  outline: 0;
  position: relative;
}
.yaml-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}
.yaml-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.yaml-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
