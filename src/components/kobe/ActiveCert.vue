<template>
  <el-card class="box-card kobe-active-cert">
    <div slot="header" class="clearfix">
      <span class="card-title">证书发放</span>
    </div>
    <div v-for="item, index in data.data">
      <el-form-item
        :label="item.title"
        v-if="item.type === 'switch'"
        >
        <el-switch
          v-model="toggleSwitch"
          on-text="开"
          off-text="关"
          on-color="#13ce66"
          off-color="#ff4949"
          @change="onSwitchChange(index)"
          >
        </el-switch>
      </el-form-item>
      <el-form-item
        :label="item.title"
        v-if="item.type === 'upload' && toggleSwitch"
        >
        <div @click="openUploadDialog" class="active-cert-upload-container">
          <img :src="coverURL" alt="">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item
        :label="item.title"
        v-if="item.type === 'textarea' && toggleSwitch"
        >
        <el-input
          @change="onTextAreaChange(index)"
          v-model="content"
          type="textarea"
          :placeholder="item.description">
        </el-input>
      </el-form-item>
      <el-form-item
        :label="item.title"
        v-if="item.type === 'input' && toggleSwitch"
        >
        <el-input
          @change="onInputChange(index)"
          placeholder="请输入发证单位"></el-input>
      </el-form-item>
      <el-form-item :label="item.title"
        v-if="item.type === 'datetime' && toggleSwitch"
        >
        <el-date-picker
          @change="onTimeChange(index)"
          v-model="time"
          type="datetime"
          placeholder="选择日期"
          >
        </el-date-picker>
      </el-form-item>
    </div>
    <kobe-upload-file
      title="上传证书"
      :show="uploadDialogVisiable"
      @close="onCloseUpload"
      @confirm="onConfirmUpload"
      :multiselect="false"
      >
    </kobe-upload-file>
  </el-card>
</template>

<script>
export default {
  name: 'kobe-active-cert',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      toggleSwitch: true,
      uploadDialogVisiable: false,
      coverURL: '',
      content: '',
      unit: '',
      time: '',
      form: {
      }
    }
  },
  methods: {
    onCloseUpload () {
      this.uploadDialogVisiable = false
    },
    onConfirmUpload (value) {
      // TODO
      this.uploadDialogVisiable = true
    },
    openUploadDialog () {
      this.uploadDialogVisiable = true
    },
    onSwitchChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        type_key: obj.type_key,
        options: [{
          title: this.toggleSwitch ? 1 : 0
        }]
      }
      this.form[index] = item
      this.$emit('cert', this.form)
    },
    onTimeChange(index) {
      const obj = this.data.data[index]
      const date = new Date(this.time).getTime()
      let item = {
        id: obj.id,
        type_key: obj.type_key,
        options: [{
          title: date
        }]
      }
      this.form[index] = item
      this.$emit('cert', this.form)
    },
    onInputChange(index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        type_key: obj.type_key,
        options: [{
          title: this.unit
        }]
      }
      this.form[index] = item
      this.$emit('cert', this.form)
    },
    onTextAreaChange(index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        type_key: obj.type_key,
        options: [{
          title: this.toggleSwitch
        }]
      }
      this.form[index] = item
      this.$emit('cert', this.form)
    }
  },
  mounted () {
  }
}
</script>

<style>
.kobe-active-cert {
  margin-top: 1rem;
}
.card-title {
  font-size: 16px;
}
.active-cert-upload-container {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.active-cert-upload-container:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>
