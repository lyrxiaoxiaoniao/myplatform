<template>
  <div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button @click="resFresh" type="primary">刷新</el-button>
                <el-dropdown @command="handleCommand" style="margin-left:10px;">
                  <el-button type="primary">
                    更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="复原文章">复原文章</el-dropdown-item>
                    <el-dropdown-item command="彻底删除">彻底删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                    <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button @click="openDialog" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
            <el-button icon="upload2" type="primary"></el-button>
            <el-button icon="setting" type="primary"></el-button>
          </el-row>
          <el-dialog title="高级搜索" v-model="showDialog" size="tiny">
            <el-form :model="selected" label-width="70px">
                <el-form-item label="关键字">
                    <el-input v-model="selected.keyword" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="栏目">
                    <el-cascader
                      style="width:100%;"
                      change-on-select
                      :options="data"
                      :props="props"
                      v-model="cids"
                      @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-col :span="11">
                        <el-form-item>
                            <el-date-picker type="datetime" placeholder="选择开始时间" v-model="selected.start_time" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item>
                            <el-date-picker type="datetime" placeholder="选择结束时间" v-model="selected.end_time" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="文章状态">
                     <el-select v-model="selected.states" multiple placeholder="请选择" style="width:100%;">
                        <el-option
                        v-for="item in optionStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章类型">
                     <el-select v-model="selected.types" multiple placeholder="请选择" style="width:100%;">
                        <el-option
                        v-for="item in optionType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-col :span="12">
                    <el-form-item label="固顶">
                        <el-checkbox v-model="is_topped">固顶文章</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="推荐">
                        <el-checkbox v-model="is_recommend">推荐文章</el-checkbox>
                    </el-form-item>
                </el-col>
                <el-form-item label="作者">
                    <el-input v-model="selected.author" placeholder="请输入作者"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button @click="advancedSearch" type="primary">搜索</el-button>
            </div>
          </el-dialog>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
                ref="multipleTable"
                border
                stripe
                :data="response.data"
                @selection-change="handleSelectionChange"
                @row-dblclick="rowDbclick">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="70"></el-table-column>
                <el-table-column label="内容标题" prop="title"></el-table-column>
                <el-table-column prop="brief" label="类型"></el-table-column>
                <el-table-column prop="category.display_name" label="栏目" width="120"></el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="200">
                  <template scope="scope">
                    {{ scope.row.created_at | toDateTime }}
                  </template>
                </el-table-column>
                <el-table-column prop="deleting" label="删除时间" width="200">
                  <template scope="scope">
                    {{ scope.row.deleting | toDateTime }}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="启用" width="100">
                  <template scope="scope">
                    <el-switch
                      v-model="scope.row.active"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.active, scope.row.id)">
                    </el-switch>
                  </template>
                </el-table-column> -->
                <el-table-column prop="status" label="操作" width="70">
                  <template scope="scope"> 
                      <el-button @click="goAwardsDetail(scope.row.id)" size="small" icon="edit"></el-button>
                      <!-- <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button> -->
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex" justify="center">
                <el-col :span="8">
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
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      data: [],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      optionStatus: [{
        value: 0,
        label: '待审核'
      }, {
        value: 1,
        label: '已审核'
      }, {
        value: 2,
        label: '退回'
      }, {
        value: 3,
        label: '已归档'
      }, {
        value: 4,
        label: '出档'
      }],
      optionType: [{
        value: 1,
        label: '普通'
      }, {
        value: 2,
        label: '图文'
      }],
      multipleSelection: [],
      showDialog: false,
      response: {
        data: []
      },
      ids: [],
      cids: [],
      is_topped: null,
      is_recommend: null,
      selected: {
        keyword: '',
        author: '',
        category_id: null,
        start_time: null,
        end_time: null,
        states: [],
        types: [],
        is_topped: null,
        is_recommend: null
      },
      form: {
        keyword: ''
      }
    }
  },
  methods: {
    handleChange (val) {
      this.cids = val
      this.selected.category_id = JSON.parse(JSON.stringify(val)).pop()
    },
    handleCommand (command) {
      this.deleteType(command)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    goAwardsDetail (id) {
      this.$router.push({
        path: '/admin/newcms/content/edit',
        query: {
          id: id
        }
      })
    },
    openDialog () {
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    getNumber (val) {
      let res
      if (val) {
        res = 1
      } else {
        res = 0
      }
      return res
    },
    /* 高级搜索 */
    advancedSearch () {
      if (this.selected.start_time) {
        this.selected.start_time = this.selected.start_time.getTime()
      }
      if (this.selected.end_time) {
        this.selected.end_time = this.selected.end_time.getTime()
      }
      this.selected.is_topped = this.getNumber(this.is_topped)
      this.selected.is_recommend = this.getNumber(this.is_recommend)
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.selected
      }
      this.getList(data, this.closeDialog)
    },
    // 双击行调用函数
    rowDbclick (data, type) {
      this.goAwardsDetail()
    },
    // 删除表单
    deleteType (type) {
    //   if (id) {
    //     this.ids = []
    //     this.ids.push(id)
    //   }
      let URL = ''
      if (type === '彻底删除') {
        URL = config.newcms.removeNcmRecycleAPI
      } else if (type === '复原文章') {
        URL = config.newcms.replyNcmRecycleAPI
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选文章？', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return
        }).catch(() => {
          return
        })
        return
      }
      this.$confirm('是否确认' + type + '文章', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(URL, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess(type + '成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    resFresh () {
      this.getList()
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
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
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    changeActive (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        } else if (v.active === 0) {
          v.active = false
        }
      })
      return res
    },
    getList (data = {}, callback) {
      api.POST(config.newcms.ncmRecycleListAPI, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.changeActive(response.data.data)
          callback()
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    getTree () {
      api.GET(config.newcms.ncmsCategotyAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.data = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    }
  },
  mounted () {
    this.getList()
    this.getTree()
  }
}
</script>
<style scoped>
.line{
    text-align: center;
}
</style>