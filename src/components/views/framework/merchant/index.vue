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
              <el-row>
                <el-col :span="24">
                <el-form-item label="关键字">
                    <el-input v-model="selected.keyword" placeholder="请输入关键字"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="商户名称">
                    <el-input v-model="selected.name" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="客户经理">
                    <el-input v-model="selected.mgr_name" placeholder="请输入客户经理"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="商户等级">
                    <el-select v-model="selected.level" placeholder="请选择" style="width:100%;">
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
                  <el-form-item label="是否有效">
                      <el-switch on-text="开" off-text="关" v-model="selected.active"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                <el-form-item label="创建时间">
                  <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择开始时间" v-model="selected.started_at" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-date-picker type="datetime" placeholder="选择结束时间" v-model="selected.ended_at" style="width: 100%;"></el-date-picker>
                  </el-col>
                </el-form-item>
                </el-col>
                <!-- <el-col :span="24">
                <el-form-item label="账号数量">
                  <el-col :span="11">
                    <el-input-number v-model="selected.num" :min="1"></el-input-number>
                  </el-col>
                  <el-col class="line" :span="1">--</el-col>
                  <el-col :span="11">
                    <el-input-number v-model="selected.num" :min="1"></el-input-number>
                  </el-col>
                </el-form-item>
                </el-col> -->
              </el-row>
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
                <el-table-column prop="name" label="商户名称"></el-table-column>
                <el-table-column prop="principal" label="负责人"></el-table-column>
                <el-table-column prop="level" label="商户级别" width="120"></el-table-column>
                <el-table-column prop="brief" label="商户简介"></el-table-column>
                <!-- <el-table-column prop="count" label="账号数量"></el-table-column> -->
                <el-table-column label="创建时间">
                  <template scope="scope">{{scope.row.created_at | toDateTime}}</template>
                </el-table-column>
                <el-table-column label="有效状态" width="100px">
                  <template scope="scope">
                    <el-switch
                      v-model="scope.row.active"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.active,scope.row.id)">
                    </el-switch>
                  </template> 
                </el-table-column>
                <el-table-column prop="status" label="操作" width="160">
                  <template scope="scope"> 
                      <el-button @click="editDetail(scope.row)" size="small" icon="edit"></el-button>
                      <el-button @click="toUser(scope.row.id)" size="small" class="fa fa-user-o"></el-button>
                      <el-button @click="toSetting(scope.row.id)" size="small" icon="setting"></el-button>
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
    <!-- 添加弹窗start -->
    <el-dialog title="添加商户" v-model="addShowDialog" top="10%">
      <el-form :model="addMerchant" label-width="80px" ref="addMerchant">
        <el-row>
        <el-col :span="24">
          <el-form-item label="商户名称">
            <el-input v-model="addMerchant.name" placeholder="请输入商户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商户等级">
              <el-select v-model="addMerchant.level" placeholder="请选择" style="width:100%;">
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
          <el-form-item label="是否有效">
              <el-switch on-text="开" off-text="关" v-model="addMerchant.active"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="服务时间">
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择开始时间" v-model="addMerchant.started_at" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择结束时间" v-model="addMerchant.ended_at" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人">
              <el-input v-model="addMerchant.principal" placeholder="客户负责人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
              <el-input v-model="addMerchant.mobile" placeholder="客户负责人联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商户地址">
              <el-input v-model="addMerchant.address" placeholder="商户地址，128字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商户简介">
              <el-input v-model="addMerchant.brief" type="textarea" placeholder="商户简介，控制在256字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户经理">
              <el-input v-model="addMerchant.mgr_name" placeholder="客户经理姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经理电话">
              <el-input v-model="addMerchant.mgr_mobile" placeholder="客户经理电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商户证照">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessIcon"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="addMerchant.license" :src="addMerchant.license" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
      </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialogAdd">取消</el-button>
          <el-button type="primary" @click="saveAdd">保存</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹窗end -->
    <!-- 修改弹窗start -->
    <el-dialog title="修改商户" v-model="editShowDialog" top="10%">
      <el-form :model="editMerchant" label-width="80px">
        <el-row>
        <el-col :span="24">
          <el-form-item label="商户名称">
            <el-input v-model="editMerchant.name" placeholder="请输入商户名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商户等级">
              <el-select v-model="editMerchant.level" placeholder="请选择" style="width:100%;">
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
          <el-form-item label="是否有效">
              <el-switch on-text="开" off-text="关" v-model="editMerchant.active"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="服务时间">
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择开始时间" v-model="editMerchant.started_at" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="datetime" placeholder="选择结束时间" v-model="editMerchant.ended_at" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人">
              <el-input v-model="editMerchant.principal" placeholder="客户负责人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话">
              <el-input v-model="editMerchant.mobile" placeholder="客户负责人联系电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商户地址">
              <el-input v-model="editMerchant.address" placeholder="商户地址，128字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商户简介">
              <el-input v-model="editMerchant.brief" type="textarea" placeholder="商户简介，控制在256字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户经理">
              <el-input v-model="editMerchant.mgr_name" placeholder="客户经理姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经理电话">
              <el-input v-model="editMerchant.mgr_mobile" placeholder="客户经理电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商户证照">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="editMerchant.license" :src="editMerchant.license" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
      </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialogEdit">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹窗end -->
    <!-- 删除弹框 -->
    <el-dialog title="删除商户" v-model="deleteShowDialog" top="35%" size="tiny">
      <div style="padding-left: 50px;position: relative; height: 36px;">
        <div class="el-message-box__status el-icon-warning" style="position: absolute;top:0;left:0;"></div>
        <div style="position: absolute;top:-18px;left:50px;">
          此操作将删除该商户，删除后，数据无法恢复。请输入手机验证码之后，决定是否继续删除？
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
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      uploadURL: config.serverURI + config.uploadFilesAPI,
      addShowDialog: false,
      editShowDialog: false,
      deleteShowDialog: false,
      mailSended: false,
      mailCode: '',
      mailButtonText: '发送验证码',
      mailCountDown: 60,
      mailTimer: null,
      responseMail: '',
      addMerchant: {
        name: null,
        level: null,
        active: null,
        started_at: null,
        ended_at: null,
        principal: null,
        mobile: null,
        address: null,
        brief: null,
        mgr_name: null,
        mgr_mobile: '',
        license: ''
      },
      editMerchant: {
        name: null,
        level: null,
        active: null,
        started_at: null,
        ended_at: null,
        principal: null,
        mobile: null,
        address: null,
        brief: null,
        mgr_name: null,
        mgr_mobile: '',
        license: ''
      },
      optionGrade: [{
        value: 1,
        label: '普通商户'
      }, {
        value: 2,
        label: '高级商户'
      }, {
        value: 3,
        label: 'VIP商户'
      }],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      multipleSelection: [],
      showDialog: false,
      response: {
        data: null
      },
      ids: [],
      selected: {
        name: null,
        level: null,
        active: null,
        keyword: null,
        mgr_name: null,
        started_at: null,
        ended_at: null
      },
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    /* 上传图片函数 */
    handleAvatarSuccessIcon (res, file) {
      this.addMerchant.license = res.data[0]
    },
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      this.editMerchant.license = res.data[0]
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
        id: id,
        active: this.changeNum(state)
      }
      api.POST(config.updateStateAdvPointAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改状态成功！！！',
            type: 'success'
          })
          this.getList(data)
        }
      })
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
    openDialog () {
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
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
      this.selected.active = Number(this.selected.active)
      if (this.selected.started_at) {
        this.selected.started_at = this.formatDate(this.selected.started_at)
      }
      if (this.selected.ended_at) {
        this.selected.ended_at = this.formatDate(this.selected.ended_at)
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
        this.$confirm('请进行正确操作，请先勾选商户？', '错误', {
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
      // this.$confirm('是否确认是否删除商户', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   api.POST(config.merchant.delete, {
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
      api.POST(config.merchant.delete, {
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
    addBaseinfo () {
      this.addShowDialog = true
      Object.keys(this.addMerchant).forEach(k => {
        this.addMerchan[k] = null
      })
    },
    getString (res) {
      if (res === '普通用户') {
        res = 1
      }
      if (res === '高级用户') {
        res = 2
      }
      if (res === 'VIP用户') {
        res = 3
      }
      return res
    },
    editDetail (data) {
      this.editShowDialog = true
      this.editMerchant = {
        ...this.editMerchant,
        ...data
      }
      this.editMerchant.level = this.getString(this.editMerchant.level)
      this.editMerchant.active = Boolean(this.addMerchant.active)
    },
    closeDialogAdd () {
      this.addShowDialog = false
    },
    closeDialogEdit () {
      this.editShowDialog = false
    },
    closeDialogDelete () {
      this.deleteShowDialog = false
    },
    saveAdd () {
      if (this.addMerchant.started_at) {
        this.addMerchant.started_at = new Date(this.addMerchant.started_at).getTime()
      }
      if (this.addMerchant.ended_at) {
        this.addMerchant.ended_at = new Date(this.addMerchant.ended_at).getTime()
      }
      this.addMerchant.active = Number(this.addMerchant.active)
      api.POST(config.merchant.add, this.addMerchant)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('新增商户成功')
          this.getList()
          this.closeDialogAdd()
        } else if (response.data.errcode === '60003') {
          this.$message.err(response.data.errmsg)
        }
      })
    },
    saveEdit () {
      if (this.editMerchant.started_at) {
        this.editMerchant.started_at = new Date(this.editMerchant.started_at).getTime()
      }
      if (this.editMerchant.ended_at) {
        this.editMerchant.ended_at = new Date(this.editMerchant.ended_at).getTime()
      }
      this.editMerchant.active = Number(this.editMerchant.active)
      api.POST(config.merchant.edit, this.editMerchant)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('修改商户成功')
          this.getList()
          this.closeDialogEdit()
        } else if (response.data.errcode === '60003') {
          this.$message.err(response.data.errmsg)
        }
      })
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
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
        if (v.level === 1) {
          v.level = '普通用户'
        } else if (v.level === 2) {
          v.level = '高级用户'
        } else if (v.level === 3) {
          v.level = 'VIP用户'
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.merchant.index, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformDate(response.data.data)
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
    },
    toSetting (id) {
      this.$router.push({
        path: '/admin/merchant/config',
        query: {
          id: id
        }
      })
    },
    toUser (id) {
      this.$router.push({
        path: '/admin/newuser/index',
        query: {
          id: id
        }
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
.line{
    text-align: center;
}
</style>