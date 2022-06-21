<template>
  <div class="login-box">
    <div class="center-box">
      <el-input placeholder="请输入内容" v-model="acc" clearable> </el-input>
      <el-input placeholder="请输入密码" v-model="pwd" show-password></el-input>
      <p class="error">{{ errormsg }}</p>
      <el-button type="primary" style="width: 100%" @click="clickLogin"
        >登录</el-button
      >
    </div>
  </div>
</template>

<script >
import { login } from "@/api/apis";
// vue中方便功能   @ 回到根目录
export default {
  name: "",
  data() {
    return {
      acc: "", //账号
      pwd: "", //密码
      errormsg: "", //错误提示
    };
  },
  components: {},
  methods: {
    clickLogin() {
      login(this.acc, this.pwd).then((res) => {
        if (res.data.code == 0) {
          //写入token
          localStorage.token = res.data.token;
          // 写入用户权限
          localStorage.role = res.data.role;
          // 存入用户名
          localStorage.acc = this.acc;
          //存入用户的id
          localStorage.id = res.data.id;

          //成功
          // location = ''
          // window.location.href = "http://localhost:8080/Main";
          this.$router.push("Main");
          this.$message({
            message: "用户登录成功",
            type: "success",
          });
        } else this.errormsg = res.data.msg; //失败
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3a4b;
  .center-box {
    width: 300px;
    height: 200px;
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    .error {
      font-size: 12px;
      color: red;
    }
  }
}
</style>
