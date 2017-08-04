<template>
  <div class="sc-tutorial-trash">
    <kobe-table
      v-if="response"
      >
      <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex">
          <el-col :span="16">
            <el-button type="primary" @click="onRefresh">刷新</el-button>
            <el-dropdown @command="handleDropDown">
              <el-button type="primary">
                批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="recover">课程复原</el-dropdown-item>
                <el-dropdown-item command="delete">彻底删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="8">
            <el-input v-model="name" placeholder="请输入课程名称">
              <el-button @click="onNameSearch" slot="append" icon="search"></el-button>
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
            <el-form-item label="删除时间">
              <el-date-picker v-model="searchForm.start_date"></el-date-picker>
              <el-date-picker v-model="searchForm.end_date"></el-date-picker>
            </el-form-item>
            <el-form-item label="课程类型">
              <el-checkbox-group v-model="searchForm.class_type">
                <el-checkbox label="视频课程"></el-checkbox>
                <el-checkbox label="文本课程"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="讲师">
              <el-input v-model="searchForm.speaker"></el-input>
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
          @selection-change="handleSelectionChange"
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="title" label="课程名称"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column label="创建时间" width="150">
            <template scope="scope">
              {{ scope.row.created_at | toDateTime }}
            </template>
          </el-table-column>
          <el-table-column label="删除时间" width="150">
            <template scope="scope">
              {{ scope.row.deleted_at | toDateTime }}
            </template>
          </el-table-column>
          <el-table-column prop="click_count" label="点击" width="100"></el-table-column>
          <el-table-column prop="speaker" label="主讲" width="120"></el-table-column>
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
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-trash',
  data () {
    return {
      error: null,
      response: null,
      searchFormVisiable: false,
      tableSelection: [],
      singleSearch: '',
      name: '',
      searchForm: {
        keyword: '',
        speaker: '',
        start_date: '',
        end_date: '',
        class_type: []
      }
    }
  },
  methods: {
    onRefresh () {
      this.getList()
    },
    onNameSearch () {
      const data = {
        name: this.name,
        pageSize: this.response.pageSize,
        currentPage: 1
      }
      this.getList(data)
    },
    handleDropDown (val) {
      if (!this.tableSelection.length) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      let ids = []
      this.tableSelection.forEach(item => {
        ids.push(item.id)
      })
      if (val === 'recover') {
        this.onRecover(ids)
      } else if (val === 'delete') {
        this.onDelete(ids)
      }
    },
    handleSizeChange (value) {
      const data = {
        pageSize: value,
        currentPage: this.response.currentPage,
        ...this.searchForm
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        pageSize: this.response.pageSize,
        currentPage: value,
        ...this.searchForm
      }
      this.getList(data)
    },
    handleSelectionChange (val) {
      this.tableSelection = val
    },
    onAdvancedSearch () {
      let type
      if (this.searchForm.class_type.length === 2) {
        type = ''
      } else {
        type = this.searchForm.class_type[0]
      }
      if (this.searchForm.start_date) {
        this.searchForm.start_date = new Date(this.searchForm.start_date).getTime()
      }
      if (this.searchForm.end_date) {
        this.searchForm.end_date = new Date(this.searchForm.end_date).getTime()
      }
      let data = {
        pageSize: this.response.pageSize,
        currentPage: 1,
        ...this.searchForm,
        class_type: type
      }
      this.getList(data)
      this.searchFormVisiable = false
    },
    closeSearchForm () {
      this.searchFormVisiable = false
    },
    showSearchForm () {
      this.searchFormVisiable = true
    },
    onRecover (ids) {
      this.$confirm('此操作将恢复课程到删除前的状态，是否确认恢复', '复原', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.trashRecover, {
          ids: ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '恢复成功'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.getList(data)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    onDelete (ids) {
      this.$confirm('此操作将彻底删除选定的内容，从此两茫茫，无法再寻回来了。是否确定如此狠心？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.trashDel, {
          ids: ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const data = {
              pageSize: this.response.pageSize,
              currentPage: this.response.currentPage,
              ...this.searchForm
            }
            this.getList(data)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    transformData (data) {
      if (!data) return
      let arr = []
      data.forEach(item => {
        let obj = {
          ...item
        }
        item.attributes.forEach(attr => {
          switch (attr.attr_key) {
            case 'activity_property_tutorial_title':
              obj.title = attr.attr_value
              break
            case 'activity_property_tutorial_speaker':
              obj.speaker = attr.attr_value
              break
            case 'activity_property_tutorial_type':
              obj.type = attr.attr_value
              break
          }
        })
        arr.push(obj)
      })
      return arr
    },
    getList (data = null) {
      api.GET(config.tutorial.trashList, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          const data = this.transformData(response.data.data.data)
          this.response = response.data.data
          this.response.data = data
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
