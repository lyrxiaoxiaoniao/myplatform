<template>
  <div class="sc-tutorial-trash">
    <kobe-table
      v-if="response"
      >
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex">
          <el-col :span="16">
            <el-button>刷新</el-button>
            <el-select
              v-model="mutilAction"
              placeholder="批量操作"
              >
              <el-option
                v-for="item in mutilActionOptions"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button @click="showSearchForm" icon="search">高级</el-button>
        </el-row>
        <el-dialog
          title="高级搜索"
          v-model="searchFormVisiable"
          >
          <el-form :model="searchForm" label-width="120px">
            <el-form-item label="关键字">
              <el-input v-model="searchForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-select></el-select>
            </el-form-item>
            <el-form-item label="删除时间">
            </el-form-item>
            <el-form-item label="课程类型">
            </el-form-item>
            <el-form-item label="讲师">
              <el-input></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="closeSearchForm">取消</el-button>
            <el-button @click="onAdvancedSearch">搜索</el-button>
          </div>
        </el-dialog>
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
          <el-table-column label="删除时间">
            <template scope="scope">
              {{ scope.row.delete_at | toDateTime }}
            </template>
          </el-table-column>
          <el-table-column prop="click" label="点击"></el-table-column>
          <el-table-column prop="author" label="主讲"></el-table-column>
          <el-table-column 
            width="80"
            label="操作"
            >
            <template scope="scope">
              <el-button size="small" icon="edit"></el-button>
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
export default {
  name: 'sc-tutorial-trash',
  data () {
    return {
      error: null,
      response: null,
      searchFormVisiable: false,
      searchForm: {
      },
      mutilActionOptions: [{
        label: '批量复原',
        value: ''
      }, {
        label: '彻底删除',
        value: ''
      }],
      mutilAction: ''
    }
  },
  methods: {
    handleSizeChange (value) {
    },
    handleCurrentChange (value) {
    },
    onAdvancedSearch () {
    },
    closeSearchForm () {
      this.searchFormVisiable = false
    },
    showSearchForm () {
      this.searchFormVisiable = true
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
