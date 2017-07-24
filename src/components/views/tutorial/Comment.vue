<template>
  <div class="sc-tutorial-comment">
    <kobe-table>
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-col :span="16">
            <el-button @click="onRefresh">刷新</el-button>
            <el-button>批量删除</el-button>
          </el-col>
          <el-select></el-select>  
          <el-col :span="4">
            <el-input></el-input>
          </el-col>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table
          v-if="response"
          border
          stripe
          :data="response.data"
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="课程标题"></el-table-column>
          <el-table-column prop="comment" label="评论内容"></el-table-column>
          <el-table-column prop="user" label="用户"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column prop="realname" label="真实姓名"></el-table-column>
          <el-table-column label="评价时间">
            <template scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template scope="scope">
              <el-switch></el-switch>
            </template>
          </el-table-column>
          <el-table-column 
            width="120"
            label="操作"
            >
            <template scope="scope">
              <el-button @click="onEdit(scope.row)" size="small" icon="edit"></el-button>
              <el-button @click="onDelete(scope.row.id)" size="small" icon="delete2"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="修改评论" v-model="editFormVisiable">
          <el-form :model="editForm" label-width="120px">
            <el-form-item label="课程标题">
              <el-input></el-input>
            </el-form-item>
            <el-row type="flex">
              <el-form-item label="审核通过">
                <el-switch></el-switch>
              </el-form-item>
              <el-form-item label="来源">
                <el-input></el-input>  
              </el-form-item>
            </el-row>
            <el-row type="flex">
              <el-form-item label="会员">
                <el-input></el-input>
              </el-form-item>
              <el-form-item label="时间">
                <el-date-picker></el-date-picker>
              </el-form-item>
            </el-row>
            <el-form-item label="手机">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="评分">
              <el-rate></el-rate>
            </el-form-item>
            <el-form-item label="评论">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="回复">
              <el-input type="textarea"></el-input>
            </el-form-item>
          </el-form>
        </el-dialog>  
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
  name: 'sc-tutorial-comment',
  data () {
    return {
      response: null,
      error: null,
      editFormVisiable: false,
      editForm: {
        // TODO
      },
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    onDelete (id) {
      this.$confirm('此操作将删除选定的评论信息,删除后无法恢复。是否继续删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        // TODO
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onEdit(item) {
    },
    onRefresh () {
      this.getList()
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
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
      api.GET(config.tutorial.commentList, data)
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
    this.getList()
  }
}
</script>

<style>
</style>
