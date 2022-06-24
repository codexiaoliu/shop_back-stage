<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="clickAddRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色数据表格区域 -->
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <!-- 角色下拉区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'row-center', index1 === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="closeTag(scope.row, item1)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="['row-center', index2 === 0 ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(scope.row, item2)"
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="closeTag(scope.row, item3)"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="400">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="400">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openEditRoles(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="openRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="isAddRolesFormVisible"
      width="50%"
    >
      <el-form :model="addRolesData" ref="addRolesForm">
        <el-form-item label="角色名" label-width="15%">
          <el-input
            autocomplete="off"
            v-model="addRolesData.roleName"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="15%" prop="mobile">
          <el-input
            autocomplete="off"
            v-model="addRolesData.roleDesc"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAddRolesForm">取 消</el-button>
        <el-button type="primary" @click="addRolesForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户角色对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="isEditRolesFormVisible"
      width="50%"
    >
      <el-form :model="editRoleData" ref="editRolesForm">
        <el-form-item label="角色名" label-width="15%">
          <el-input
            autocomplete="off"
            v-model="editRoleData.roleName"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="15%" prop="email">
          <el-input
            autocomplete="off"
            v-model="editRoleData.roleDesc"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="quitEditRole">取 消</el-button>
        <el-button type="primary" @click="putEditrRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="isRightsFormVisible"
      width="50%"
      @close="closeRightsForm"
    >
      <el-tree
        :data="rightsTree"
        :props="rightsProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedNode"
        ref="rightsTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitEditRight">取 消</el-button>
        <el-button type="primary" @click="putEditrRight">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      isAddRolesFormVisible: false,
      addRolesData: {
        roleName: "",
        roleDesc: "",
      },
      isEditRolesFormVisible: false,
      //   修改的角色信息
      editRoleData: {},
      isRightsFormVisible: false,
      //   权限数据
      rightsTree: [],
      //   展示的权限层级关系
      rightsProps: {
        children: "children",
        label: "authName",
      },
      //   默认选中的节点
      checkedNode: [],
      //   当前角色id
      roleId: "",
    };
  },
  methods: {
    // 获取角色数据
    async getRolesData() {
      const { data: res } = await this.$axios.get("roles");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色数据失败");
      this.rolesList = res.data;
    },
    // 监听添加角色按钮
    clickAddRoles() {
      this.isAddRolesFormVisible = true;
    },
    // 监听取消添加按钮
    quitAddRolesForm() {
      this.isAddRolesFormVisible = false;
    },
    // 监听确认添加按钮
    async addRolesForm() {
      const { data: res } = await this.$axios.post(`roles`, {
        roleName: this.addRolesData.roleName,
        roleDesc: this.addRolesData.roleDesc,
      });
      console.log(res);
      if (res.meta.status !== 201) return this.$message.error("添加角色失败");

      // 更新表格数据
      this.getRolesData();
      // 提示修改成功
      this.$message.success("添加角色成功");
      //关闭添加角色界面
      this.isAddRolesFormVisible = false;
    },
    // 监听编辑按钮打开编辑界面
    openEditRoles(role) {
      this.editRoleData = role;
      this.isEditRolesFormVisible = true;
    },
    // 确认编辑按钮
    putEditrRole(role) {
      // 表单提交前预验证
      this.$refs.editRolesForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          `roles/${this.editRoleData.id}`,
          {
            roleName: this.editRoleData.roleName,
            roleDesc: this.editRoleData.roleDesc,
          }
        );
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("修改角色信息失败");
        // 关闭修改信息界面
        this.isEditRolesFormVisible = false;
        // 更新表格数据
        this.getRolesData();
        // 提示修改成功
        this.$message.success("修改角色信息成功");
      });
    },
    // 取消编辑按钮
    quitEditRole() {
      // 重置输入框
      this.$refs.editRolesForm.resetFields();
      // 关闭修改信息界面
      this.isEditRolesFormVisible = false;
      this.getRolesData();
    },

    // 删除角色按钮
    async deleteRoles(id) {
      const result = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: datares } = await this.$axios.delete("roles/" + id);
      if (datares.meta.status != 200) this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getRolesData();
    },
    // 删除权限标签
    async closeTag(role, right) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((res) => res);
      if (result === "cancel") return this.$message.info("取消删除成功");
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      this.$message.success("删除权限成功");
      //   将获取到的角色下最新的权限数据赋值给角色  达到不刷新页面就可以更新的效果
      role.children = res.data;
    },

    // 监听打开分配权限按钮
    async openRightDialog(role) {
      this.roleId = role.id;
      // 获取全部权限节点
      const { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.console.error("获取权限失败");
      this.rightsTree = res.data;
      //   console.log(this.rightsTree);
      this.getCheckNode(role, this.checkedNode);
      this.isRightsFormVisible = true;
    },
    // 通过递归的形式获取到角色权限
    getCheckNode(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getCheckNode(item, arr);
      });
    },

    // 关闭分配权限对话框
    closeRightsForm() {
      this.checkedNode = [];
    },

    // 取消分配权限对话框
    quitEditRight() {
      this.isRightsFormVisible = false;
    },

    // 确定分配权限对话框
    async putEditrRight() {
      let rightsArr = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys(),
      ];
      let rightStr = rightsArr.join(",");
      const { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        {
          rids: rightStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.console.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesData();
      this.isRightsFormVisible = false;
    },
  },

  created() {
    this.getRolesData();
  },
};
</script>

<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
  margin: 0 50px;
}
.row-center {
  display: flex;
  align-items: center;
}
</style>