<template>
  <div class="sc-tutorial-signin-component">
    <kobe-table v-if="response">
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex">
          <el-col :span="16">
            <el-button @click="onRefresh" type="primary">刷新</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-col :span="8">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button icon="search">高级</el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table
          border
          stripe
          :data="response.data"
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="activity_info.title" label="课程名称"></el-table-column>
          <el-table-column prop="user" label="用户"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column prop="realname" label="真实姓名"></el-table-column>
          <el-table-column prop="pay.pay_way" label="支付方式"></el-table-column>
          <el-table-column prop="pay.credit_price"; label="积分"></el-table-column>
          <el-table-column prop="pay.price" label="现金"></el-table-column>
          <el-table-column label="报名时间">
            <template scope="scope">
              {{ scope.row.created_at | toDateTime }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column 
            width="80"
            label="操作"
            >
            <template scope="scope">
              <el-button @click="onSingleDelete(scope.row.id)" size="small" icon="delete2"></el-button>
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
      form: {
      }
    }
  },
  methods: {
    onRefresh () {
      this.getUserList()
    },
    onSingleDelete (id) {
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
    getUserList (data = null) {
      api.GET(config.tutorial.attendee, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
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
