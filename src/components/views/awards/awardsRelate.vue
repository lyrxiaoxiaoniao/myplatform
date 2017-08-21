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
              <el-button @click="relateDialog" type="primary">关联规格</el-button>
              <el-button @click="getList" type="primary">刷新</el-button>
              <el-dropdown @command="handleCommand" style="margin-left:10px;">
                <el-button type="primary">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="批量删除">批量删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
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
            <el-table-column prop="title" label="关联规格"></el-table-column>
            <el-table-column prop="value_type" label="规格类型"></el-table-column>
            <el-table-column prop="created_at" label="创建时间">
              <template scope="scope">
                {{scope.row.created_at | toDateTime}}
              </template>
            </el-table-column>
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
                <!-- <el-button size="small" icon="edit"></el-button> -->
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
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
    <el-dialog title="关联分类规格" v-model="dialogVisible">
      <div class="kobe-table-component" style="margin-top: -30px;">
        <div solt="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="7">
              <el-input v-model="keyword" placeholder="请输入">
                <el-button slot="append" icon="search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>

        <div solt="kobe-table-content" class="kobe-table">
          <el-table
            :data="tableData.data"
            border
            stripe
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="关联规格"></el-table-column>
            <el-table-column prop="value_type" label="规格类型"></el-table-column>
            <el-table-column prop="created_at" label="创建时间">
              <template scope="scope">
                {{scope.row.created_at | toDateTime}}
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div solt="kobe-table-footer" class="kobe-table-footer">
          <el-row type="flex" justify="end">
            <el-button @click="relateNow" type="primary">关联</el-button>
            <el-button>取消</el-button>
          </el-row>
        </div>
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
      multipleSelection: [],
      response: {
        data: null
      },
      tableData: {
        data: null
      },
      dialogVisible: false,
      form: {
        keyword: ''
      },
      keyword: '',
      parentId: null,
      category_id: 0,
      ids: []
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
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    relateDialog () {
      this.dialogVisible = true
      this.getNotList({
        category_id: this.category_id
      })
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
    toswitch (active, id) {
      api.POST(config.activeCategoryAPI, {id: id, active: Number(active)})
      .then(response => {
        this.getList()
        this.onSuccess('操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.category_id = data.id
      this.getList({category_id: this.category_id})
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
        api.POST(config.removeAawardsProperty, {
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
    relateNow () {
      let categories = []
      categories.push(this.category_id)
      this.relateData({
        categories: categories,
        properties: this.ids
      })
    },
    // 关联规格
    relateData (data) {
      api.POST(config.relateAwards, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('关联成功')
          this.dialogVisible = false
        }
      })
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
      api.GET(config.relateAwardsList, data)
      .then(response => {
        this.response = this.transformDate(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getNotList (data = {}) {
      let obj = {
        currentPage: 1,
        pageSize: 100,
        ...data
      }
      api.GET(config.norelateAwardsList, obj)
      .then(response => {
        this.tableData = this.transformDate(response.data.data)
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