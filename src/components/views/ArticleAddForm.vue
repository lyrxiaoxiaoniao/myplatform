<template>
  <div class="articleAddForm" v-if="catlgList">
    <el-form ref="form" :model="form" labelWidth="80px" :rules="formRules">
      <el-row>
        <el-col class="content-left" :span="5">
          <el-form-item prop="pictures" class="upload-item">
            <el-upload
              class="upload-picture"
              :action="uploadUrl"
              :before-upload="beforeAvatarUpload"
              :file-list="imageList"
              :on-success="onUploadSuccess"
              :on-remove="onRemovePic"
              :on-error="onUploadError"
              list-type="picture">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <div class="item-label">栏目</div>
          <el-form-item prop="categoryId">
            <el-cascader
              expand-trigger="hover"
              :options="catlgList"
              v-model="selectedOptions"
              @change="handleCatlgChange">
            </el-cascader>
          </el-form-item>
          <div class="item-label">作者</div>
          <el-form-item prop="author">
            <el-input v-model="form.author" type="text" placeholder="请输入作者"></el-input>
          </el-form-item>
          <el-button class="reset-button" @click="resetForm('form')">重置</el-button>
        </el-col>
        <el-col class="content-main" :span="18">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" type="text" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="digest">
            <el-input v-model="form.digest" type="text" placeholder="摘要,分享时或图文的摘要或简述"></el-input>
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <vue-html5-editor :content="form.content" @change="updateData"></vue-html5-editor>
          </el-form-item>
          <el-form-item class="item-tag" label="标签" prop="tags">
            <el-tag
              :key="tag"
              v-for="tag in tagsList"
              type="success"
              :closable="true"
              :close-transition="false"
              @close="handleTagClose(tag)"
              >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-add-tag"
              v-if="isShowTag"
              v-model="newTag"
              ref="saveTagInput"
              size="large"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
            </el-input>
            <el-button 
              v-else-if="!isShowTag && !onTagsDone" 
              class="button-add-tag"
              size="small"
              @click="showTagInput">
              添加
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.isPrime">推荐</el-checkbox>
            <el-checkbox v-model="form.isTrend">热点</el-checkbox>
          </el-form-item>
          <el-button class="submit-button" type="primary" @click="addArticle('form')">提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        categoryId: null,
        pictures: [],
        title: '',
        digest: '',
        content: '',
        author: '',
        isPrime: false,
        isTrend: false,
        tags: []
      },
      formRules: {
        categoryId: [
          { required: true, message: '请选择文章板块', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入文章标题', trigger: 'change' }
        ],
        digest: [
          { required: true, message: '请输入文章摘要', trigger: 'change' }
        ],
        author: [
          { required: true, message: '请输入文章作者', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ]
      },
      imageList: [],
      tagsList: [],
      isShowTag: false,
      onTagsDone: false,
      newTag: '',
      catlgList: null,
      error: null,
      uploadUrl: config.serverURI + config.uploadImgAPI
    }
  },
  methods: {
    backToList () {
      this.$router.go(-1)
    },
    handleCatlgChange (value) {
      this.form.categoryId = value.pop()
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    },
    addArticle (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let data = this.form
          data.isPrime = data.isPrime === true ? 1 : 0
          data.isTrend = data.isTrend === true ? 1 : 0
          api.POST(config.addArticleAPI, this.form)
            .then(response => {
              if (response.status !== 200) {
                this.$message.error(response.statusText)
                return
              }
              if (response.data.errcode === '0000') {
                this.$notify({
                  type: 'success',
                  title: '成功',
                  message: '添加文章成功'
                })
                setTimeout(this.$router.push('article'), 3000)
              } else {
                this.$message.error('错误，请重新提交')
              }
            })
            .catch(error => {
              this.$message.error(error)
            })
        } else {
          this.$message.error('请填写完整的信息')
        }
      })
    },
    updateData (data) {
      this.form.content = data
    },
    beforeAvatarUpload (file) {
      if (this.form.pictures.length !== 0) {
        this.$message.error('只能选取一张图片')
        return false
      }
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onUploadSuccess (response, file, fileList) {
      if (response.errcode === '0000') {
        this.form.pictures.push(response.errmsg)
      }
    },
    onUploadError (error, file) {
      this.$message.error(error)
    },
    onRemovePic (file, fileList) {
      this.form.pictures.pop()
    },
    handleTagClose (tag) {
      let index = this.tagsList.indexOf(tag)
      this.tagsList.splice(index, 1)
      this.form.tags.splice(index, 1)
      this.onTagsDone = false
    },
    handleInputConfirm () {
      let value = this.newTag
      if (value) {
        this.tagsList.push(value)
        this.postTagValue(value)
        if (this.tagsList.length === 3) {
          this.onTagsDone = true
        }
      }
      this.isShowTag = false
      this.newTag = ''
    },
    showTagInput () {
      this.isShowTag = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    getCategoryList () {
      const URL = config.serverURI + config.articleCatlgAPI
      axios.get(URL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            const data = response.data.data
            this.catlgList = this.transformData(data)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    postTagValue (tag) {
      const URL = config.serverURI + config.addTagAPI
      axios.post(URL, {
        name: tag
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }
        if (response.data.errcode === '0000') {
          this.form.tags.push(response.data.data.id)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformData (data) {
      let object = []
      data.forEach(item => {
        let category = item
        category.value = item.id
        category.label = item.name
        if (item.children.length !== 0) {
          const children = this.transformData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>
<style scoped>
  .articleAddForm {
    padding-top: 2rem;
    margin-left: 20px;
    margin-right: 20px;
    border: 1px solid lightgray;
  }
  el-form {
    height: 100%;
  }
  .content-left {
    height: 100%;
  }
  .upload-item div:first-child {
    margin-left: 0 !important;
  }
  .upload-item .el-form-item__content {
    margin-left: 0 !important;
  }
  .item-tag {
    margin-bottom: 0 !important;
  }
  .item-label {
    font-size: 14px;
    line-height: 1;
    vertical-align: middle;
    padding-left: 10px;
    color: #48576a;
    font-weight: 700;
  }
  .item-label:before {
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .upload-picture {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .input-add-tag {
    width: 200px;
  }
  .reset-button {
    margin-left: 50px;
    width: 200px;
  }
  .submit-button {
    margin-left: 300px;
    margin-bottom: 20px;
    width: 300px;
  }
  .upload-picture {
    border-color: #20a0ff;
  }
  .btnWrapper {
    margin-top: 2rem;
    padding-top: 2rem;
  }
</style>
