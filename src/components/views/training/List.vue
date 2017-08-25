<template>
  <kobe-table
    v-if="response"
    >
    <div class="kobe-table-header" slot="kobe-table-header">
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-button type="primary" @click="addActivity">发布</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="kobe-table" slot="kobe-table-content">
      <el-table
        border
        stripe
        :data="response.data"
        >
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <!-- <el-table-column prop="title" label="培训标题"></el-table-column> -->
        <el-table-column prop="title" label="培训标题"></el-table-column>
        <el-table-column prop="address" label="培训地址"></el-table-column>
        <el-table-column label="举办时间" width="150px">
          <template scope="scope">
            {{ scope.row.created_at | toDateTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80px"></el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
            <el-button @click="onEdit(scope.row.id)" size="small" icon="edit"></el-button>
            <el-button @click="onDetail(scope.row.id)" size="small" icon="information"></el-button>
            <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="kobe-table-footer" slot="kobe-table-footer">
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
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-training-table',
  data () {
    return {
      error: null,
      response: null,
      form: {
        category_id: 12,
        keyword: ''
      }
    }
  },
  methods: {
    onDelete (id) {
      this.$confirm('此操作将删除该活动,删除后,数据无法恢复。\n是否继续?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.training.delete, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          }
          const data = {
            pageSize: this.response.pageSize,
            currentPage: this.response.currentPage,
            ...this.form
          }
          this.getList(data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    addActivity () {
      this.$router.push({
        path: '/admin/training/publish'
      })
    },
    onEdit (id) {
      this.$router.push({
        path: '/admin/training/edit',
        query: {
          id: id
        }
      })
    },
    onDetail (id) {
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
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.form
      }
      this.getList(data)
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = null) {
      api.GET(config.training.list, data)
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
    this.getList({
      category_id: 12
    })
  }
}
</script>

<style>
</style>
