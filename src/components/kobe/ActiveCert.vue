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
        <div @click="openUploadDialog(index)" class="active-cert-upload-container">
          <img v-if="coverURL" :src="coverURL" alt="cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
          v-model="unit"
          placeholder="请输入发证单位"></el-input>
      </el-form-item>
      <el-form-item :label="item.title"
        v-if="item.type === 'datetime' && toggleSwitch"
        >
        <el-date-picker
          @change="onTimeChange(index)"
          v-model="certTime"
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
  // activity cert toggle card
  // used for kobe active form
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
      certTime: '',
      itemIndex: ''
    }
  },
  computed: {
    form () {
      const data = this.data.data[0]
      const obj = [{
        id: data.id,
        index: data.index,
        type_key: data.type_key,
        options: [{
          title: this.toggleSwitch ? 1 : 0
        }]
      }]
      return obj
    }
  },
  methods: {
    onCloseUpload () {
      this.uploadDialogVisiable = false
    },
    onConfirmUpload (value) {
      this.coverURL = value[0]
      const obj = this.data.data[this.itemIndex]
      let item = {
        id: obj.id,
        index: obj.index,
        type_key: obj.type_key,
        options: [{
          title: this.coverURL
        }]
      }
      this.uploadDialogVisiable = false
      this.form[this.itemIndex] = item
      this.$emit('cert', this.form)
    },
    openUploadDialog (index) {
      this.itemIndex = index
      this.uploadDialogVisiable = true
    },
    onSwitchChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        index: obj.index,
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
      const date = new Date(this.certTime).getTime()
      let item = {
        id: obj.id,
        index: obj.index,
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
        index: obj.index,
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
        index: obj.index,
        type_key: obj.type_key,
        options: [{
          title: this.content
        }]
      }
      this.form[index] = item
      this.$emit('cert', this.form)
    },
    init () {
      this.data.data.forEach((item, index) => {
        if (item.values && item.values.length) {
          const key = item.values[0].key
          const value = item.values[0].value
          switch (key) {
            case 'activity_property_cert':
              if (value === 1 || value === '1') {
                this.toggleSwitch = true
              } else {
                this.toggleSwitch = false
              }
              let cert = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: this.toggleSwitch ? 1 : 0
                }]
              }
              this.form[index] = cert
              break
            case 'activity_property_cert_style':
              this.coverURL = value
              let img = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: this.coverURL
                }]
              }
              this.form[index] = img
              break
            case 'activity_property_cert_content':
              this.content = value
              let content = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: this.content
                }]
              }
              this.form[index] = content
              break
            case 'activity_property_cert_unit':
              this.unit = value
              let unit = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: this.unit
                }]
              }
              this.form[index] = unit
              break
            case 'activity_property_cert_date':
              this.certTime = value
              let time = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: new Date(this.certTime).getTime()
                }]
              }
              this.form[index] = time
              break
          }
        }
      })
      this.$emit('cert', this.form)
    }
  },
  mounted () {
    this.init()
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
