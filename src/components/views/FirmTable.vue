<template>
  <div class="sc-firm-component" v-if="response">
    <div class="sc-firm-header">
      <el-row type="flex" justify="end">
        <el-input v-model="keyword" class="input-search" :span="6" placeholder="请输入搜索关键字"></el-input>
        <el-button @click="onKeywordSearch" type="primary" icon="search">搜索</el-button>
        <el-button type="primary">高级</el-button>
      </el-row>
    </div>
    <div class="sc-firm-content">
      <el-table
        border
        stripe
        :data="response.data"
        >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="company" label="企业名称" width="180"></el-table-column>
        <el-table-column prop="industryName" label="所属行业"></el-table-column>
        <el-table-column prop="address" label="详细地址"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="createdAt" label="登记时间"></el-table-column>
        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button size="small" icon="information" @click="onEditFirmDetail(scope.row.id)"></el-button>
            <el-button size="small" icon="delete2" @click="onDeleteFirm(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-firm-footer">
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
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-firm',
  data () {
    return {
      response: null,
      error: null,
      form: {
      },
      advancedSearch: false,
      keyword: ''
    }
  },
  methods: {
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.updateList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.updateList(data)
    },
    onEditFirmDetail (id) {
      this.$router.push({
        path: 'firmdetail',
        query: {
          id
        }
      })
    },
    onKeywordSearch () {
      api.GET(config.firmListAPI, {
        keyword: this.keyword
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
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
    onDeleteFirm (id) {
      this.$confirm('是否确认删除该篇文章？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.firmDeleteAPI, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.form
            }
            this.updateList(data)
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        })
      })
    },
    updateList (data) {
      if (!data) {
        return
      }
      api.GET(config.firmListAPI, data)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
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
    transformData (res) {
      if (!res) {
        return null
      }
      res.data.forEach(item => {
        switch (item.status) {
          case 0:
            item.status = '未审核'
            break
          case 1:
            item.status = '审核通过'
            break
          case 2:
            item.status = '审核未通过'
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
    getFirmList () {
      api.GET(config.firmListAPI)
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
    }
  },
  mounted () {
    this.getFirmList()
  }
}
</script>

<style scoped>
.sc-firm-component {
  border-top: 1px solid lightgray;
  padding-top: 2rem;
  margin-left: 2rem;
  margin-top: 2rem;
  margin-right: 2rem;
}
.sc-firm-header {
  margin: 0 1rem;
  margin-bottom: 20px;
}
.el-table-column {
  font-size: 12px;
}
.input-search {
  width: 150px;
}
</style>
