<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>添加账户</span>
    </div>
    <!-- 账户 -->
    <el-row type="flex" align="middle" justify="center">
      账户
      <el-col :span="6">
        <div class="inner_div">
          <el-input placeholder="请输入账号" v-model="acc"></el-input>
        </div>
      </el-col>
    </el-row>
    <!-- 密码 -->
    <el-row type="flex" align="middle" justify="center">
      密码
      <el-col :span="6">
        <div class="inner_div">
          <el-input
            placeholder="请输入密码"
            v-model="pwd"
            type="password"
            minlength="6"
          ></el-input>
        </div>
      </el-col>
    </el-row>
    <!-- 用户组 -->
    <el-row type="flex" align="middle" justify="center" :gutter="23">
      用户组
      <el-col :span="6">
        <el-select v-model="usergroup" placeholder="请选择用户组">
          <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :push="1">
        <p class="errColor"></p>
      </el-col>
    </el-row>

    <el-row type="flex" align="middle" justify="center">
      <el-col :span="6" :push="1">
        <el-button type="primary" size="small" @click="clickAdd"
          >新增用户</el-button
        >
        <el-button size="small">重置</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script >
import { useradd } from "@/api/apis";
export default {
  name: "",
  data() {
    return {
      acc: "",
      pwd: "",
      list: [
        { label: "普通管理员", value: "普通管理员" },
        { label: "超级管理员", value: "超级管理员" },
      ],
      usergroup: "",
    };
  },
  components: {},
  methods: {
    clickAdd() {
      let { acc, pwd, usergroup } = this;
      useradd(acc, pwd, usergroup).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            message: "系统提示: 账号添加成功",
            type: "success",
          });
        } else {
          this.$message.error("系统提示: 账号添加失败");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 20px;
  .el-col {
    margin-left: 5px;
    .inner_div {
      margin-left: 17px;
    }
  }
  .errColor {
    color: red;
  }
}
</style>
