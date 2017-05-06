<template>
  <div v-if="response" class="sc-report-table">
    <div class="sc-report-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="16">
          <el-row type="flex">
            <el-col :span="4">
              <el-select v-model="searchSelect" placeholder="请选择">
                <el-option
                  v-for="item in searchOptions"
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
      <el-select class="catlg-select" multiple placeholder="案件分类" v-model="selectedCatlg">
        <el-option 
          v-for="item in caseCatlg"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select class="status-select" mutiple placeholder="案件状态" v-model="caseStatus" @change="onStatusChanged" clearable>
        <el-option
          v-for="item in caseStatusCatlg"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="sc-report-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="acceptNo" label="受理号" sortable min-width="100"></el-table-column>
        <el-table-column prop="reportName" label="举报人"></el-table-column>
        <el-table-column prop="catlgName" label="案件分类" min-width="80"></el-table-column>
        <el-table-column prop="address" label="事发地址" min-width="180"></el-table-column>
        <el-table-column prop="description" label="案件描述" min-width="200"></el-table-column>
        <el-table-column prop="createDate" label="举报时间" sortable></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template scope="scope">
            <router-link to="reportdeal">
              <el-button size="small" icon="edit"></el-button>
            </router-link>
            <el-button size="small" icon="circle-cross" @click="shieldReport(scope.row.id)"></el-button>
            <el-button size="small" icon="information" @click="selectCase(scope.row)"></el-button>
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
      searchOptions: [],
      singleSelect: '',
      selectedCatlg: '',
      caseStatus: '',
      caseCode: -1,
      caseCatlg: [],
      advancedForm: false,
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
    },
    caseStatusCatlg () {
      return config.reportsStatusCatlg
    }
  },
  methods: {
    // Handle Page Size Change
    handleSizeChange (value) {
      if (this.caseCode !== -1) {
        this.updateCase({
          pageSize: value,
          currentPage: this.response.CurrentPage,
          status: this.caseCode
        })
        return
      }
      this.getCaseList(value, this.response.currentPage)
    },
    // Handle Page Change
    handleCurrentChange (value) {
      if (this.caseCode !== -1) {
        this.updateCase({
          pageSize: this.response.pageSize,
          currentPage: value,
          status: this.caseCode
        })
        return
      }
      this.getCaseList(this.response.pageSize, value)
    },
    // Toggle Advanced Search Form
    onAdvancedSearch () {
      this.advancedForm = !this.advancedForm
    },
    // Report Status Change
    onStatusChanged () {
      config.reportsStatusCatlg.forEach(item => {
        if (item.value === this.caseStatus) {
          this.caseCode = item.code
        }
      })

      if (this.caseStatus === '') {
        this.caseCode = -1
      }

      if (this.caseCode === -1) {
        this.getCaseList(this.response.pageSize, 1)
        return
      }

      const data = {
        pageSize: this.response.pageSize,
        currentPage: 1,
        status: this.caseCode
      }
      console.log(`data: ${data}`)
      this.updateCase(data)
    },
    selectCase (object) {
      this.$store.commit('SET_CURRENT_CASE', object)
      this.$router.push('reportdetail')
    },
    // Shield Report
    shieldReport (id) {
      const caseShieldURL = config.serverURI + config.shieldCaseAPI

      this.$confirm('是否确认删除该条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(caseShieldURL, {
          id: id
        })
        .then(response => {
          console.log(`Case Lists response ${response}`)

          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '屏蔽成功',
              type: 'success'
            })
            this.getCaseList(this.response.pageSize, this.response.currentPage)
          }
        })
        .catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
            this.response = this.transformData(response.data.data)
            console.log('Case List')
            console.log(this.response)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // GET Report Catlgory Request
    getCaseCatlg () {
      const caseCatlgURL = config.serverURI + config.caseCatlgAPI

      axios.get(caseCatlgURL)
        .then(response => {
          console.log(`Case Catlogory response ${response}`)

          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            response.data.data.forEach(item => {
              let object = {}
              object.id = item.id
              object.value = item.name
              this.caseCatlg.push(object)
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // Update Report List With Extra Conditions
    updateCase (data) {
      // TODO
      axios.get(this.caseListURL, {
        params: data
      })
      .then(response => {
        console.log(`Case Lists Update response ${response}`)

        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.response = this.transformData(response.data.data)
          console.log('Update Case List Response Data')
          console.log(this.response)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    // Transform Response Data
    transformData (res) {
      res.data.forEach(item => {
        switch (item.status) {
          case 1:
            item.status = '进行中'
            break
          case 2:
            item.status = '已结束'
            break
          case 3:
            item.status = '已驳回'
            break
        }

        if (item.createDate) {
          let date = new Date(item.createDate)
          item.createDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        }
      })

      return res
    }
  },
  components: {
  },
  mounted () {
    this.getCaseList()
    this.getCaseCatlg()
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

  .catlg-select {
    margin-top: 10px;
  }
</style>
