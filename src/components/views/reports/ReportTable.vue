<template>
  <div v-if="response" class="sc-report-table">
    <transition name="fade">
      <el-form v-if="advancedForm" class="search-form" :model="searchForm" :label-position="left" :label-width="'80px'">
        <el-row>
          <el-col :span="8">
            <el-form-item label="受理号">
              <el-input v-model="searchForm.acceptNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="举报人">
              <el-input v-model="searchForm.reportName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="隐患单位">
              <el-input v-model="searchForm.hiddenUnit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="案件分类">
              <el-select class="catlg-select" placeholder="案件分类" v-model="searchForm.catlgId">
                <el-option 
                  v-for="item in caseCatlg"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="案件状态">
              <el-select class="status-select" placeholder="案件状态" v-model="searchForm.status" clearable>
                <el-option
                  v-for="item in caseStatusCatlg"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker type="date" placeholder="开始日期" v-model="searchForm.startTime"></el-date-picker>
              <el-date-picker type="date" placeholder="结束日期" v-model="searchForm.endTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </transition>
    <div class="sc-report-table-header">
      <el-row type="flex" justify="end">
        <el-select v-model="searchSelect" placeholder="请选择" clearable>
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disbaled="true">
          </el-option>
        </el-select>
        <el-col :span="5">
          <el-input v-model="searchInput" placeholder="请输入内容" class="sc-table-header-select"></el-input>
        </el-col>
        <el-button class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
        <el-button type="primary" @click="onAdvancedSearch">高级</el-button>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div class="sc-report-table-content">
      <el-table :data="response.data" border stripe>
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="acceptNo" label="受理号" min-width="90"></el-table-column>
        <el-table-column prop="reportName" label="举报人" width="80"></el-table-column>
        <el-table-column prop="catlgName" label="案件分类" min-width="90"></el-table-column>
        <el-table-column prop="hiddenUnit" label="隐患单位" width="100"></el-table-column>
        <el-table-column prop="address" label="事发地址" min-width="180"></el-table-column>
        <el-table-column prop="description" label="案件描述" min-width="200"></el-table-column>
        <el-table-column prop="createdAt" label="举报时间" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="80"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template scope="scope">
            <el-button size="small" icon="information" @click="selectCase(scope.row)"></el-button>
            <el-button size="small" icon="circle-cross" @click="shieldReport(scope.row.id)"></el-button>
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
      searchOptions: [
        { value: 'acceptNo', label: '受理号' },
        { value: 'reportName', label: '举报人' },
        { value: 'hiddenUnit', label: '隐患单位' }
      ],
      // Single Search Select
      searchSelect: '',
      // Single Search Input
      searchInput: '',
      selectedCatlg: '',
      caseCatlg: [],
      advancedForm: false,
      searchForm: {
        status: '',
        acceptNo: '',
        reportName: '',
        hiddenUnit: '',
        selectedCatlg: '',
        startTime: '',
        catlgId: '',
        endTime: ''
      },
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
      if (this.searchInput !== '' || this.advancedForm) {
        let data = {
          pageSize: value,
          currentPage: this.response.currentPage,
          ...this.searchForm
        }
        data[this.searchSelect] = this.searchInput
        this.updateCase(data)
        return
      }
      this.getCaseList(value, this.response.currentPage)
    },
    // Handle Page Change
    handleCurrentChange (value) {
      if (this.searchInput !== '' || this.advancedForm) {
        let data = {
          pageSize: this.response.pageSize,
          currentPage: value,
          ...this.searchForm
        }
        data[this.searchSelect] = this.searchInput
        this.updateCase(data)
        return
      }
      this.getCaseList(this.response.pageSize, value)
    },
    // Toggle Advanced Search Form
    onAdvancedSearch () {
      this.advancedForm = !this.advancedForm
    },
    selectCase (object) {
      this.$store.commit('SET_CURRENT_CASE', object)
      this.$router.push('reportdetail')
    },
    // Calling Search API
    onSearch () {
      if (this.advancedForm) {
        // Advanced Search
        const data = {
          currentPage: this.response.currentPage,
          pageSize: this.response.pageSize,
          ...this.searchForm
        }

        this.updateCase(data)
      } else {
        // Single Search
        let data = {
          currentPage: 1,
          pageSize: this.response.pageSize
        }

        data[this.searchSelect] = this.searchInput
        this.updateCase(data)
      }
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
            let data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            if (this.searchInput !== '') {
              data[this.searchSelect] = this.searchInput
            }
            this.updateCase(data)
          }
        })
        .catch(error => {
          this.$message({
            type: 'info',
            message: error
          })
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
    // GET Report Catlgory Request
    getCaseCatlg () {
      const caseCatlgURL = config.serverURI + config.caseCatlgAPI

      axios.get(caseCatlgURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }

          if (response.data.errcode === '0000') {
            response.data.data.forEach(item => {
              let object = {}
              object.label = item.name
              object.id = item.id
              object.value = item.id
              this.caseCatlg.push(object)
            })
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    // Update Report List With Extra Conditions
    updateCase (form) {
      // TODO
      const data = this.transformSearchForm(form)
      axios.get(this.caseListURL, {
        params: data
      })
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
      res.data.forEach(item => {
        switch (item.status) {
          case 1:
            item.status = '进行中'
            break
          case 2:
            item.status = '已结案'
            break
          case 3:
            item.status = '已驳回'
            break
        }

        if (item.createdAt) {
          let date = new Date(item.createdAt)
          const month = date.getMonth() + 1
          item.createdAt = `${date.getFullYear()}-${month}-${date.getDate()}`
        }
      })

      return res
    },
    transformSearchForm (data) {
      if (data.startTime && data.startTime !== '') {
        const start = new Date(data.startTime.toString()).getTime()
        data.startTime = start
      }
      if (data.endTime && data.endTime !== '') {
        const end = new Date(data.endTime.toString()).getTime()
        data.endTime = end
      }
      return data
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
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  .search-form {
    border: 1px solid lightgray;
    padding: 20px;
    margin-bottom: 10px;
  }

  .sc-report-table-header {
    margin: 1rem 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid lightgray;
  }

  .sc-table-search-btn {
    margin-left: 20px;
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
</style>
