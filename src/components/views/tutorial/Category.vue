<template>
  <div class="sc-tutorial-category-component">
    <el-row tpye="flex">
      <el-col :span="4">
        <el-tree
          :default-expanded-keys="['0']"
          node-key="value"
          highlight-current
          :data="categories"
          @node-click="onClickNode"
          >
        </el-tree>
      </el-col>
      <el-col :span="20">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="space-between">
              <el-col :span="12">
                <el-button @click="showAddDialog" type="primary">添加子分类</el-button>
                <el-dropdown @command="handleDropDown">
                  <el-button type="primary">
                    批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                    <el-dropdown-item command="move">移动</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button @click="onRefresh" type="primary">刷新</el-button>
              </el-col>
              <el-col :span="8">
                <el-input v-model="searchForm.name" placeholder="请输入分类名称">
                  <el-button slot="append" icon="search"  @keyup.enter="onSearch" @click="onSearch"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-dialog title="新增分类" v-model="addDialogVisiable">
              <el-form :model="addForm" label-width="120px" :rules="rules">
                <el-form-item label="上级分类">
                  <el-cascader 
                    style="width:100%;"
                    clearable
                    change-on-select
                    expand-trigger="hover"
                    :options="categories"
                    @change="handleCatlgChange"
                    v-model="selectedCategory"
                    >
                  </el-cascader>
                </el-form-item>
                <el-form-item label="分类名称">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-row type="flex">
                  <el-form-item label="分类排序">
                    <el-input-number v-model="addForm.sort"></el-input-number>
                  </el-form-item>
                  <el-form-item label="是否启用">
                    <el-switch v-model="addForm.status"></el-switch>
                  </el-form-item>
                </el-row>
                <el-form-item label="分类说明">
                  <el-input type="textarea" v-model="addForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="分类图片">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadAction"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeAddDialog">取消</el-button>   
                <el-button @click="onAddCategory" type="primary">确定</el-button>   
              </div>
            </el-dialog>
            <el-dialog title="查看/修改分类" v-model="editDialogVisiable">
              <el-form :model="editForm" label-width="120px">
                <el-form-item label="上级分类">
                  <el-cascader
                    clearable
                    change-on-select
                    expand-trigger="hover"
                    :options="categories"
                    v-model="editedCategory"
                    >
                  </el-cascader>
                </el-form-item>
                <el-form-item label="分类名称">
                  <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-row type="flex">
                  <el-form-item label="分类排序">
                    <el-input-number v-model="editForm.sort"></el-input-number>
                  </el-form-item>
                  <el-form-item label="是否启用">
                    <el-switch v-model="editForm.status"></el-switch>
                  </el-form-item>
                </el-row>
                <el-form-item label="分类说明">
                  <el-input type="textarea" v-model="editForm.brief"></el-input>
                </el-form-item>
                <el-form-item label="分类图片">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadAction"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="editForm.lb_img" :src="editForm.lb_img" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeEditDialog">取消</el-button>   
                <el-button @click="onUpdateCategory" type="primary">确定</el-button>   
              </div>
            </el-dialog>
            <el-dialog title="移动分类" v-model="moveDialogVisiable">
              <el-form :model="moveForm" label-width="120px">
                <el-form-item label="移动到">
                  <el-cascader
                    style="width:100%;"
                    clearable
                    change-on-select
                    expand-trigger="hover"
                    :options="categories"
                    v-model="moveCategory"
                    >
                  </el-cascader>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="closeMoveDialog">取消</el-button>   
                <el-button @click="onMoveCategory" type="primary">确定</el-button>   
              </div>
            </el-dialog>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              v-if="response"
              border
              stripe
              :data="response.data"
              @selection-change="handleSelectionChange"
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="name" label="分类名称"></el-table-column>
              <el-table-column label="图片">
                <template scope="scope">
                  <img class="user-img-avatar" :src="scope.row.lb_img" @click="bigImg(scope.row.lb_img)" alt="">
                  <el-dialog v-model="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="150">
                <template scope="scope">
                  {{ scope.row.create_at | toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
              <el-table-column label="启用" width="120">
                <template scope="scope">
                  <el-switch v-model="scope.row.status" @change="toggleSwicth(scope.row)" on-text="开" off-text="关"></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                width="120"
                label="操作"
                >
                <template scope="scope">
                  <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
                  <el-button @click="showEditDialog(scope.row)" size="small" icon="edit"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-pagination
                  v-if="response"
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
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-category',
  data () {
    return {
      categoryID: 14,
      error: null,
      response: null,
      addDialogVisiable: false,
      editDialogVisiable: false,
      moveDialogVisiable: false,
      uploadAction: config.serverURI + config.uploadFilesAPI,
      imageUrl: '',
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        brief: [{ required: true, message: '请输入分类说明', trigger: 'blur' }]
      },
      addForm: {
        catgr_id: 14,
        p_id: '',
        name: '',
        brief: '',
        sort: 0,
        status: true,
        lb_img: ''
      },
      editForm: {
        catgr_id: 14,
        p_id: '',
        name: '',
        brief: '',
        sort: '',
        status: true,
        lb_img: ''
      },
      searchForm: {
        catgr_id: 14,
        name: ''
      },
      moveForm: {
      },
      selectedNode: 0,
      categories: null,
      tableSelection: [],
      moveCategory: [],
      editedCategory: [],
      selectedCategory: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    bigImg (url) {
      console.log(url)
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    handleDropDown (val) {
      if (!this.tableSelection.length) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      let ids = []
      this.tableSelection.forEach(item => {
        ids.push(item.id)
      })
      if (val === 'delete') {
        this.onDelete(ids)
      } else if (val === 'move') {
        this.moveDialogVisiable = true
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.errcode === '0000') {
        this.addForm.lb_img = res.data[0]
        this.editForm.lb_img = res.data[0]
        this.imageUrl = res.data[0]
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleSelectionChange (val) {
      this.tableSelection = val
    },
    handleCatlgChange (value) {
    },
    onDelete (ids) {
      let data = ids.length ? {ids: [...ids]} : {ids: [ids]}

      this.$confirm('此操作将删除选定分类。如分类下属有子栏目，或者具体课程，将无法删除。是否继续删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.categoryDelete, data)
        .then(response => {
          if (response.data.errcode === '0000') {
            // this.$message({
            //   type: 'success',
            //   message: '删除成功'
            // })
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.getCategoryList(data)
            this.getTreeList()
          } else {
            this.$message.error(response.data.errmsg)
          }
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    onClickNode (node) {
      this.selectedNode = node.value
      const data = {
        p_id: node.value
      }
      this.getCategoryList(data, true)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        p_id: this.selectedNode,
        ...this.searchForm
      }
      this.getCategoryList(data, true)
    },
    closeMoveDialog () {
      this.moveDialogVisiable = false
    },
    onMoveCategory () {
      if (!this.moveCategory.length) {
        this.$message.error('请选择移动的分类')
        return
      }
      if (this.moveCategory.length === 3) {
        this.$message({
          message: '最多只能添加二级分类',
          type: 'info'
        })
        return
      }
      const id = Number(this.moveCategory[this.moveCategory.length - 1])
      let ids = []
      this.tableSelection.forEach(item => {
        ids.push(item.id)
      })
      api.POST(config.tutorial.categoryMove, {
        ids: ids,
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '移动成功',
            type: 'success'
          })
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize,
            p_id: 0,
            ...this.searchForm
          }
          this.getCategoryList(data)
          this.getTreeList()
        }
      })
      this.moveDialogVisiable = false
    },
    onAddCategory () {
      if (this.selectedCategory.length === 3) {
        this.$message({
          message: '最多只能添加二级分类',
          type: 'warning'
        })
        return
      }
      this.addForm.p_id = this.selectedCategory.pop()
      this.addDialogVisiable = false
      const status = this.addForm.status ? 1 : 0
      api.POST(config.tutorial.categoryAdd, {
        ...this.addForm,
        status: status
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })
          // this.addForm = {
          //   catgr_id: 14,
          //   p_id: '',
          //   name: '',
          //   brief: '',
          //   sort: '',
          //   status: true,
          //   lb_img: ''
          // }
          const data = {
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.searchForm
          }
          this.getCategoryList(data)
          this.getTreeList()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onUpdateCategory () {
      const data = {
        ...this.editForm,
        status: this.editForm.status ? 1 : 0
      }
      this.editDialogVisiable = false
      api.POST(config.tutorial.categoryUpdate, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize,
            p_id: this.selectedNode,
            ...this.searchForm
          }
          this.getCategoryList(data, true)
          this.getTreeList()
        } else {
          this.$message.error(response.data.errmsg)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    toggleSwicth (value) {
      api.POST(config.tutorial.categoryActiveUpdate, {
        id: value.id,
        status: value.status ? 1 : 0
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          const data = {
            currentPage: this.response.currentPage,
            pageSize: this.response.pageSize,
            p_id: this.selectedNode,
            ...this.searchForm
          }
          this.getCategoryList(data, true)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    showAddDialog () {
      this.addDialogVisiable = true
      this.imageUrl = ''
      this.addForm = {
        catgr_id: 14,
        p_id: '',
        name: '',
        brief: '',
        sort: '',
        status: true,
        lb_img: ''
      }
    },
    closeAddDialog () {
      this.addDialogVisiable = false
    },
    closeEditDialog () {
      this.editDialogVisiable = false
    },
    showEditDialog (value) {
      this.editForm = {
        id: value.id,
        catgr_id: 14,
        p_id: value.p_id,
        name: value.name ? value.name : '',
        brief: value.brief ? value.brief : '',
        sort: value.sort ? value.sort : 0,
        status: value.status === 1 || value.status === true,
        lb_img: value.lb_img ? value.lb_img : ''
      }
      this.editedCategory = [value.p_id.toString(), value.id.toString()]
      if (value.p_id !== 0) this.editedCategory.unshift('0')
      this.editDialogVisiable = true
    },
    onRefresh () {
      this.getCategoryList()
      this.getTreeList()
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.searchForm
      }
      this.getCategoryList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.getCategoryList(data)
    },
    transformTreeData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id.toString()
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformTreeData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    transformListData (data) {
      data.data.forEach(item => {
        item.status = (item.status === 1 || item.status === '1')
      })
      return data
    },
    getCategoryList (data = null, isRefresh) {
      api.GET(config.tutorial.category, {
        catgr_id: this.categoryID,
        p_id: 0,
        // id: 0,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformListData(response.data.data)
          // this.response = response.data.data
          if (isRefresh) {
            return
          }
          // const data = this.transformTreeData(this.response.data)
          // const root = [{
          //   value: '0',
          //   label: '根级分类',
          //   children: data
          // }]
          // this.categories = [...root]
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getTreeList () {
      api.GET(config.tutorial.categoryTree, {
        catgr_id: this.categoryID,
        p_id: 0
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          const data = this.transformTreeData(response.data.data)
          const root = [{
            value: '0',
            label: '根级分类',
            children: data
          }]
          this.categories = [...root]
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getTreeList()
    this.getCategoryList()
  }
}
</script>

<style>
.sc-tutorial-category-component .el-tree {
  margin-top: 1rem;
  margin-left: 1rem;
}
</style>
