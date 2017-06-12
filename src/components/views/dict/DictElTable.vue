<template>
  <kobe-table v-if="response">
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input v-model="form.keyword" placeholder="请输入搜索关键字"></el-input>
        </el-col>
        <el-button @click="onSearch" icon="search"></el-button>
        <el-button @click="addDictEl" icon="plus"></el-button>
        <el-button icon="upload2" type="primary"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-row>
      <el-dialog title="添加新元素" v-model="showAddDialog" label-position="left">
        <el-form :model="addForm">
          <el-form-item label="键">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="addForm.value"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <el-table
        :data="response.data"
        stripe
        border
        >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="键"></el-table-column>
        <el-table-column prop="value" label="值"></el-table-column>
        <el-table-column 
          width="180"
          label="操作"
          >
          <template scope="scope">
            <el-button size="small" icon="edit"></el-button>
            <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
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
  name: 'sc-dict-el-table',
  data () {
    return {
      dictElID: this.$route.query.id,
      response: null,
      error: null,
      showAddDialog: false,
      form: {
        keyword: ''
      },
      addForm: {
        pId: this.$route.query.id,
        name: '',
        value: ''
      }
    }
  },
  methods: {
    addDictEl () {
      this.showAddDialog = true
    },
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
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: 10,
        ...this.form
      }
      this.updateList(data)
    },
    onDelete (id) {
      this.$confirm('是否删除该条信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(response => {
        api.POST(config.dictElDeleteAPI, {
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
          }
        })
      })
    },
    updateList (data) {
      api.GET(config.dictElListAPI, {
        pId: this.dictElID
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getList () {
      api.GET(config.dictElListAPI, {
        pId: this.dictElID
      })
      .then(response => {
        if (response.status !== 200) {
          this.$message.error(response.statusText)
          return
        }

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
    this.getList()
  }
}
</script>

<style>
</style>
