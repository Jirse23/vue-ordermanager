<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :default-active="curhash"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        unique-opened
      >
        <!-- router设置为锚点，index直接变成类似to -->
        <!-- 展开菜单 -->
        <div v-for="item in powerarr" :key="item.url">
          <el-menu-item v-if="!item.children" :index="item.url">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>

          <!-- 多个选项 -->
          <el-submenu v-else :index="item.url">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group
              v-for="child in item.children"
              :key="child.url"
              :index="child.url"
            >
              <el-menu-item :index="child.url">{{ child.name }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breaklist" :key="item">{{
              item
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          {{ username }}
          <img style="width: 50px; border-radius: 50%" :src="headimg" />
        </div>
      </el-header>
      <!-- 二级路由 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script >
import { checktoken, accinfo } from "@/api/apis";

export default {
  name: "",
  data() {
    return {
      username: "", //用户名

      // {url:'/Index',icon:'el-icon-bell',name:'后台首页'}
      list: [
        {
          url: "/index",
          icon: "el-icon-bell",
          name: "后台首页",
          roles: ["super", "normal"],
        },
        {
          url: "/manage",
          icon: "el-icon-s-order",
          name: "订单管理",
          roles: ["super", "normal"],
        },
        {
          url: "/items",
          icon: "el-icon-shopping-cart-full",
          name: "商品管理",
          children: [
            { url: "/itemslist", name: "商品列表" },
            { url: "/itemsadd", name: "添加商品" },
            { url: "/itemstype", name: "商品分类" },
          ],
          roles: ["super", "normal"],
        },

        {
          url: "/shops",
          icon: "el-icon-s-shop",
          name: "店铺管理",
          roles: ["super"],
        },
        {
          url: "/users",
          icon: "el-icon-s-custom",
          name: "账号管理",
          children: [
            { url: "/userlist", name: "用户列表" },
            { url: "/useradd", name: "添加用户" },
            { url: "/useredit", name: "修改用户" },
          ],
          roles: ["super"],
        },

        {
          url: "/total",
          icon: "el-icon-bell",
          name: "销售统计",
          children: [
            { url: "/salecount", name: "销售统计" },
            { url: "/ordercount", name: "订单统计" },
          ],
          roles: ["super"],
        },
      ],
      curhash: "", //当前hash值
      headimg: "", //右侧图片src
      breaklist: [], //左侧面包屑
    };
  },
  components: {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    //刷新个人信息 封装
    refreshinfo() {
      // 获取个人信息
      accinfo(localStorage.id).then((res) => {
        // 把img的src取出来
        this.headimg = res.data.accountInfo.imgUrl;
      });
    },
  },
  computed: {
    // 管理用户权限
    powerarr() {
      //对用户权限进行运算，产生新的数组而不影响原来的数组  filter
      // es5写法
      let newarr = this.list.filter((item) => {
        // 返回该用户权限的数据
        return item.roles.includes(localStorage.role);
      });
      return newarr;
    },
  },
  created() {
    // 权限管理
    // super 超级管理员 6大板块
    // normal 普通管理员 3大板块
    checktoken(localStorage.token).then((res) => {
      if (res.data.code == 0) {
        //有效
        this.username = localStorage.acc;
      } else {
        // 无效
        this.username = "请登录";
      }
    });

    this.refreshinfo();

    //3.监听bus的传递事件
    this.$bus.$on("imguploadfinish", () => {
      this.refreshinfo(); //刷新头像
    });

    //  设置刷新后默认hash为当前页面
    // this.$router 是指整个路由表  可以用push跳转页面   window.location.hash  原生js显示hash
    this.curhash = this.$route.path;

    // 初始化二级面包屑导航
    this.breaklist = this.$route.meta.breaklist;
  },

  // 可以观察vue中多属性的变化(包括hash值的变化)
  watch: {
    // 面包屑需要监听hash变化而不是点击变化
    // $route(to,from)
    // 需要先初始化一次
    $route(to) {
      this.breaklist = to.meta.breaklist;
    },
  },
};
</script>

<style lang="less" scoped>
@base: #545c64;

.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: @base;
}

.el-main {
  background-color: #e9eef3;
}
</style>
