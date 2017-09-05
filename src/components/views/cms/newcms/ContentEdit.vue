<template>
    <div class="ca-container">
        <div>
            <el-button @click="goBack" type="primary">返回列表</el-button>
            <el-button @click="addContent" type="primary">提交发布</el-button> 
        </div>
        <div class="ca-cpntent">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="ca-content-left">
                        <h4>头图及属性</h4>
                        <div class="left-img">
                            <el-upload
                                class="avatar-uploader"
                                :action="uploadURL"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm" style="padding:0 10px;">
                            <el-form-item label="来源">
                                <el-select v-model="ruleForm.source_id" placeholder="来源列表" style="width:100%;">
                                    <el-option
                                        v-for="item in option.data"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="作者">
                                <el-input v-model="ruleForm.author" placeholder="作者名称"></el-input>
                            </el-form-item>
                        </el-form>
                        <el-row style="text-align: center;">
                            <el-checkbox v-model="is_original">本文属于原创</el-checkbox>
                            <el-checkbox v-model="is_recommend">推荐本文</el-checkbox>
                            <el-checkbox v-model="is_topped">本文固顶</el-checkbox>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="ca-content-right">
                        <el-form :model="formData" ref="formData" label-width="80px" class="ca-right-form">
                            <el-form-item label="分类">
                                <el-cascader
                                style="width:100%;"
                                :options="options"
                                change-on-select
                                :props="props"
                                @change="handleChange"
                                v-model="formData.cids"
                                ></el-cascader>
                            </el-form-item>
                            <el-form-item label="标题">
                                <el-input placeholder="请输入标题" v-model="formData.title"></el-input>
                            </el-form-item>
                            <el-form-item label="摘要">
                                <el-input type="textarea" placeholder="请输入摘要" v-model="formData.digest"></el-input>
                            </el-form-item>
                            <el-form-item label="正文">
                                <vue-html5-editor :content="formData.content" @change="updateData"></vue-html5-editor>
                            </el-form-item>
                            <el-form-item label="链接">
                                <el-input placeholder="请输入完整的url地址链接，如果没有，请留空" v-model="formData.refer_url"></el-input>
                            </el-form-item>
                            <el-form-item label="标签">
                                <el-tag
                                :key="tag"
                                v-for="tag in dynamicTags"
                                :closable="true"
                                :close-transition="false"
                                @close="handleClose(tag)"
                                type="primary"
                                style="margin:0 5px"
                                >
                                {{tag}}
                                </el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="inputVisible"
                                    v-model="inputValue"
                                    ref="saveTagInput"
                                    @keyup.enter.native="handleInputConfirm"
                                    @blur="handleInputConfirm"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
                            </el-form-item>
                            <el-form-item label="附件">
                                <el-upload
                                    class="upload-demo"
                                    list-type="picture"
                                    :action= "uploadURL"
                                    :file-list="fileList"
                                    :on-remove="handleRemove"
                                    :on-success="handlefileSuccess">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      id: this.$route.query.id,
      fileList: [],
      option: [],
      uploadURL: config.serverURI + config.uploadFilesAPI,
      is_original: false,
      is_topped: false,
      is_recommend: false,
      ruleForm: { // 头图与属性
        source_id: '',
        author: '',
        picture: '',
        is_original: false,
        is_topped: false,
        is_recommend: false
      },
      formData: {
        category_id: null,
        title: '',
        digest: '',
        content: '',
        refer_url: '',
        tags: [],
        files: [],
        cids: []
      },
      options: [],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    /* 分类选择函数 */
    handleChange (val) {
      this.formData.cids = val
      this.formData.category_id = JSON.parse(JSON.stringify(val)).pop()
    },
    /* 上传附件 */
    handleRemove (file, fileList) {
      this.formData.files.forEach((v, i) => {
        if (v === file.response.data[0]) {
          this.formData.files.splice(i, 1)
        }
      })
    },
    handlefileSuccess (res, file, fileList) {
      this.formData.files = []
      this.removeImg(fileList)
    },
    removeImg (obj) {
      obj.forEach(v => {
        this.formData.files.push({
          file_name: v.name,
          file_url: v.response.data[0]
        })
      })
    },
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      this.ruleForm.picture = res.data[0]
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    /* 富文本数据函数 */
    updateData (data) {
      this.formData.content = data
    },
    /* 标签函数 */
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    goBack () {
      this.$router.go(-1)
    },
    getNumber (val) {
      let res
      if (val) {
        res = 1
      } else {
        res = 0
      }
      return res
    },
    addContent () {
      this.ruleForm.is_original = this.getNumber(this.is_original)
      this.ruleForm.is_topped = this.getNumber(this.is_topped)
      this.ruleForm.is_recommend = this.getNumber(this.is_recommend)
      this.formData.tags = this.dynamicTags
      this.formData.id = Number(this.id)
      const data = {
        ...this.ruleForm,
        ...this.formData
      }
      data.cids = data.cids.join(',')
      api.POST(config.content.edit, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('新增文章内容')
          this.goBack()
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    getSource (data = {}) {
      api.GET(config.showWordSourceListAPI, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.option = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getTree () {
      api.GET(config.newcms.ncmsCategotyAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.options = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    getGontentData () {
      api.GET(config.content.detail, {id: this.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.showFormData(response.data.data)
          this.showRuleForm(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    showFormData (data) {
      for (var k in this.formData) {
        this.formData[k] = data[k]
      }
      if (this.formData.tags) {
        this.dynamicTags = this.formData.tags
      }
      if (this.formData.files) {
        this.formData.files.forEach((v, i) => {
          this.fileList.push({
            name: v.file_name,
            url: v.file_url
          })
        })
      }
      this.formData.cids = data.cids.split(',')
      let ids = []
      this.formData.cids.forEach(v => {
        ids.push(Number(v))
      })
      this.formData.cids = ids
    },
    showRuleForm (data) {
      for (var k in this.ruleForm) {
        this.ruleForm[k] = data[k]
      }
      this.is_original = Boolean(this.ruleForm.is_original)
      this.is_topped = Boolean(this.ruleForm.is_topped)
      this.is_recommend = Boolean(this.ruleForm.is_recommend)
    }
  },
  mounted () {
    this.getGontentData()
    this.getTree()
    this.getSource({
      currentPage: 1,
      pageSize: 100
    })
  }
}
</script>
<style lang="scss" scoped>
.ca-container {
    width: 100%;
    padding: 1rem;
    .ca-cpntent {
        margin-top: 1rem;
        border-top: 1px solid lightgray;
        padding-top: 1rem;
        .ca-content-left {
            background-color: #fff;
            border: 1px solid lightgray;
            height: 500px;
            h4 {
                padding: 10px;
                border-bottom: 1px solid lightgray;
            }
            .left-img {
                text-align: center;
                width: 100%;
                height: 250px;
                padding: 10px 30px;
            }
        }
        .ca-content-right {
            border: 1px solid lightgray;
            padding: 20px 20px 0 0;
            background-color: #fff;
        }
    }
}    
</style>