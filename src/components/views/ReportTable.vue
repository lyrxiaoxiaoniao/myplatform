<template>
  <div v-if="response" class="sc-report-table">
    <div class="sc-report-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="16">
          <el-row type="flex">
            <el-col :span="4">
              <el-select v-model="searchSelect" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disbaled="true">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="searchInput" placeholder="请输入内容" class="sc-table-header-select"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button class="sc-table-search-btn" type="primary">搜索</el-button>
              <el-button type="primary" icon="search">高级搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="upload2"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="sc-report-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" sortable></el-table-column>
        <el-table-column prop="reportName" label="举报人"></el-table-column>
        <el-table-column prop="createDate" label="举报时间" sortable></el-table-column>
        <el-table-column prop="mobile" label="手机号码" sortable></el-table-column>
        <el-table-column prop="address" label="事发地址"></el-table-column>
        <el-table-column prop="description" label="案件描述"></el-table-column>
        <el-table-column prop="status" label="受理状态"></el-table-column>
        <el-table-column prop="acceptNo" label="受理号" sortable></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template scope="scope">
            <router-link to="reportdeal">
              <el-button size="small" icon="edit"></el-button>
            </router-link>
            <el-button size="small" icon="circle-cross"></el-button>
            <el-button size="small" icon="information"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-report-table-footer">
      <el-row type="flex" justify="center">
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
    </div>
  </div>
</template>

<script>
import config from 'src/config'
import axios from 'axios'

export default {
  name: 'sc-report-table',
  data () {
    return {
      options: [],
      response: null,
      error: null
    }
  },
  computed: {
    caseListURL () {
      return config.serverURI + config.caseListAPI
    },
    removeCaseURL () {
      return config.serverURI + config.removeCaseAPI
    }
  },
  methods: {
    handleSizeChange (value) {
      this.getCaseList(value, this.response.currentPage)
    },
    handleCurrentChange (value) {
      this.getCaseList(this.response.pageSize, value)
    },
    getCaseList (pageSize = 10, currentPage) {
      axios.get(this.caseListURL, {
        params: {
          pageSize,
          currentPage
        }
      })
        .then(response => {
          console.log(`Case Lists response ${response}`)

          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
            console.log('user list')
            console.log(this.response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  components: {
  },
  mounted () {
    this.getCaseList()
  }
}
</script>

<style scoped>
  .sc-report-table {
    border-top: 1px solid lightgray;
    padding-top: 2rem;
    margin-left: 2rem;
    margin-top: 2rem;
    margin-right: 2rem;
  }

  .sc-report-table-header {
    margin-bottom: 20px;
  }

  .sc-report-table-content {
    margin-bottom: 20px;
  }
</style>
