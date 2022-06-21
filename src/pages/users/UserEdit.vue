<template>
  <div class="">
    <el-upload
      class="avatar-uploader"
      action="http://10.64.5.133:5000/users/avatar_upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :data="uploaddata"
    >
      <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script >
export default {
  name: "",
  data() {
    return {
      uploaddata: {},
    };
  },
  components: {},
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        //code等于0则是图片上传成功

        // 2.发起自定义事件
        this.$bus.$emit("imguploadfinish");
      }
    },
  },
  created() {
    this.uploaddata = { id: localStorage.id };
  },
};
</script>

<style lang="less" scoped>
</style>
