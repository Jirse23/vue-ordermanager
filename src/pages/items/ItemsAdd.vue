<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品添加</span>
      </div>

      <!-- 商品名称  -->
      <el-row>
        <el-col :span="12">
          商品名称
          <el-input v-model="name" placeholder="商品名称"></el-input>
        </el-col>
      </el-row>
      <!-- 商品分类 -->
      <el-row>
        <el-col :span="8">
          商品分类
          <el-select v-model="selectvalue" placeholder="请选择商品分类">
            <el-option
              v-for="item in categories"
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
            v-model="price"
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
              <i v-show="imgUrl == ''" class="el-icon-plus"></i>
              <img
                style="width: 100px"
                v-show="imgUrl != ''"
                :src="GET_ITEMS_IMG + imgUrl"
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
            v-model="iteminfo"
          ></el-input>
        </el-col>
      </el-row>
      <el-button type="primary" size="small" @click="clickAddItem"
        >添加商品</el-button
      >
    </el-card>
  </div>
</template>

<script>
//import 相当于 var 一个变量  无法在template中直接用  所以写到data里再用create赋给data
// api接口可以先拼接再发送  也可以直接传参数再拼接
import {
  categories,
  additem,
  ITEMS_IMG_UPLOAD,
  GET_ITEMS_IMG,
} from "@/api/apis";

export default {
  data() {
    return {
      name: "", //商品名
      selectvalue: "", //商品分类
      price: 0, //价格
      iteminfo: "", //商品描述
      categories: [], //分类数组
      imgUrl: "", //新图片路径
      ITEMS_IMG_UPLOAD: "", //图片上传地址
      GET_ITEMS_IMG: "", //图片下载地址
    };
  },
  methods: {
    clickAddItem() {
      additem({
        name: this.name,
        category: this.selectvalue,
        price: this.price,
        imgUrl: this.imgUrl,
        goodsDesc: this.iteminfo,
      }).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "系统温馨提示:添加商品成功,请至商品列表查看",
            type: "success",
          });
        }
      });
    },
    uploadfinish(res) {
      if (res.code == 0) {
        this.imgUrl = res.imgUrl;
      }
    },
    handleChange(value) {
      console.log(value);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
  created() {
    this.ITEMS_IMG_UPLOAD = ITEMS_IMG_UPLOAD;
    this.GET_ITEMS_IMG = GET_ITEMS_IMG;

    categories().then((res) => {
      this.categories = res.data.categories;
      //设置默认选项
      this.selectvalue = this.categories[0].cateName;
    });
  },
};
</script>

<style lang="less" scoped>
.el-col {
  display: flex;
  align-items: center;
  .el-input,
  .el-textarea,
  .el-select {
    flex: 1;
    margin-left: 5px;
  }
  .el-input-number,
  .inner {
    margin-left: 5px;
  }
}
.el-row {
  margin: 20px 0;
  display: flex;
}

// 上传图片样式
.el-upload {
  margin-left: 5px;
}
.el-button {
  margin-left: 100px;
}
</style>