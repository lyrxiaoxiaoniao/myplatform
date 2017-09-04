<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="16">
          <el-button type="primary" @click="openDialog('新增专题')">添加专题</el-button>
          <el-button type="primary" @click="getList">刷新</el-button>
        </el-col>
        <el-col :span="7">
          <el-input v-model="searchForm.keyword" placeholder="请输入专题名称" class="sc-table-header-select">
            <el-button slot="append" class="sc-table-search-btn" @click="onKeywordSearch" icon="search"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table 
        :data="response.data"
        border
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="display_name" label="专题名称"></el-table-column>
        <el-table-column prop="amount" label="文章数" width="120"></el-table-column>
        <el-table-column prop="sort" label="排序" width="120"></el-table-column>
        <el-table-column prop="is_recommend" label="是否推荐" width="120">
          <template scope="scope">
            <el-switch on-text="开" off-text="关" v-model="scope.row.is_recommend" @change="toggleSwicth(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template scope="scope">
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" icon="edit" @click="openDialog('修改专题',scope.row.id)" title="修改"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-button type="text" style="color: #48576a; padding:5px 0;" @click="deleteData()">删除</el-button>
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
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="top-ruleForm">
          <el-form-item label="专题名称" prop="display_name" style="margin-bottom:30px;">
            <el-input v-model="ruleForm.display_name" placeholder="简单为宜" @blur="checkSubjectName"></el-input>
          </el-form-item>
          <el-form-item label="专题排序" prop="sort">
            <el-input-number v-model="ruleForm.sort" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="是否推荐" required>
            <el-switch
              v-model="ruleForm.is_recommend"
              on-text="开"
              off-text="关">
            </el-switch>
          </el-form-item>
          <el-form-item label="专题说明" prop="description">
            <el-input type="textarea" :rows="3" v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="标题图" prop="logo">
            <el-upload
              class="avatar-uploader"
              :action="uploadURL"
              :show-file-list="false"
              :on-success="iconHandleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.logo" :src="ruleForm.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容图" prop="banners">
            <el-upload
              class="avatar-uploader"
              :action="uploadURL"
              :show-file-list="false"
              :on-success="bannersHandleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.banners.length" :src="ruleForm.banners[0]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          <!--
            <el-upload
              :action="uploadURL"
              list-type="picture-card"
              :on-success="bannersHandleAvatarSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="bannersVisible">
              <img width="100%" v-for="value in ruleForm.banners" :src="value" alt="">
            </el-dialog>
          -->
          </el-form-item>
          <el-form-item v-if="dialogTitle === '修改专题'">
            <el-row type="flex">
              <el-button size="small" @click="moveArticles">移出专题</el-button>
            </el-row>
          </el-form-item>
          <el-form-item v-if="dialogTitle === '修改专题'">
            <el-table
              :data="articleData.data"
              style="width: 100%"
              @selection-change="handleArticleSelectionChange"
              @cell-dblclick="toContentEdit(row.id)">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="created_at" label="日期" width="150"></el-table-column>
              <el-table-column prop="author" label="作者" width="100"></el-table-column>
              <el-table-column prop="title" label="标题"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="dialogTitle === '修改专题'">
            <el-row type="flex" justify="center">
              <el-pagination
                @current-change="handleArticleDataCurrentChange"
                :current-page="articleData.currentPage"
                :total="articleData.count"
                layout="total, prev, pager, next, jumper">
              </el-pagination>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" v-if="dialogTitle === '新增专题'">保存</el-button>
          <el-button type="primary" @click="editForm" v-if="dialogTitle === '修改专题'">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-subject-table',
  data () {
    var validateSubjectName = (rule, value, callback) => {
      api.GET(config.subject.checkName, {display_name: value})
        .then(response => {
          if (response.data.errcode === '60000') {
            callback(new Error('专题重名'))
          } else {
            callback()
          }
        })
    }
    return {
      selectedCatlg: '',
      caseCatlg: [],
      searchForm: {
        keyword: ''
      },
      response: {
        data: null
      },
      error: null,
      dialogType: '',
      dialogTitle: '',
      dialogFormVisible: false,
      ruleForm: {
        display_name: '',
        sort: 0,
        is_recommend: false,
        description: '',
        logo: '',
        banners: []
      },
      multipleSelection: [],
      ids: [],
      subjectId: 0, // 正在编辑的专题id
      uploadURL: config.serverURI + config.uploadFilesAPI,
      bannersVisible: false,
      articleData: [],
      multipleArticleSelection: [],
      articleIds: [],
      rules: {
        display_name: [
          { validator: validateSubjectName, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    handleSizeChange (value) {
      let data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.searchForm
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.searchForm
      }
      this.getList(data)
    },
    handleArticleDataCurrentChange (value) {
      let data = {
        currentPage: value
      }
      api.GET(config.content.list, data)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.articleData = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onKeywordSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.getList(data)
    },
    getList (data = {}) {
      api.GET(config.subject.list, data)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getDetail (id) {
      api.GET(config.subject.detail, {id})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.ruleForm = response.data.data
          switch (this.ruleForm.is_recommend) {
            case 0:
              this.ruleForm.is_recommend = false
              break
            case 1:
              this.ruleForm.is_recommend = true
              break
          }
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getArticleData (id) {
      api.GET(config.content.list, {subject_id: id})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.articleData = this.transformData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // Transform Response Data
    transformData (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        if (v.is_recommend === 0) {
          v.is_recommend = false
        }
        if (v.is_recommend === 1) {
          v.is_recommend = true
        }
        if (v.counters.length) {
          v.articleCount = v.counters[0].count
        } else {
          v.articleCount = 0
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
    deleteData (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选专题？', '错误', {
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
      this.$confirm('是否确认删除该条数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.subject.delete, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    moveArticles () {
      if (this.articleIds.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选', '错误', {
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
      this.$confirm('是否确认移出该专题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.content.removeSubject, {
          articles: this.articleIds,
          subject_id: this.subjectId
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('移出成功')
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    /*
    deleteArticles () {
      if (this.articleIds.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选专题？', '错误', {
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
      this.$confirm('是否确认删除该条数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.content.delete, {
          ids: this.articleIds
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    */
    toContentEdit (id) {
      this.$router.push({
        path: '/admin/newcms/content/edit',
        query: {
          id: id
        }
      })
    },
    // 专题列表选中记录
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    // 修改专题对话框文章列表选中记录
    handleArticleSelectionChange (val) {
      this.multipleArticleSelection = val
      this.articleIds = []
      this.multipleArticleSelection.forEach(v => {
        this.articleIds.push(v.id)
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.is_recommend = Number(this.ruleForm.is_recommend)
          this.ruleForm.active = Number(this.ruleForm.active)
          var obj = this.ruleForm
          api.POST(config.subject.add, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.onSuccess('创建成功')
                this.getList()
                this.closeDialog()
                this.ruleForm = {
                  display_name: '',
                  sort: 0,
                  is_recommend: false,
                  description: '',
                  logo: '',
                  banners: []
                }
              }
            })
        } else {
          return false
        }
      })
    },
    editForm () {
      var obj = this.ruleForm
      switch (obj.is_recommend) {
        case false:
          obj.is_recommend = 0
          break
        case true:
          obj.is_recommend = 1
          break
      }
      api.POST(config.subject.update, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.onSuccess('修改成功')
          this.getList()
          this.closeDialog()
          this.ruleForm = {
            display_name: '',
            sort: 0,
            is_recommend: false,
            description: '',
            logo: '',
            banners: []
          }
        }
      })
    },
    toggleSwicth (value) {
      switch (value.is_recommend) {
        case false:
          value.is_recommend = 0
          break
        case true:
          value.is_recommend = 1
          break
      }
      api.POST(config.subject.update, value)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success'
          })
          let data = {
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.searchForm
          }
          this.getList(data)
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
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getList(data)
    },
    openDialog (value, id) {
      this.dialogTitle = value
      this.dialogFormVisible = true
      if (value === '修改专题') {
        this.subjectId = id
        this.getDetail(id)// 获取专题详情
        this.getArticleData(id)// 获取该专题下所有文章
      }
      if (value === '新增专题') {
        this.ruleForm = {
          display_name: '',
          sort: 0,
          is_recommend: false,
          description: '',
          logo: '',
          banners: []
        }
      }
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogTitle = ''
    },
    checkSubjectName (formName) {
    },
    // 内容图上传成功
    bannersHandleAvatarSuccess (res, file) {
      this.ruleForm.banners.push(res.data[0])
      this.bannersVisible = true
    },
    // 标题图上传成功
    iconHandleAvatarSuccess(res, file) {
      this.ruleForm.logo = res.data[0]
      // this.saveImg(this.ruleForm.logo)
    },
    saveImg (url) {
      let obj = {}
      obj.urls = [].push(url)
      obj.parentId = 0
      api.POST(config.saveFilesAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('图片上传成功')
        }
      })
    }
  },
  components: {
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
  .sc-report-table {
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  .search-form {
    padding: 1rem;
  }

  .sc-report-table-header {
    margin: 1rem 2rem;
    padding-bottom: 1rem;
  }

  .sc-report-table-content {
    margin-bottom: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .top-ruleForm .el-form-item {
    margin-bottom: 10px;
  }
</style>
