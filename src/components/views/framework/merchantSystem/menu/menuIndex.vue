<template>
  <div class="GD-container">
    <el-row tpye="flex">
      <el-col :span="4">
      <el-tree :data="data" :props="defaultProps"
              accordion
              :highlight-current="true"
              :default-expanded-keys="[0]"
              node-key="id"
              @node-click="handleNodeClick">
      </el-tree>
   </el-col>
    <el-col :span="20">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="14">
              <el-button @click="getList()" type="primary">刷新</el-button>
            </el-col>
            <el-col :span="8">
              <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
              </el-input>
            </el-col>
            <el-button type="primary" @click="openAdvance" icon="search" style="margin-left:10px;">高级</el-button>
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
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="display_name" label="菜单名称"></el-table-column>
            <el-table-column prop="name" label="菜单标识"></el-table-column>
            <el-table-column prop="icon" label="图标" width="160">
              <template scope="scope">
                <el-row class="clearfix" style="vertical-align: middle;">
                  <el-col :span="4" class="float-l"><i :class="scope.row.icon" class="margin-r"></i></el-col>
                  <el-col :span="18" class="float-r">{{scope.row.icon}}</el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="同级排序" width="88"></el-table-column> 
            <el-table-column label="有效状态" width="90">
              <template scope="scope">
                <div v-if="scope.row.active">有效</div>
                <div v-if="!scope.row.active" class="text-red">无效</div>
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
    <!-- 高级搜索模态框 -->
    <el-dialog title="高级搜索" v-model="dialogAdvance">
        <el-form :model="advancedSearch" :label-width="formLabelWidth">
         <el-form-item label="关键字">
            <el-input v-model="advancedSearch.keyword" placeholder="输入关键字"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="advancedSearch.display_name" placeholder="输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单标识">
            <el-input v-model="advancedSearch.name" placeholder="输入菜单标识"></el-input>
          </el-form-item>               
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
    <!-- 菜单关联权限弹框 -->
      <el-dialog v-if="reload" title="菜单关联权限" v-model="correlateShow">
        <el-form :model="permissionForm" :label-width="formLabelWidth">
           <el-form-item label="菜单名称">
              <el-input v-model="permissionForm.display_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单标识">
              <el-input v-model="permissionForm.name" auto-complete="off"></el-input>
            </el-form-item>           
        </el-form>
        <el-tabs class="margin" v-model="activeName"  @tab-click="handleClick" style="margin:0 2em">
          <el-tab-pane label="已关联权限" name="first">
            <rel-tab v-if='firstId' :menuId="permissionForm.id"></rel-tab>
          </el-tab-pane>
          <el-tab-pane label="待关联权限" name="second">
            <norel-tab v-if='secondId' :menuId="permissionForm.id"></norel-tab>
          </el-tab-pane>  
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="correlateShow = false">取 消</el-button>
            <el-button type="primary" @click="correlateShow = false">确定</el-button>
          </el-row>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import relTab from './reltable/rel-perssion'
import norelTab from './reltable/noRel-perssion'
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('菜单标识不能为空'))
      } else {
        api.GET(config.frameWorkMenu.check, {name: value})
        .then(response => {
          if (response.data.errcode === '60000') {
            return callback(new Error('有重名，请重新输入！'))
          } else {
            callback()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      }
    }
    return {
      activeName: 'first',
      formLabelWidth: '80px',
      advancedSearch: {
        keyword: '',
        display_name: '',
        name: '',
        start_time: '',
        end_time: ''
      },
      dialogAdvance: false,
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
      multipleSelection: [],
      response: {
        data: null
      },
      classData: {
        parent_id: [],
        display_name: '',
        sort: null,
        active: 1,
        name: '',
        memo: '',
        url: '',
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
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '分类说明50字以内', trigger: 'blur' },
          { min: 0, max: 50, message: '分类说明长度在50字以内', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    reload: function () {
      if (this.correlateShow) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    relTab,
    norelTab
  },
  methods: {
    openAdvance () {
      this.dialogAdvance = true
    },
    // 高级搜索
    advance () {
      if (this.advancedSearch.start_time) {
        this.advancedSearch.start_time = this.formatDate(this.advancedSearch.start_time)
      }
      if (this.advancedSearch.end_time) {
        this.advancedSearch.end_time = this.formatDate(this.advancedSearch.end_time)
      }
      console.log(this.advancedSearch, 1111)
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      this.getList(data)
      this.dialogAdvance = false
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
      api.GET(config.frameWorkMenu.showLeft)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        var boot = [{
          id: 0,
          display_name: '根级分类',
          label: '根级分类',
          value: 0,
          children: [...newData]
        }]
        this.data = boot
        this.cascaderData = boot
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList (data = {}) {
      api.GET(config.frameWorkMenu.index, data)
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
.text-red {
  color: red;
}
.line{
  text-align: center;
}
.clearfix {
  *zoom:1;
}
.float-l {
  float: left;
}
.float-r {
  float:right;
}
.margin-r {
  margin-top: 80%;
  margin-right: 22px;
}
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