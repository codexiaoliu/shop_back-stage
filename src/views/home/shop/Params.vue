<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 提示标语 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择分类区域 -->
      <label for="">选择商品分类：</label>
      <el-cascader
        style="width: 20%"
        v-model="goodscata"
        :options="categoriesList"
        :props="cateProps"
        @change="changeCasader"
      ></el-cascader>
      <!-- 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数部分 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="small"
            :disabled="isButnDisabled"
            @click="addParamsVisible = true"
            >添加参数</el-button
          >
          <!--动态 参数表格部分 -->
          <el-table style="width: 100%" border :data="manyParamsList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="paramstag"
                  @close="closeTag(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="addparamsinput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="openEditParams(scope.row)"
                  >修改</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="small"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数部分 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="small"
            :disabled="isButnDisabled"
            @click="addParamsVisible = true"
            >添加属性</el-button
          >

          <!--静态属性表格部分 -->
          <el-table style="width: 100%" border :data="onlyParamsList">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="paramstag"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="addparamsinput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="openEditParams(scope.row)"
                  >修改</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="small"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数和静态属性的对话框 -->
    <el-dialog
      :title="'添加' + paramsTitle"
      :visible.sync="isAddParamsVisible"
      width="50%"
    >
      <el-form
        :model="addParamsForm"
        :rules="ParamsRules"
        ref="addParamsRef"
        label-width="80px"
      >
        <el-form-item :label="paramsTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quitAddParams">取 消</el-button>
        <el-button type="primary" @click="putAddParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'编辑' + paramsTitle"
      :visible.sync="isEditParamsVisible"
      width="50%"
    >
      <el-form
        :model="editParamsData"
        :rules="ParamsRules"
        ref="editParamsRef"
        label-width="80px"
      >
        <el-form-item :label="paramsTitle" prop="attr_name">
          <el-input v-model="editParamsData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quitEditParams">取 消</el-button>
        <el-button type="primary" @click="putEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品类别
      categoriesList: [],
      //   级联选择器返回的选中数组
      goodscata: [],
      // 可选数据源配置
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      activeName: "many",
      //   商品id
      goodsId: 0,
      //商品动态 参数数据
      manyParamsList: [],
      //   商品静态属性数据
      onlyParamsList: [],
      //   添加动态参数和静态属性的显示
      isAddParamsVisible: false,
      //   添加参数表单对象
      addParamsForm: {
        attr_name: "",
      },

      //   添加参数表单验证规则
      ParamsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      //   修改动态参数和静态属性的显示
      isEditParamsVisible: false,

      //   编辑参数表单对象
      editParamsData: {},
    };
  },
  methods: {
    // 获取商品类别数据
    async getShopCategoriesData() {
      const { data: res } = await this.$axios.get("categories");

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");

      this.categoriesList = res.data;

      //   console.log(res);
    },
    // 获取商品参数
    async getShopParamsData(activeName) {
      if (this.goodscata.length !== 3) {
        this.goodscata = [];
        this.manyParamsList = [];
        this.onlyParamsList = [];
        return;
      }

      const { data: res } = await this.$axios.get(
        `categories/${this.goodsId}/attributes`,
        {
          params: { sel: activeName },
        }
      );

      if (res.meta.status !== 200)
        return this.$message.error("获取商品参数失败");

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // this.attrValsLis = item.attr_vals.split(" ");
        // 设置属性，让每个参数有自己的属性输入框
        item.inputValue = "";
        item.inputVisible = false;
      });

      if (this.activeName === "many") {
        this.manyParamsList = res.data;
      } else {
        this.onlyParamsList = res.data;
      }
    },

    // 监听级联选择器的变化
    changeCasader() {
      this.goodsId = this.goodscata[this.goodscata.length - 1];
      this.getShopParamsData(this.activeName);
    },
    // 监听标签页的点击事件
    handleClick(tab, event) {
      this.getShopParamsData(this.activeName);
    },

    // 取消添加参数
    quitAddParams() {
      this.$refs.addParamsRef.resetFields();
      this.isAddParamsVisible = false;
    },
    // 确认添加参数
    putAddParams() {
      this.$refs.addParamsRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("添加参数失败");
        }
        const { data: res } = await this.$axios.post(
          `categories/${this.goodsId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        console.log(res);
      });
      this.getShopParamsData(this.activeName);
      this.$refs.addParamsRef.resetFields();
      this.isAddParamsVisible = false;
    },

    // 打开编辑参数对话框
    async openEditParams(row) {
      const { data: res } = await this.$axios.get(
        `categories/${this.goodsId}/attributes/${row.attr_id}`,
        {
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      this.editParamsData = res.data;
      this.isEditParamsVisible = true;
    },

    // 取消编辑参数
    quitEditParams() {
      this.$refs.editParamsRef.resetFields();
      this.isEditParamsVisible = false;
    },

    // 确认提交编辑参数
    putEditParams() {
      this.$refs.editParamsRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("编辑参数失败");
        }
        const { data: res } = await this.$axios.put(
          `categories/${this.goodsId}/attributes/${this.editParamsData.attr_id}`,
          {
            attr_name: this.editParamsData.attr_name,
            attr_sel: this.activeName,
          }
        );

        if (res.meta.status !== 200) return this.$message.error("修改失败");
        this.$message.success("修改成功");

        this.getShopParamsData(this.activeName);
        this.isEditParamsVisible = false;
      });
    },

    // 删除参数
    async deleteParams(row) {
      const { data: res } = await this.$axios.delete(
        `categories/${this.goodsId}/attributes/${row.attr_id}`
      );

      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");

      this.getShopParamsData(this.activeName);
    },

    // 点击按钮出现输入框
    showInput(row) {
      row.inputVisible = true;
      //   点击按钮输入框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 输入框失去焦点触发事件
    handleInputConfirm(row) {
      if (row.inputValue) {
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        this.saveAttrValue(row);
      }

      row.inputVisible = false;
    },

    // 删除对应的参数可选项
    closeTag(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrValue(row);
    },

    // 编辑提交参数  对attr_vals保存到数据库中
    async saveAttrValue(row) {
      const { data: res } = await this.$axios.put(
        `categories/${this.goodsId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("操作失败");
    },
  },

  created() {
    this.getShopCategoriesData();
  },
  computed: {
    isButnDisabled() {
      if (this.goodscata.length !== 3) {
        return true;
      }
      return false;
    },
    paramsTitle() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },

    // attrValsList() {
    //   let vals = this.paramsList[0].attr_vals;
    //   return vals.trim().split(/\s+/);
    // },
  },
};
</script>

<style>
.el-alert {
  margin-bottom: 10px;
}
.paramstag {
  margin: 0 10px;
}
.addparamsinput {
  width: 120px;
}
</style>