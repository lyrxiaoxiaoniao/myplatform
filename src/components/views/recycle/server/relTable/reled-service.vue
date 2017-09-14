<template>
    <div class="lh-container">
    <div class="lh-top">
        <div class="lh-form">
            <kobe-table>
                <div slot="kobe-table-header" class="kobe-table-header">
                 <!--  <el-row type="flex" justify="end">
                    <el-col :span="10" :offset="14">
                        <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                        <el-button slot="append" @click="onSearch" icon="search"></el-button>
                        </el-input>
                    </el-col>
                      <el-button icon="upload2" type="primary" style="margin-left:10px;"></el-button>
                      <el-button icon="setting" type="primary"></el-button>
                  </el-row>  -->         
                </div>
                <div slot="kobe-table-content" class="kobe-table">
                <el-table
                    ref="multipleTable"
                    border
                    stripe
                    :data="response.data"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column prop="id" label="ID" sortable width="120"></el-table-column>
                    <el-table-column prop="name" label="小区名称" width="170"></el-table-column>
                    <el-table-column prop="duty_name" label="负责人" width="150"></el-table-column>
                    <el-table-column prop="mobile" label="联系电话" width="150"></el-table-column>
                    <el-table-column label="服务时间" width="150">
                      <template scope="scope">
                        {{scope.row.begin_time | toYM}} - {{scope.row.end_time | toYM}}
                      </template>
                    </el-table-column>
                    <el-table-column prop="detail_address" label="所属街道" width="150"></el-table-column>
                    <el-table-column prop="detail_address" label="详细地址"></el-table-column>
                    <el-table-column width="160" label="操作">
                    <template scope="scope">
                        <el-button size="small" icon="edit" title="修改"></el-button>
                        <el-button size="small" @click="remove(scope.row.id)" title="解除">解除</el-button>
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
        </div>
        </div>
    </div>    
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: ['tenementId'],
  data () {
    return {
      removeForm: {
        community_id: '',
        tenement_id: this.tenementId
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
    getList (data = null) {
      if (data === null) {
        data = {
          id: this.tenementId,
          currentPage: 1,
          pageSize: 10
        }
      }
      api.GET(config.server.queryTenement, data)
      .then(response => {
        this.response.data = this.transform(response.data.data.data)
        this.response.currentPage = response.data.data.currentPage
        this.response.pageSize = response.data.data.pageSize
        this.response.count = response.data.data.count
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    remove (id) {
      this.removeForm.community_id = id
      this.$confirm('此操作将解除关联该物业,是否继续解除？', '解除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.village.removeCorrelate, this.removeForm)
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('解除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
      this.getList()
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
    formatDate (value) {
      let date = new Date(value)
      let M = date.getMonth() + 1
      M = M < 10 ? ('0' + M) : M
      value = `${date.getFullYear()}.${M}`
      return value
    },
    // 转换数据
    transform (data) {
      var res = []
      data.forEach(e => {
        e.rubCommunityVOS[0].id = e.community_id
        e.rubCommunityVOS[0].begin_time = e.begin_time
        e.rubCommunityVOS[0].end_time = e.end_time
        res.push(e.rubCommunityVOS[0])
      })
      return res
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