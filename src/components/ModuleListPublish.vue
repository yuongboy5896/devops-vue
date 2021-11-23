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
          <el-button type="primary" @click="addPipeLineDialogVisible = true"
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
          <template slot-scope="scope"> </template>
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
    <!-- 树型部署模块对话框 -->
    <el-dialog
      title="添加部署流程"
      :visible.sync="addPipeLineDialogVisible"
      :rules="addPipeLineFormRules"
      width="50%"
      @close="setPipeLineDialogClosed"
    >
      <el-form
        :model="addPipeLineForm"
        :rules="addPipeLineFormRules"
        ref="editPipeLineFormRef"
        label-width="70px"
      >
        <div>
          <el-form-item label="发布流程名称" prop="ModuleName">
            <el-input v-model="addPipeLineForm.Pipename"></el-input>
          </el-form-item>
          <el-form-item label="发布流程code" prop="ModuleName">
            <el-input v-model="addPipeLineForm.PipeCode"></el-input>
          </el-form-item>
          <el-form-item label="模块的名字" prop="ModuleName">
            <el-input v-model="addPipeLineForm.Department" disabled></el-input>
          </el-form-item>
          <el-form-item label="部署环境" prop="ModuleCode">
            <el-select v-model="selectedDeployEnvItem" placeholder="请选择">
              <el-option
                v-for="item in deployEnvList"
                :key="item.Id"
                :label="item.EnvName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="命名空间" prop="ModuleCode">
            <el-input v-model="addPipeLineForm.NameSpace"></el-input>
          </el-form-item>
          <el-form-item label="模块的分支" prop="ModuleCode">
            <el-select v-model="addPipeLineForm.Branch" placeholder="请选择">
              <el-option
                v-for="item in branchList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块的url" prop="ModuleCode">
            <el-input
              v-model="addPipeLineForm.SshUrlToRepo"
              disabled
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPipeLineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePipeLineInfo">确 定</el-button>
        <el-button type="primary" @click="setPipeLineInfo">生产信息</el-button>
      </span>
    </el-dialog>
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
      pipeLineList: [],
      // PipeLine添加模块对话框的显示与隐藏
      addPipeLineDialogVisible: false,
      // addForm
      addPipeLineForm: {
        Pipename: "",
        PipeCode: "",
        TechnologyType: "",
        EnvName: "",
        SshUrlToRepo: "",
        Branch: "",
        GitlabId: "",
        ModuleName: "",
        ModuleCode: "",
        Department: "",
        ShowUrl: "",
        ModuleName:"" //临时存储模块信息
      },
    };
  },
  props: {
    dictValue: {
      type: Object,
    },
  },
  watch: {
    dictValue() {
      //普通监听
      this.getPipeLineList();
    },
  },
  created() {
    console.log("发布流程");
    this.getPipeLineList();
  },
  methods: {
    async getPipeLineList() {
      const { data: res } = await this.$http.get(
        "/api/getpllistbyid/" + this.dictValue.GitlabId,
        {
          params: this.queryInfo,
        }
      );
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.pipeLineList = res.data;
      this.total = res.data.length;
      console.log(res);
    },
    // 添加流水线部署
    async addPipelineDialog(ModuleInfo) {
      const { data: res } = await this.$http.get(
        "/api/getgrlist/" + ModuleInfo.GitlabId
      );

      if (res.code !== 200) {
        return this.$message.error("获取Gitlab数据失败！");
      }

      // 把获取到的权限数据保存到 data 中
      this.branchList = res.data;
      console.log(this.branchList);
      this.addPipeLineForm.GitlabId = ModuleInfo.GitlabId;
      this.addPipeLineForm.SshUrlToRepo = ModuleInfo.SshUrlToRepo;
      this.addPipeLineForm.Department = ModuleInfo.ModuleCode;
      this.addPipeLineForm.ModuleName = ModuleInfo.ModuleName;
      this.addPipeLineForm.ModuleCode = ModuleInfo.ModuleCode;
      this.addPipeLineForm.TechnologyType = ModuleInfo.TechnologyType;


      // 获取环境列表
      const { data: resde } = await this.$http.get("/api/getdelist");
      if (resde.code !== 200) {
        return this.$message.error("获取环境列表数据失败！");
      }

      // 把获取到的环境列表保存到 data 中
      this.deployEnvList = resde.data;
      console.log(this.deployEnvList);
      this.addPipeLineDialogVisible = true;
    },
    //
    setPipeLineDialogClosed() {
      this.$refs.addPipeLineFormRules.resetFields();
    },
    // 保存部署流程
    async savePipeLineInfo() {
      if (!this.addPipeLineForm.Branch) {
        return this.$message.error("请选择分支！");
      }
      if (!this.selectedDeployEnvItem) {
        return this.$message.error("请选择环境信息！");
      }
      debugger
      this.$refs.editPipeLineFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加模块的网络请求
        console.log(this.addPipeLineForm)
        debugger
        this.addPipeLineForm.EnvName =  this.selectedDeployEnvItem.EnvName
        //this.addPipeLineForm.EnvName =  this.selectedDeployEnvItem.EnvName
        const { data: res } = await this.$http.post("/api/addpl", this.addPipeLineForm);
        console.log(res);
        if (res.code !== 200) {
          this.$message.error("添加模块失败！");
          return;
        }

        this.$message.success("添加模块成功！");
        // 隐藏添加模块的对话框
        this.addPipeLineDialogVisible = false;
        // 重新获取模块列表数据
        this.getModuleInfoList();
      });
    },
    // 生产部署流程信息，部署名称、部署编号
    setPipeLineInfo() {
     // if (!this.selectedBranchId) {
      //  return this.$message.error("请选择分支！");
    //  }
      if (!this.selectedDeployEnvItem) {
        return this.$message.error("请选择环境信息！");
      }
      //if (!this.selectedNameSpaceId) {
      //  return this.$message.error("请选择环境信息命名空间！");
     // }
      console.log(this.selectedDeployEnvItem)
      this.addPipeLineForm.PipeCode = this.selectedDeployEnvItem.EnvCode + "-" +  this.addPipeLineForm.Department;
      this.addPipeLineForm.Pipename = this.selectedDeployEnvItem.EnvName + "-" +  this.addPipeLineForm.ModuleName;
    },
  },
};
</script>
