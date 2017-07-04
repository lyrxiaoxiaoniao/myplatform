<template>
  <div class="sc-tutorial-manage-component">
    <div class="sc-tutorial-manage-tree">
    </div>

    <kobe-table v-if="response" class="sc-tutorial-manage-table">
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex">
          <el-col :span="16">
            <el-button>发布课程</el-button>
            <el-button>刷新</el-button>
            <el-select></el-select>
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
          <el-table-column prop="title" label="课程名称"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column label="创建时间">
            <template scope="scope">
              {{ scope.row.created_at | toDateTime }}
            </template>
          </el-table-column>
          <el-table-column prop="click" label="点击"></el-table-column>
          <el-table-column prop="author" label="主讲"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column 
            width="180"
            label="操作"
            >
            <template scope="scope">
              <el-button size="small" icon="edit"></el-button>
              <el-button size="small" icon="information"></el-button>
              <el-button size="small" icon="delete2"></el-button>
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
  name: 'sc-tutorial-manage',
  data () {
    return {
      error: null,
      response: null
    }
  },
  methods: {
    handleSizeChange () {
    },
    handleCurrentChange () {
    },
    getClassList (data = null) {
      api.GET(config.tutorial.class, data)
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
  }
}
</script>

<style>
.sc-tutorial-manage-tree {
  width: 15%;
}
.sc-tutorial-manage-table {
  width:83%;
  padding: 1rem;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
