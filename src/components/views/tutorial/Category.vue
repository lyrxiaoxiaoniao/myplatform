<template>
  <div class="sc-tutorial-category-component">
    <kobe-table v-if="response">
      <div slot="kobe-table-header" class="kobe-table-header">
      </div>
      <div slot="kobe-table-content" class="kobe-table">
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
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-categoty',
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
