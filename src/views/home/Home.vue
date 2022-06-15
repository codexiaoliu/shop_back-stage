<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/img/cart.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="menucollapse" @click="clickCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activeIndex"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="itemnu.id + ''"
            v-for="itemnu in menuData"
            :key="itemnu.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[itemnu.id]"></i>
              <span>{{ itemnu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item.path + ''"
              v-for="item in itemnu.children"
              :key="item.id"
              @click="clickIndex('/' + item.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ item.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      menuData: [],
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      activeIndex: "",
    };
  },
  methods: {
    // 退出登录
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 折叠菜单
    clickCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 处理点击菜单高亮问题 保存菜单的激活状态
    clickIndex(indexpath) {
      window.sessionStorage.setItem("indexpath", indexpath);
      this.activeIndex = indexpath;
    },

    // 获取菜单数据
    async getMenuDate() {
      const { data: res } = await this.$axios.get("menus");
      this.menuData = res.data;
      console.log(this.menuData);
    },
  },
  created() {
    this.getMenuDate();
    this.activeIndex = window.sessionStorage.getItem("indexpath");
  },
};
</script>

<style lang='less'>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    img {
      height: 50px;
      width: 50px;

      padding-right: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .menucollapse {
    color: #fff;
    background-color: #4a5064;
    height: 28px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaeaea;
}
.iconfont {
  padding: 8px;
}
</style>