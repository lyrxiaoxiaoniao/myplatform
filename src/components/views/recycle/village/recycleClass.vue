<template>
  <div class="GD-container">
    <el-row tpye="flex">
      <el-col :span="3" style="margin-top: 1rem">
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick">
      </el-tree>
   </el-col>
    <el-col :span="21">
      <kobe-table> 
        <div slot="kobe-table-header" class="kobe-table-header">      
          <el-row type="flex" justify="end">
            <el-col :span="12">
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
            <el-col :span="10">
              <el-input v-model="form.keyword" placeholder="请输入小区名称">
                <el-select v-model="form.audit_state" slot="prepend" placeholder="所有信息" style="width:105px;">
                  <el-option
                    v-for="item in option"
                    :key="item.audit_state"
                    :label="item.label"
                    :value="item.audit_state">
                  </el-option>
                </el-select>
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" @click="dialogAdvance = true" style="margin-left:10px;">高级</el-button>
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
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" sortable label="ID" width="70"></el-table-column>
            <el-table-column prop="name" label="小区名称" width="150"></el-table-column>
            <el-table-column prop="duty_name" label="负责人" width="80">
            </el-table-column>
            <el-table-column prop="mobile" width="105" label="联系电话"></el-table-column>
            <el-table-column prop="street" label="所属街道" width="90"></el-table-column>
            <el-table-column label="审核状态" width="95">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.audit_state"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.audit_state,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="detail_address" label="详细地址"></el-table-column>
            <el-table-column 
              width="160"
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
                      :props="moveProps"
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
    <el-dialog title="高级搜索" v-model="dialogAdvance">
        <el-form :model="advancedSearch" style="padding-right:30px;" label-position="right" label-width="70px">
          <el-form-item label="小区名称" >
            <el-input v-model="advancedSearch.keyword" placeholder="请输入小区名称"></el-input>
          </el-form-item>
          <el-form-item label="关联物业">
            <el-input v-model="advancedSearch.name" placeholder="请输入已关联物业名称"></el-input>
          </el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="联系人">
                 <el-input v-model="advancedSearch.duty_name" placeholder="请输入小区负责人" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :offset="2" :span="11">
                <el-form-item label="所属街道">
                  <el-cascader
                    style="width: 100%;"
                    :options="cascaderData"
                    :props="props"
                    :show-all-levels="false"
                    v-model="selectedOptions"
                    @change="handleChange">
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="数据状态">
              <el-radio class="radio" v-model="advancedSearch.audit_state" label="1" style="margin:0 10px;">开</el-radio>
              <el-radio class="radio" v-model="advancedSearch.audit_state" label="0"  style="margin:0 10px;">关</el-radio>
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
      sendData: null,
      formLabelWidth: '90px',
      adSwitch: true,
      advancedSearch: {
        keyword: '',
        name: '',
        title: '',
        audit_state: '',
        duty_name: ''
      },
      dialogAdvance: false,
      moveVal: null,
      dialogVisibleMove: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      cascaderData: [],
      moveProps: {
        children: 'children',
        label: 'title',
        value: 'id'
      },
      props: {
        children: 'children',
        label: 'title',
        value: 'title'
      },
      uploadURL: config.serverURI + config.uploadFilesAPI,
      multipleSelection: [],
      option: [{
        audit_state: null,
        label: '所有信息'
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
      region_pid: null,
      region_id: null,
      ids: [],
      cityOptions: [],
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
      this.$store.commit('SET_TOKEN', id)
      this.$router.push({ path: '/admin/recycle/village/relserver', query: { 'id': id } })
    },
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
      if (command === '移动') {
        this.dialogVisibleMove = true
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
        v.street = v.rubRegionVO.title
      })
      return res
    },
    toswitch (active, id) {
      if (active) {
        active = 1
      } else {
        active = 0
      }
      api.POST(config.village.audit, {id: id, audit_state: active})
      .then(response => {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: this.response.pageSize,
          region_id: this.region_id,
          ...this.form
        }
        this.getList(data)
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
        if (response.data.errcode === '5000') {
          this.response.data = null
          this.response.count = 0
        } else {
          this.response = this.transformDate(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 树形结构选择
    handleChange (value) {
      // console.log(value)
      this.advancedSearch.title = this.selectedOptions[1]
    },
    handleChangeMove (value) {
      this.moveVal = value
      // console.log(value)
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      if (data.type === 'district') {
        this.cityOptions = []
        this.cityOptions.push(data.id)
      } else {
        if (this.cityOptions.length === 2) {
          this.cityOptions.pop()
          this.cityOptions.push(data.id)
          // console.log(this.cityOptions)
        } else {
          this.cityOptions.push(data.id)
          // console.log(this.cityOptions)
        }
      }
      if (this.cityOptions.length === 1) {
        this.region_pid = this.cityOptions[0]
        this.getList({
          region_pid: this.region_pid,
          currentPage: 1,
          pageSize: this.response.pageSize
          // ...this.form
        })
      }
      if (this.cityOptions.length === 2) {
        this.region_id = this.cityOptions[1]
        this.getList({
          region_id: this.region_id,
          currentPage: 1,
          pageSize: this.response.pageSize
          // ...this.form
        })
      }
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
                const data = {
                  currentPage: this.response.currentPage,
                  pageSize: this.response.pageSize,
                  region_id: this.region_id,
                  ...this.form
                }
                this.getList(data)
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
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize,
            region_id: this.region_id,
            ...this.form
          }
          this.getList(data)
          this.getTree()
          this.showDialog = false
        }
      })
    },
    // 批量移动
    confirmMove () {
      var obj = {}
      obj.ids = this.ids
      obj.region_pid = this.moveVal[0]
      obj.region_id = this.moveVal[1]
      api.POST(config.village.move, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize,
            region_id: this.region_id,
            ...this.form
          }
          this.getList(data)
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
      if (this.cityOptions.length === 1) {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: value,
          region_pid: this.region_pid
          // ...this.form
        }
        if (this.adSwitch) {
          this.getList(data)
        } else {
          this.adSwitch = true
        }
      } else if (this.cityOptions.length === 2) {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: value,
          region_id: this.region_id
          // ...this.form
        }
        if (this.adSwitch) {
          this.getList(data)
        } else {
          this.adSwitch = true
        }
      } else {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: value,
          ...this.form
        }
        this.getList(data)
      }
    },
    handleCurrentChange (value) {
      // console.log(value)
      if (this.cityOptions.length === 1) {
        const data = {
          currentPage: value,
          pageSize: this.response.pageSize,
          region_pid: this.region_pid
          // ...this.form
        }
        if (this.adSwitch) {
          this.getList(data)
        } else {
          this.adSwitch = true
        }
      } else if (this.cityOptions.length === 2) {
        const data = {
          currentPage: value,
          pageSize: this.response.pageSize,
          region_id: this.region_id
          // ...this.form
        }
        if (this.adSwitch) {
          this.getList(data)
        } else {
          this.adSwitch = true
        }
      } else {
        const data = {
          currentPage: value,
          pageSize: this.response.pageSize,
          ...this.form
        }
        this.getList(data)
      }
    },
    onSearch () {
      this.adSwitch = true
      this.region_id = ''
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
    getList (data = null) {
      if (data === null) {
        data = {
          currentPage: 1,
          pageSize: 10
        }
      }
      api.GET(config.village.list, data)
      .then(response => {
        if (response.data.errcode === '5000') {
          this.response.data = null
          this.response.count = 0
          this.response.currentPage = 1
          this.response.pageSize = 10
        } else {
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
    }
  },
  mounted () {
    this.getList()
    this.getTree()
  }
}
</script>
<style scoped>
.GD-container{
    height: 100%;
    padding: 1rem 2rem;
    padding-top:0;
    padding-right: 0; 
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