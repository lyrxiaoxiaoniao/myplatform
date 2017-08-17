<template>
  <div :class="['kobe-tutorial-material', typeClass]">
    <div>请选择课程素材:</div>
    <div class="kobe-tutorial-material-components">
      <template v-for="item, index in options">
        <div>
          <el-radio-group
            v-if="item.type === 'radio'"
            v-model="radio"
            @change="onRadioChange(index)"
            >
            <el-radio
              :label="index"
              >
              {{ item.title }}
            </el-radio>
          </el-radio-group>
        </div>
        <div v-if="item.type === 'input'" class="kobe-tutorial-material-link">
          <el-form-item :label="item.title">
            <el-input
              v-model="link"
              @change="onInputChange(index)"
              placeholder="请输入外部连接"
              >
            </el-input>
          </el-form-item>
          <div>外部视频链接仅支持腾讯视频链接;其他文本内容链接支持pdf或者jpg/png等图片文件。</div>
        </div>
        <div v-if="item.type === 'upload'">
          <div class="file-upload-container">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onUploadSuccess"
              :on-change="onUploadChange"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
          <div>如果选择课程分类为文本内容,则只能上传pdf或者文本内容文件;如果选择了视频课程,则必须上传视频文件MP4</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import config from 'src/config'

export default {
  name: 'kobe-tutorial-material',
  props: {
    data: {
      type: Object
    },
    typeClass: {
      type: String
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      uploadURL: config.serverURI + config.uploadFilesAPI,
      fileList: [],
      files: [],
      uploadIndex: 3,
      link: '',
      radio: '',
      form: []
    }
  },
  computed: {
    options () {
      let arr = []
      this.data.data.forEach(item => {
        item.value = ''
        arr.push(item)
      })
      return arr
    }
  },
  methods: {
    handleRemove(file, fileList) {
      const url = file.response.data[0]
      let num = -1
      this.files.forEach((file, index) => {
        if (url === file.url) {
          num = index
        }
      })
      if (num !== -1) {
        this.files.splice(num, 1)
      }

      const data = this.data.data[this.uploadIndex]
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.files
          }]
        }
      }
      this.form[this.uploadIndex] = item
      this.$emit('material', this.form)
    },
    handlePreview(file) {
    },
    onUploadChange (file, fileList) {
      const data = this.data.data[this.uploadIndex]
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.files
          }]
        }
      }
      this.form[this.uploadIndex] = item
      this.$emit('material', this.form)
    },
    onUploadSuccess (response, file, fileList) {
      if (response.errcode === '0000') {
        let obj = {
          name: file.name,
          url: response.data[0]
        }
        this.files.push(obj)
      } else {
        this.$message.error('上传错误，请重试')
      }
    },
    onRadioChange (index) {
      const selected = index === this.radio
      const data = this.data.data[index]
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: selected ? 1 : 0
          }]
        }
      }
      this.form[index] = item
      this.$emit('material', this.form)
    },
    onInputChange (index) {
      const data = this.data.data[index]
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.link
          }]
        }
      }
      this.form[index] = item
      this.$emit('material', this.form)
    },
    init () {
      if (this.data.data && this.data.data.length) {
        this.data.data.forEach((item, index) => {
          if (!item.values || !item.values.length) return
          let data
          switch (item.type_key) {
            case 'activity_property_tutorial_external_material':
              const external = item.values[0].value
              this.radio = (external === '1' || external === 1) ? 0 : 2
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: external
                  }]
                }
              }
              break
            case 'activity_property_tutorial_external_url':
              const link = item.values[0].value
              this.link = link
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: this.link
                  }]
                }
              }
              break
            case 'activity_property_tutorial_server_material':
              const server = item.values[0].value
              this.radio = (server === '1' || server === 1) ? 2 : 0
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: server
                  }]
                }
              }
              break
            case 'activity_property_tutorial_server_url':
              const files = item.values[0].value
              this.files = JSON.parse(files)
              this.fileList = JSON.parse(files)
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: this.files
                  }]
                }
              }
              break
          }
          this.form[index] = data
        })
        this.$emit('material', this.form)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.kobe-tutorial-material-link {
  padding-bottom: 8rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid lightgray;
}
.kobe-tutorial-material-components {
  padding: 2rem;
  padding-top: 1rem;
}
.kobe-tutorial-material .el-radio {
  font-weight: 400;
}
.kobe-tutorial-material .el-radio__label {
  font-size: 12px;
}
.kobe-tutorial-material .file-upload-container {
  margin: 2rem;
}
</style>
