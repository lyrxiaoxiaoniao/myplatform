<template>
  <div class="GD-container">
    <el-row tpye="flex">
      <el-col :span="4">
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick">
      </el-tree>
   </el-col>
    <el-col :span="20">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">      
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="enterAdd" type="primary">添加</el-button>      
              <el-dropdown @command="handleCommand" style="margin-left:10px;">
                <el-button type="primary">
                                   批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="批量删除">删除</el-dropdown-item>
                  <el-dropdown-item command="移动">移动</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-select v-model="form.audit_state" placeholder="所有信息" style="width:140px;">
              <el-option
                v-for="item in option"
                :key="item.audit_state"
                :label="item.label"
                :value="item.audit_state">
              </el-option>
            </el-select>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" @click="dialogAdvance = true">高级</el-button>
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
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="小区名称" width="150"></el-table-column>
            <el-table-column prop="duty_name" label="负责人" width="95">
            </el-table-column>
            <el-table-column prop="mobile" width="105" label="联系电话"></el-table-column>
            <el-table-column prop="region_id" label="所属街道"></el-table-column>
            <el-table-column label="审核状态" width="90">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.audit_state"
                  on-text="已"
                  off-text="待"
                  @change="toswitch(scope.row.audit_state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="detail_address" label="详细地址"></el-table-column>
            <el-table-column 
              width="170"
              label="操作"
              >
              <template scope="scope">
                <!-- <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button> -->
                <el-button @click="edit(scope.row.id)" size="small" icon="edit"></el-button>
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button @click="enterRel(scope.row.id)" size="small"><i class="fa fa-home"></i></el-button>
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
     </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 批量移动 -->
    <el-dialog title="移动" v-model="dialogVisibleMove" size="tiny">
        <div style="width:100%">
            <el-row type="flex" justify="center">
                <el-col :span="4">
                  <p class="FS-moveName">移动到</p>
                </el-col>
                <el-col :span="20">
                    <el-cascader
                      style="width:100%;"
                      change-on-select
                      :options="cascaderData"
                      :props="props"
                      v-model="selectedOptions"
                      @change="handleChangeMove">
                  </el-cascader>
                </el-col>
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleMove = false">取 消</el-button>
            <el-button type="primary" @click="confirmMove">确 定</el-button>
        </span>
    </el-dialog>
<!-- 高级搜索模态框 -->
    <el-dialog title="高级搜索" v-model="dialogAdvance" size="tiny">
        <el-form :model="advancedSearch" style="padding-right:30px;" label-position="left">
           <el-form-item label="关键字" :label-width="formLabelWidth">
              <el-input v-model="advancedSearch.keyword" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="关联物业" :label-width="formLabelWidth">
              <el-input v-model="advancedSearch.server" auto-complete="off"></el-input>
            </el-form-item>
            <el-row>
              <el-form-item label="所属街道" :label-width="formLabelWidth">
              <el-cascader
                :options="options"
                v-model="selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="13">
              <el-form-item label="联系人" :label-width="formLabelWidth">
               <el-input v-model="advancedSearch.duty_name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            </el-row>
            <el-form-item label="数据状态" :label-width="formLabelWidth">
                 <el-radio class="radio" v-model="advancedSearch.audit_state" label="1" style="margin:0 10px;">已审核</el-radio>
                 <el-radio class="radio" v-model="advancedSearch.audit_state" label="0"  style="margin:0 10px;">未审核</el-radio>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdvance = false">取 消</el-button>
            <el-button type="primary" @click="advance">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      formLabelWidth: '90px',
      adSwitch: true,
      advancedSearch: {
        keyword: '',
        server: '',
        audit_state: '1',
        duty_name: ''
      },
      dialogAdvance: false,
      moveVal: null,
      dialogVisibleMove: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'display_name'
      },
      cascaderData: [],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      uploadURL: config.serverURI + config.uploadFilesAPI,
      multipleSelection: [],
      option: [{
        audit_state: null,
        label: '全部'
      }, {
        audit_state: '1',
        label: '已审核'
      }, {
        audit_state: '0',
        label: '待审核'
      }],
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
      selectedOptions: [],
      showDialog: false,
      dialogVisible: false,
      dialogImageUrl: '',
      dialogTitle: '',
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: '',
        audit_state: ''
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
    // 进入添加小区页面
    enterAdd () {
      this.$router.push('/admin/recycle/village/add')
    },
    // 进入小区详情页
    edit (id) {
      this.$router.push({ path: '/admin/recycle/village/detail', query: { 'id': id } })
    },
    enterRel (id) {
      this.$router.push({ path: '/admin/recycle/village/relserver', query: { 'id': id } })
    },
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
      if (command === '移动') {
        this.confirmMove()
      }
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
    transformDate (res) {
      res.data.forEach(v => {
        if (v.audit_state === 0) {
          v.audit_state = false
        }
        if (v.audit_state === 1) {
          v.audit_state = true
        }
      })
      return res
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
      this.dialogAdvance = false
      this.adSwitch = false
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      api.GET(config.village.advanced, data)
      .then(response => {
        this.response = this.transformDate(response.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 树形结构选择
    handleChange (value) {
      console.log(value)
    },
    handleChangeMove (value) {
      console.log(value)
      this.moveVal = value
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.getList({parent_id: this.parentId})
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
          console.log(obj)
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
    // 批量移动
    confirmMove () {
      this.dialogVisibleMove = true
      this.parentId = null
      this.parentId = this.moveVal.shift()
      var obj = {}
      obj.ids = this.ids
      obj.id = this.parentId
      api.POST(config.moveCategoryAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getList()
          this.getTree()
          this.dialogVisibleMove = false
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选表单？', '错误', {
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
      this.$confirm('此操作将删除选定小区,是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.village.delete, {
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
      api.GET(config.categoryTreeAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.push({ id: 0, display_name: '罗湖', label: '罗湖', value: 0 })
        this.data = newData
        this.cascaderData = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      api.GET(config.village.list, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
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
.GD-container{
    height: 100%;
    margin-top: 1.5rem;
    padding: 1rem 2rem;
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