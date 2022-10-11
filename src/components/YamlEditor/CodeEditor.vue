<template>
  <div >
    <textarea ref="textarea" id="" cols="30" rows="20"></textarea>
  </div>
</template>
<script>
import "codemirror/lib/codemirror.css";
import "codemirror/mode/css/css.js";
import "codemirror/mode/yaml/yaml.js";
import "codemirror/mode/yaml-frontmatter/yaml-frontmatter.js";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/selection/active-line"; // 代码高亮
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/show-hint.css";
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/xq-light.css'
import 'codemirror/addon/lint/yaml-lint'
import "codemirror/theme/monokai.css"; // 主题
import CodeMirror from "codemirror";
export default {
  name: "CodeEditor",
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
      codeMirrorEditor: null, // codeMirror实例化对象
    };
  },
  watch: {
    value: {
      handler(val) {
        if (!this.codeMirrorEditor) return;
        const editorValue = this.getCodeMirrorEditorValue();
        if (val !== editorValue) {
          this.setCodeMirrorEditorValue(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
      setTimeout(this.initCodeMirrorEditor,500)
    // this.initCodeMirrorEditor();
  },
  destroyed() {
    this.codeMirrorEditor.off("change");
  },

  methods: {
    initCodeMirrorEditor() {
      this.codeMirrorEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: this.mode,
        lineNumbers: true, // 显示行数
        lint: true,
        indentUnit: 2, // 缩进单位为2
        smartIndent: true, // 自动缩进是否开启
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true, // 括号匹配
        lineWrapping: true, // 自动换行
        tabSize: 2,
        styleActiveLine: true, // 设置光标所在行高亮
        readOnly: this.readOnly,
         // 使用的语法校验工具
        gutters: ['CodeMirror-lint-markers'],
        theme:"rubyblue",
        autoRefresh: true,
        scrollbarStyle: "overlay",
      });


      if(this.value) this.setCodeMirrorEditorValue(this.value); // 设置值
      this.codeMirrorEditor.on("change", () => {
        const EditorValue = this.getCodeMirrorEditorValue();
        this.$emit("change", EditorValue);
        this.$emit("input", EditorValue);
      });
    },
    // 设置编辑器支持的语言mode
    setCodeMirrorEditorMode(option) {
      this.codeMirrorEditor.setOption("mode", option);
    },

    // 获取编辑器内容
    getCodeMirrorEditorValue() {
      return this.codeMirrorEditor.getValue();
    },
    // 设置编辑器内容
    setCodeMirrorEditorValue(value) {
      return this.codeMirrorEditor.setValue(value);
    },
    // 刷新编辑器
    refreshCodeMirrorEditor() {
      this.codeMirrorEditor.refresh();
    },
  },
};
</script>

<style scoped>
.yaml-editor{
  height: 100%;
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
