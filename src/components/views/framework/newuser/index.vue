<template>
  <div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button @click="addBaseinfo" type="primary">新增</el-button>
                <el-button @click="handleCommand" type="primary">批量删除</el-button>
                <el-button @click="onFresh" type="primary">刷新</el-button>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                    <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button @click="openDialog" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
            <el-button icon="upload2" type="primary"></el-button>
            <el-button icon="setting" type="primary"></el-button>
          </el-row>
          <el-dialog title="高级搜索" v-model="showDialog" size="tiny">
            <el-form :model="selected" label-width="85px">
                <el-form-item label="关键字">
                    <el-input v-model="selected.keyword" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="selected.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="selected.realname" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="用户归属">
                    <el-input v-model="selected.keyword" placeholder="请输入用户归属"></el-input>
                </el-form-item> -->
                <el-col :span="12">
                  <el-form-item label="是否有效">
                      <el-switch on-text="开" off-text="关" v-model="selected.is_lock"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="创建时间">
                  <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择开始时间" v-model="selected.start_time" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择结束时间" v-model="selected.end_time" style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button @click="advancedSearch" type="primary">搜索</el-button>
            </div>
          </el-dialog>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
                ref="multipleTable"
                border
                stripe
                :data="response.data"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="account.name" label="用户归属"></el-table-column>
                <el-table-column label="头像" width="100">
                  <template scope="scope">
                    <img class="table-img" :src="scope.row.avatar" @click="bigImg(scope.row.avatar)" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="nickname" label="用户名" width="120"></el-table-column>
                <el-table-column prop="realname" label="真实姓名"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column label="创建时间">
                  <template scope="scope">{{scope.row.created_at | toDateTime}}</template>
                </el-table-column>
                <el-table-column label="有效状态" width="100px">
                  <template scope="scope">
                    <el-switch
                      v-model="scope.row.is_lock"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.is_lock,scope.row.id)">
                    </el-switch>
                  </template> 
                </el-table-column>
                <el-table-column prop="status" label="操作" width="160">
                  <template scope="scope"> 
                      <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                      <el-button @click="goAwardsDetail(scope.row.id)" size="small" icon="edit"></el-button>
                      <el-button @click="relaType(scope.row)" size="small" class="fa fa-th-large"></el-button>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex" justify="center">
                <el-col :span="8">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="response.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="response.pageSize"
                    :total="response.count"
                    layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </kobe-table>
    <el-dialog v-model="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 添加弹窗start -->
    <el-dialog title="新增用户" v-model="addShowDialog" top="5%">
      <el-form :model="addMerchant" :rules="rules" label-width="80px" ref="addMerchant">
        <el-row style="border-bottom: 1px solid lightgray;margin-bottom: 30px;">
        <el-col :span="24">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addMerchant.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码" prop="password">
              <el-input type="password" v-model="addMerchant.password" placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="checkPassword">
              <el-input type="password" v-model="addMerchant.checkPassword" placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全手机" prop="phone">
              <el-input v-model="addMerchant.phone" placeholder="安全手机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全邮箱" prop="email">
              <el-input v-model="addMerchant.email" placeholder="安全邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
              <el-switch on-text="开" off-text="关" v-model="addMerchant.is_lock"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户归属">
              <el-select v-model="addMerchant.account_id" filterable placeholder="请选择" class="fullwidth">
                  <el-option
                  v-for="item in optionAccount"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="真实姓名">
              <el-input v-model="addMerchant.realname" placeholder="真实姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称">
              <el-input v-model="addMerchant.nickname" placeholder="昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓别">
              <el-select v-model="addMerchant.sex" placeholder="请选择" class="fullwidth">
                  <el-option
                  v-for="item in optionGrade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="pid">
              <el-input v-model="addMerchant.pid" placeholder="证件号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系地址">
              <el-input v-model="addMerchant.address" placeholder="商户地址，128字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息">
              <el-input v-model="addMerchant.info" type="textarea" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户头像">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessIcon"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="addMerchant.avatar" :src="addMerchant.avatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
        </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px;">
          <el-button @click="addCloseDialog">取消</el-button>
          <el-button type="primary" @click="saveAdd('addMerchant')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹窗end -->
    <!-- 修改弹窗start -->
    <el-dialog title="修改用户" v-model="editShowDialog" top="5%">
       <el-form :model="editMerchant" label-width="80px">
        <el-row style="border-bottom: 1px solid lightgray;margin-bottom: 30px;">
        <el-col :span="24">
          <el-form-item label="用户名">
            <el-input v-model="editMerchant.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全手机">
              <el-input v-model="editMerchant.phone" placeholder="安全手机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全邮箱">
              <el-input v-model="editMerchant.email" placeholder="安全邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
              <el-switch on-text="开" off-text="关" v-model="editMerchant.is_lock"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户归属">
              <el-select v-model="editMerchant.account_id" filterable placeholder="请选择" class="fullwidth">
                  <el-option
                  v-for="item in optionAccount"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="真实姓名">
              <el-input v-model="editMerchant.realname" placeholder="真实姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称">
              <el-input v-model="editMerchant.nickname" placeholder="昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓别">
              <el-select v-model="editMerchant.sex" placeholder="请选择" class="fullwidth">
                  <el-option
                  v-for="item in optionGrade"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码">
              <el-input v-model="editMerchant.pid" placeholder="证件号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系地址">
              <el-input v-model="editMerchant.address" placeholder="商户地址，128字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息">
              <el-input v-model="editMerchant.info" type="textarea" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户头像">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessIconEdit"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="editMerchant.avatar" :src="editMerchant.avatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
        </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px;">
          <el-button @click="editCloseDialog" >取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹窗end -->
    <!-- 删除弹框 -->
    <el-dialog title="删除用户" v-model="deleteShowDialog" top="35%" size="tiny">
      <div style="padding-left: 50px;position: relative; height: 36px;">
        <div class="el-message-box__status el-icon-warning" style="position: absolute;top:0;left:0;"></div>
        <div style="position: absolute;top:-18px;left:50px;">
          此操作将删除该用户，删除后，数据无法恢复。请输入手机验证码之后，决定是否继续删除？
        </div>
      </div>
      <div class="form-group has-feedback row">
          <div class="col-xs-8">
            <input v-model="mailCode" type="text" class="form-control" placeholder="请输入短信验证码">
          </div>
          <div class="col-xs-4">
            <el-button @click="sendMail" :disabled="mailSended" type="primary" class="btn btn-primary btn-block btn-flat">{{ mailButtonText }}</el-button>
          </div>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top: -20px;">
          <el-button @click="closeDialogDelete">取消</el-button>
          <el-button type="primary" @click="saveDelete">确定</el-button>
      </div>
    </el-dialog>
    <!-- 关联弹窗 -->
    <el-dialog title="用户关联角色" v-model="relaShowDialog" top="5%">
        <el-form :model="relaForm" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录名">
                    <el-input v-model="relaForm.username" disabled placeholder="登录名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="真实姓名">
                    <el-input v-model="relaForm.realname" disabled placeholder="真实姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全手机">
                    <el-input v-model="relaForm.phone" disabled placeholder="安全手机"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
              <el-tab-pane label="已关联角色" name="first">
                <already-rela v-if="isFirst" :userid="usersid"></already-rela>
              </el-tab-pane>
              <el-tab-pane label="待关联角色" name="second">
                <no-rela v-if="isSecond" :userid="usersid"></no-rela>
              </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top:-20px;">
            <el-button @click="relaCloseDialog" >取消</el-button>
            <el-button type="primary" @click="saveRela">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import alreadyRela from './table/alreadyRela.vue'
