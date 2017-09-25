<template>
  <div class="lh-container">
    <div class="lh-top">
      <div class="lh-form">
        <kobe-table>
            <div slot="kobe-table-header" class="kobe-table-header">
              <el-row type="flex" justify="end">
                <el-col :span="8" :offset="14">
                    <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                      <el-button slot="append" @click="onSearch" icon="search"></el-button>
                    </el-input>
                </el-col>
                <el-button type="primary" @click="openAdvanced" icon="search" style="margin-left:10px;">高级</el-button>
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
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
              <el-table-column prop="name" label="工单编号" width="140"></el-table-column>
              <el-table-column prop="name" label="工单名称" width="140"></el-table-column>
              <el-table-column prop="duty_name" label="待办内容" width="80"></el-table-column>
              <el-table-column prop="mobile" label="发起单位" width="120"></el-table-column>
              <el-table-column prop="address" label="上一级处理人"></el-table-column>
              <el-table-column prop="address" label="已停留时间"></el-table-column>
              <el-table-column width="115" label="操作">
              <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button size="small" icon="edit" title="处理"></el-button>
              </template>
              </el-table-column>
            </el-table>
            </div>
            <div slot="kobe-table-footer" class="kobe-table-footer">
                <el-row type="flex" justify="center">
                <el-col :span="8">
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
        <!-- 关联模态框 -->
        <el-dialog title="关联物业" v-model="dialogAdvance" size="tiny">
          <el-row  type="flex" justify="space-around">
            <el-date-picker
              v-model="correlateForm.begin_time"
              type="datetime"
              placeholder="选择开始时间">
            </el-date-picker>
            <el-date-picker
              v-model="correlateForm.end_time"
              type="datetime"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogAdvance = false">取 消</el-button>
              <el-button type="primary" @click="correlate">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 高级搜索模态框 -->
        <el-dialog title="高级搜索" v-model="dialogAdvance">
            <el-form :model="advancedSearch" label-width="100px">
                <el-form-item label="关键字">
                  <el-input v-model="advancedSearch.keyword" placeholder="输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="工单名称">
                  <el-input v-model="advancedSearch.display_name" placeholder="输入工单名称"></el-input>
                </el-form-item>         
                <el-form-item label="待办内容">
                  <el-input v-model="advancedSearch.name" placeholder="请输入待办内容"></el-input>
                </el-form-item>
                <el-form-item label="发起单位">
                  <el-input v-model="advancedSearch.name" placeholder="请输入发起单位"></el-input>
                </el-form-item>
                <el-form-item label="上一级处理人">
                  <el-input v-model="advancedSearch.name" placeholder="请输入上一级处理人"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogAdvance = false">取 消</el-button>
              <el-button type="primary" @click="advance">搜 索</el-button>
            </span>
        </el-dialog>
      </div>
      </div>
  </div>    
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: ['communityId'],
  data () {
    return {
      dialogAdvance: false,
      correlateForm: {
        community_id: this.communityId,
        tenement_id: '',
        begin_time: '',
        end_time: ''
      },
      form: {
        keyword: ''
      },
      response: {
        data: null
      },
      multipleSelection: [],
      ids: [],
      advancedSearch: {
        keyword: '',
        display_name: '',
        name: '',
        active: '',
        start_time: '',
        end_time: '',
        type: '',
        account_id: ''
      }
    }
  },
  methods: {
    openAdvanced () {
      this.dialogAdvance = true
    },
    advance () {
      this.advancedSearch.active = Number(this.advancedSearch.active)
      if (this.advancedSearch.start_time) {
        this.advancedSearch.start_time = this.formatDate(this.advancedSearch.start_time)
      }
      if (this.advancedSearch.end_time) {
        this.advancedSearch.end_time = this.formatDate(this.advancedSearch.end_time)
      }
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.advancedSearch
      }
      this.getList(data)
      this.dialogAdvance = false
    },
    onSearch () {
      const data = {
        id: this.communityId,
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
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
    // 转换数据
    transform (data) {
      var res = []
      data.forEach(e => {
        res.push(e.rubTenementVOS[0])
      })
      return res
    },
    handleSizeChange (value) {
      const data = {
        id: this.communityId,
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        id: this.communityId,
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = null) {
      if (data === null) {
        data = {
          id: this.communityId,
          currentPage: 1,
          pageSize: 10
        }
      }
      api.GET(config.village.uncorrelated, data)
      .then(response => {
        if (response.data.errcode === '5000') {
          this.response.data = null
          this.response.currentPage = 1
          this.response.pageSize = 10
          this.response.count = 0
        }
        this.response.data = this.transform(response.data.data.data)
        this.response.currentPage = response.data.data.currentPage
        this.response.pageSize = response.data.data.pageSize
        this.response.count = response.data.data.count
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
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
      this.$confirm('此操作将删除选定工单,删除后数据无法恢复，是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.village.delete, {
          ids: this.ids
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
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    // padding: 1rem 2rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        padding-bottom: 1rem;
        .lh-header {
            padding: 0 2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            border-bottom: 1px solid lightgray;
            div:nth-of-type(1){
                font-size: 16px;
            }
        }
    }
}
</style>