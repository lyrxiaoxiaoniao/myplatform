<template>
  <div class="articleAddForm">
    <el-row type="flex">
      <el-col :span="12" :offset="2">
        <el-form ref="form" :model="form" labelWidth="80px">
          <el-form-item>
            <el-button icon="d-arrow-left">返回列表</el-button>
          </el-form-item>
          <el-form-item label="栏目">
            <el-select v-model="form.class" placeholder="请选择文章分类">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input type="text" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input type="text" placeholder="请输入文章摘要"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input type="text" placeholder="请输入作者"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-input type="text" placeholder="请输入标签"></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传图片只能是 JPG 格式，单个图像大小不大于2M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-checkbox>推荐</el-checkbox>
            <el-checkbox>热点</el-checkbox>
          </el-form-item>
          <el-form-item label="正文">
            <vue-html5-editor :content="inputContent" @change="updateData"></vue-html5-editor>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-button type="primary">提交</el-button>
      <el-button>重置</el-button>
    </el-row>
  </div>
</template>
<script>
  import config from 'src/config'

  export default {
    data () {
      return {
        form: {
          class: '',
          fileList: [],
          summary: '',
          inputContent: ''
        },
        uploadUrl: config.serverURI + config.uploadImgAPI,
        fileList: []
      }
    },
    methods: {
      updateData (data) {
        this.form.inputContent = data
        console.log(this.form.inputContent)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    }
  }
</script>
<style scoped>
  .articleAddForm {
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: 1px solid lightgray;
  }

  .btnWrapper {
    margin-top: 2rem;
    padding-top: 2rem;
  }
</style>
