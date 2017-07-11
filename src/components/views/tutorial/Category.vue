<template>
  <div class="sc-tutorial-category-component">
    <el-row tpye="flex">
      <el-col :span="4">
        <kobe-category-tree></kobe-category-tree>
      </el-col>
      <el-col :span="20">
        <kobe-table v-if="response">
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex">
              <el-col :span="16">
                <el-button type="primary">添加子分类</el-button>
                <el-button type="primary">修改属性</el-button>
                <el-button type="primary">更多操作</el-button>
                <el-button type="primary">刷新</el-button>
              </el-col>
              <el-col :span="8">
                <el-select></el-select>
                <el-input>
                  <el-button slot="append" icon="search"></el-button>
                </el-input>
              </el-col>
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
              <el-table-column prop="title" label="分类名称"></el-table-column>
              <el-table-column label="图片">
                <template scope="scope">
                  <img :src="scope.row.img" alt="">
                </template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template scope="scope">
                  {{ scope.row.created_at | toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="顺序"></el-table-column>
              <el-table-column label="启用">
                <template scope="scope">
                  <el-switch></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                width="180"
                label="操作"
                >
                <template scope="scope">
                  <el-button size="small" icon="edit"></el-button>
                  <el-button size="small" icon="delete2"></el-button>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-category',
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
    getCategoryList () {
      api.GET(config.tutorial.category)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.respones = response.data.data
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
</style>
