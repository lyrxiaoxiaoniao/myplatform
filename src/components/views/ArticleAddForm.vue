<template>
  <div class="articleAddForm" v-if="catlgList">
    <el-row type="flex">
      <el-col :span="12" :offset="2">
        <el-form ref="form" :model="form" labelWidth="80px" :rules="formRules">
          <el-form-item>
            <el-button icon="d-arrow-left">返回列表</el-button>
          </el-form-item prop="categoryId">
          <el-form-item label="栏目">
            <el-cascader
              expand-trigger="hover"
              :options="catlgList"
              v-model="selectedOptions"
              @change="handleCatlgChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" type="text" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="digest">
            <el-input v-model="form.digest" type="text" placeholder="请输入文章摘要"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" type="text" placeholder="请输入作者"></el-input>
          </el-form-item>
          <el-form-item label="标签" prop="tags">
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
          <el-form-item label="封面" prop="pictures">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :before-upload="beforeAvatarUpload"
              :file-list="imageList"
              :on-success="onUploadSuccess"
              :on-remove="onRemovePic"
              :on-error="onUploadError"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传图片只能是 JPG 格式，单个图像大小不大于2M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.isPrime">推荐</el-checkbox>
            <el-checkbox v-model="form.isTrend">热点</el-checkbox>
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <vue-html5-editor :content="form.content" @change="updateData"></vue-html5-editor>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="addArticle('form')">提交</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </el-row>
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
                setTimeout(this.$router.push('articles'), 2000)
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
    margin-top: 2rem;
    border-top: 1px solid lightgray;
  }

  .btnWrapper {
    margin-top: 2rem;
    padding-top: 2rem;
  }
</style>
