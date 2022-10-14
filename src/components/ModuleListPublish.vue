<template>
  <div style="height: 100%">
    <label>{{this.dictValue.ModuleName}} </label>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getPipeLineList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getPipeLineList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addPipelineDialog(dictValue)"
            >添加发布</el-button
          >
        </el-col>
      </el-row>

      <!-- 模块列表区域 -->
      <el-table :data="pipeLineList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="发布环境"  show-overflow-tooltip>
          <template slot-scope="scope">
            <a :href="jenkins+scope.row.PipeCode" target="_blank" class="buttonText">{{scope.row.EnvName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="代码分支" prop="Branch"></el-table-column>
        <el-table-column label="命名空间" prop="NameSpace"></el-table-column>
        <el-table-column label="模块名字" prop="ModuleName"></el-table-column>
        <el-table-column label="发布流程" prop="PipeName"></el-table-column>
        <el-table-column label="流程编码" prop="PipeCode"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showPipeLineInfo(scope.row.Id)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removePipeLineById(scope.row.Id)"
            ></el-button>
            <!--列表部署模块情况-->
            <el-tooltip
              effect="dark"
              content="发布程序"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setPipeLineByIdPublish(scope.row.Id)"
              ></el-button>
            </el-tooltip>
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
    <!-- 树型部署模块对话框 -->
    <el-dialog
      title="添加部署流程"
      :visible.sync="addPipeLineDialogVisible"
      width="50%"
      @close="setPipeLineDialogClosed"
    >
      <el-form
        :model="addPipeLineForm"
        :rules="addPipeLineFormRules"
        ref="addPipeLineFormRef"
        label-width="70px"
      >
        <div>
          <el-form-item label="发布流程名称" prop="PipeName">
            <el-input v-model="addPipeLineForm.PipeName"></el-input>
          </el-form-item>
          <el-form-item label="发布流程code" prop="PipeName">
            <el-input v-model="addPipeLineForm.PipeCode"></el-input>
          </el-form-item>
          <el-form-item label="模块的名字" prop="PipeName">
            <el-input v-model="addPipeLineForm.ModuleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="部署环境" prop="ModuleCode">
            <el-select @change="getNamespaces" v-model="selectedDeployEnvItem" placeholder="请选择">
              <el-option
                v-for="item in deployEnvList"
                :key="item.Id"
                :label="item.EnvName"
                :value="item.Id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="命名空间" prop="ModuleCode">
             <el-select  v-model="addPipeLineForm.NameSpace" placeholder="请选择">
              <el-option
                v-for="item in namespaceList"
                :key="item.metadata.name"
                :label="item.metadata.name"
                :value="item.metadata.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块的分支" prop="PipeName">
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
          <el-form-item label="模块的url">
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

    <!-- 编辑发布模块 -->
    <el-dialog
      title="修改部署流程"
      :visible.sync="editPipeLineDialogVisible"
      width="50%"
      @close="setEditPipeLineDialogClosed"
    >
      <el-form
        :model="editPipeLineForm"
        :rules="editPipeLineFormRules"
        ref="editPipeLineFormRef"
        label-width="70px"
      >
        <div>
          <el-form-item label="发布流程名称" prop="PipeName">
            <el-input v-model="editPipeLineForm.PipeName"></el-input>
          </el-form-item>
          <el-form-item label="发布流程code" prop="PipeName">
            <el-input v-model="editPipeLineForm.PipeCode"></el-input>
          </el-form-item>
          <el-form-item label="模块的名字">
            <el-input v-model="editPipeLineForm.ModuleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="部署环境">
            <el-select @change="getNamespaces" v-model="selectedDeployEnvItem" placeholder="请选择">
              <el-option
                v-for="item in deployEnvList"
                :key="item.Id"
                :label="item.EnvName"
                :value="item.Id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select @click="getNamespaces" v-model="editPipeLineForm.NameSpace" placeholder="请选择">
              <el-option
                v-for="item in namespaceList"
                :key="item.metadata.name"
                :label="item.metadata.name"
                :value="item.metadata.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块的分支">
            <el-select v-model="editPipeLineForm.Branch" placeholder="请选择">
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
              v-model="editPipeLineForm.SshUrlToRepo"
              disabled
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPipeLineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditPipeLineInfo"
          >确 定</el-button
        >
        <el-button type="primary" @click="setEditPipeLineInfo"
          >生产信息</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      //
      jenkins:"",
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
      // PipeLine编辑模块对话框的显示与隐藏
      editPipeLineDialogVisible: false,
      // addPipeLineForm
      addPipeLineForm: {
        PipeName: "",
        PipeCode: "",
        TechnologyType: "",
        EnvName: "",
        EnvCode: "",
        SshUrlToRepo: "",
        Branch: "",
        GitlabId: "",
        ModuleName: "",
        ModuleCode: "",
        Department: "",
        ShowUrl: "",
        NameSpace: "default",
        ModuleName: "", //临时存储模块信息
        EnvCommCloud: 0, //是否共有云
      },
      // 验证
      addPipeLineFormRules: {
        PipeName: [
          { required: true, message: "请输入模块code", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "模块名的长度在3~50个字符之间",
            trigger: "blur",
          },
        ],
      },
      // editPipeLine
      editPipeLineForm: {},
      // 修改表单的验证规则对象
      editPipeLineFormRules: {
        PipeName: [
          { required: true, message: "请输入模块code", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "模块名的长度在3~50个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 分支数据
      branchList: [],
      // 命名空间
      namespaceList: [],
      // 分支环境列表
      deployEnvList: [],
      // 已选中的角色分支name api 只提供名字
      selectedBranchId: "",
      // 已选中的环境ID
      selectedDeployEnvItem: "",
      // 已选中的信息命名空间
      selectedNameSpaceId: "",
      total: 0,
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
    this.getJenkinsUrl();
    this.getPipeLineList();
  },
  methods: {
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getModuleInfoList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getModuleInfoList();
    },
    async getJenkinsUrl() {
        const { data: res } = await this.$http.get(
        "/api/getjenkinsurl" ,
        {
          params: null,
        }
      );
      if (res.code !== 200) {
        return this.$message.error("获取jenkins的地址失败！");
      }
      if (res.data !== null) {
        this.jenkins = res.data;     
      }
    },
    async getPipeLineList() {
      const { data: res } = await this.$http.get(
        "/api/getpllistbygitlabid/" + this.dictValue.GitlabId,
        {
          params: this.queryInfo,
        }
      );
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.pipeLineList = null;
      if (res.data !== null) {
        this.pipeLineList = res.data;
        this.total = res.data.length;
      }
    },
    //
    //
    async getNamespaces() {
      // 可以发起添加模块的网络请求
      var EnvItem;
      if (!this.selectedDeployEnvItem) {
        return this.$message.error("请选择环境信息！");
      }
      console.log(this.deployEnvList);
      console.log(this.selectedDeployEnvItem);
        for (var i = 0; i < this.deployEnvList.length; i++) {
          if (this.deployEnvList[i].Id === this.selectedDeployEnvItem) {
            EnvItem = this.deployEnvList[i];
          }
      }
     console.log(EnvItem);
      const { data: res } = await this.$http.get(
        "/api/getnamesapces?clusterid=" + EnvItem.Id
      );

      if (res.code !== 200) {
        return this.$message.error("获取k8s命名数据失败！");
      }
      // 把获取到的权限数据保存到 data 中
      this.namespaceList = res.data;
      console.log(this.namespaceList)
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
    
      this.addPipeLineForm.GitlabId = ModuleInfo.GitlabId;
      this.addPipeLineForm.SshUrlToRepo = ModuleInfo.SshUrlToRepo;
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
      this.addPipeLineDialogVisible = true;
    },
    //
    setPipeLineDialogClosed() {
      this.$refs.addPipeLineFormRef.resetFields();
    },
    // 保存部署流程
    async savePipeLineInfo() {
      
      if (!this.addPipeLineForm.Branch) {
        return this.$message.error("请选择分支！");
      }
      if (!this.selectedDeployEnvItem) {
        return this.$message.error("请选择环境信息！");
      }
      this.$refs.addPipeLineFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加模块的网络请求
        var EnvItem;
        for (var i = 0; i < this.deployEnvList.length; i++) {
          if (this.deployEnvList[i].Id === this.selectedDeployEnvItem) {
            EnvItem = this.deployEnvList[i];
          }
        }

        this.addPipeLineForm.EnvName = EnvItem.EnvName;
        this.addPipeLineForm.EnvId = EnvItem.Id;
        this.addPipeLineForm.EnvCode = EnvItem.EnvCode;
        
        this.addPipeLineForm.EnvCommCloud = EnvItem.EnvCommCloud;
        const { data: res } = await this.$http.post(
          "/api/addpl",
          this.addPipeLineForm
        );
        if (res.code !== 200) {
          this.$message.error("添加模块失败！");
          return;
        }

        this.$message.success("添加模块成功！");
        // 隐藏添加模块的对话框
        this.addPipeLineDialogVisible = false;
        // 重新获取模块列表数据
        this.getPipeLineList();
      });
    },

    // 保存修改部署流程
    async saveEditPipeLineInfo() {
      
      if (!this.editPipeLineForm.Branch) {
        return this.$message.error("请选择分支！");
      }
      if (!this.editPipeLineForm.EnvId) {
        return this.$message.error("请选择环境信息！");
      }

      this.$refs.editPipeLineFormRef.validate(async (valid) => {
      // 可以发起添加模块的网络请求
      var EnvItem;
      for (var i = 0; i < this.deployEnvList.length; i++) {
        if (this.deployEnvList[i].Id === this.editPipeLineForm.EnvId) {
          EnvItem = this.deployEnvList[i];
        }
      }
      this.editPipeLineForm.EnvName = EnvItem.EnvName;
      this.editPipeLineForm.EnvId = EnvItem.Id;
      this.editPipeLineForm.EnvCode = EnvItem.EnvCode;
      const { data: res } = await this.$http.put(
        "/api/updatepl/" + this.editPipeLineForm.Id,
        this.editPipeLineForm
      );
      if (res.code !== 200) {
        this.$message.error("添加模块失败！");
        return;
      }
      this.$message.success("添加模块成功！");})
      // 隐藏添加模块的对话框
      this.editPipeLineDialogVisible = false;
      // 重新获取模块列表数据
      this.getPipeLineList();
    },
    // 生产部署流程信息，部署名称、部署编号
    setPipeLineInfo() {
      if (!this.selectedDeployEnvItem) {
        return this.$message.error("请选择环境信息！");
      }
      var EnvName;
      var EnvCode;
      for (var i = 0; i < this.deployEnvList.length; i++) {
        if (this.deployEnvList[i].Id === this.selectedDeployEnvItem) {
          EnvCode = this.deployEnvList[i].EnvCode;
          EnvName = this.deployEnvList[i].EnvName;
        }
      }
      this.addPipeLineForm.PipeCode =
        EnvCode + "-" + this.addPipeLineForm.ModuleCode;
      this.addPipeLineForm.PipeName =
        EnvName + "-" + this.addPipeLineForm.ModuleName;
    },
    // 生产部署流程信息，部署名称、部署编号 编辑对话框
    setEditPipeLineInfo() {
      if (!this.selectedDeployEnvItem) {
        return this.$message.error("请选择环境信息！");
      }
      console.log(this.editPipeLineForm.EnvId);
      var EnvName;
      var EnvCode;
      for (var i = 0; i < this.deployEnvList.length; i++) {
        if (this.deployEnvList[i].Id === this.selectedDeployEnvItem) {
          EnvCode = this.deployEnvList[i].EnvCode;
          EnvName = this.deployEnvList[i].EnvName;
        }
      }
      this.editPipeLineForm.PipeCode =
        EnvCode + "-" + this.editPipeLineForm.ModuleCode;
      this.editPipeLineForm.PipeName =
        EnvName + "-" + this.editPipeLineForm.ModuleName;
    },
    // 根据Id删除对应的
    async removePipeLineById(Id) {
      // 弹框询问Pipeline是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该Pipeline, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果Pipeline确认删除，则返回值为字符串 confirm
      // 如果Pipeline取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("/api/deletepl/" + Id);
      if (res.code !== 200) {
        return this.$message.error("删除模块信息失败！");
      }
      this.$message.success("删除模块成功！");
      this.getPipeLineList();
    },
    // 展示编辑模块的对话框
    async showPipeLineInfo(id) {
      // 获取gitlab branch
      const { data: gitlabres } = await this.$http.get(
        "/api/getgrlist/" + this.dictValue.GitlabId
      );

      if (gitlabres.code !== 200) {
        return this.$message.error("获取Gitlab数据失败！");
      }
      this.branchList = gitlabres.data;

      // 获取环境列表
      const { data: envres } = await this.$http.get("/api/getdelist");
      if (envres.code !== 200) {
        return this.$message.error("获取环境列表数据失败！");
      }
      this.deployEnvList = envres.data;
      this.deployEnvList.valuetype = envres.data.Id;
      const { data: res } = await this.$http.get("/api/getpllistbyid/" + id);

      if (res.code !== 200) {
        return this.$message.error("查询模块信息失败！");
      }
      // this.selectedDeployEnvItem = res.data.EnvId
      this.editPipeLineForm = res.data;
      this.editPipeLineDialogVisible = true;
    },
    // 关闭编辑对话框
    setEditPipeLineDialogClosed() {
      this.$refs.editPipeLineFormRef.resetFields();
    },
    // 发布按钮
    async setPipeLineByIdPublish(Id) {
      const { data: res } = await this.$http.put("/api/publishplbyid/" + Id);
      if (res.code !== 200) {
        return this.$message.error("查询模块信息失败！");
      }
    },
  },
};
</script>
