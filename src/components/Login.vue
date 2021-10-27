<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="loginForm.value" prefix-icon="iconfont icon-3702mima" ></el-input>
        </el-form-item>
         <el-form-item >
          <div>   <img :src="vertifycha.data" alt=""  @click="getVertifycha"> </div>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
           <el-button type="success" @click="addDialogVisible = true">注册用户</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
     <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addUserForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证的邮箱的正则表达式
      const reEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_])+(\.[a-zA-Z0-9_-])+/;
      console.log("Email");
      if (reEmail.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法邮箱"));
    };
    // 验证电话的规则
    var checkMobile = (rule, value, cb) => {
      // 验证电话的正则表达式
      const reMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reMobile.test(value)) {
        // 合法的电话
        return cb();
      }

      cb(new Error("请输入合法手机号"));
    };  
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
        value:'',
        //省事把验证码id存到这里
        id:''
      },
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //验证码
      vertifycha: {
          id: "",
          data: ""
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 用户验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
       //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
    }
  },
  created() {
      this.getVertifycha()
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/api/login_pwd', this.loginForm)
        if (res.code !== 0) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
       //# window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    },
    // 获取验证码
    async getVertifycha() {
      const{ data:res } =  await this.$http.get('/api/captcha')
      if (res.code !== 0) {
        return this.$message.error("获取验证码识别失败！");
      }
      //console.log(res);
      this.loginForm.id = res.data.captcha_result.id;
      this.vertifycha.id = res.data.captcha_result.id;
      this.vertifycha.data = res.data.captcha_result.base_64_blob;
    },
    // 注册用户
    async addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        //console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("/api/adduser", this.addUserForm);
        console.log(res);
        console.log(res.code);
        if (res.code !== 1) {
          this.$message.error("添加用户失败或用户已存在！！");
          return
        }
        this.$message.success("添加用户成功！");
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
      });
      
    },
    // 清空注册字段
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },

  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #f2f4f7;
  height: 100%;
}

.login_box {
  width: 550px;
  height: 450px;
  background-color: rgb(243, 235, 235);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
