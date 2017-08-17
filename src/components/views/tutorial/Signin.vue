<template>
  <div class="sc-tutorial-signin-component">
    <kobe-table v-if="response">
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex">
          <el-col :span="16">
            <el-button @click="onRefresh" type="primary">刷新</el-button>
            <el-button @click="onDelete(tableSelection)" type="primary">删除</el-button>
          </el-col>
          <el-col :span="8">
            <el-input v-model="keyword" placeholder="请输入搜索关键字">
              <el-button @click="onKeywordSearch" slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button @click="showDialog" icon="search">高级</el-button>
        </el-row>
        <el-dialog title="高级搜索" v-model="searchDialogVisiable">
          <el-form :model="form" label-width="120px">
            <el-form-item label="关键字">
              <el-input v-model="form.keyword"></el-input>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select v-model="form.pay_way" placeholder="请选择" clearable>
                <el-option
                  v-for="item in payOptions"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker v-model="form.start_date"></el-date-picker>
              <el-date-picker v-model="form.end_date"></el-date-picker>
            </el-form-item>
            <el-form-item label="支付状态">
              <el-select v-model="form.status" placeholder="请选择" clearable>
                <el-option
                  v-for="item in signOptions"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="onAdvancedSearch" type="primary">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table
          border
          stripe
          :data="response.data"
          @selection-change="handleSelectionChange"
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID" width="70"></el-table-column>
          <el-table-column prop="attr_value" label="课程名称" width="150"></el-table-column>
          <el-table-column prop="nickname" label="用户"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column prop="name" label="真实姓名"></el-table-column>
          <el-table-column prop="pay.pay_way" label="支付方式"></el-table-column>
          <el-table-column prop="pay.credit_price" label="积分"></el-table-column>
          <el-table-column prop="pay.price" label="现金"></el-table-column>
          <el-table-column label="报名时间" width="150">
            <template scope="scope">
              {{ scope.row.created_at | toDateTime }}
            </template>
          </el-table-column>
          <el-table-column prop="pay.status" label="支付状态"></el-table-column>
          <el-table-column 
            width="80"
            label="操作"
            >
            <template scope="scope">
              <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
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
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-categoty',
  data () {
    return {
      error: null,
      response: null,
      searchDialogVisiable: false,
      tableSelection: [],
      keyword: '',
      signOptions: [{
        value: 1,
        label: '成功'
      }, {
        value: 2,
        label: '失败'
      }],
      payOptions: [{
        value: 1,
        label: '免费'
      }, {
        value: 2,
        label: '积分支付'
      }, {
        value: 3,
        label: '现金支付'
      }],
      form: {
        keyword: '',
        pay_way: '',
        status: '',
        start_date: '',
        end_date: ''
      }
    }
  },
  methods: {
    onRefresh () {
      this.getUserList()
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      })
    },
    onDelete (value) {
      let arr = []
      if (Array.isArray(value) && value.length === 0) {
        this.$message.info('请先选择数据')
        return
      }
      if (!Array.isArray(value)) {
        arr = [value]
      } else {
        value.forEach(item => {
          arr.push(item.id)
        })
      }
      this.$confirm('此操作将删除选定分类。如分类下属有子栏目，或者具体课程，将无法删除。是否继续删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.attendeeDel, {
          ids: arr
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
              ...this.form
            }
            this.getUserList(data)
          }
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    onKeywordSearch () {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        keyword: this.keyword
      }
      this.getUserList(data)
    },
    closeDialog () {
      this.searchDialogVisiable = false
    },
    handleSelectionChange (val) {
      this.tableSelection = val
    },
    onAdvancedSearch () {
      if (this.form.start_date) {
        this.form.start_date = new Date(this.form.start_date).getTime()
      }
      if (this.form.end_date) {
        this.form.end_date = new Date(this.form.end_date).getTime()
      }
      this.getUserList(this.form)
      this.searchDialogVisiable = false
    },
    showDialog () {
      this.searchDialogVisiable = true
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getUserList(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.getUserList(data)
    },
    transformData (data) {
      data.data.forEach(item => {
        if (item.pay) {
          switch (item.pay.pay_way) {
            case '1':
              item.pay.pay_way = '免费'
              break
            case '2':
              item.pay.pay_way = '积分支付'
              break
            case '3':
              item.pay.pay_way = '现金支付'
              break
          }
          switch (item.pay.status) {
            case 1:
              item.pay.status = '成功'
              break
            case 2:
              item.pay.status = '失败'
              break
          }
        }
      })
      return data
    },
    getUserList (data = null) {
      api.GET(config.tutorial.attendee, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
          console.log(this.response)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>

<style>
</style>
