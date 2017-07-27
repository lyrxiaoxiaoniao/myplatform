<template>
  <div class="GD-container">
    <div class="GD-left">
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              node-key="id"
              @node-click="handleNodeClick"
              style="max-height:600px;overflow:auto;">
      </el-tree>
    </div>
    <div class="GD-right">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="openDialog" type="primary">添加子分类</el-button>
              <el-button @click="getList()" type="primary">刷新</el-button>
              <el-dropdown @command="handleCommand" style="margin-left:10px;">
                <el-button type="primary">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="批量删除">批量删除</el-dropdown-item>
                  <el-dropdown-item command="移动">移动</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-select v-model="form.value" placeholder="所有信息" style="width:120px;">
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
            <el-table-column prop="display_name" label="分类名称"></el-table-column>
            <el-table-column prop="type_key" label="图片" width="130">
              <template scope="scope">
                <img width="100%" :src="scope.row.logo" @click="bigImg(scope.row.logo)" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
            <el-table-column label="启用" width="90">
              <template scope="scope">
                <el-switch
                  style="width:60px;"
                  v-model="scope.row.active"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.active,scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
              width="120"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
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
    </div>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :title="dialogTitle" v-model="showDialog" size="tiny">
      <el-form :model="classData" :rules="rules" ref="classData" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级分类" prop="parent_id" require>
              <el-cascader
                :options="cascaderData"
                :props="props"
                change-on-select
                v-model="classData.parent_id"
                @change="handleChange"
                style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类名称" prop="display_name" require>
              <el-input v-model="classData.display_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类排序" prop="sort" require>
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
            <el-form-item label="分类icon" prop="icon" require>
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
            <el-form-item label="分类图片" prop="logo" require>
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
          <el-button @click="submitForm('classData')">确定</el-button>
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
        label: '栏目名称'
      }, {
        value: '2',
        label: '访问路径'
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
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        parent_id: [
          { type: 'array', required: true, message: '请选择上级分类', trigger: 'change' }
        ],
        logo: [
          { required: true, message: '请上传分类图片', trigger: 'change' }
        ],
        icon: [
          { required: true, message: '请上传分类ICON', trigger: 'change' }
        ],
        description: [
          { required: true, message: '分类说明50字以内', trigger: 'blur' },
          { min: 0, max: 50, message: '分类说明长度在50字以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCommand (command) {
      if (command === '批量删除') {
        this.deleteType()
      }
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
    transformDate (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.updated_at) {
          v.updated_at = this.formatDate(v.updated_at)
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
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
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
        this.classData.parent_id = []
        if (data.parent) {
          this.classData.parent_id.push(data.parent.id)
        } else {
          this.classData.parent_id.push(data.id)
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
      this.classData.active = Number(this.classData.active)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var obj = this.classData
          obj.parent_id = this.classData.parent_id
          obj.parent_id = obj.parent_id.pop()
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
      this.$confirm('是否确认删除该表单', '提示', {
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
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
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
    position: relative;
}
.GD-left{
  width: 15%;
}
.GD-right{
    width:83%;
    position: absolute;
    top: 0;
    right: 0;
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
</style>