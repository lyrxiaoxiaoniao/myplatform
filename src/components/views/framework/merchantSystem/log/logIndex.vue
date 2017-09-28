<template>
  <div>
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">      
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="refresh" type="primary">刷新</el-button>             
            </el-col>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" @click="dialogAdvance = true" icon="search" style="margin-left:10px;">高级</el-button>
            <el-button icon="upload2" type="primary" style="margin-left:10px;"></el-button>
            <el-button icon="setting" type="primary"></el-button>
          </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table
            ref="multipleTable"
            border
            stripe
            :data="response.data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column prop="id" sortable label="ID" width="80"></el-table-column>
    <!--         <el-table-column prop="account.name" label="商户名" width="150"></el-table-column> -->
            <el-table-column label="操作员" width="135">
              <template scope="scope">
                <div v-if="scope.row.user_type === 1">{{scope.row.user.nickname}}（{{scope.row.user.username}}）</div>
                <div v-else-if="scope.row.user_type === 2">{{scope.row.wx_user.nickname}}</div>
                <div v-else>无</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="module" width="105" label="模块"></el-table-column> -->
            <el-table-column prop="url" label="url"></el-table-column>
            <el-table-column prop="agent" label="agent"></el-table-column>
            <el-table-column prop="created_ip" label="IP" width="101"></el-table-column>
            <el-table-column prop="created_at" label="操作时间" width="90">
              <template scope="scope">{{scope.row.created_at | toDateTime}}</template>
            </el-table-column>
            <el-table-column 
              width="80"
              label="操作"
              >
              <template scope="scope">
                <!-- <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button> -->
                <el-button @click="detail(scope.row)" size="small" icon="information"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
          <el-row type="flex" justify="center">
            <el-col :span="12">
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
<!-- 高级搜索模态框 -->
    <el-dialog title="高级搜索" v-model="dialogAdvance">
        <el-form :model="advancedSearch" label-width="75px">
           <el-form-item label="关键字">
              <el-input v-model="advancedSearch.keyword" placeholder="请输入关键字"></el-input>
            </el-form-item>
   <!--          <el-form-item label="归属商户">
              <el-select v-model="advancedSearch.account_id" filterable placeholder="请选择" style="width:100%;">
                <el-option
                  v-for="item in origins"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="用户名" >
              <el-input v-model="advancedSearch.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="url">
              <el-input v-model="advancedSearch.url" placeholder="请输入url"></el-input>
            </el-form-item>
            <el-form-item label="IP地址">
              <el-input v-model="advancedSearch.created_ip" placeholder="请输入IP地址"></el-input>
            </el-form-item>
          <!--   <el-form-item label="操作模块" >
              <el-input v-model="advancedSearch.keyword"></el-input>
            </el-form-item> -->
            <el-form-item label="创建时间">
              <el-row>
                <el-col :span="11">
                  <el-date-picker
                    v-model="advancedSearch.start_time"
                    style="width: 100%"
                    type="datetime"
                    placeholder="选择开始时间">
                  </el-date-picker>
                </el-col>
                <el-col :span="2" class="line">-</el-col>
                <el-col :span="11">
                  <el-date-picker
                    v-model="advancedSearch.end_time"
                    style="width: 100%"
                    type="datetime"
                    placeholder="选择结束时间">
                  </el-date-picker>
                </el-col>
              </el-row>  
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdvance = false">取 消</el-button>
            <el-button type="primary" @click="advance">搜 索</el-button>
        </span>
    </el-dialog>
    <el-dialog title="操作详情查看" v-model="detailShow">
        <el-form :model="detailForm" ref="detailForm" label-width="90px">
          <el-form-item label="商户名：">
            <p class="border">{{detailForm.account.name}}</p>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="操作员类别：">
                <p class="border" v-if="detailForm.user_type === 1">
                  管理员
                </p>
                <p class="border" v-else-if="detailForm.user_type === 2">
                  微信用户
                </p>
                <p class="border" v-else>
                </p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="操作员姓名：">
                <p class="border" v-if="detailForm.user_type === 1">
                  {{detailForm.user.nickname}}
                </p>
                <p class="border" v-else-if="detailForm.user_type === 2">
                  {{detailForm.wx_user.nickname}}
                </p>
                 <p class="border" v-else>
                </p>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!-- <el-col :span="11">
              <el-form-item label="操作模块" prop="id">
                <el-input v-model="detailForm.id"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="操作时间：">
                <p class="border">{{detailForm.created_at | toDateTime}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="url">
                <p class="border">
                  {{detailForm.url}}
                </p>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row> 
            <el-col :span="12">
              <el-form-item label="操作IP：" prop="id">
                <p class="border">{detailForm.created_ip}}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="入参：">
            <p class="border">
              {{detailForm.param}}
            </p>
          </el-form-item>
          <el-form-item label="出参：">
            <p class="border">
              {{detailForm.result}}
            </p>
          </el-form-item>
          <el-form-item label="浏览器Agent：">
            <p class="border">
              {{detailForm.agent}}
            </p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="detailShow = false">取 消</el-button>
            <el-button type="primary" @click="detailShow = false">确定</el-button>
          </el-row>
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
      origins: [],
      formLabelWidth: '80px',
      adSwitch: true,
      advancedSearch: {
        keyword: '',
        account_id: '',
        username: '',
        url: '',
        created_ip: '',
        start_time: '',
        end_time: ''
      },
      dialogAdvance: false,
      detailForm: {
        account: {
          name: ''
        },
        agent: '',
        created_at: '',
        created_ip: '',
        param: null,
        result: null,
        url: '',
        user_type: '',
        wx_user: {
          nickname: ''
        },
        user: {
          nickname: ''
        }
      },
      dialogVisibleMove: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      cascaderData: [],
      props: {
        children: 'children',
        label: 'title',
        value: 'id'
      },
      uploadURL: config.serverURI + config.uploadFilesAPI,
      multipleSelection: [],
      response: {
        data: null
      },
      icon: '',
      logo: '',
      classData: {
        parent_id: [],
        display_name: '',
        sort: null,
        active: 1,
        description: '',
        logo: '',
        icon: ''
      },
      detailShow: false,
      selectedOptions: [],
      showDialog: false,
      dialogVisible: false,
      dialogImageUrl: '',
      dialogTitle: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      },
      parentId: null,
      ids: [],
      rules: {
        display_name: [
          { required: true, message: '请输入小区名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '分类说明50字以内', trigger: 'blur' },
          { min: 0, max: 50, message: '分类说明长度在50字以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 刷新
    refresh () {
      this.getList()
    },
    detail (data) {
      this.detailShow = true
      this.detailForm = {
        ...data
      }
    },
    // 进入添加小区页面
    enterAdd () {
      this.$router.push('/admin/recycle/village/add')
    },
    // 进入小区详情页
    edit (id) {
      this.$router.push({ path: '/admin/recycle/village/detail', query: { 'id': id } })
    },
    enterRel (id) {
      this.$store.commit('SET_TOKEN', id)
      this.$router.push({ path: '/admin/recycle/village/relserver', query: { 'id': id } })
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
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
    iconHandleAvatarSuccess(res, file) {
      this.icon = window.URL.createObjectURL(file.raw)
      this.classData.icon = res.data[0]
    },
    handleAvatarSuccess(res, file) {
      this.logo = window.URL.createObjectURL(file.raw)
      this.classData.logo = res.data[0]
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    toswitch (active, id) {
      if (active) {
        active = 1
      } else {
        active = 0
      }
      api.POST(config.village.audit, {id: id, audit_state: active})
      .then(response => {
        this.getList()
        this.onSuccess('启用操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    advance () {
      if (this.advancedSearch.start_time) {
        this.advancedSearch.start_time = this.formatDate(this.advancedSearch.start_time)
      }
      if (this.advancedSearch.end_time) {
        this.advancedSearch.end_time = this.formatDate(this.advancedSearch.end_time)
      }
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      this.getList(data)
      this.dialogAdvance = false
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
    // 模态框显示
    openDialog (e, data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改分类'
        this.classData = {
          ...this.classData,
          ...data
        }
        this.stepsSelection = []
        if (data.parent) {
          this.stepsSelection.push(data.parent.id)
        } else {
          this.stepsSelection.push(data.id)
        }
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增分类'
        this.classData = {
          parent_id: [],
          display_name: '',
          sort: null,
          active: 1,
          description: '',
          logo: '',
          icon: ''
        }
      }
      this.showDialog = true
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.classData.active = Number(this.classData.active)
          var obj = this.classData
          var pid = this.stepsSelection
          obj.parent_id = pid.shift()
          api.POST(config.createCategoryAPI, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.onSuccess('创建成功')
                this.getList()
                this.getTree()
                this.showDialog = false
              }
            })
        } else {
          return false
        }
      })
    },
    editForm () {
      this.classData.active = Number(this.classData.active)
      var obj = this.classData
      var pid = this.stepsSelection
      obj.parent_id = pid.shift()
      obj.created_at = this.classData.created_at
      api.POST(config.updateCategoryAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.onSuccess('修改成功')
          this.getList()
          this.getTree()
          this.showDialog = false
        }
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      if (this.adSwitch) {
        this.getList(data)
      } else {
        this.adSwitch = true
      }
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      if (this.adSwitch) {
        this.getList(data)
      } else {
        this.adSwitch = true
      }
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    },
    getTree () {
      api.GET(config.village.streetTree)
      .then(response => {
        var newData = response.data.data[0].children[0].children
        this.iteration(newData)
        this.data = newData
        this.cascaderData = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      api.GET(config.journal.index, data)
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
    },
    getOrigins (data = {}) {
      api.GET(config.fmrole.aindex, data)
      .then(response => {
        this.origins = this.transform(response.data.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transform (data) {
      let res = []
      data.forEach((e) => {
        let obj = {
          value: e.id,
          label: e.name
        }
        res.push(obj)
      })
      return res
    }
  },
  mounted () {
    this.getList()
    this.getOrigins()
  }
}
</script>
<style scoped>
.line{
  text-align: center;
}
.border {
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  padding-left: 10px;
  color: #1f2d3d;
  word-wrap: break-word;
  word-break: normal;
}
.GD-container{
    height: 100%;
    padding: 1rem 2rem;
    padding-top:0;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
   border-color: #20a0ff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px !important;
    text-align: center;
}
.avatar {
    width: 140px;
    height: 140px;
    display: block;
}
.FS-moveName{
    font-weight: 600;
    font-size: 14px;
    margin: 7px 0 0 7px;
}

</style>