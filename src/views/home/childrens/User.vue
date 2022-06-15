<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="usersInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户数据表格区域 -->
      <el-table :data="usersList" style="width: 100%" stripe border>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽两种写法 -->
          <!-- <template slot-scope="scope">
            {{ scope.row }}
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template> -->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserMessage(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isAddUsersFormVisible"
      width="50%"
    >
      <el-form :model="adduserData" :rules="UsersFormRules" ref="addUsersForm">
        <el-form-item label="用户名" label-width="15%">
          <el-input
            autocomplete="off"
            v-model="adduserData.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="15%" prop="password">
          <el-input
            autocomplete="off"
            v-model="adduserData.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="15%" prop="checkPass">
          <el-input
            autocomplete="off"
            v-model="adduserData.checkPass"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="15%" prop="email">
          <el-input autocomplete="off" v-model="adduserData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" label-width="15%" prop="mobile">
          <el-input autocomplete="off" v-model="adduserData.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAddUsersForm">取 消</el-button>
        <el-button type="primary" @click="clickAddUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="isEditUsersFormVisible"
      width="50%"
    >
      <el-form
        :model="edituserData"
        :rules="UsersFormRules"
        ref="editUsersForm"
      >
        <el-form-item label="用户名" label-width="15%">
          <el-input
            autocomplete="off"
            v-model="edituserData.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="15%" prop="email">
          <el-input autocomplete="off" v-model="edituserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="15%" prop="mobile">
          <el-input autocomplete="off" v-model="edituserData.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="quitEditUser">取 消</el-button>
        <el-button type="primary" @click="putEditUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    // 邮箱验证
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    var checkMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号不可为空"));
      } else {
        if (value !== "") {
          var reg = /^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的手机号码"));
          }
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.adduserData.checkPass !== "") {
          this.$refs.addUsersForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.adduserData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      // 请求参数
      usersInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      usersList: [],
      total: 0,
      currentPage: 1,
      // 添加用户数据
      adduserData: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        checkPass: "",
      },
      // 修改用户数据
      edituserData: {},
      // 添加用户对话框的显示与隐藏
      isAddUsersFormVisible: false,
      // 修改用户对话框的显示与隐藏
      isEditUsersFormVisible: false,
      // 邮箱验证

      // 修改信息验证规则
      UsersFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 请求用户数据
    async getUsersList() {
      const { data: res } = await this.$axios.get("users", {
        params: this.usersInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("数据请求失败");
      this.usersList = res.data.users;
      this.total = res.data.total;
      console.log(this.usersList);
    },
    // 监听修改用户状态
    async changeStatus(usersdata) {
      const { data: res } = await this.$axios.put(
        `users/${usersdata.id}/state/${usersdata.mg_state}`
      );
      if (res.meta.status !== 200) return this.$message.error("状态修改失败");
      this.$message.success("状态修改成功");
    },

    //监听 每页显示的条数
    handleSizeChange(pagesize) {
      this.usersInfo.pagesize = pagesize;
      this.getUsersList();
    },
    // 监听当前页
    handleCurrentChange(pagenum) {
      this.usersInfo.pagenum = pagenum;
      this.getUsersList();
    },
    // 添加用户对话框

    addUsers() {
      this.isAddUsersFormVisible = true;
    },
    // 监听打开修改信息界面
    editUserMessage(user) {
      this.edituserData = user;
      this.isEditUsersFormVisible = true;

      // console.log(this.userData);
    },
    // 监听修改信息对话框退出按钮
    quitEditUser() {
      // 重置输入框
      this.$refs.editUsersForm.resetFields();
      // 关闭修改信息界面
      this.isEditUsersFormVisible = false;
    },

    // 监听修改信息确认按钮
    putEditUser() {
      // 表单提交前预验证
      this.$refs.editUsersForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `users/${this.userData.id}`,
          {
            email: this.userData.email,
            mobile: this.userData.mobile,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("修改信息失败");
        // 关闭修改信息界面
        this.isEditUsersFormVisible = false;
        // 更新表格数据
        this.getUsersList();
        // 提示修改成功
        this.$message.success("修改信息成功");
      });
    },
    // 监听添加用户对话框退出按钮
    quitAddUsersForm() {
      // 重置输入框
      this.$refs.addUsersForm.resetFields();
      // 关闭修改信息界面
      this.isAddUsersFormVisible = false;
      this.adduserData = {};
    },
    // 监听添加用户对话框确认按钮
    clickAddUser() {
      // 表单提交前预验证
      this.$refs.addUsersForm.validate(async (valid) => {
        if (!valid) return;
        console.log(this.adduserData);
        const { data: res } = await this.$axios.post(`users`, {
          username: this.adduserData.username,
          email: this.adduserData.email,
          mobile: this.adduserData.mobile,
          password: this.adduserData.password,
        });
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        // 关闭修改信息界面
        this.isAddUsersFormVisible = false;
        // 更新表格数据
        this.getUsersList();
        // 提示修改成功
        this.$message.success("添加用户成功");
      });
    },
    // 监听删除用户按钮
    async deleteUser(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((res) => res);
      // 点击确认删除返回的是confirm
      // 点击取消返回的是cancel
      // console.log(result);
      if (result === "cancel") return this.$message.info("取消删除成功");
      const { data: datares } = await this.$axios.delete("users/" + id);
      if (datares.meta.status != 200) this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getUsersList();
    },
  },
  created() {
    this.getUsersList();
  },
};
</script>

<style>
</style>