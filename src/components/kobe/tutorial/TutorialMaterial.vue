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
          <div class="img-upload-container">
            <img v-if="url" :src="url" alt="cover">
            <i v-else @click="openUpload(index)" class="el-icon-plus avatar-uploader-icon"></i>
          </div>
          <div>如果选择课程分类为文本内容,则只能上传pdf或者文本内容文件;如果选择了视频课程,则必须上传视频文件MP4</div>
          <kobe-upload-file
            title="上传头图"
            :show="showUpload"
            @close="onClose"
            @confirm="onConfirm"
            :multiselect="false"
            >
          </kobe-upload-file>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
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
      showUpload: false,
      uploadIndex: '',
      url: '',
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
    openUpload (index) {
      this.uploadIndex = index
      this.showUpload = true
    },
    onClose () {
      this.showUpload = false
    },
    onConfirm (value) {
      this.url = value[0]
      const data = this.data.data[this.uploadIndex]
      let item = {
        index: data.uploadIndex,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.url
          }]
        }
      }
      this.form[this.uploadIndex] = item
      this.$emit('material', this.form)
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
    }
  },
  mounted () {
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
</style>
