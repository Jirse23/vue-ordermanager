<template>
  <div>
    <el-table :data="list" v-loading="isloading">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 商品列表展开 -->
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ scope.row.name }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ scope.row.goodsDesc }}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{ scope.row.price }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 商品列表 -->
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="商品分类" prop="category"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <!-- 服务器给的是图片名，要取到图片需要拼上前面的地址 -->
          <img
            style="width: 80px; height: 80px"
            :src="GET_ITEMS_IMG + scope.row.imgUrl"
          />
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="goodsDesc"></el-table-column>
      <el-table-column label="操作">
        <!-- 里面需要继续套用组件 -->
        <template slot-scope="scope">
          <el-button type="warning" @click="clickEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="clickRemove(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 编辑弹出模态框 -->
    <el-dialog title="提示" :visible.sync="showdialog" width="30%">
      <!-- 用itemsAdd的内容 -->
      <el-row>
        <el-col :span="12">
          商品名称
          <el-input v-model="editobj.name" placeholder="商品名称"></el-input>
        </el-col>
      </el-row>
      <!-- 商品分类 -->
      <el-row>
        <el-col :span="8">
          商品分类
          <el-select v-model="editobj.category" placeholder="请选择商品分类">
            <el-option
              v-for="item in categorieslist"
              :key="item.cateName"
              :label="item.cateName"
              :value="item.cateName"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 商品价格 -->
      <el-row>
        <el-col>
          商品价格
          <el-input-number
            v-model="editobj.price"
            @change="handleChange"
            :min="0"
            label="描述文字"
          ></el-input-number>
        </el-col>
      </el-row>
      <!-- 商品图片 -->
      <el-row>
        <el-col>
          商品图片
          <div class="inner">
            <el-upload
              :action="ITEMS_IMG_UPLOAD"
              :on-success="uploadfinish"
              :show-file-list="false"
            >
              <i v-show="!editobj.imgUrl" class="el-icon-plus"></i>
              <img
                style="width: 100px"
                v-show="editobj.imgUrl"
                :src="GET_ITEMS_IMG + editobj.imgUrl"
              />
            </el-upload>
            <!-- <el-dialog :visible.sync="dialogVisible" size="tiny"> -->
            <!-- <img width="100%" :src="dialogImageUrl" alt /> -->
            <!-- </el-dialog> -->
          </div>
        </el-col>
      </el-row>

      <!-- 商品描述 -->
      <el-row>
        商品描述
        <el-col :span="12">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="商品描述"
            v-model="editobj.goodsDesc"
          ></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showdialog = false">取 消</el-button>
        <el-button type="primary" @click="clickChangeItems">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
import {
  itemlist,
  GET_ITEMS_IMG,
  deleteitem,
  ITEMS_IMG_UPLOAD,
  categories,
  edititem,
} from "@/api/apis";
// 调用中国时间
// import { getChinatime } from "@/utils/utils";
export default {
  name: "",
  data() {
    return {
      list: [], //表格数据 接受后台参数
      total: 0,
      GET_ITEMS_IMG: "", //商品 ip地址
      ITEMS_IMG_UPLOAD: "", //商品上传地址
      currentpage: 1, //当前页数
      pagesizes: [5, 10, 15, 20, 25], //可切换的条数
      pagesize: 5, //每页显示条数
      isloading: false, // loading加载
      showdialog: false, // 编辑模态框

      // 模态框回填数据
      name: "", //商品名
      selectvalue: "", //商品分类
      price: 0, //价格
      iteminfo: "", //商品描述
      categories: [], //分类数组
      imgUrl: "", //新图片路径
      ITEMS_IMG_UPLOAD: "", //图片上传地址

      // 回填数据
      editobj: {}, //当前编辑数据
      categorieslist: [], //分类数组
    };
  },
  components: {},
  methods: {
    //图片上传成功回调
    uploadfinish(res) {
      if (res.code == 0) {
        this.editobj.imgUrl = res.imgUrl;
      }
    },

    // 点编辑按钮
    clickEdit(row) {
      // 深拷贝对象
      this.editobj = { ...row };
      this.showdialog = true;

      // 点击编辑获取分类数据
      categories().then((res) => {
        this.categorieslist = res.data.categories;
      });
    },

    // 删除按钮
    clickRemove(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteitem(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 弹窗确认后发送请求
    clickChangeItems() {
      delete this.editobj.rating;
      delete this.editobj.ratings;
      delete this.editobj.sellCount;

      edititem(this.editobj).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "商品数据修改成功！",
          });
          // 刷新数据，重新获取数据
          this.refreshTable();
          // 关闭模态框
          this.showdialog = false;
        }
      });
    },

    //页条数发生变化
    handleSizeChange(newpagesize) {
      this.pagesize = newpagesize;
      this.refreshTable();
    },

    //点击页码 跳转到其他页码
    handleCurrentChange(newpage) {
      this.currentpage = newpage;
      this.refreshTable();
    },

    //刷新表格数据
    refreshTable() {
      this.isloading = true;
      itemlist(this.currentpage, this.pagesize).then((res) => {
        this.list = res.data.data;
        this.total = res.data.total;
        this.isloading = false;
      });
    },
  },
  created() {
    this.GET_ITEMS_IMG = GET_ITEMS_IMG; //引用到template需要赋个值
    this.ITEMS_IMG_UPLOAD = ITEMS_IMG_UPLOAD;
    this.refreshTable();
  },
};
</script>

<style >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin: 0 0 0 60px;
  width: 44%;
}
</style>
