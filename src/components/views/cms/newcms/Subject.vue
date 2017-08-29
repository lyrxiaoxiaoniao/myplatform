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
        <el-table-column prop="reportName" label="文章数" width="120"></el-table-column>
        <el-table-column prop="sort" label="排序" width="120"></el-table-column>
        <el-table-column label="是否推荐" width="120">
          <template scope="scope">
            <el-switch on-text="开" off-text="关" v-model="scope.row.is_recommend" @change="toggleSwicth(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template scope="scope">
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" icon="edit" @click="openDialog('修改专题')" title="修改"></el-button>
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
          <el-form-item label="专题名称" prop="spacename">
            <el-input v-model="ruleForm.spacename" placeholder="简单为宜"></el-input>
          </el-form-item>
          <el-form-item label="专题排序" prop="spacename">
            <el-input-number v-model="ruleForm.spacename" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="是否推荐" required>
            <el-switch
              v-model="ruleForm.state"
              on-text="开"
              off-text="关">
            </el-switch>
          </el-form-item>
          <el-form-item label="专题说明" prop="spacename">
            <el-input type="textarea" :rows="3" v-model="ruleForm.spacename"></el-input>
          </el-form-item>
          <el-form-item label="标题图" prop="spacename">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容图" prop="spacename">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="dialogVisible">
              <img width="100%" v-for="value in contentImageUrls" :src="value" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item prop="spacename" v-if="isEdit">
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
          </el-form-item>
          <el-form-item prop="spacename" v-if="isEdit">
            <el-table :data="response.data" style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="日期" width="100"></el-table-column>
              <el-table-column prop="acceptNo" label="作者" width="100"></el-table-column>
              <el-table-column prop="reportName" label="标题"></el-table-column>
            </el-table>
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
    return {
      selectedCatlg: '',
      caseCatlg: [],
      searchForm: {
        keyword: ''
      },
      response: null,
      error: null,
      dialogType: '',
      dialogTitle: '',
      dialogFormVisible: false,
      ruleForm: {
        description: '',
        slug: '',
        spacename: '',
        typename: null,
        value: '',
        tagList: [],
        state: true
      },
      multipleSelection: [],
      dynamicTags: [],
      titleImageUrl: '',
      contentImageUrls: [],
      ids: []
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
    // Transform Response Data
    transformData (res) {
      res.data.forEach(v => {
        if (v.created_at) {
          v.created_at = this.formatDate(v.created_at)
        }
        /*
        if (v.status === 0) {
          v.status = '未审核'
        }
        if (v.status === 1) {
          v.status = '审核通过'
        }
        if (v.status === 2) {
          v.status = '审核不通过'
        }
        if (v.status === 3) {
          v.status = '申请认证中'
        }
        if (v.status === 4) {
          v.status = '认证通过'
        }
        if (v.status === 5) {
          v.status = '认证驳回'
        }
      */
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
        api.POST(config.deleteTeamAPI, {
          id: id
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
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
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
                this.closeDialog()
              }
            })
        } else {
          return false
        }
      })
    },
    editForm () {
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
          this.closeDialog()
        }
      })
    },
    toggleSwicth (value) {
      api.POST(config.report.toggleActive, {
        active: value.active ? 1 : 0,
        id: value.id
      })
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
          this.updateCase(data)
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
    openDialog (value) {
      this.dialogTitle = value
      this.dialogFormVisible = true
    },
    closeDialog () {
      this.dialogFormVisible = false
      this.dialogTitle = ''
    },
    handlePictureCardPreview (file) {
      this.contentImageUrls = file.url
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
