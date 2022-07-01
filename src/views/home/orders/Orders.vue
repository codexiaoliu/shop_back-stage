<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="orderInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户数据表格区域 -->
      <el-table :data="ordersList" style="width: 100%" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="500">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'"> 已付款</el-tag>
            <el-tag v-if="scope.row.pay_status === '0'" type="warning">
              未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column prop="update_time" label="创建时间"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editOrdersMessage(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="clickOrdersLogistics()"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页部分区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Orders",
  data() {
    return {
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      ordersList: [],
      total: 0,
    };
  },
  methods: {
    // 获取商品列表数据
    async getOrdersList() {
      const { data: res } = await this.$axios.get("orders", {
        params: {
          query: this.orderInfo.query,
          pagenum: this.orderInfo.pagenum,
          pagesize: this.orderInfo.pagesize,
        },
      });
      //   console.log(res);
      if (res.meta.status !== 200) return this.$message.error("数据请求失败");
      this.ordersList = res.data.goods;
      this.ordersList.forEach((item) => {
        item.create_time = this.dayjs(item.create_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        item.update_time = this.dayjs(item.update_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      });

      this.total = res.data.total;
      //   console.log(this.goodsList);
    },
    //监听 每页显示的条数
    handleSizeChange(pagesize) {
      this.orderInfo.pagesize = pagesize;
      this.getOrdersList();
    },
    // 监听当前页
    handleCurrentChange(pagenum) {
      this.orderInfo.pagenum = pagenum;
      this.getOrdersList();
    },

    // 监听订单物流点击  订单号不能用
    // async clickOrdersLogistics() {
    //   const { data: res } = await this.$axios.get(`/kuaidi/1106975712662`);
    //   console.log(res);
    //   if (res.meta.status !== 200) return this.$message.error("数据请求失败");
    // },
  },
  created() {
    this.getOrdersList();
  },
};
</script>

<style>
</style>