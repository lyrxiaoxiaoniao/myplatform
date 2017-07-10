<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入搜索关键字">
            <el-button slot="append" icon="search"></el-button>
          </el-input> 
        </el-col>
          <el-button type="primary" icon="upload2"></el-button>
          <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <el-table :data="response.data" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column label="活动封面" width="90px">
          <template scope="scope">
            <img class="activity-cover" :src="scope.row.cover" alt="cover">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="活动名称"></el-table-column>
        <el-table-column prop="category.title" label="活动类型" width="120px"></el-table-column>
        <el-table-column prop="brief" label="活动描述"></el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template scope="scope">
            {{ scope.row.created_at | toDateTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template scope="scope">
            <el-button size="small" icon="information" @click="checkInfo(scope.row.id)"></el-button>
            <el-button size="small" icon="delete2" @click="infoDelete(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">
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
  </kobe-table>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-activity-list',
  data () {
    return {
      response: null,
      error: null,
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    onSearch () {
    },
    editListInfo (user) {
    },
    checkInfo (id) {
      api.GET(config.activity.detail, {
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          console.log(response.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    infoDelete (id) {
      this.$confirm('是否确定删除该条数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.activity.delete, {
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
            this.getActivityList(data)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      })
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getActivityList(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.getActivityList(data)
    },
    getActivityList (data = null) {
      api.GET(config.activity.list, data)
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
    this.getActivityList()
  }
}
</script>

<style>
.activity-cover {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 56px;
  height: 56px;
}
</style>
