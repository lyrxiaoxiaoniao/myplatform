<template>
    <div class="lh-container">
		<div class="lh-top">
            <div class="lh-header">
                <div>管理端站点配置</div>
                <div>
                    <el-button @click="saveConfig" type="primary">保存</el-button>
                </div>
            </div>
            <div class="lh-form">
              <el-form :model="selected" label-width="85px">
                <el-row>
                    <el-col :span="12">
                    <el-form-item label="站点名称">
                        <el-input v-model="selected.mng_config_name.value" placeholder="请输入站点名称"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item label="站点别名">
                        <el-input v-model="selected.mng_config_alias.value" placeholder="请输入站点别名"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="关键字">
                        <el-input v-model="selected.mng_config_keyword.value" placeholder="请输入"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="描述">
                        <el-input v-model="selected.mng_config_desc.value" type="textarea" placeholder="请输入"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="域名信息">
                        <el-input v-model="selected.mng_config_info.value" placeholder="请输入"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="版权信息">
                        <el-input v-model="selected.mng_config_copyright.value" placeholder="请输入"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item label="网站图标">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadURL"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessIcon"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="selected.mng_config_icon.value" :src="selected.mng_config_icon.value" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item label="网站背景图">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadURL"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUploadLogo">
                            <img v-if="selected.mng_config_background.value" :src="selected.mng_config_background.value" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    </el-col>
                </el-row>
              </el-form>
            </div>
        </div>
    </div>    
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: {
    manageData: {
      type: Object
    }
  },
  data () {
    return {
      uploadURL: config.serverURI + config.uploadFilesAPI,
      selectedObj: {
        mng_config_name: {value: null},
        mng_config_keyword: {value: null},
        mng_config_alias: {value: null},
        mng_config_desc: {value: null},
        mng_config_info: {value: null},
        mng_config_copyright: {value: null},
        mng_config_icon: {value: null},
        mng_config_background: {value: null}
      },
      sendData: []
    }
  },
  computed: {
    selected () {
      var obj = {}
      Object.keys(this.manageData).forEach(k => {
        obj[k] = this.manageData[k]
      })
      return obj
    }
  },
  methods: {
    /* 上传图片函数 */
    handleAvatarSuccessIcon (res, file) {
      this.selected.mng_config_icon.value = res.data[0]
    },
    /* 上传图片函数 */
    handleAvatarSuccessLogo (res, file) {
      this.selected.mng_config_background.value = res.data[0]
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    getSendData () {
      this.sendData = []
      Object.keys(this.selectedObj).forEach(v => {
        this.sendData.push(this.selectedObj[v])
      })
    },
    saveConfig () {
      this.getSendData()
      console.log(this.selected, 22222)
      api.POST(config.merchant.alter, {exts: this.sendData})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('保存管理端站点配置成功')
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    // padding: 1rem 2rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        padding-bottom: 1rem;
        .lh-form {
            padding: 1rem 1rem 0;
        }
        .lh-header {
            padding: 0 2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            border-bottom: 1px solid lightgray;
            div:nth-of-type(1){
                font-size: 16px;
            }
        }
    }
}
</style>