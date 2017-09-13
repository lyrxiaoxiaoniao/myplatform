<template>
    <div class="lh-container">
    <div class="lh-top">
        <div class="lh-form">
            <kobe-table>
                <div slot="kobe-table-header" class="kobe-table-header">
                  <el-row type="flex" justify="end">
                    <el-col :span="10" :offset="14">
                        <el-input v-model="form.keyword" placeholder="请输入小区名称">
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
                    <!-- <el-table-column type="selection" width="40"></el-table-column> -->
                    <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
                    <el-table-column prop="name" label="物业名称" width="140"></el-table-column>
                    <el-table-column prop="duty_name" label="联系人" width="80"></el-table-column>
                    <el-table-column prop="mobile" label="联系电话" width="120"></el-table-column>
                    <el-table-column prop="address" label="公司地址"></el-table-column>
                    <el-table-column width="140" label="操作">
                    <template scope="scope">
                        <el-button size="small" icon="edit" title="修改"></el-button>
                        <el-button size="small" @click="openDialog(scope.row.id)" title="关联">关联</el-button>
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
              <el-row>
              <el-col :span="12">
                <el-date-picker
                  v-model="correlateForm.begin_time"
                  type="datetime"
                  placeholder="选择开始时间">
                </el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="correlateForm.end_time"
                  type="datetime"
                  placeholder="选择结束时间">
                </el-date-picker>
              </el-col> 
              </el-row>
              <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogAdvance = false">取 消</el-button>
                  <el-button type="primary" @click="correlate">确 定</el-button>
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
      ids: []
    }
  },
  methods: {
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    openDialog (id) {
      this.dialogAdvance = true
      this.correlateForm.tenement_id = id
    },
    correlate () {
      this.dialogAdvance = false
      api.POST(config.village.addcorrelate, this.correlateForm)
      .then(response => {
        this.onSuccess('关联成功！')
        this.getList()
        this.$emit('correlateEvent', this.response.count)
      })
      .catch(error => {
        this.$message.error(error)
      })
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
        e.rubTenementVOS[0].id = e.id
        res.push(e.rubTenementVOS[0])
      })
      return res
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
        this.response.data = this.transform(response.data.data.data)
        this.response.currentPage = response.data.data.currentPage
        this.response.pageSize = response.data.data.pageSize
        this.response.count = response.data.data.count
        if (response.data.errcode === '5000') {
          this.response.data = null
        }
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
      this.$confirm('此操作将解除关联该物业,是否继续解除？', '解除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.village.delete, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('解除成功')
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