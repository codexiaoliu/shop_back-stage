<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="goodsInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 用户数据表格区域 -->
      <el-table :data="goodsList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoodsMessage(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      goodsInfo: {
        pagenum: 1,
        pagesize: 10,
        query: "",
      },
      goodsList: [],
      total: 0,
    };
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$axios.get("goods", {
        params: this.goodsInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("数据请求失败");
      this.goodsList = res.data.goods;
      this.goodsList.forEach((item) => {
        item.add_time = this.dayjs(item.add_time).format("YYYY-MM-DD HH:mm:ss");
      });

      this.total = res.data.total;
      //   console.log(this.goodsList);
    },

    //监听 每页显示的条数
    handleSizeChange(pagesize) {
      this.goodsInfo.pagesize = pagesize;
      this.getGoodsList();
    },
    // 监听当前页
    handleCurrentChange(pagenum) {
      this.goodsInfo.pagenum = pagenum;
      this.getGoodsList();
    },

    // 监听删除商品按钮
    async deleteGoods(id) {
      const result = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
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
      const { data: datares } = await this.$axios.delete("goods/" + id);
      if (datares.meta.status != 200) this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getGoodsList();
    },
    // 监听添加商品跳转到添加商品页面
    showAddGoods() {
      this.$router.push({
        path: "/addGoods",
        query: {},
      });
    },
  },

  created() {
    this.getGoodsList("/addGoods");
  },
};
</script>

<style>
</style>