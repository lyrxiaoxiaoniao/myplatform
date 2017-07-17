<template>
  <div class="kobe-tutorial-upload">
    <div class="img-upload-container">
      <img v-if="url" :src="url" alt="cover">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </div>
    <kobe-upload-file
      title="上传头图"
      :show="isShow"
      @close="onClose"
      @confirm="onConfirm"
      :multiselect="false"
      >
    </kobe-upload-file>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-upload',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      isShow: false,
      url: ''
    }
  },
  methods: {
    onClose () {
      this.isShow = false
    },
    onConfirm (value) {
    }
  },
  mounted () {
  }
}
</script>

<style>
.img-upload-container {
  margin: 1rem auto;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-upload-container:hover {
  border-color: #20a0ff;
}
</style>
