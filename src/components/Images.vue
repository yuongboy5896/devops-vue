<template>
    <div> <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资料管理</el-breadcrumb-item>
      <el-breadcrumb-item>镜像仓库</el-breadcrumb-item>
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
            @clear="getRepositoryList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRepositoryList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加镜像仓库</el-button
          >
        </el-col>
      </el-row>
       
      <!-- 模块列表区域 -->
      <el-table :data="moduleInfolist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="仓库名称" prop="RegistryName"></el-table-column>
        <el-table-column label="仓库编码" prop="RegistryCode"></el-table-column>
        <el-table-column
          label="技术类型"
          prop="TechnologyType"
        ></el-table-column>
        <el-table-column label="仓库地址" prop="RegistryUrl"></el-table-column>
        <el-table-column label="内网地址" prop="RegistryLocalUrl"></el-table-column>
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
              @click="removeModuleInfoById(scope.row.Id)"
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
      title="添加仓库"
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
        <el-form-item label="仓库名称" prop="ModuleName">
          <el-input v-model="addForm.RegistryName"></el-input>
        </el-form-item>
        <el-form-item label="仓库编码" prop="ModuleCode">
          <el-input v-model="addForm.RegistryCode"></el-input>
        </el-form-item>
        <el-form-item label="登录名称">
          <el-input v-model="addForm.Login"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="addForm.Pasword"></el-input>
        </el-form-item>
         <el-form-item label="仓库地址">
          <el-input v-model="addForm.RegistryUrl"></el-input>
        </el-form-item>
        <el-form-item label="仓库地址">
          <el-input v-model="addForm.RegistryLocalUrl"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRegistry">确 定</el-button>
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
      RepositoryList: [],
       // 控制添加模块对话框的显示与隐藏
      addDialogVisible: false,
       // 添加模块的表单数据
      addForm: {
        RegistryName: "",
        RegistryCode: "",
        Login: "",
        Pasword: "",
        RegistryUrl: "",
        RegistryLocalUrl: "",
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
        
      },
    };
  },
  created() {
    this.getRepositoryList();
  },
  methods: {
    async getRepositoryList() {
      const { data: res } = await this.$http.get("/api/getirlist", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.code !== 200) {
        return this.$message.error("获取模块列表失败！");
      }
      this.RepositoryList = res.data;
      this.total = res.data.length;
      console.log(res);
    },
    // 点击按钮，添加新模块
    addRegistry() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加模块的网络请求
        const { data: res } = await this.$http.post("/api/addir", this.addForm);
        console.log(res);
        if (res.code !== 200) {
          this.$message.error("添加镜像仓库失败！");
          return;
        }

        this.$message.success("添加镜像仓库成功！");
        // 隐藏添加模块的对话框
        this.addDialogVisible = false;
        // 重新获取模块列表数据
        this.getRepositoryList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-form-item {
  width: 500px;
}
</style>
