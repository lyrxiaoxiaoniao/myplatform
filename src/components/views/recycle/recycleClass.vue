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
            <el-select v-model="form.value" placeholder="所有信息" style="width:140px;">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button v-popover:advancedSearch type="primary">高级</el-button>
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
            <el-table-column prop="display_name" label="小区名称" width="150"></el-table-column>
            <el-table-column prop="logo" label="负责人" width="95">
              <template scope="scope">
                <img style="width:58px;height:58px;" :src="scope.row.logo" @click="bigImg(scope.row.logo)" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="联系电话"></el-table-column>
            <el-table-column prop="sort" label="所属街道"></el-table-column>
            <el-table-column label="审核状态" width="90">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.active"
                  on-text="待"
                  off-text="已"
                  @change="toswitch(scope.row.active,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="详细地址"></el-table-column>
            <el-table-column 
              width="150"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button  size="small" icon="home1"></el-button>
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
    <el-dialog :title="dialogTitle" v-model="showDialog" size="tiny">
      <el-form :model="classData" :rules="rules" ref="classData" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级分类">
              <el-cascader
                :options="cascaderData"
                :props="props"
                :change-on-select="true"
                v-model="stepsSelection"
                @change="handleChange"
                style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="小区名称" prop="display_name" require>
              <el-input v-model="classData.display_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类排序">
              <el-input-number v-model="classData.sort" style="width:120px;"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-switch
                v-model="classData.active"
                on-text="开"
                off-text="关">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类说明" prop="description" require>
              <el-input type="textarea" v-model="classData.description"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="分类icon">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                :on-success="iconHandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="classData.icon" :src="classData.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="分类图片">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="classData.logo" :src="classData.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button @click="submitForm('classData')" v-if="dialogType === 'add'">确定</el-button>
          <el-button @click="editForm()" v-if="dialogType === 'edit'">确定</el-button>
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
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '已审核'
      }, {
        value: '2',
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
        value: ''
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
    enterAdd () {
      this.$router.push('/admin/recycle/add')
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
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    toswitch (active, id) {
      api.POST(config.activeCategoryAPI, {id: id, active: Number(active)})
      .then(response => {
        this.getList()
        this.onSuccess('启用操作成功！')
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
      console.log(data)
      // if (data.type === '')
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
        api.POST(config.deleteCategoryAPI, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
            this.getTree()
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
      api.GET(config.categoryIndexAPI, data)
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
    this.getTree()
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