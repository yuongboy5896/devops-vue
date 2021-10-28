<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资料管理</el-breadcrumb-item>
      <el-breadcrumb-item>应用模块</el-breadcrumb-item>
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
            >添加模块</el-button
          >
        </el-col>
      </el-row>

      <!-- 模块列表区域 -->
      <el-table :data="moduleInfolist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="模块名称" prop="ModuleName"></el-table-column>
        <el-table-column label="模块编码" prop="ModuleCode"></el-table-column>
        <el-table-column
          label="技术类型"
          prop="TechnologyType"
        ></el-table-column>
        <el-table-column label="项目列表" prop="ProjectType"></el-table-column>
        <el-table-column label="Gitlab地址" prop="GitlabUrl"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.ModuleCode)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeModuleInfoById(scope.row.ModuleCode)"
            ></el-button>
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
        <el-form-item label="模块名称" prop="ModuleName">
          <el-input v-model="addForm.ModuleName"></el-input>
        </el-form-item>
        <el-form-item label="模块编码" prop="ModuleCode">
          <el-input v-model="addForm.ModuleCode"></el-input>
        </el-form-item>
        <el-form-item label="技术类型">
          <el-input v-model="addForm.TechnologyType"></el-input>
        </el-form-item>
        <el-form-item label="项目列表">
          <el-input v-model="addForm.ProjectType"></el-input>
        </el-form-item>
        <el-form-item label="GitLab">
          <el-input v-model="addForm.GitlabUrl"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addModuleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改模块的对话框 -->
    <el-dialog
      title="修改模块"
      :visible.sync="editDialogVisible"
      width="50%"
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
        <el-form-item label="GitLab">
          <el-input v-model="editForm.GitlabUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
      moduleInfolist: [],
      total: 0,
      // 控制添加模块对话框的显示与隐藏
      addDialogVisible: false,
      // 添加模块的表单数据
      addForm: {
        ModuleCode: "thpower-operation",
        ModuleName: "运维管理微服务",
        TechnologyType: "java",
        ProjectType: "微服务",
        GitlabUrl: "http://192.168.48.15:8080/microservice/operation",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        ModuleCode: [
          { required: true, message: "请输入模块code", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "模块名的长度在3~50个字符之间",
            trigger: "blur",
          },
        ],
        ModuleName: [
          { required: true, message: "请输入模块名称", trigger: "blur" },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            required: true,
            message: "请输入中文",
            trigger: "blur",
          },
          {
            min: 3,
            max: 50,
            message: "模块名的长度在3~15个字符之间",
            trigger: "blur",
          },
        ],
        GitLab: [
          { required: true, message: "请输入Url地址", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "模块名的长度在3~200个字符之间",
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
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的模块信息
      userInfo: {},
    };
  },
  created() {
    this.getModuleInfoList();
  },
  methods: {
    async getModuleInfoList() {
      const { data: res } = await this.$http.get("/api/getmilist", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 0) {
        return this.$message.error("获取模块列表失败！");
      }
      this.moduleInfolist = res.data;
      this.total = res.data.length;
      console.log(res);
    },
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
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新模块
    addModuleInfo() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加模块的网络请求
        const { data: res } = await this.$http.post("/api/addmi", this.addForm);
        console.log(res);
        if (res.code !== 0) {
          this.$message.error("添加模块失败！");
          return;
        }

        this.$message.success("添加模块成功！");
        // 隐藏添加模块的对话框
        this.addDialogVisible = false;
        // 重新获取模块列表数据
        this.getModuleInfoList();
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
            GitlabUrl: this.editForm.GitlabUrl
          }
        );

        if (res.code !== 0) {
          return this.$message.error("更新模块信息失败！");
        }

        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getModuleInfoList();
        // 提示修改成功
        this.$message.success("更新模块信息成功！");
      });
    },
    // 根据Id删除对应的
    async removeModuleInfoById(Id) {
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
      if (res.code !== 0) {
        return this.$message.error("删除模块信息失败！");
      }

      this.$message.success("删除模块成功！");
      this.getModuleInfoList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>

