<template>
  <div>
    <!-- 订单信息  -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="orderNo" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="consignee" placeholder="收货人"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="orderState" placeholder="订单状态">
          <el-option
            v-for="item in option"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 日期查询 -->
    <div class="block">
      <span class="demonstration">选择时间</span>
      <el-date-picker
        v-model="date"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" @click="clickSearch" icon="el-icon-search"
        >搜索</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table :data="gridData" border style="width: 100%" v-loading="loadDate">
      <el-table-column fixed prop="orderNo" label="订单号"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="consignee" label="收货人"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址"></el-table-column>
      <el-table-column prop="deliveryTime" label="送达时间"></el-table-column>
      <el-table-column prop="remarks" label="用户备注"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
      <el-table-column prop="orderState" label="订单状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small" @click="editOrder(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 信息查看 -->

    <el-dialog title="订单详情" :visible.sync="dialogTableVisible"></el-dialog>

    <!-- 修改订单信息 -->
    <el-dialog title="订单修改"></el-dialog>
  </div>
</template>

<script>
import { orderlist } from "@/api/apis";
import { getChinatime } from "@/utils/utils";

export default {
  data() {
    return {
      //信息查看
      gridData: [],
      dialogTableVisible: false,
      loadDate: false,
      option: ["已完成", "派送中", "已受理", "全部"],

      //查询数据
      orderNo: "", //订单号
      consignee: "", //收货人
      phone: "", //手机号
      orderState: "", //订单状态
      date: [new Date("1998-9-18"), new Date()],

      curPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 15, 20],
      total: 0,
    };
  },
  created() {
    this.refreshTable();
  },
  methods: {
    handleCurrentChange(newpage) {
      this.curPage = newpage;

      // 在点击翻页时, 把额外的查询数据一起带过去
      this.refreshTable(this.paramsex);
    },
    handleSizeChange() {},
    clickSearch() {
      //如果用户选择了时间
      console.log(this.date);
      let { orderNo, consignee, phone, orderState } = this;

      //额外参数对象
      let paramsex = {};
      if (orderNo != "") paramsex.orderNo = orderNo;
      if (consignee != "") paramsex.consignee = consignee;
      if (phone != "") paramsex.phone = phone;
      if (orderState != "" && orderState != "全部")
        paramsex.orderState = orderState;
      if (this.date)
        paramsex.date = JSON.stringify([
          getChinatime(this.date[0]),
          getChinatime(this.date[1]),
        ]);

      this.paramsex = paramsex;

      this.refreshTable(this.paramsex);
    },
    refreshTable(paramsex) {
      orderlist({
        currentPage: this.curPage,
        pageSize: this.pageSize,
        ...paramsex,
      }).then((res) => {
        console.log(res);

        for (let obj of res.data.data) {
          obj.deliveryTime = getChinatime(obj.deliveryTime);
          obj.orderTime = getChinatime(obj.orderTime);
        }

        this.gridData = res.data.data;
        this.total = res.data.total;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-button {
  margin-left: 10px;
}
.el-table {
  margin-top: 20px;
}
.el-dialog {
  span {
    margin-left: 20px;
    color: coral;
    font-weight: bold;
  }
}
</style>