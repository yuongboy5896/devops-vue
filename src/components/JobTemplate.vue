<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>模版管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getTempInfoList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getTempInfoList"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加模版</el-button
          >
        </el-col>
      </el-row>
      <!--环境列表区域-->
      <el-table :data="tempInfoList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="模版名称" prop="TemplateName"></el-table-column>
        <el-table-column label="模版编码" prop="TemplateCode"></el-table-column>
        <el-table-column label="模版类型" prop="TemplateType"></el-table-column>
        <el-table-column label="操作" width="180">
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
              @click="removeUserById(scope.row.Id)"
            ></el-button>
            <!--分配角色按钮-->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
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
        :page-sizes="[1, 2, 5, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!----添加模版的对话框 ---->
    <el-dialog
      title="添加模版"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="addDiaglgoClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="AddForm"
        :rules="AddFormRules"
        ref="addFormRef"
        label-width="150"
      >
        <el-form-item label="模版名称" prop="TemplateName" >
          <el-input v-model="AddForm.TemplateName"></el-input>
        </el-form-item>
        <el-form-item label="模版编码" prop="TemplateCode">
          <el-input v-model="AddForm.TemplateCode"></el-input>
        </el-form-item>
        <el-form-item label="模版类型" prop="TemplateType">
          <el-input v-model="AddForm.TemplateType"></el-input>
        </el-form-item>
        <el-form-item label="模版yaml">
          <div class="editor-container">
            <yaml-editor  v-model="AddForm.TemplateText" />
          </div>
        </el-form-item>
        <el-form-item label="模版jenkins">
          <el-input type="textarea" :rows="20" v-model="AddForm.TemplateJekins" mode="text/yaml"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addJobTemplate">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改环境的对话框 -->
    <el-dialog
      title="修改环境"
      :visible.sync="editDialogVisible"
      width="30%"
      lock-scroll=false
      :before-close="handleClose"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="模版名称" prop="TemplateName">
          <el-input v-model="editForm.TemplateName"></el-input>
        </el-form-item>
        <el-form-item label="模版编码" prop="TemplateCode">
          <el-input v-model="editForm.TemplateCode"></el-input>
        </el-form-item>
        <el-form-item label="模版类型" prop="TemplateType">
          <el-input v-model="editForm.TemplateType"></el-input>
        </el-form-item>
        <label>模版yaml</label>
          <div class="editor-container">
            <yaml-editor  v-model="editForm.TemplateText" mode="text/yaml"/>
          </div>

        <label>模版jenkins模版</label>
          <div class="editor-container">
            <yaml-editor  v-model="editForm.TemplateJekins" mode="XML/HTML"/>
          </div>  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editJobTemplate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import YamlEditor from '@/components/YamlEditor/index.vue';
export default {
  components: { YamlEditor },
  data() {
    // 验证邮箱的规则
    var IsIP = (rule, value, cb) => {
      // 验证的邮箱的正则表达式
      const reCheckIP =
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      console.log("Email");
      if (reCheckIP.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法IP"));
    };
    // 验证端口是否在[0,65535]之间的规则
    var isCheckPort = (rule, value, cb) => {
      // 验证端口是否在[0,65535]之间的规则
      const reCheckPort =
        /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (reCheckPort.test(value)) {
        // 合法的端口
        return cb();
      }

      cb(new Error("请输入合法端口"));
    };
    return {
      // 获取环境的列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数
        pagesize: 2,
      },
      tempInfoList: [],
      total: 0,
      //控制添加环境对话框的显示与隐藏
      dialogVisible: false,
      editDialogVisible: false,

      AddForm: {
        TemplateType: "",
        TemplateName: "",
        TemplateCode: "",
        TemplateType: "",
        //连接方式 api ssh
        TemplateText: "",
        TemplateJekins: ""
      },
      AddFormRules: {
        TemplateName: [
          { required: true, message: "请输入环境名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        TemplateCode: [
          { required: true, message: "请输入环境名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
       
      },
      editForm: {
        TemplateName: "",
        TemplateCode: "",
        TemplateType: "",
        TemplateText: "",
        //连接方式 api ssh
        TemplateJekins: "",
      },
      editFormRules: {
        TemplateName: [
          { required: true, message: "请输入模版名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        TemplateCode: [
          { required: true, message: "请输入模版名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
      //
      editDialogClose() {
        this.$refs.editFormRef.resetFields();
        this.getTempInfoList();
      },
      //
    };
  },
  created() {
    this.getTempInfoList();
  },
  methods: {
    async getTempInfoList() {
      const { data: res } = await this.$http.get(
        "/api/gettclist" //{
        //params: this.queryInfo,
        //}
      );
      if (res.code !== 200) return this.$message.error("获取环境列表失败！");
      //console.log(res);
      this.tempInfoList = res.data;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getTempInfoList();
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getTempInfoList();
    },
    addDiaglgoClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addJobTemplate() {
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("/api/addtc", this.AddForm);
        if (res.code !== 200) {
          this.$message.error("添加环境失败！");
        }
        this.$message.success("添加环境成功！");
        // 隐藏添加环境的对话框
        this.dialogVisible = false;
        // 重新获取环境列表数据
        this.getTempInfoList();
      });
    },
    async showEditDialog(Id) {
      const { data: res } = await this.$http.get("/api/gettc/" + Id);

      if (res.code !== 200) {
        return this.$message.error("查询环境数据失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editJobTemplate() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "/api/updatetc/" + this.editForm.Id,
          {
            Id: this.editForm.Id,
            TemplateName: this.editForm.TemplateName,
            TemplateType: this.editForm.TemplateType,
            TemplateJekins: this.editForm.TemplateJekins,
            TemplateCode: this.editForm.TemplateCode,
            TemplateText: this.editForm.TemplateText,
 
          }
        );
        if (res.code !== 200) {
          this.$message.error("更新环境信息失败！");
        }
      });
      this.editDialogVisible = false;
      this.getTempInfoList();
      this.editDialogClose();
      this.$message.success("更新环境信息成功！");
      
      
    },
    //
    async removeUserById(Id) {
      //
      const confirmResult = await this.$confirm(
        "是否永久删除该环境, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      //如点击确定 返回值是字符 confirm
      //如果取消 返回值是字符 cancel
      console.log(Id)
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      const { data: res } = await this.$http.delete("/api/deltc/" + Id);
      if (res.code !== 200) {
        return this.$message.error("删除环境数据失败！");
      }
      this.$message.success("删除环境数据成功！");
      this.getTempInfoList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>