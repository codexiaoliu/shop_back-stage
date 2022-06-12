<template>
  <div class="login_container">
    <!-- 登录部分 -->
    <div class="login_box">
      <!-- 头像部分 -->
      <div class="avatar_box">
        <img src="@/assets/img/logo.png" alt="" />
      </div>
      <!-- 表单部分 -->
      <el-form
        label-width="0px"
        class="login_from"
        :model="loginFrom"
        :rules="loginFromRules"
        ref="loginFromRef"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginFrom.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginFrom.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button type="info" round @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "123456",
      },
      loginFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 18,
            message: "长度在 1 到 18 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置
    resetLoginFrom() {
      this.$refs.loginFromRef.resetFields();
    },
    // 表单预验证
    login() {
      // validate里的形参返回的是个布尔值
      this.$refs.loginFromRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$axios.post("login", this.loginFrom);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");

        // 保存taken到sessionstorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 跳转到后台主页路由
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
}
.avatar_box {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 65px;
  background-color: #fff;
  padding: 5px;
  box-shadow: 0 0 10px rgba(68, 67, 67, 0.3);
  img {
    width: 100%;
    height: 100%;
    border-radius: 65px;
    background-color: #ccc;
  }
}
.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: end;
}
</style>