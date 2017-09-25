<template>
    <div class="lh-container">
    <div class="lh-top">
        <div class="lh-form">
            <kobe-table>
                <div slot="kobe-table-header" class="kobe-table-header">
                  <el-row type="flex" justify="end">
                    <el-col :span="14">
                    </el-col>
                    <el-select v-model="form.audit_state" placeholder="所有信息" style="width:140px;">
                      <el-option
                        v-for="item in option"
                        :key="item.audit_state"
                        :label="item.label"
                        :value="item.audit_state">
                      </el-option>
                    </el-select>
                    <el-col :span="8">
                        <el-input v-model="form.keyword" placeholder="请输入关键字">
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
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
                    <el-table-column prop="name" label="工单编号" width="140"></el-table-column>
                    <el-table-column prop="name" label="工单名称" width="140"></el-table-column>
                    <el-table-column prop="duty_name" label="已办内容" width="80"></el-table-column>
                    <el-table-column prop="mobile" label="处理单位" width="120"></el-table-column>
                    <el-table-column prop="address" label="处理状态"></el-table-column>
                    <el-table-column width="115" label="操作">
                    <template scope="scope">
                        <el-button size="small" icon="edit" title="修改"></el-button>
                        <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
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
      option: [{
        audit_state: null,
        label: '所有信息'
      }, {
        audit_state: '1',
        label: '已指派'
      }, {
        audit_state: '0',
        label: '已退单'
      }],
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
        id: this.communityId,
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
        const data = {
          id: this.communityId,
          currentPage: 1,
          pageSize: this.response.pageSize,
          ...this.form
        }
        this.getList(data)
        this.$emit('correlateEvent')
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