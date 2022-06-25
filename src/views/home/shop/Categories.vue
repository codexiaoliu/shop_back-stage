<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="clickisAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="catetable"
        :data="categoriesList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editCategories(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            size="small"
            type="danger"
            @click="deleteCategories(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-size="querInfo.pagesize"
        :page-sizes="[1, 2, 5, 10]"
        layout="total,  sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isAddCateVisible"
      width="30%"
      @close="closeAddCateForm"
    >
      <!-- 添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            clearable
            style="width: 100%"
            v-model="fatherCat"
            :options="fatherCateList"
            :props="cateProps"
            @change="changeCasader"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="isEditCateFormVisible"
      width="50%"
    >
      <el-form ref="EditCateForm" :v-model="categories">
        <el-form-item label="分类名称" label-width="15%">
          <el-input autocomplete="off" v-model="categories.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditCateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="putEditCategories">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      categoriesList: [],
      // 请求数据参数
      querInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      // 分类数据总数
      total: 0,
      // 表格列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],

      // 添加分类对话框的显示
      isAddCateVisible: false,
      // 添加分类表单的对象
      addCateForm: {
        cat_name: "",
        // 父分类的id
        cat_pid: 0,
        // 分类的等级
        cat_level: 0,
      },
      // 添加分类的规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类数据
      fatherCateList: [],
      // 可选数据源配置
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      // 父级分类选择的值
      fatherCat: [],
      isEditCateFormVisible: false,
      categories: {},
    };
  },
  methods: {
    // 获取商品类别数据
    async getShopCategoriesData() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.querInfo,
      });

      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");

      this.categoriesList = res.data.result;
      this.total = res.data.total;
      // console.log(res);
    },
    // 监听页码的变化
    handleCurrentChange(pagenum) {
      this.querInfo.pagenum = pagenum;
      this.getShopCategoriesData();
    },
    // 监听显示数量变化
    handleSizeChange(pagesize) {
      this.querInfo.pagesize = pagesize;
      this.getShopCategoriesData();
    },

    // 添加分类
    clickisAddCate() {
      this.getAddFatherCategoriesData();
      this.isAddCateVisible = true;
    },
    // 获取父级分类数据
    async getAddFatherCategoriesData() {
      const { data: res } = await this.$axios.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.fatherCateList = res.data;
    },

    // 监听级联选择器的变化
    changeCasader() {
      this.addCateForm.cat_pid = this.fatherCat[this.fatherCat.length - 1];
      this.addCateForm.cat_level = this.fatherCat.length;
    },

    // 添加分类
    addCategories() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$axios.post(
            "categories",
            this.addCateForm
          );
          console.log(this.addCateForm);
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加分类失败");
          }
        }
      });
      // console.log(this.addCateForm);

      this.isAddCateVisible = false;
      this.getShopCategoriesData();
    },

    //  监听 添加分类对话框关闭
    closeAddCateForm() {
      this.$refs.addCateFormRef.resetFields();
      this.fatherCat = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    // 删除分类
    async deleteCategories(id) {
      const { data: res } = await this.$axios.delete(`categories/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.$message.success("删除分类成功");
      this.getShopCategoriesData();
    },

    // 编辑分类
    editCategories(categorie) {
      this.categories = categorie;
      this.isEditCateFormVisible = true;
      // console.log(categorie);
    },
    // 确定修改分类
    async putEditCategories() {
      // 表单提交前预验证

      const { data: res } = await this.$axios.put(
        `categories/${this.categories.cat_id}`,
        {
          cat_name: this.categories.cat_name,
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改信息失败");
      // 关闭修改信息界面
      this.isEditCateFormVisible = false;
      // 更新表格数据
      this.getShopCategoriesData();
      // 提示修改成功
      this.$message.success("修改成功");
    },
  },
  created() {
    this.getShopCategoriesData();
  },
};
</script>

<style>
.catetable {
  margin-top: 10px;
}
</style>