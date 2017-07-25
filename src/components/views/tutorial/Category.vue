<template>
  <div class="sc-tutorial-category-component">
    <el-row tpye="flex">
      <el-col :span="4">
        <el-tree
          :data="categories"
          @node-click="onClickNode"
          >
        </el-tree>
      </el-col>
      <el-col :span="20">
        <kobe-table>
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex">
              <el-col :span="12">
                <el-button @click="showAddDialog" type="primary">添加子分类</el-button>
                <el-button type="primary">修改属性</el-button>
                <el-button type="primary">更多操作</el-button>
                <el-button @click="onRefresh" type="primary">刷新</el-button>
              </el-col>
              <el-select v-model="selectedKeyword" clearable>
                <el-option
                  v-for="item in searchOptions"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
              <el-col :span="8">
                <el-input>
                  <el-button slot="append" icon="search"></el-button>
                </el-input>
              </el-col>
            </el-row>
            <el-dialog title="新增分类" v-model="addDialogVisiable">
              <el-form :model="addForm" label-width="120px" :rules="rules">
                <el-form-item label="上级分类">
                  <el-cascader
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
            <el-dialog title="查看/修改分类" v-model="EditDialogVisiable">
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
                  <img class="user-img-avatar" :src="scope.row.lb_img" alt="">
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
                  <el-switch v-model="scope.row.status" @change="toggleSwicth(scope.row)"></el-switch>
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
      EditDialogVisiable: false,
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
      },
      selectedNode: 0,
      categories: null,
      selectedKeyword: '',
      searchOptions: [{
        value: 'keyword',
        label: '所有信息'
      }, {
        value: 'name',
        label: '栏目名称'
      }],
      editedCategory: [],
      selectedCategory: []
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.errcode === '0000') {
        this.addForm.lb_img = res.data[0]
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
    },
    handleCatlgChange (value) {
    },
    onDelete (id) {
      this.$confirm('此操作将删除选定分类。如分类下属有子栏目，或者具体课程，将无法删除。是否继续删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.categoryDelete, {
          ids: [id]
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.getCategoryList(data)
          }
        })
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onClickNode (node) {
      const data = {
        p_id: node.value
      }
      this.getCategoryList(data, true)
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
      this.addForm.status = this.addForm.status ? 1 : 0
      api.POST(config.tutorial.categoryAdd, this.addForm)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success'
          })
          this.addForm = {
            catgr_id: 14,
            p_id: '',
            name: '',
            brief: '',
            sort: '',
            status: true,
            lb_img: ''
          }
          this.getCategoryList()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onUpdateCategory () {
      console.log(this.editForm)
    },
    toggleSwicth (value) {
      api.POST(config.tutorial.categoryUpdate, {
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
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    showAddDialog () {
      this.addDialogVisiable = true
    },
    closeAddDialog () {
      this.addDialogVisiable = false
    },
    closeEditDialog () {
      this.EditDialogVisiable = false
    },
    showEditDialog (value) {
      this.editForm = {
        catgr_id: 14,
        p_id: value.p_id,
        name: value.name,
        brief: value.brief,
        sort: value.sort,
        status: value.status === 1 || value.status === true,
        lb_img: value.lb_img
      }
      this.EditDialogVisiable = true
    },
    onRefresh () {
      this.getCategoryList()
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
        item.status = !!item.status
      })
      return data
    },
    getCategoryList (data = null, isRefresh) {
      api.GET(config.tutorial.category, {
        catgr_id: this.categoryID,
        p_id: 0,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformListData(response.data.data)
          if (isRefresh) {
            return
          }
          const data = this.transformTreeData(this.response.data)
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
