<template>
  <div>
    <el-button type="danger" @click="clickBatchDelete">批量删除</el-button>
    <!-- 表格组件 -->
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="tableData"
      style="width: 100%; height: 310px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="账号名称" prop="account">
        <template slot-scope="scope">
          <span v-show="!scope.row.isedit">{{ scope.row.account }}</span>
          <el-input
            v-show="scope.row.isedit"
            v-model="scope.row.account"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="ctime">
        <template slot-scope="scope">
          <span v-show="!scope.row.isedit">{{ scope.row.ctime }}</span>
          <el-input
            v-show="scope.row.isedit"
            v-model="scope.row.ctime"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="用户权限" prop="userGroup">
        <template slot-scope="scope">
          <span v-show="!scope.row.isedit">{{ scope.row.userGroup }}</span>
          <el-input
            v-show="scope.row.isedit"
            v-model="scope.row.userGroup"
          ></el-input>
        </template>
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

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[1, 5, 10, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script >
// 调用分页接口
import { userlist, userDelete, userbatchDelete, userEdit } from "@/api/apis";
//调用公共中的转换成中国时间
import { getChinatime } from "@/utils/utils";

export default {
  name: "",
  data() {
    return {
      tableData: [],
      currentPage: 1, //当前页数
      pagesize: 5, //每页显示的条数
      total: 100, //总条数
      loading: true, //显示加载对象
    };
  },
  components: {},
  methods: {
    // 修改用户数据
    clickEdit(scope) {
      if (scope.row.isedit) {
        // 改变数据
        scope.row.isedit = false;
        // 成功之后要发送数据到后台接口
        userEdit(scope.row.id, scope.row.account, scope.row.userGroup).then(
          (res) => {
            if (res.data.code == 0) {
              this.$message({
                showClose: true,
                message: "恭喜你，成功修改了账号信息",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: "请稍后再试",
                type: "error",
              });
            }
          }
        );
      } else {
        //打开编辑状态
        scope.row.isedit = true;
      }
    },
    //删除用户数据
    clickDelete(scope) {
      this.$confirm("此操作将永久删除该用户数据, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          userDelete(scope.row.id).then((res) => {
            if (res.data.code == 0) {
              //刷新一次 让数据渲染
              this.getuserList();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //点击切换条数
    handleSizeChange(newsize) {
      // 改变当前条数
      this.pagesize = newsize;
      this.getuserList();
    },
    // 点击获取当前页数
    handleCurrentChange(newpage) {
      //改变当前条数
      this.currentPage = newpage;
      this.getuserList();
    },
    // 获取用户列表
    getuserList() {
      // 每次调用都打开加载
      this.loading = true;
      // 调用api中的分页接口
      userlist(this.currentPage, this.pagesize).then((res) => {
        // 数据里面是ctime需要转化一下时间
        //要写一个公共函数，最好重新写一个文件夹可以公用文件
        let arr = res.data.data;
        // 先转化在调用就不用渲染两次
        for (let obj of arr) {
          obj.ctime = getChinatime(obj.ctime);
          obj.isedit = false; //让调用的数据对象不处在编辑状态
        }

        // 本页数据
        this.tableData = arr;

        // 总条数
        this.total = res.data.total;

        // then发送完就loading就变成false
        this.loading = false;
      });
    },

    //复选框发生变化
    handleSelectionChange(arr) {
      //循环三种forEach，filter，map
      // 每循环一次触发一次函数， filter return true 才添加，map return直接添加
      // 把选中的用户id放到一个新的数组里面
      this.ids = arr.map((item) => item.id);
    },
    clickBatchDelete() {
      // 要拿到复选框发生变化的id  2种办法  一个是写在data里面   第二种是直接挂载在this上
      this.$confirm("此操作将批量删除选中用户数据, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          //批量删除数据，发生变化的复选框ids从this中获取
          userbatchDelete(JSON.stringify(this.ids)).then((res) => {
            if (res.data.code == 0) {
              //刷新一次 让数据渲染
              this.getuserList();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getuserList();
  },
};
</script>

<style lang="less" scoped>
</style>
