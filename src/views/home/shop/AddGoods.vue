<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="消息提示的文案"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        class="goods_steps"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsFormRef"
        label-width="100px"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeleaveTab"
          @tab-click="clickTabs"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="addGoodsForm.goods_name"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model.number="addGoodsForm.goods_price"
                placeholder="请输入商品价格"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model.number="addGoodsForm.goods_weight"
                placeholder="请输入商品重量"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model.number="addGoodsForm.goods_number"
                placeholder="请输入商品数量"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                style="width: 20%"
                v-model="goodscata"
                :options="categoriesList"
                :props="cateProps"
                @change="changeCasader"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->

            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsParamsManyList"
              :key="item.attr_id"
            >
              <br />
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="vals"
                  v-for="(vals, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in goodsParamsOnlyList"
              :key="item.attr_id"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="header"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <editor-bar
              :catchData="catchData"
              :content="editorContent"
            ></editor-bar>
            <el-button @click="putAddGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片展示对话框 -->
    <el-dialog title="图片展示" :visible.sync="isPreviewPicVisible" width="50%">
      <img :src="previewPath" alt="" class="picPreview" />
    </el-dialog>
  </div>
</template>

<script>
import EditorBar from "@/components/common/editoritem";
export default {
  name: "AddGoods",
  components: {
    EditorBar,
  },
  data() {
    return {
      activeIndex: "0",
      addGoodsForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: undefined,
        goods_weight: undefined,
        goods_number: undefined,
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      //   添加商品基本信息表单验证
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      categoriesList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //   商品分类选择的数组值
      goodscata: [],
      //   商品参数列表
      goodsParamsManyList: [],
      goodsParamsOnlyList: [],
      fileList: [],
      //   上传的头部
      header: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片路径
      previewPath: "",
      isPreviewPicVisible: false,
    };
  },
  methods: {
    // 获取商品类别数据
    async getShopCategoriesData() {
      const { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.categoriesList = res.data;
      //   console.log(this.categoriesList);
    },
    // 获取商品参数
    async getGoodsParamsManyData() {
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "many",
          },
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品参数数据失败");
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
      this.goodsParamsManyList = res.data;
      console.log(this.goodsParamsManyList);
    },
    // 获取商品属性
    async getGoodsParamsOnlyData() {
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: "only",
          },
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品参数数据失败");

      this.goodsParamsOnlyList = res.data;
      //   console.log(this.goodsParamsOnlyList);
    },

    // 监听级联选择器的变化
    changeCasader() {
      if (this.goodscata.length !== 3) {
        this.goodscata = [];
        return;
      }
      this.addGoodsForm.goods_cat = this.goodscata.join(",");
      //   console.log(this.addGoodsForm.goods_cat);
    },

    // 监听标签页的跳转
    beforeleaveTab(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.goodscata.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // 监听标签页的点击
    clickTabs() {
      if (this.activeIndex === "1") {
        this.getGoodsParamsManyData();
      } else if (this.activeIndex === "2") {
        this.getGoodsParamsOnlyData();
      }
    },
    // 点击图片列表时的钩子函数
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.isPreviewPicVisible = true;
    },
    // 删除上传的图片的回调函数
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      //   根据图片临时路径找到对应的索引值
      const i = this.addGoodsForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      //   在数组中删除图片路径
      this.addGoodsForm.pics.splice(i, 1);
      console.log(this.addGoodsForm);
    },

    // 图片上传成功的回调函数
    uploadSuccess(res) {
      const picInfo = {
        pic: res.data.tmp_path,
      };
      this.addGoodsForm.pics.push(picInfo);
      console.log(this.addGoodsForm);
    },
    // 监听富文本的输入
    catchData(e) {
      this.addGoodsForm.goods_introduce = e;
    },
    // 监听富文本的内容
    editorContent(e) {},
    // 监听添加商品按钮
    putAddGoods() {
      // 表单提交前预验证
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写相关数据");
        // 处理动态参数
        this.goodsParamsManyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addGoodsForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.goodsParamsOnlyList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addGoodsForm.attrs.push(newInfo);
        });

        const { data: res } = await this.$axios.post(
          `goods`,
          this.addGoodsForm
        );
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加商品失败");

        // 更新表格数据
        // this.getUsersList();
        // 提示修改成功
        this.$message.success("添加商品成功");
        this.$router.push({
          path: "/goods",
          query: {},
        });
      });
      //   console.log(this.addGoodsForm);
    },
  },
  created() {
    this.getShopCategoriesData();
  },
  computed: {
    // 商品分类的id
    cateId() {
      if (this.goodscata.length === 3) {
        return this.goodscata[2];
      }
    },
  },
};
</script>

<style>
.goods_steps {
  margin: 20px 80px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.picPreview {
  width: 100%;
}
</style>