<template>
  <div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button @click="addBaseinfo" type="primary">新增</el-button>
                <el-button @click="handleCommand" type="primary">批量删除</el-button>
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
                <el-form-item label="商户名称">
                    <el-input v-model="selected.keyword" placeholder="请输入商户名称"></el-input>
                </el-form-item>
                <el-form-item label="客户经理">
                    <el-input v-model="selected.keyword" placeholder="请输入客户经理"></el-input>
                </el-form-item>
                <el-form-item label="负责人电话">
                    <el-input v-model="selected.keyword" placeholder="请输入负责人电话"></el-input>
                </el-form-item>
                <el-form-item label="业务类型">
                    <el-select v-model="selected.keyword" placeholder="请选择业务类型" class="fullwidth">
                      <el-option label="大件垃圾" value=0></el-option>
                      <el-option label="餐厨垃圾" value=1></el-option>
                    </el-select>
                </el-form-item>
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
                <el-table-column prop="name" label="用户归属"></el-table-column>
                <el-table-column label="头像" width="100">
                  <template scope="scope">
                    <img class="table-img" :src="scope.row.license" @click="bigImg(scope.row.license)" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="dutyName" label="用户名" width="120"></el-table-column>
                <el-table-column prop="mobile" label="真实姓名"></el-table-column>
                <el-table-column prop="detailAddress" label="手机号码"></el-table-column>
                <el-table-column prop="detailAddress" label="邮箱"></el-table-column>
                <el-table-column prop="detailAddress" label="创建时间">
                  <template scope="scope">{{scope.row.created_at | toDateTime}}</template>
                </el-table-column>
                <el-table-column label="有效状态" width="100px">
                  <template scope="scope">
                    <el-switch
                      v-model="scope.row.state"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.state,scope.row.id)">
                    </el-switch>
                  </template> 
                </el-table-column>
                <el-table-column prop="status" label="操作" width="115">
                  <template scope="scope"> 
                      <el-button @click="goAwardsDetail(scope.row.id)" size="small" icon="edit"></el-button>
                      <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                      <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
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
    <el-dialog title="新增用户" v-model="addShowDialog" top="5%">
      <el-form :model="addMerchant" label-width="80px">
        <el-row>
        <el-col :span="24">
          <el-form-item label="用户名">
            <el-input placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录秘密">
              <el-input placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码">
              <el-input placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全手机">
              <el-input placeholder="安全手机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全邮箱">
              <el-input placeholder="安全邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
              <el-switch on-text="开" off-text="关" v-model="addMerchant.active"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户归属">
              <el-select v-model="addMerchant.grade" placeholder="请选择" class="fullwidth">
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
          <el-form-item label="真实姓名">
              <el-input placeholder="真实姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称">
              <el-input placeholder="昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名">
              <el-select v-model="addMerchant.grade" placeholder="请选择" class="fullwidth">
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
              <el-input placeholder="证件号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系地址">
              <el-input placeholder="商户地址，128字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息">
              <el-input type="textarea" placeholder="备注信息"></el-input>
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
                  <img v-if="addMerchant.icon" :src="addMerchant.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
        </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button >取消</el-button>
          <el-button type="primary">保存</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹窗end -->
    <!-- 修改弹窗start -->
    <el-dialog title="修改用户" v-model="editShowDialog" top="5%">
       <el-form :model="editMerchant" label-width="80px">
        <el-row>
        <el-col :span="24">
          <el-form-item label="用户名">
            <el-input placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录秘密">
              <el-input placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码">
              <el-input placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全手机">
              <el-input placeholder="安全手机"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全邮箱">
              <el-input placeholder="安全邮箱"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用">
              <el-switch on-text="开" off-text="关" v-model="editMerchant.active"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户归属">
              <el-select v-model="editMerchant.grade" placeholder="请选择" class="fullwidth">
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
          <el-form-item label="真实姓名">
              <el-input placeholder="真实姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称">
              <el-input placeholder="昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名">
              <el-select v-model="editMerchant.grade" placeholder="请选择" class="fullwidth">
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
              <el-input placeholder="证件号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系地址">
              <el-input placeholder="商户地址，128字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注信息">
              <el-input type="textarea" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网站图标">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessIconEdit"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="editMerchant.icon" :src="editMerchant.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
        </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button >取消</el-button>
          <el-button type="primary">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹窗end -->
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      data: [],
      uploadURL: config.serverURI + config.uploadFilesAPI,
      addShowDialog: false,
      editShowDialog: false,
      addMerchant: {
        beginTime: null,
        endTime: null,
        active: true,
        grade: '',
        icon: ''
      },
      editMerchant: {
        beginTime: null,
        endTime: null,
        active: true,
        grade: '',
        icon: ''
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
        keyword: '',
        author: ''
      },
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    /* 上传图片函数 */
    handleAvatarSuccessIcon (res, file) {
      this.addMerchant.icon = res.data[0]
    },
    /* 上传图片函数 */
    handleAvatarSuccessIconEdit (res, file) {
      this.editMerchant.icon = res.data[0]
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
        state: this.changeNum(state)
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
          this.updateList(data)
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
    goAwardsDetail (id) {
      this.$router.push({
        path: '/admin/recycle/recovery/info',
        query: {
          id: id
        }
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
    /* 高级搜索 */
    advancedSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.selected
      }
      this.getList(data)
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选清运公司？', '错误', {
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
      this.$confirm('是否确认是否删除清运公司', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.recovery.remove, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    addBaseinfo () {
      this.addShowDialog = true
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
    getList (data = {}) {
      api.GET(config.recovery.index, data)
      .then(response => {
        this.response = response.data.data
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