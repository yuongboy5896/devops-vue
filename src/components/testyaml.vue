<template>
    <div>12312312
    <div class="editor-container">
      <YamlEditor v-model="YamlValues" mode="yaml" /> 
    </div>
  </div>
</template>

<script>
const yamlData = "- hosts: all\n  become: yes\n  become_method: sudo\n  gather_facts: no\n\n  tasks:\n  - name: \"install {{ package_name }}\"\n    package:\n      name: \"{{ package_name }}\"\n      state: \"{{ state | default('present') }}\"";
import YamlEditor from '@/components/YamlEditor/CodeEditor.vue';
export default {
  components: { YamlEditor }, 
  data() {
    return {
      YamlValues: yamlData,
    };
  },
}
</script>