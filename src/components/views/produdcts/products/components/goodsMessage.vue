<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分类">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="计量单位">
            <el-input v-model="form.num"></el-input>
        </el-form-item>
        <el-form-item label="链接">
            <el-input v-model="form.web"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tagList">
            <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
                type="primary"
                style="margin:0 5px">
            {{tag}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
        </el-form-item>
        <el-form-item label="图片" prop="poster" class="gm-line">
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
                <div slot="tip" class="el-upload__tip">建议尺寸：800*800PX，单张大小不超过2M，最多可上传10张</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="支付方式">
             <el-radio-group v-model="form.resource" style="display:block;padding:8px 0;font-size: 14px;"> 
                <el-row style="margin-bottom:20px;">
                    <el-col :span="5">
                        <el-radio label="使用现金支付"></el-radio>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <label style="width:70px;text-align:right;padding-right:20px;">价格</label>
                        <el-input placeholder="请输入" v-model="form.input3" style="width:150px;">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <label style="width:70px;text-align:right;padding-right:20px;">原价</label>
                        <el-input placeholder="请输入" v-model="form.input3" style="width:150px;">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-radio label="使用积分支付"></el-radio>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <label style="width:70px;text-align:right;padding-right:20px;">积分</label>
                        <el-input placeholder="请输入" v-model="form.input3" style="width:150px;">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <label style="width:70px;text-align:right;padding-right:20px;">原积分</label>
                        <el-input placeholder="请输入" v-model="form.input3" style="width:150px;">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </el-col>
                </el-row>
             </el-radio-group> 
        </el-form-item>
        <el-form-item label="运费设置">
             <el-radio-group v-model="form.resource1" style="display:block;padding:8px 0;font-size: 14px;"> 
                <el-row style="margin-bottom:20px;">
                    <el-col :span="5">
                        <el-radio label="统一运费"></el-radio>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <label style="width:70px;text-align:right;padding-right:20px;">价格</label>
                        <el-input placeholder="请输入" v-model="form.input3" style="width:150px;">
                            <template slot="prepend">￥</template>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-radio label="运费模板"></el-radio>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <el-input placeholder="请选择运费模板" v-model="form.input3" style="width:224px;"></el-input>
                    </el-col>
                </el-row>
             </el-radio-group> 
        </el-form-item>
        <el-form-item label="每人限购">
            <template>
                <el-input-number v-model="form.num1" :min="1"></el-input-number>
            </template>
        </el-form-item>
        <el-form-item label="开售时间">
             <el-radio-group v-model="form.resource2" style="display:block;padding:8px 0;font-size: 14px;"> 
                <el-row style="margin-bottom:20px;">
                    <el-col :span="5">
                        <el-radio label="立即开售"></el-radio>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-radio label="指定时间"></el-radio>
                    </el-col>
                    <el-col :span="8" style="margin-top:-9px;">
                        <el-date-picker
                            style="width:224px;"
                            v-model="form.value1"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                </el-row>
             </el-radio-group> 
        </el-form-item>
    </el-form>
</template>
<script>
import config from 'src/config'
// import api from 'src/api'
export default {
  data () {
    return {
      form: {
        resource: '',
        resource1: '',
        resource2: '',
        num1: '',
        input3: '',
        value1: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      imageList: [],
      imageURL: '',
      uploadUrl: config.serverURI + config.uploadImgAPI
    }
  },
  props: ['getInfo'],
  watch: {
    getInfo: function () {
      this.$emit('getComponentForm', {formName: 'goodsMessageForm', value: 5})
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
      this.inputVisible = false
      this.inputValue = ''
    },
    // 上传
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    onUploadSuccess (response, file, fileList) {
      if (response.errcode === '0000') {
        this.imageURL = file.url
        this.form.poster = response.data[0]
      }
    },
    onUploadError (error, file) {
      this.$message.error(error)
    },
    onRemovePic (file, fileList) {
      this.form.poster = ''
    }
  }
}
</script>
<style scoped>
.gm-line {
    margin-bottom: 35px;
    border-bottom: 1px solid lightgray;
}
</style>

