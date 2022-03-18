<template>
  <div  style="height: 100%;">
      <div class="menu" >
        <el-tree
          :data="moduleInfolist"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="ptwopanel" >
        <Modulelistpublish ref="portalInfo" :dictValue="dictValue" > </Modulelistpublish>
      </div>
  </div>
</template>

<script>
import Modulelistpublish from './ModuleListPublish.vue'
export default {
  data() {
    return {
      moduleInfolist: [],
      defaultProps: {
        children: "children",
        label: "ModuleName",
      },
      dictValue:''
    };
  },
  created() {
    this.getModuleInfoList();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      // this.dictValue = data.GitlabUrl;
      this.dictValue = data ;
    },
    async getModuleInfoList() {
      const { data: res } = await this.$http.get("/api/getmilist", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.moduleInfolist = res.data;
      this.total = res.data.length;
      console.log(res);
    },
  },
   components:{
        Modulelistpublish
    }
};
</script>


<style  scoped>
.el-tree {
   height: 100%;
}
.pagecontent {
    padding: 16px;
    height: 100%;
    overflow: auto;
    
}
.ptwopanel {
    padding: 16px 50px 0 20px;
    height: 100%;
    display: flex;
    float: left;
    width: calc(100% - 250px);;
}
.chart-wrap {
    position: absolute;
   
    bottom: 15px;
    left: 250px;
    right: 15px;
    box-shadow: 0 0 5px rgba(0,0,0,.1);
}
.menu {
  width: 250px;
  padding: 10px;
  box-sizing: border-box;
  float: left;

}
.orgtree {
  width: 220px;
  padding: 10px;
}
.showMenuBox .menu_item {
  line-height: 32px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #181e28;
  padding-left: 12px;
}
.showMenuBox .menu {
  /* position: absolute; */
  position: fixed;
  z-index: 100;
  width: 104px;
  /* height: 128px; */
  background: #fff;
  box-shadow: 0px 2px 8px 0px rgba(18, 21, 41, 0.16);
  border-radius: 2px;
  cursor: pointer;
}
.showMenuBox li:hover {
  color: #df3f3f;
}
.tree_bottom_btn {
  margin-top: 50px;
  text-align: center;
}
.parentName {
  background: #f5f6f7;
  border-radius: 2px;
  padding: 0 15px;
  height: 28px;
  line-height: 28px;
  margin-top: 6px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
</style>