<template>
  <div>
   1111 
   <h3>{{ dictValue.GitlabUrl }}</h3>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getModuleInfoList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getModuleInfoList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加发布</el-button
          >
        </el-col>
      </el-row>
           
      <!-- 模块列表区域 -->
      <el-table :data="pipeLineList" border stripe>  
        <el-table-column type="index"></el-table-column>
        <el-table-column label="模块名字" prop="ModuleName"></el-table-column>
        <el-table-column label="发布流程" prop="PipeName"></el-table-column>
        <el-table-column label="流程编码" prop="PipeCode"></el-table-column>
        <el-table-column label="发布环境" prop="EnvName"></el-table-column>
        <el-table-column label="命名空间" prop="NameSpace"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // 获取模块列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      pipeLineList: []
    }
  },
  props: {
    dictValue: {
      type: Object,
    },
  },
  created() {
    console.log("发布流程")  
    this.getPipeLineList();
  },
  methods: {
   async getPipeLineList() {
      const { data: res } = await this.$http.get("/api/getpllist", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.pipeLineList = res.data;
      this.total = res.data.length;
      console.log(res);
    },
  },
};
</script>
