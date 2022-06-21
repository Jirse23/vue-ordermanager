<template>
  <div>
    <!-- 表格组件 -->
    <el-table :data="datalist">
      <el-table-column label="序号" type="index" width="200"></el-table-column>
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <span v-show="!scope.row.isedit">{{ scope.row.cateName }}</span>
          <el-input v-show="scope.row.isedit" v-model="scope.row.cateName" />
        </template>
      </el-table-column>
      <el-table-column label="是否启用">
        <!-- 套用其他组件 -->
        <template slot-scope="scope">
          <el-switch
            :disabled="!scope.row.isedit"
            v-model="scope.row.state"
          ></el-switch> </template
        >+
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="clickEdit(scope)">{{
            scope.row.isedit ? "完成" : "编辑"
          }}</el-button>
          <el-button size="mini" type="danger" @click="clickDelete(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curpage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script >
import { catelist, editcate } from "@/api/apis";

export default {
  name: "",
  data() {
    return {
      datalist: [], //数据源
      curpage: 1, //当前页数
      pagesizes: [6, 12, 18, 24], //可以切换的每页显示条数
      pagesize: 6, //每页显示条数
      total: 0, //总条数
    };
  },
  components: {},
  created() {
    // 进入页面先刷新一次
    this.refreshTable();
  },
  methods: {
    clickEdit(scope) {
      if (scope.row.isedit) {
        //发送请求,改数据
        editcate(scope.row).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: "恭喜你，成功修改了商品分类信息",
              type: "success",
            });
            scope.row.isedit = false;
          }
        });
      } else {
        // 开启编辑状态
        scope.row.isedit = true;
      }
    },
    clickDelete() {},

    // 条数发生变化事件
    handleSizeChange(newsize) {
      this.pagesize = newsize;
      this.refreshTable();
    },
    //页数发生变化事件
    handleCurrentChange(newpage) {
      this.curpage = newpage;
      this.refreshTable();
    },

    // 获取页面数据
    refreshTable() {
      catelist(this.curpage, this.pagesize).then((res) => {
        let dataarr = res.data.data; //显示的数组
        //循环改变数据中的状态为true或者false
        for (let i = 0; i < dataarr.length; i++) {
          //==1即为true或者false
          dataarr[i].state = dataarr[i].state == 1;
          dataarr[i].isedit = false;
        }
        // let total = res.data.total; //数据的总条数
        // 绑定数据
        this.datalist = dataarr;
        this.total = res.data.total;
      });
    },
  },
};
</script>

<style >
</style>
