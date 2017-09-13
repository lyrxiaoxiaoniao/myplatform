<template>
    <div class="lh-container">
		<div class="lh-top">
            <div class="lh-header">
                <div>微信授权配置</div>
                <div>
                    <el-button type="primary">保存</el-button>
                    <el-button type="danger">清空</el-button>
                </div>
            </div>
            <div class="lh-form">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="通用配置" name="first">
                        <el-form :model="selected" label-width="85px">
                            <el-row>
                                <el-col :span="12">
                                <el-form-item label="公众号名称">
                                    <el-input placeholder="请输入公众号名称"></el-input>
                                </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                <el-form-item label="原始ID">
                                    <el-input placeholder="请输入站点别名"></el-input>
                                </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                <el-form-item label="微信号">
                                    <el-input placeholder="请输入"></el-input>
                                </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                <el-form-item label="微信号类型">
                                    <el-input type="textarea" placeholder="请输入"></el-input>
                                </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                <el-form-item label="APPID">
                                    <el-input placeholder="请输入"></el-input>
                                </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                <el-form-item label="APPSecret">
                                    <el-input placeholder="请输入"></el-input>
                                </el-form-item>
                                </el-col><el-col :span="24">
                                <el-form-item label="Encoding AESKey">
                                    <el-input placeholder="请输入"></el-input>
                                </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                <el-form-item label="关注二维码">
                                    <el-upload
                                        class="avatar-uploader"
                                        :action="uploadURL"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUploadIcon">
                                        <img v-if="selected.icon" :src="selected.icon" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                                </el-col>
                            </el-row>  
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="扫码配置" name="second">
                        <el-row type="flex" justify="space-around">
                            <el-col :span="6" style="text-align:center;">
                                <img src="qweqweqe">
                            </el-col>
                            <el-col :span="18">
                                <el-form :model="selected1" label-width="100px">
                                    <el-form-item label="已绑定公众号">
                                        <el-input placeholder="请输入"></el-input>
                                    </el-form-item>
                                    <el-form-item label="原始ID">
                                        <el-input placeholder="请输入"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>    
</template>
<script>
import config from 'src/config'
// import api from 'src/api'
export default {
  data () {
    return {
      activeName: 'first',
      uploadURL: config.serverURI + config.uploadFilesAPI,
      selected: {
        icon: null
      },
      selected1: {}
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    /* 上传图片函数 */
    handleAvatarSuccessIcon (res, file) {
      this.selected.icon = res.data[0]
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
    }
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