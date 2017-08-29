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
              <el-button @click="openDialog" type="primary">添加栏目</el-button>
              <!-- <el-button type="primary">权限分配</el-button> -->
              <!-- <el-button type="primary">更多操作</el-button> -->
              <el-button @click="reFresh" type="primary">刷新</el-button>
            </el-col>
            <!-- <el-select v-model="form.value" placeholder="所有信息" style="width:140px;">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
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
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="display_name" label="栏目名称"></el-table-column>
            <el-table-column prop="url" label="访问路径"></el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="130">
              <template scope="scope">
                {{scope.row.created_at | toDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
            <el-table-column label="显示" width="100">
              <template scope="scope">
                <el-switch
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
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :title="dialogTitle" v-model="showDialog" size="small">
      <el-form :model="classData" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级栏目">
              <el-cascader
                :options="options"
                change-on-select
                :props="props"
                v-model="classData.cids"
                @change="handleChange"
                style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="栏目名称">
              <el-input v-model="classData.display_name" placeholder="请输入栏目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="访问路径">
              <el-input v-model="classData.url" placeholder="例如：/admin/newcms/index"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排列顺序">
              <el-input-number v-model="classData.sort"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否显示">
              <el-switch
                v-model="classData.active"
                on-text="开"
                off-text="关">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类说明">
              <el-input type="textarea" v-model="classData.description" placeholder="请输入分类说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容图">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccessBanner"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="classData.banner" :src="classData.banner" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题图">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="classData.icon" :src="classData.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否审核">
              <el-switch
                v-model="classData.is_audit"
                on-text="开"
                off-text="关">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评论">
              <el-radio-group v-model="classData.is_comment">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顶踩">
              <el-radio-group v-model="classData.is_upvote">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Meta关键字">
              <el-input v-model="classData.meta_key" placeholder="请输入Meta关键字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Meta标题">
              <el-input v-model="classData.meta_title" placeholder="请输入Meta标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Meta描述">
              <el-input type="textarea" v-model="classData.meta_desc" placeholder="请输入Meta描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button @click="addColumn" type="primary">确定</el-button>
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
      data: [],
      defaultProps: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      multipleSelection: [],
      option: [{
        value: '1',
        label: '所有信息'
      }, {
        value: '2',
        label: '栏目名称'
      }, {
        value: '3',
        label: '访问路径'
      }],
      options: [],
      response: {
        data: null
      },
      classData: {
        cids: [],
        parent_id: null,
        display_name: '',
        active: null,
        sort: null,
        url: '',
        description: '',
        banner: '',
        icon: '',
        is_audit: null,
        is_comment: null,
        is_upvote: null,
        meta_key: '',
        meta_title: '',
        meta_desc: ''
      },
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
      parent_id: 0
    }
  },
  methods: {
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 树形结构选择
    handleChange (val) {
      // console.log(val)
      this.classData.cids = val
      this.classData.parent_id = JSON.parse(JSON.stringify(val)).pop()
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parent_id = data.id
      this.getList({parent_id: this.parent_id})
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
      console.log(this.multipleSelection)
    },
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      // console.log(res, file)
      this.classData.icon = res.data[0]
    },
    handleAvatarSuccessBanner (res, file) {
      // console.log(res, file)
      this.classData.banner = res.data[0]
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    // 模态框显示
    openDialog (e, data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.dialogTitle = '修改栏目'
        this.classData = {
          ...this.classData,
          ...data
        }
        this.classData.cids = this.classData.cids.split(',')
        let ids = []
        this.classData.cids.forEach(v => {
          ids.push(Number(v))
        })
        this.classData.cids = ids
        console.log(this.classData, '111')
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '新增栏目'
        Object.keys(this.classData).forEach(key => {
          this.classData[key] = null
        })
        this.classData.cids = []
      }
      this.showDialog = true
    },
    /* 新增栏目 */
    addColumn () {
      let URL = ''
      let obj = {
        ...this.classData
      }
      obj.cids = obj.cids.join(',')
      obj.active = Number(obj.active)
      obj.is_audit = Number(obj.is_audit)
      obj.banners = obj.banner.split(',')
      // console.log(obj)
      if (this.dialogType === 'edit') {
        URL = config.newcms.editNcmsCategotyAPI
      } else {
        URL = config.newcms.addNcmsCategotyAPI
      }
      api.POST(URL, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess(this.dialogTitle + '成功！')
          this.showDialog = false
          this.getList()
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
    },
    // 删除表单
    deleteType (id) {
      this.$confirm('此操作将删除该栏目，栏目删除后，数据将无法恢复。如栏目下属有子栏目，或者文章，将无法被删除。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.newcms.removeNcmsCategotyAPI, {
          id: id
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
    /* 切换状态 */
    toswitch (active, id) {
      api.POST(config.newcms.activeNcmsCategotyAPI, {id: id, active: Number(active)})
      .then(response => {
        this.getList()
        this.onSuccess('状态操作成功！')
      })
      .catch(error => {
        this.$message.error(error)
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
    changeActive (res) {
      res.data.forEach(v => {
        if (v.active) {
          v.active = Boolean(v.active)
        }
        if (v.is_audit) {
          v.is_audit = Boolean(v.is_audit)
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.newcms.ncmsCategotyListAPI, data)
      .then(response => {
        this.response = this.changeActive(response.data.data)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    reFresh () {
      this.getList()
      this.getTree()
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
      api.GET(config.newcms.ncmsCategotyAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.data = newData
        this.options = newData
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
    this.reFresh()
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
</style>

