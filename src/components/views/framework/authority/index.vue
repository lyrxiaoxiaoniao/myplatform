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
                <el-form-item label="权限名称">
                    <el-input v-model="selected.display_name" placeholder="请输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="权限标识">
                    <el-input v-model="selected.name" placeholder="请输入权限标识"></el-input>
                </el-form-item>
                <el-col :span="12">
                  <el-form-item label="是否启用">
                      <el-switch on-text="开" off-text="关" v-model="selected.active"></el-switch>
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
                <el-table-column prop="display_name" label="权限名称"></el-table-column>
                <el-table-column prop="name" label="权限标识" width="150"></el-table-column>
                <el-table-column prop="description" label="权限说明"></el-table-column>
                <el-table-column label="创建时间">
                  <template scope="scope">{{scope.row.createdAt | toDateTime}}</template>
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
                <el-table-column prop="status" label="操作" width="200">
                  <template scope="scope"> 
                      <el-button @click="deleteType(scope.row.id)" title="删除" size="small" icon="delete2"></el-button>
                      <el-button @click="goAwardsDetail(scope.row.id)" title="修改" size="small" icon="edit"></el-button>
                      <el-button @click="relaType(scope.row)" title="关联角色" size="small" class="fa fa-th-large"></el-button>
                      <el-button @click="relaMenuType(scope.row)" title="关联菜单" size="small" class="fa fa-link"></el-button>
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
    <el-dialog title="新增权限点" v-model="addShowDialog" size="tiny">
      <el-form :model="addMerchant" label-width="80px">
        <el-row>
        <el-col :span="24">
          <el-form-item label="权限名称">
            <el-input v-model="addMerchant.display_name" placeholder="请输入权限名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用">
              <el-switch on-text="开" off-text="关" v-model="addMerchant.active"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限标识">
              <el-input v-model="addMerchant.name" placeholder="权限标识"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限简介">
              <el-input v-model="addMerchant.description" placeholder="权限简介"></el-input>
          </el-form-item>
        </el-col>
        </el-row>  
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px;">
          <el-button @click="addCloseDialog">取消</el-button>
          <el-button type="primary" @click="saveAdd">保存</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹窗end -->
    <!-- 修改弹窗start -->
    <el-dialog title="修改用户" v-model="editShowDialog" size="tiny">
       <el-form :model="editMerchant" label-width="80px">
        <el-row>
        <el-col :span="24">
          <el-form-item label="权限名称">
            <el-input v-model="editMerchant.display_name" placeholder="请输入权限名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否启用">
              <el-switch on-text="开" off-text="关" v-model="editMerchant.active"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限标识">
              <el-input v-model="editMerchant.name" placeholder="权限标识"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="权限简介">
              <el-input v-model="editMerchant.description" placeholder="权限简介"></el-input>
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
    <!-- 关联弹窗 -->
    <el-dialog title="权限关联角色" v-model="relaShowDialog">
        <el-form :model="relaForm" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="权限名称">
                    <el-input v-model="relaForm.display_name" disabled placeholder="权限名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="权限标识">
                    <el-input v-model="relaForm.name" disabled placeholder="权限标识"></el-input>
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
    <!-- 关联菜单弹窗 -->
    <el-dialog title="权限关联菜单" v-model="dialogVisible">
        <el-form :model="relaForm" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="权限名称">
                    <el-input v-model="relaForm.display_name" disabled placeholder="权限名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="权限标识">
                    <el-input v-model="relaForm.name" disabled placeholder="权限标识"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <menu-table v-if="dialogVisible" :userid="usersid"></menu-table>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top:-20px;">
            <el-button @click="saveRelaMenu">取消</el-button>
            <el-button type="primary" @click="saveRelaMenu">关闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import alreadyRela from './table/alreadyRela.vue'
import noRela from './table/noRela.vue'
import menuTable from './table/menuTable.vue'
export default {
  data () {
    return {
      usersid: null,
      activeName: 'first',
      isFirst: true,
      isSecond: false,
      dialogImageUrl: '',
      dialogVisible: false,
      addShowDialog: false,
      editShowDialog: false,
      relaShowDialog: false,
      relaForm: {
        display_name: null,
        name: null
      },
      addMerchant: {
        display_name: null,
        name: null,
        active: null,
        description: null
      },
      editMerchant: {
        display_name: null,
        name: null,
        active: null,
        description: null
      },
      multipleSelection: [],
      showDialog: false,
      response: {
        data: null
      },
      ids: [],
      selected: {
        keyword: '',
        name: '',
        display_name: '',
        active: null,
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
    noRela,
    menuTable
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
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
        id: id,
        active: Number(state)
      }
      api.POST(config.authority.active, obj)
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
      api.GET(config.authority.show, {id: id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.editMerchant = {
            ...this.editMerchant,
            ...response.data.data[0]
          }
          this.editMerchant.active = Boolean(this.editMerchant.active)
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
    saveAdd () {
      console.log(this.addMerchant, 11111)
      this.addMerchant.active = Number(this.addMerchant.active)
      api.POST(config.authority.add, this.addMerchant)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('添加成功')
          this.addCloseDialog()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    saveEdit () {
      console.log(this.editMerchant, 11111)
      this.editMerchant.active = Number(this.editMerchant.active)
      api.POST(config.authority.edit, this.editMerchant)
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
    saveRelaMenu () {
      this.dialogVisible = false
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
        this.$confirm('请进行正确操作，请先勾选权限？', '错误', {
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
      this.$confirm('是否确认是否删除权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.authority.delete, {
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
    relaMenuType (data) {
      this.usersid = data.id
      this.dialogVisible = true
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
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.authority.index, data)
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