<template>
  <el-container class="home-container">
    <!--头部---->
    <el-header>
      <div>
        <img src="../assets/thpower.png" alt="" width="56" height="56" />
        <span>运维管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button></el-header
    >
    <!--页面主题区域---->
    <el-container>
      <!--侧边栏---->
      <el-aside :width="isCollpase ? '63px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollpase"
          :collapse-transition="false"
          router=""
        >
          <!-- 一级菜单--->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!--一级菜单的模板-->
            <template slot="title">
              <!--图标--->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!---二级菜单---->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template slot="title">
                <!--图标--->
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容---->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠
      isCollpase: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      //const { data: res } = await this.$http.get("menus");
      // console.log(res);
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = [
        {
          id: 125,
          authName: "资源管理",
          path: "moduleinfo",
          children: [
            {
              id: 110,
              authName: "应用模块",
              path: "moduleinfo",
              children: [],
              order: null,
            },
            {
              id: 111,
              authName: "环境管理",
              path: "deployenv",
              children: [],
              order: null,
            }
          ],
          order: 1,
        },
        {
          id: 103,
          authName: "环境管理",
          path: "rights",
          children: [
            {
              id: 111,
              authName: "公用云",
              path: "roles",
              children: [],
              order: null,
            },
            {
              id: 112,
              authName: "私有云",
              path: "rights",
              children: [],
              order: null,
            }
            
          ],
          order: 2,
        },
      ];
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollpase = !this.isCollpase;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>
 
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffff;
  font: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>