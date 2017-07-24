<template>
  <div class="sc-tutorial-category-component">
    <el-row tpye="flex">
      <el-col :span="4">
        <kobe-category-tree
          :title="'课程分类'"
          :data="categories"
          >
        </kobe-category-tree>
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
              <el-select></el-select>
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
                    expand-trigger="hover"
                    :options="categories"
                    v-model="selectedCategory"
                    >
                  </el-cascader>
                </el-form-item>
                <el-form-item label="分类名称">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-row type="flex">
                  <el-form-item label="分类排序">
                    <el-input-number></el-input-number>
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
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              v-if="response"
              border
              stripe
              :data="response.data"
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="title" label="分类名称"></el-table-column>
              <el-table-column label="图片">
                <template scope="scope">
                  <img :src="scope.row.lb_img" alt="">
                </template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template scope="scope">
                  {{ scope.row.created_at | toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="顺序"></el-table-column>
              <el-table-column label="启用">
                <template scope="scope">
                  <el-switch></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="操作"
                >
                <template scope="scope">
                  <el-button size="small" icon="delete2"></el-button>
                  <el-button size="small" icon="edit"></el-button>
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
      uploadAction: '',
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
        sort: '',
        status: true,
        lb_img: ''
      },
      categories: [],
      selectedCategory: []
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    onAddCategory () {
      this.addForm.p_id = this.selectedCategory.shift()
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
          this.getCategoryList()
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
    onRefresh () {
      this.getCategoryList()
    },
    handleSizeChange () {
    },
    handleCurrentChange () {
    },
    transformData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    getCategoryList (data = null) {
      api.GET(config.tutorial.category, {
        catgr_id: this.categoryID,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          this.categories = this.transformData(this.response)
          this.categories.unshift({label: '根级分类', value: 0})
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
</style>
