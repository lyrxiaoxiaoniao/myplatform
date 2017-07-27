<template>
  <div class="kobe-tutorial-upload">
    <div class="img-upload-container">
      <img v-if="url" :src="url" alt="cover" class="avatar">
      <i v-else @click="openDialog" class="el-icon-plus avatar-uploader-icon"></i>
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
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      isShow: false,
      url: ''
    }
  },
  methods: {
    openDialog () {
      this.isShow = true
    },
    onClose () {
      this.isShow = false
    },
    onConfirm (value) {
      this.url = value[0]
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: this.url
          }]
        }
      }
      this.isShow = false
      this.$emit('upload', data)
    },
    init () {
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        this.url = value.value
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: this.url
            }]
          }
        }
        this.$emit('upload', data)
      }
    }
  },
  mounted () {
    this.init()
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
