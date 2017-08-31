<template>
    <div class="ca-container">
        <div>
            <el-button @click="goBack" type="primary">返回列表</el-button>  
            <el-button type="primary">文章预览</el-button>
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
                            <el-checkbox :model="is_original">本文属于原创</el-checkbox>
                            <el-checkbox :model="is_recommend">推荐本文</el-checkbox>
                            <el-checkbox :model="is_topped">本文固顶</el-checkbox>
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
                                    :action= "uploadURL"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :on-success="handlefileSuccess"
                                    :file-list="fileList">
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
      fileList: [],
      option: [],
      uploadURL: config.serverURI + config.uploadFilesAPI,
      is_original: null,
      is_topped: null,
      is_recommend: null,
      ruleForm: { // 头图与属性
        source_id: '',
        author: '',
        picture: '',
        is_original: null,
        is_topped: null,
        is_recommend: null
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
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handlefileSuccess (res, file, fileList) {
      // console.log(res, file)
      this.ruleForm.files = []
      this.removeImg(fileList)
      // this.ruleForm.files = res.data[0]
    },
    removeImg (obj) {
      obj.forEach(v => {
        this.ruleForm.files.push(v.response.data[0])
      })
    },
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      // console.log(res, file)
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
      this.$router.push({
        path: '/admin/newcms/content/index'
      })
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
      console.log(this.formData, this.ruleForm)
    },
    getSource (data = {}) {
      api.GET(config.showWordSourceListAPI, data)
      .then(response => {
        this.option = response.data.data
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
    }
  },
  mounted () {
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