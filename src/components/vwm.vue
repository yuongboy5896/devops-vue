<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础资源</el-breadcrumb-item>
      <el-breadcrumb-item>虚拟机</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getVirtualMachineList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getVirtualMachineList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加虚拟机</el-button
          >
        </el-col>
      </el-row>
           
      <!-- 模块列表区域 -->
      <el-table :data="VirtualMachinelist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="虚拟机" prop="name"></el-table-column>
        <el-table-column label="处理器" prop="cpu_count"></el-table-column>
        <el-table-column label="内存" prop="memory_size_MiB"></el-table-column>
        <el-table-column label="状态" prop="Power_state"></el-table-column>
        <el-table-column label="用户" prop="vm"></el-table-column>
        <el-table-column label="BU" prop=""></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.Id)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeVirtualMachineById(scope.row.Id)"
            ></el-button>
            <!--列表部署模块情况-->
            <el-tooltip
              effect="dark"
              content="列表部署模块情况"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="addPipelineDialog(scope.row)"
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
        :page-sizes="[25, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加模块的对话框 -->
    <el-dialog
      title="添加模块"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="虚拟机名称" prop="ModuleName">
          <el-input v-model="addForm.ModuleName"></el-input>
        </el-form-item>
        <el-form-item label="CPU" prop="ModuleCode">
          <el-input v-model="addForm.ModuleCode"></el-input>
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="addForm.TechnologyType"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="addForm.ProjectType"></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="addForm.GitlabUrl"></el-input>
        </el-form-item>
        <el-form-item label="BU">
          <el-input v-model="addForm.GitlabUrl"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addVirtualMachine">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改模块的对话框 -->  
    <!-- 修改模块的对话框 -->
    <el-dialog
      title="修改模块"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="editDialogClosed" 
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="模块名称" prop="ModuleName">
          <el-input v-model="editForm.ModuleName"></el-input>
        </el-form-item>
        <el-form-item label="模块编码" prop="ModuleCode">
          <el-input v-model="editForm.ModuleCode"></el-input>
        </el-form-item>
        <el-form-item label="技术类型">
          <el-input v-model="editForm.TechnologyType"></el-input>
        </el-form-item>
        <el-form-item label="项目列表">
          <el-input v-model="editForm.ProjectType"></el-input>
        </el-form-item>
        <el-form-item label="GitLab" >
          <el-input v-model="editForm.GitlabUrl" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 树型部署模块对话框 -->
    <el-dialog
      title="添加部署流程"
      :visible.sync="addPipeLineDialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="setPipeLineDialogClosed"
    >
      <el-form
        :model="addPipeLineForm"
        :rules="addPipeLineFormRules"
        ref="addPipeLineFormRef"
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
            <el-input v-model="addPipeLineForm.ModuleName" disabled ></el-input>
          </el-form-item>
          <el-form-item label="部署环境" prop="ModuleCode">
            <el-select v-model="selectedDeployEnvItem" placeholder="请选择">
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
            <el-input v-model="addPipeLineForm.SshUrlToRepo" disabled></el-input>
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
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    // 验证url的规则
    var checkUrl = (rule, value, cb) => {
      // 验证Url的正则表达式
      const regUrl =
        /^(https?|ftp?|http):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

      if (regUrl.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      // 获取模块列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      VirtualMachinelist: [],
      // 所有环境的数据
      rightslist: [],
      // 分支数据
      branchList: [],
      // 分支环境列表
      deployEnvList: [],
      // 已选中的角色分支name api 只提供名字
      selectedBranchId: "",
      // 已选中的环境ID
      selectedDeployEnvItem: "",
      // 已选中的信息命名空间
      selectedNameSpaceId: "",
      total: 0,
      // 控制添加模块对话框的显示与隐藏
      addDialogVisible: false,
      // PipeLine添加模块对话框的显示与隐藏
      addPipeLineDialogVisible: false,
      // 添加模块的表单数据
      addForm: {
        ModuleCode: "thpower-operation",
        ModuleName: "运维管理微服务",
        TechnologyType: "java",
        ProjectType: "微服务",
        GitlabUrl: "http://192.168.48.15:8080/microservice/operation",
      },
      // addForm
      addPipeLineForm: {
        Id: "",
        Member: "",
        Cpu: 0,
        Mem: 0,
        Os: "",
        Disk: 0,
        IP:"" ,//临时存储模块信息
        Hostname:"" ,//临时存储模块信息
      },
      // 添加表单的验证规则对象
      addFormRules: {
        Hostname: [
          { required: true, message: "请输入模块code", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "模块名的长度在3~50个字符之间",
            trigger: "blur",
          },
        ],
      },
      addPipeLineFormRules: {
        Pipename: [
          { required: true, message: "请输入模块code", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "模块名的长度在3~50个字符之间",
            trigger: "blur",
          },
        ],
      },

      // 控制修改模块对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的模块信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入模块邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入模块手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
       // 修改表单的验证规则对象
      editPipeLineFormRules: {
        email: [
          { required: true, message: "请输入模块邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入模块手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      setModuleDialogVisible: false,
      // 需要被分配角色的模块信息
      userInfo: {},
    };
  },
  created() {
    this.getVirtualMachineList();
  },
  methods: {
    async getVirtualMachineList() {
      const { data: res } = await this.$http.get("/api/getvmlist", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.VirtualMachinelist = res.data;
      this.total = res.data.length;
      console.log(res);
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getVirtualMachineList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getVirtualMachineList();
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新模块状态失败！");
      }
      this.$message.success("更新模块状态成功！");
    },
    // 监听添加模块对话框的关闭事件
    addDialogClosed() {
      console.log( this.$refs);
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新模块
    addVirtualMachine() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加模块的网络请求
        const { data: res } = await this.$http.post("/api/addmi", this.addForm);
        console.log(res);
        if (res.code !== 200) {
          this.$message.error("添加模块失败！");
          return;
        }

        this.$message.success("添加模块成功！");
        // 隐藏添加模块的对话框
        this.addDialogVisible = false;
        // 重新获取模块列表数据
        this.getVirtualMachineList();
      });
    },
    // 展示编辑模块的对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get("/api/getmi/" + id);

      if (res.code == 1) {
        return this.$message.error("查询模块信息失败！");
      }

      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改模块对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改模块信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起修改模块信息的数据请求
        const { data: res } = await this.$http.put(
          "/api/updatemi/" + this.editForm.Id,
          {
            Id: this.editForm.Id,
            ModuleCode: this.editForm.ModuleCode,
            ModuleName: this.editForm.ModuleName,
            TechnologyType: this.editForm.TechnologyType,
            ProjectType: this.editForm.ProjectType,
            GitlabUrl: this.editForm.GitlabUrl,
          }
        );

        if (res.code !== 200) {
          return this.$message.error("更新模块信息失败！");
        }

        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getVirtualMachineList();
        // 提示修改成功
        this.$message.success("更新模块信息成功！");
      });
    },
    // 根据Id删除对应的
    async removeVirtualMachineById(Id) {
      // 弹框询问模块是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该模块, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果模块确认删除，则返回值为字符串 confirm
      // 如果模块取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      console.log(Id);
      const { data: res } = await this.$http.delete("/api/deletemi/" + Id);
      if (res.code !== 200) {
        return this.$message.error("删除模块信息失败！");
      }

      this.$message.success("删除模块成功！");
      this.getVirtualMachineList();
    },
    
    // 添加流水线部署
    async addPipelineDialog(VirtualMachine) {
      const { data: res } = await this.$http.get(
        "/api/getgrlist/" + VirtualMachine.GitlabId
      );

      if (res.code !== 200) {
        return this.$message.error("获取Gitlab数据失败！");
      }

      // 把获取到的权限数据保存到 data 中
      this.branchList = res.data;
      console.log(this.branchList);
      this.addPipeLineForm.GitlabId = VirtualMachine.GitlabId;
      this.addPipeLineForm.SshUrlToRepo = VirtualMachine.SshUrlToRepo;
      this.addPipeLineForm.ModuleName = VirtualMachine.ModuleName;
      this.addPipeLineForm.ModuleCode = VirtualMachine.ModuleCode;
      this.addPipeLineForm.TechnologyType = VirtualMachine.TechnologyType;


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
      debugger
      this.$refs.editPipeLineFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加模块的网络请求
        console.log(this.addPipeLineForm)
        debugger
        this.addPipeLineForm.EnvName =  this.selectedDeployEnvItem.EnvName
        this.addPipeLineForm.EnvId =  this.selectedDeployEnvItem.Id;
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
        this.getVirtualMachineList();
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
      this.addPipeLineForm.PipeCode = this.selectedDeployEnvItem.EnvCode + "-" +  this.addPipeLineForm.ModuleCode;
      this.addPipeLineForm.PipeName = this.selectedDeployEnvItem.EnvName + "-" +  this.addPipeLineForm.ModuleName;
    },
  },
};
</script>

<style lang="less" scoped>
.el-form-item {
  width: 500px;
}
</style>