import noRela from './table/noRela.vue'
export default {
  data () {
    /* eslint-disable */
    var checkname = (rule, value, callback) => {
      // let name = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{5,17}$/
      let name = /^[a-zA-Z0-9_-]{5,17}$/
      if (!value) {
        return callback(new Error('不能为空'))
      } else if (!name.test(value)) {
        return callback(new Error('用户名不能为中文，5-17为英文字母'))
      }
      api.GET(config.newuser.check, {username: value})
      .then(response => {
        if (response.data.errcode === '60000') {
          return callback(new Error('有重名，请重新输入！'))
        } else {
          callback()
        }
      })
    };
    var checkphone = (rule, value, callback) => {
      let phone = /^1[0-9]{10}$/
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      } else if (!phone.test(value)) {
        callback(new Error('请输入正确手机号码'))
      } else {
        callback()
      }
    };
    var checkpid = (rule, value, callback) => {
      let pid = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      if (!value) {
        return callback(new Error('证件号码不能为空'))
      } else if (!pid.test(value)) {
        callback(new Error('请输入正确证件号码'))
      } else {
        callback()
      }
    };
    var checkemail = (rule, value, callback) => {
      let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      } else if (!email.test(value)) {
        callback(new Error('请输入正确邮箱号码'))
      } else {
        callback()
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value.length < 6){
        callback(new Error('请输入6位以上的密码'));
      } else {
        if (this.addMerchant.checkPassword !== '') {
          this.$refs.addMerchant.validateField('checkPassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addMerchant.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    /* eslint-enable */
    return {
      id: this.$route.query.id,
      usersid: null,
      activeName: 'first',
      isFirst: true,
      isSecond: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadURL: config.serverURI + config.uploadFilesAPI,
      addShowDialog: false,
      editShowDialog: false,
      deleteShowDialog: false,
      relaShowDialog: false,
      mailSended: false,
      mailCode: '',
      mailButtonText: '发送验证码',
      mailCountDown: 60,
      mailTimer: null,
      responseMail: '',
      relaForm: {
        realname: null,
        phone: null,
        username: null
      },
      rules: {
        username: [
          { validator: checkname, trigger: 'blur' }
        ],
        phone: [
          { validator: checkphone, trigger: 'blur' }
        ],
        pid: [
          { validator: checkpid, trigger: 'blur' }
        ],
        email: [
          { validator: checkemail, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ]
      },
      addMerchant: {
        username: null,
        password: null,
        checkPassword: null,
        phone: null,
        email: null,
        is_lock: null,
        realname: null,
        nickname: null,
        sex: null,
        pid: null,
        address: null,
        info: null,
        avatar: null,
        account_id: null
      },
      editMerchant: {
        username: null,
        password: null,
        phone: null,
        email: null,
        is_lock: null,
        realname: null,
        nickname: null,
        sex: null,
        pid: null,
        address: null,
        info: null,
        avatar: null,
        account_id: null
      },
      optionGrade: [{
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }, {
        value: 3,
        label: '保密'
      }],
      optionAccount: [],
      multipleSelection: [],
      showDialog: false,
      response: {
        data: null
      },
      ids: [],
      selected: {
        keyword: '',
        username: '',
        realname: '',
        is_lock: null,
        end_time: '',
        start_time: ''
      },
      form: {
        keyword: ''
      }
    }
  },
  components: {
    alreadyRela,
    noRela
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.isFirst = true
        this.isSecond = false
      } else if (tab.name === 'second') {
        this.isFirst = false
        this.isSecond = true
      }
    },
    /* 上传图片函数 */
    handleAvatarSuccessIcon (res, file) {
      this.addMerchant.avatar = res.data[0]
    },
    /* 上传图片函数 */
    handleAvatarSuccessIconEdit (res, file) {
      this.editMerchant.avatar = res.data[0]
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
    toswitch (state, id) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      var obj = {
        id: id
      }
      api.POST(config.newuser.lock, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改状态成功！！！',
            type: 'success'
          })
          this.getList(data)
        } else {
          this.getList(data)
        }
      })
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleCommand () {
      this.deleteType()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    getEditData (id) {
      api.GET(config.newuser.show, {id: id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.editMerchant = {
            ...this.editMerchant,
            ...response.data.data
          }
          this.editMerchant.is_lock = Boolean(this.editMerchant.is_lock)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    goAwardsDetail (id) {
      this.editShowDialog = true
      this.getEditData(id)
    },
    openDialog () {
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    encrypt(string) {
      const pubkey = config.basic.key
      try {
        let content = this.addMerchant.password
        let crypt = new window.JSEncrypt()
        crypt.setKey(pubkey)
        let crypted = crypt.encrypt(content)
        return crypted
      } catch (ex) {
        return false
      }
    },
    saveAdd (formName) {
      console.log(this.addMerchant, 11111)
      this.addMerchant.is_lock = Number(this.addMerchant.is_lock)
      this.addMerchant.password = this.addMerchant.checkPassword = this.encrypt()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.newuser.add, this.addMerchant)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('添加成功')
              this.addCloseDialog()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          return false
        }
      })
    },
    saveEdit () {
      console.log(this.editMerchant, 11111)
      this.editMerchant.is_lock = Number(this.editMerchant.is_lock)
      api.POST(config.newuser.edit, this.editMerchant)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('修改成功')
          this.editCloseDialog()
          this.getList()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    saveRela () {
      this.relaShowDialog = false
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
    /* 高级搜索 */
    advancedSearch () {
      this.selected.is_lock = Number(this.selected.is_lock)
      if (this.selected.start_time) {
        this.selected.start_time = this.formatDate(this.selected.start_time)
      }
      if (this.selected.end_time) {
        this.selected.end_time = this.formatDate(this.selected.end_time)
      }
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.selected
      }
      this.getList(data)
      this.closeDialog()
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选用户？', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return
        }).catch(() => {
          return
        })
        return
      }
      this.deleteShowDialog = true
      this.mailCode = ''
      // this.$confirm('是否确认是否删除清运公司', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   api.POST(config.recovery.remove, {
      //     ids: this.ids
      //   })
      //   .then(response => {
      //     if (response.data.errcode === '0000') {
      //       this.onSuccess('删除成功')
      //       this.getList()
      //     } else {
      //       this.$message.error('发生错误，请重试')
      //     }
      //   })
      // })
    },
    sendMail () {
      api.GET(config.merchant.sendMail)
        .then(response => {
          if (response.data.errcode === '0000') {
            this.responseMail = '短信已发送,请查收'
            this.onSuccess(this.responseMail)
          } else {
            this.$message.error(response.data.errmsg)
          }
        })
        .catch(error => {
          this.responseMail = '短信发送失败'
          this.$message.error(error)
          return
        })
      this.mailSended = true
      this.mailButtonText = `重新发送(${this.mailCountDown--})`
      // set mail button timer
      this.mailTimer = setInterval(() => {
        if (this.mailCountDown === 0) {
          this.mailSended = false
          this.mailButtonText = '发送验证码'
          this.responseMail = ''
          this.mailCountDown = 60
          clearInterval(this.mailTimer)
          this.mailTimer = null
          return
        }
        this.mailButtonText = `重新发送(${this.mailCountDown--})`
      }, 1000)
    },
    saveDelete () {
      api.POST(config.newuser.delete, {
        ids: this.ids,
        code: this.mailCode
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('删除成功')
          this.getList()
          this.closeDialogDelete()
        } else {
          this.$message.error('发生错误，请重试')
        }
      })
    },
    closeDialogDelete () {
      this.deleteShowDialog = false
    },
    addBaseinfo () {
      this.addShowDialog = true
      Object.keys(this.addMerchant).forEach(k => {
        this.addMerchant[k] = null
      })
    },
    relaType (data) {
      this.usersid = data.id
      this.relaShowDialog = true
      this.relaForm = {
        ...this.relaForm,
        ...data
      }
    },
    addCloseDialog () {
      this.addShowDialog = false
    },
    editCloseDialog () {
      this.editShowDialog = false
    },
    relaCloseDialog () {
      this.relaShowDialog = false
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }

      this.getList(data)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    transformDate (res) {
      res.data.forEach(v => {
        if (v.is_lock === 1) {
          v.is_lock = true
        }
        if (v.is_lock === 0) {
          v.is_lock = false
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.newuser.index, {account_id: this.id, ...data})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformDate(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getMerchantList (data = {}) {
      api.GET(config.merchant.index, {
        currentPage: 1,
        pageSize: 10000
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.optionAccount = response.data.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    onFresh () {
      this.getList()
      this.getMerchantList()
    }
  },
  mounted () {
    this.getList()
    this.getMerchantList()
  }
}
</script>
<style scoped>
.line{
    text-align: center;
}
</style>