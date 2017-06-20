<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
    <el-form-item label="广告标题" prop="title">
      <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="点位分类" prop="typeId" required>
      <template>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :label="item.type"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
    <el-form-item label="广告内容" prop="poster" required>
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :file-list="imageList"
        :on-success="onUploadSuccess"
        :on-remove="onRemovePic"
        :on-error="onUploadError"
        :before-upload="beforeAvatarUpload"
        list-type="picture">
        <img v-if="imageURL !== ''" :src="imageURL" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip">只能上传jpg图片文件，且不超过2M</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="点位类型" prop="linkType" required>
      <el-radio-group v-model="ruleForm.linkType">
        <el-radio label="1">不跳转链接</el-radio>
        <el-radio label="2">完整地址链接</el-radio>
        <el-radio label="3">系统内部链接</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="链接地址" prop="link">
      <el-input v-model="ruleForm.link" placeholder="链接地址，外链请使用完整http://或者https://开始"></el-input>
    </el-form-item>
     <el-form-item label="文字链接" prop="content">
      <el-input v-model="ruleForm.content" placeholder="文字链内容，替换alt"></el-input>
    </el-form-item>
     <el-form-item label="内容备注" prop="memo">
      <el-input v-model="ruleForm.memo" placeholder="内容备注"></el-input>
    </el-form-item>
    <el-form-item label="内容标签" prop="tagList">
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        :closable="true"
        :close-transition="false"
        @close="handleClose(tag)"
        type="danger"
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
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
      <el-button type="primary" @click="resetForm()">返回管理首页</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        id: this.$route.query.id,
        options: [],
        value: '',
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        imageList: [],
        imageURL: '',
        uploadUrl: config.serverURI + config.uploadImgAPI,
        dialogVisible: false,
        ruleForm: {
          title: '',
          poster: '',
          link: '',
          linkType: '',
          memo: '',
          content: '',
          typeId: '',
          tagList: ''
        },
        inpValue: [],
        responseData: null,
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入广告内容', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
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
        // console.log(this.dynamicTags)
        this.inputVisible = false
        this.inputValue = ''
      },
       // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
      transformDate (res) {
        res.forEach(v => {
          if (v.createdAt) {
            v.createdAt = this.formatDate(v.createdAt)
          }
          if (v.beginTime) {
            v.beginTime = this.formatDate(v.beginTime)
          }
          if (v.endTime) {
            v.endTime = this.formatDate(v.endTime)
          }
        })
        return res
      },
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      },
      // 上传
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      onUploadSuccess (response, file, fileList) {
        if (response.errcode === '0000') {
          console.log(response)
          this.imageURL = file.url
          this.ruleForm.poster = response.data[0]
        }
      },
      onUploadError (error, file) {
        this.$message.error(error)
      },
      onRemovePic (file, fileList) {
        this.ruleForm.poster = ''
      },
      getData () {
        const id = this.$route.query.id
        if (this.options) {
          api.GET(config.showAdvertisementAPI, {id: id})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000' && response.data.data) {
              const res = response.data.data
              this.responseData = res
              this.ruleForm = res
              this.ruleForm.linkType = String(res.linkType)
              this.value = String(res.typeId)
              this.imageURL = res.poster
              this.dynamicTags = res.tagList.split(',')
              console.log(this.ruleForm)
            }
          })
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            obj.typeId = Number(this.value)
            obj.link = this.ruleForm.link
            obj.linkType = Number(this.ruleForm.linkType)
            obj.content = this.ruleForm.content
            obj.title = this.ruleForm.title
            obj.poster = this.ruleForm.poster
            obj.memo = this.ruleForm.memo
            obj.tagList = this.dynamicTags.join(',')
            obj.id = this.id
            console.log(obj)
            api.POST(config.editAdvertisementAPI, obj)
              .then(response => {
                if (response.status !== 200) {
                  this.error = response.statusText
                  return
                }
                if (response.data.errcode === '0000') {
                  this.$message('修改内容保存成功！！！')
                }
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm () {
        this.$router.push({
          path: 'advcontent'
        })
      },
      getTypeId () {
        api.GET(config.getTypeAdvPointAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            console.log(response.data.data)
            this.options = this.transformNumber(response.data.data)
          }
        })
      },
      transformNumber (res) {
        res.forEach(v => {
          v.id = String(v.id)
        })
        return res
      }
    },
    mounted () {
      this.getData()
      this.getTypeId()
    }
  }
</script>
<style scoped>
 .sc-main-content {
	  border-top: 1px solid lightgray;
    padding: 1rem 1rem 2rem;
  }
  .sc-top-header {
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
</style>