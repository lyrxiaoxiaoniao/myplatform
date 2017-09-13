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
                        <el-form ref="form" :model="form" label-width="80px" class="ca-form">
                            <el-form-item label="商户名称">
                                <el-input v-model="form.name" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="商户分类">
                                <el-input v-model="form.level" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <el-input v-model="form.created_at" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="商户说明">
                                <el-input type="textarea" v-model="form.brief" disabled></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="ca-content-right">
                      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
                        <el-tab-pane label="站点基础配置" name="first">
                          <manage-config :manageData="manageConfigData" :manageArr="manageConfigArr"></manage-config>
                          <mobile-config :mobileData="mobileConfigData"></mobile-config>
                          <short-massage :shortMsgData="shortMessageData"></short-massage>
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
import api from 'src/api'
import config from 'src/config'
export default {
  data () {
    return {
      id: this.$route.query.id,
      activeName: 'first',
      response: null,
      form: {
        name: null,
        brief: null,
        created_at: null,
        level: null
      },
      manageConfigData: {
        mng_config_name: null,
        mng_config_keyword: null,
        mng_config_alias: null,
        mng_config_desc: null,
        mng_config_info: null,
        mng_config_copyright: null,
        mng_config_icon: null,
        mng_config_background: null
      },
      manageConfigArr: [],
      mobileConfigData: {
        mobile_config_name: null,
        mobile_config_keyword: null,
        mobile_config_alias: null,
        mobile_config_desc: null,
        mobile_config_info: null,
        mobile_config_copyright: null,
        mobile_config_icon: null,
        mobile_config_background: null
      },
      shortMessageData: {
        mng_config_name: null,
        mng_config_keyword: null,
        mng_config_alias: null
      }
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
    },
    getForm (res) {
      Object.keys(this.form).forEach(k => {
        this.form[k] = res[k]
      })
    },
    getManageConfig (res) {
      Object.keys(this.manageConfigData).forEach(k => {
        res.exts.forEach(v => {
          if (v.key.label === k) {
            this.manageConfigData[k] = {id: v.id, value: v.value}
            this.manageConfigArr.push({id: v.id, value: v.value, key: v.key.label})
          }
        })
      })
    },
    getMobileConfig () {
      console.log(1)
    },
    getShortMessage () {
      console.log(1)
    },
    getList() {
      api.GET(config.merchant.show, {id: this.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          this.getForm(response.data.data)
          this.getManageConfig(response.data.data)
        }
      })
    }
  },
  mounted () {
    this.getList()
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
            .ca-form {
                padding: 1rem 2rem 1rem 1rem;
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