<template>
    <div class="ca-container">
        <div>
            <el-button @click="goBack" type="primary">返回列表</el-button>
            <el-button type="primary">刷新</el-button> 
        </div>
        <div class="ca-cpntent">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="ca-content-left">
                        <h4>商户属性</h4>
                        <div class="left-img">
                           <img src="123123123123">
                            <!-- <el-upload
                                class="avatar-uploader"
                                :action="uploadURL"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="ruleForm.picture" :src="ruleForm.picture" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload> -->
                        </div>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="ca-content-right">
                      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                        <el-tab-pane label="站点基础配置" name="first">
                          <manage-config></manage-config>
                          <mobile-config></mobile-config>
                          <short-massage></short-massage>
                        </el-tab-pane>
                        <el-tab-pane label="微信配置" name="second">
                          <wechat-config></wechat-config>
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import manageConfig from './baseConfig/manageConfig'
import mobileConfig from './baseConfig/mobileConfig'
import shortMassage from './baseConfig/shortMassage'
import wechatConfig from './baseConfig/wechatConfig'
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
    manageConfig,
    mobileConfig,
    shortMassage,
    wechatConfig
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    }
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
            // border: 1px solid lightgray;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
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
            // border: 1px solid lightgray;
            // padding: 10px 20px 0 0;
            background-color: #fff;
        }
    }
}    
</style>