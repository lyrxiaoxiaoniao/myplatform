<template>
    <div class="ca-container">
        <div>
            <!-- <el-button @click="goBack" type="primary">返回列表</el-button> -->
            <el-button @click="onFresh" type="primary">刷新</el-button> 
        </div>
        <div class="ca-cpntent">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="ca-content-left">
                        <h4>商户属性</h4>
                        <div class="left-img">
                           <img @click="bigImg(form.license)" :src="form.license">
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
                        <el-tab-pane label="商户基础信息" name="first">
                            <div class="lh-top" style="margin-bottom: 1rem;">
                                <div class="lh-header">
                                    <div>商户信息</div>
                                    <div>
                                        <el-button @click="saveMerchant" type="primary">保存</el-button>
                                    </div>
                                </div>
                                <div class="lh-form">
                                <el-form :model="merchantData" label-width="85px">
                                    <el-row>
                                        <el-col :span="12">
                                        <el-form-item label="负责人">
                                            <el-input v-model="merchantData.principal" placeholder="请输入负责人"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                        <el-form-item label="联系电话">
                                            <el-input v-model="merchantData.mobile" placeholder="请输入联系电话"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="商户地址">
                                            <el-input v-model="merchantData.address" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="商户简介">
                                            <el-input v-model="merchantData.brief" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="商户证件照">
                                            <img @click="bigImg(merchantData.license)" :src="merchantData.license" title="证件照" style="width:150px;height:150px;">
                                            <p>商户的证照信息不能修改，只能通过平台服务商进行修改；请联系客户经理。</p>
                                        </el-form-item>
                                        </el-col>
                                    </el-row>  
                                </el-form>
                                </div>
                            </div>
                            <div class="lh-top">
                                <div class="lh-header">
                                    <div>服务信息</div>
                                    <div>
                                        <el-button @click="saveService" type="primary">保存</el-button>
                                    </div>
                                </div>
                                <div class="lh-form">
                                <el-form :model="serviceData" label-width="85px">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item label="服务有效期">
                                                <el-col :span="11">
                                                <el-date-picker v-model="serviceData.started_at" type="datetime" placeholder="选择开始时间" style="width: 100%;"></el-date-picker>
                                                </el-col>
                                                <el-col class="line" style="text-align: center;" :span="2">---</el-col>
                                                <el-col :span="11">
                                                <el-date-picker v-model="serviceData.ended_at" type="datetime" placeholder="选择结束时间" style="width: 100%;"></el-date-picker>
                                                </el-col>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="客户经理">
                                            <el-input v-model="serviceData.mgr_name" placeholder="请输入客户经理"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="经理电话">
                                            <el-input v-model="serviceData.mgr_mobile" placeholder="请输入经理电话"></el-input>
                                        </el-form-item>
                                        </el-col>
                                    </el-row>  
                                </el-form>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="站点基础配置" name="second">
                            <!-- 管理端站点配置 -->
                            <div class="lh-top" style="margin-bottom: 1rem;">
                                <div class="lh-header">
                                    <div>管理端站点配置</div>
                                    <div>
                                        <el-button @click="saveManageConfig" type="primary">保存</el-button>
                                    </div>
                                </div>
                                <div class="lh-form">
                                    <el-form :model="manageConfigData" label-width="85px">
                                    <el-row>
                                        <el-col :span="12">
                                        <el-form-item label="站点名称">
                                            <el-input v-model="manageConfigData.mng_config_name.value" placeholder="请输入站点名称"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                        <el-form-item label="站点别名">
                                            <el-input v-model="manageConfigData.mng_config_alias.value" placeholder="请输入站点别名"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="关键字">
                                            <el-input v-model="manageConfigData.mng_config_keyword.value" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="描述">
                                            <el-input v-model="manageConfigData.mng_config_desc.value" type="textarea" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="域名信息">
                                            <el-input v-model="manageConfigData.mng_config_info.value" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="版权信息">
                                            <el-input v-model="manageConfigData.mng_config_copyright.value" placeholder="请输入"></el-input>
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
                                                <img v-if="manageConfigData.mng_config_icon.value" :src="manageConfigData.mng_config_icon.value" class="avatar">
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
                                                :on-success="handleAvatarSuccessLogo"
                                                :before-upload="beforeAvatarUpload">
                                                <img v-if="manageConfigData.mng_config_background.value" :src="manageConfigData.mng_config_background.value" class="avatar">
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                                        </el-form-item>
                                        </el-col>
                                    </el-row>
                                    </el-form>
                                </div>
                            </div>
                            <!-- 移动端站点配置 -->
                            <div class="lh-top" style="margin-bottom: 1rem;">
                                <div class="lh-header">
                                    <div>移动端站点配置</div>
                                    <div>
                                        <el-button @click="saveMobileConfig" type="primary">保存</el-button>
                                    </div>
                                </div>
                                <div class="lh-form">
                                    <el-form :model="mobileConfigData" label-width="80px">
                                    <el-row>
                                        <el-col :span="12">
                                        <el-form-item label="站点名称">
                                            <el-input v-model="mobileConfigData.mobile_config_name.value" placeholder="请输入站点名称"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                        <el-form-item label="站点别名">
                                            <el-input v-model="mobileConfigData.mobile_config_alias.value" placeholder="请输入站点别名"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="关键字">
                                            <el-input v-model="mobileConfigData.mobile_config_keyword.value" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="描述">
                                            <el-input v-model="mobileConfigData.mobile_config_desc.value" type="textarea" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="域名信息">
                                            <el-input v-model="mobileConfigData.mobile_config_info.value" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="版权信息">
                                            <el-input v-model="mobileConfigData.mobile_config_copyright.value" placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="网站图标">
                                            <el-upload
                                                class="avatar-uploader"
                                                :action="uploadURL"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccessMobileIcon"
                                                :before-upload="beforeAvatarUpload">
                                                <img v-if="mobileConfigData.mobile_config_icon.value" :src="mobileConfigData.mobile_config_icon.value" class="avatar">
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                            </el-upload>
                                        </el-form-item>
                                        </el-col>
                                    </el-row>  
                                </el-form>
                                </div>
                            </div>
                            <!-- 短信服配置 -->
                            <!-- <div class="lh-top">
                                <div class="lh-header">
                                    <div>短信发送配置</div>
                                    <div>
                                        <el-button type="primary">保存</el-button>
                                    </div>
                                </div>
                                <div class="lh-form">
                                <el-form :model="shortMessageData" label-width="85px">
                                    <el-row>
                                        <el-col :span="24">
                                        <el-form-item label="短信服务商">
                                            <el-input placeholder="请输入站点名称"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="每月限量">
                                            <el-input placeholder="请输入站点别名"></el-input>
                                        </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="短信后缀">
                                            <el-input placeholder="请输入"></el-input>
                                        </el-form-item>
                                        </el-col>
                                    </el-row>  
                                </el-form>
                                </div>
                            </div> -->
                        </el-tab-pane>
                        <el-tab-pane label="微信配置" name="third">
                            <div class="lh-top">
                                <div class="lh-header">
                                    <div>微信授权配置</div>
                                    <div>
                                        <el-button @click="saveWechatConfig" type="primary">保存</el-button>
                                        <!-- <el-button type="danger">清空</el-button> -->
                                    </div>
                                </div>
                                <div class="lh-form">
                                    <el-tabs>
                                        <el-tab-pane label="通用配置">
                                            <el-form :model="weChatData" label-width="85px">
                                                <el-row>
                                                    <el-col :span="12">
                                                    <el-form-item label="公众号名称">
                                                        <el-input v-model="weChatData.acct_name" placeholder="请输入公众号名称"></el-input>
                                                    </el-form-item>
                                                    </el-col>
                                                    <el-col :span="12">
                                                    <el-form-item label="原始ID">
                                                        <el-input v-model="weChatData.original" placeholder="请输入站点别名"></el-input>
                                                    </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                    <el-form-item label="微信号">
                                                        <el-input v-model="weChatData.wechat" placeholder="请输入"></el-input>
                                                    </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                    <el-form-item label="微信号类型">
                                                        <el-radio-group v-model="weChatData.pubtype">
                                                            <el-radio :label="1">普通订阅号</el-radio>
                                                            <el-radio :label="2">认证订阅号/普通服务号</el-radio>
                                                            <el-radio :label="3">认证服务号</el-radio>
                                                        </el-radio-group>
                                                    </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                    <el-form-item label="APPID">
                                                        <el-input v-model="weChatData.appid" placeholder="请输入"></el-input>
                                                    </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                    <el-form-item label="APPSecret">
                                                        <el-input v-model="weChatData.secret" placeholder="请输入"></el-input>
                                                    </el-form-item>
                                                    </el-col><el-col :span="24">
                                                    <el-form-item label="Encoding AESKey">
                                                        <el-input v-model="weChatData.encodingaeskey" placeholder="请输入"></el-input>
                                                    </el-form-item>
                                                    </el-col>
                                                    <el-col :span="24">
                                                    <el-form-item label="关注二维码">
                                                        <el-upload
                                                            class="avatar-uploader"
                                                            :action="uploadURL"
                                                            :show-file-list="false"
                                                            :on-success="handleAvatarSuccessWechat"
                                                            :before-upload="beforeAvatarUpload">
                                                            <img v-if="weChatData.attend_code" :src="weChatData.attend_code" class="avatar">
                                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                        </el-upload>
                                                    </el-form-item>
                                                    </el-col>
                                                </el-row>  
                                            </el-form>
                                        </el-tab-pane>
                                        <!-- <el-tab-pane label="扫码配置"> -->
                                            <!-- <el-row type="flex" justify="space-around">
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
                                            </el-row> -->
                                        <!-- </el-tab-pane> -->
                                    </el-tabs>
                                </div>
                            </div>
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog v-model="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  data () {
    return {
      id: null,
      uploadURL: config.serverURI + config.uploadFilesAPI,
      activeName: 'first',
      response: null,
      form: {
        name: null,
        brief: null,
        created_at: null,
        level: null,
        license: null
      },
      manageConfigData: {
        mng_config_name: {id: null, value: null},
        mng_config_keyword: {id: null, value: null},
        mng_config_alias: {id: null, value: null},
        mng_config_desc: {id: null, value: null},
        mng_config_info: {id: null, value: null},
        mng_config_copyright: {id: null, value: null},
        mng_config_icon: {id: null, value: null},
        mng_config_background: {id: null, value: null}
      },
      sendManageData: [],
      mobileConfigData: {
        mobile_config_name: {id: null, value: null},
        mobile_config_keyword: {id: null, value: null},
        mobile_config_alias: {id: null, value: null},
        mobile_config_desc: {id: null, value: null},
        mobile_config_info: {id: null, value: null},
        mobile_config_copyright: {id: null, value: null},
        mobile_config_icon: {id: null, value: null}
      },
      sendMobileData: [],
      shortMessageData: {
        msg_servicer: {id: null, value: null},
        msg_month_limit: {id: null, value: null},
        msg_suffix: {id: null, value: null}
      },
      sendMessageData: [],
      weChatData: {
        acct_name: null,
        original: null,
        pubtype: null,
        wechat: null,
        appid: null,
        secret: null,
        encodingaeskey: null,
        attend_code: null
      },
      serviceData: {
        license: null,
        active: null,
        principal: null,
        mobile: null,
        address: null,
        brief: null,
        level: null,
        started_at: null,
        ended_at: null,
        mgr_mobile: null,
        mgr_name: null,
        id: null,
        name: null
      },
      merchantData: {
        started_at: null,
        active: null,
        ended_at: null,
        mgr_mobile: null,
        mgr_name: null,
        license: null,
        principal: null,
        mobile: null,
        address: null,
        brief: null,
        level: null,
        id: null,
        name: null
      },
      dialogImageUrl: null,
      dialogVisible: false,
      isUpdate: false,
      extidData: null
    }
  },
  methods: {
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    /* 上传图片函数 */
    handleAvatarSuccessIcon (res, file) {
      this.manageConfigData.mng_config_icon.value = res.data[0]
    },
    /* 上传图片函数 */
    handleAvatarSuccessLogo (res, file) {
      this.manageConfigData.mng_config_background.value = res.data[0]
    },
    /* 上传图片函数 */
    handleAvatarSuccessWechat (res, file) {
      this.weChatData.attend_code = res.data[0]
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
    getSendManageData () {
      this.sendManageData = []
      Object.keys(this.manageConfigData).forEach(v => {
        this.sendManageData.push(this.manageConfigData[v])
      })
    },
    saveManageConfig () {
      this.getSendManageData()
      api.POST(config.merchant.alter, {exts: this.sendManageData})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('保存管理端站点配置成功')
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    /* 上传图片函数 */
    handleAvatarSuccessMobileIcon (res, file) {
      this.mobileConfigData.mobile_config_icon.value = res.data[0]
    },
    getSendMobileData () {
      this.sendMobileData = []
      Object.keys(this.mobileConfigData).forEach(v => {
        this.sendMobileData.push(this.mobileConfigData[v])
      })
    },
    saveMobileConfig () {
      this.getSendMobileData()
    //   console.log(this.sendMobileData, 111112222)
      api.POST(config.merchant.alter, {exts: this.sendMobileData})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('保存移动端站点配置成功')
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    saveWechatConfig () {
      let sendURL
      if (this.isUpdate) {
        sendURL = config.merchant.wxupdate
      } else {
        sendURL = config.merchant.wxadd
      }
      api.POST(sendURL, {account_id: Number(this.id), ...this.weChatData})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('保存微信配置成功')
          this.isUpdate = !this.isUpdate
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    saveService () {
      if (this.serviceData.started_at) {
        this.serviceData.started_at = new Date(this.serviceData.started_at).getTime()
      }
      if (this.serviceData.ended_at) {
        this.serviceData.ended_at = new Date(this.serviceData.ended_at).getTime()
      }
      api.POST(config.merchant.edit, this.serviceData)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('保存商户信息成功')
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    saveMerchant () {
      api.POST(config.merchant.edit, this.merchantData)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('保存商户信息成功')
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
    },
    goBack () {
      this.$router.go(-1)
    },
    handleClick (tab, event) {
    //   console.log(tab, event)
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
    getForm (res) {
      Object.keys(this.form).forEach(k => {
        this.form[k] = res[k]
      })
      this.form.created_at = this.formatDate(this.form.created_at)
      if (this.form.level === 1) {
        this.form.level = '普通用户'
      } else if (this.form.level === 2) {
        this.form.level = '高级用户'
      } else if (this.form.level === 3) {
        this.form.level = 'VIP用户'
      }
    },
    /* 获取站点配置的value以及id */
    getConfig (res, data) {
      Object.keys(data).forEach(k => {
        res.exts.forEach(v => {
          if (v.key.label === k) {
            data[k] = {id: v.id, value: v.value}
          }
        })
      })
    },
    /* 获取商户基础信息 */
    getBaseData (res, data) {
      Object.keys(data).forEach(k => {
        data[k] = res[k]
      })
    },
    /* 获取微信配置信息 */
    getWechatData (res) {
      if (res.wx_cfg) {
        this.weChatData = {
          ...this.weChatData,
          ...res.wx_cfg
        }
        this.isUpdate = true
      } else {
        this.isUpdate = false
      }
    },
    getList() {
      api.GET(config.merchant.current)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          this.id = response.data.data.id
          this.getForm(response.data.data)
          this.getConfig(response.data.data, this.manageConfigData)
          this.getConfig(response.data.data, this.mobileConfigData)
          this.getConfig(response.data.data, this.shortMessageData)
          this.getBaseData(response.data.data, this.serviceData)
          this.getBaseData(response.data.data, this.merchantData)
          this.getWechatData(response.data.data)
        //   this.getExtid()
        }
      })
    },
    /* 获取站点配置的id */
    // getID (res, data) {
    //   Object.keys(data).forEach(k => {
    //     res.forEach(v => {
    //       if (v.label === k) {
    //         data[k].id = v.id
    //       }
    //     })
    //   })
    // },
    // getExtid() {
    //   api.GET(config.merchant.extid)
    //   .then(response => {
    //     if (response.data.errcode === '0000') {
    //       this.extidData = response.data.data
    //       this.getID(response.data.data, this.manageConfigData)
    //       this.getID(response.data.data, this.mobileConfigData)
    //       this.getID(response.data.data, this.shortMessageData)
    //     }
    //   })
    // },
    onFresh () {
      this.getList()
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
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .ca-form {
                padding: 1rem 2rem 1rem 1rem;
            }
        }
        .ca-content-right {
            // border: 1px solid lightgray;
            // padding: 10px 20px 0 0;
            background-color: #fff;
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
    }
}    
</style>