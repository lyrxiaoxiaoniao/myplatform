<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="17">
          <el-button type="primary" @click="toAddStatus">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-col>
        <el-col :span="5" style="margin-right: 10px">
          <el-input v-model="form.keyword" placeholder="">
            <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
          </el-input>
        </el-col>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table 
        :data="response.data"
        border
        stripe
        @selection-change="selectIds">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="标签名称"></el-table-column>
        <el-table-column prop="dutyName" label="包含题目数量" width="120"></el-table-column>
        <el-table-column prop="mobile" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="toEditStatus(scope.row.id)" title="修改"></el-button>
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-button type="text" style="color: #48576a; padding:5px 0;" @click="deleteData()">删除</el-button>
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
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny">
        <div class="dialog-add" v-show="dialogTitle==='新增标签'">
          <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
            <el-form-item label="标签名称：" prop="dutyName">
              <el-input v-model="addForm.dutyName" placeholder="请输入新的标签名称"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="add">保存</el-button>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-restaurants-table',
    data () {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        advancedSearchForm: {
          signState: 0
        },
        addForm: {
        },
        dialogTitle: '',
        dialogFormVisible: false,
        searchSelectOptions: [{
          value: '',
          label: '所有信息'
        }, {
          value: 0,
          label: '未签约'
        }, {
          value: 1,
          label: '已签约'
        }],
        searchSelectValue: '', // 列表页顶部选择器的值
        selectedIds: [],
        editingId: 0
      }
    },
    computed: {},
    methods: {
      getList (data = {}) {
        api.GET(config.restaurants.index, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      async deleteData (value) {
        // next表示是否进行下一步
        var next = true
        if (value) {
          this.selectIds(value)
        }
        if (!this.selectedIds.length) {
          next = await this.warnSelection(next)
        }
        if (next) {
          next = await this.confirmDelete(next)
        }
        if (next) {
          api.POST(config.restaurants.delete, {ids: this.selectedIds})
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.onSuccess('删除成功')
                this.selectedIds = []
                this.getList()
              }
            })
            .catch(error => {
              this.$message.error(error)
            })
        }
      },
      add () {
        api.POST(config.loadometer.create, this.addForm)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('创建成功')
              let data = {
                pageSize: this.response.pageSize,
                currentPage: this.response.currentPage,
                ...this.form
              }
              this.getList(data)
              this.closeDialog()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      refresh () {
        this.getList()
      },
      // 搜索按钮
      onSearch () {
        let data = {
          currentPage: 1,
          pageSize: this.response.pageSize,
          ...this.form
        }
        this.getList(data)
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
      transformData (res) {
        res.data.forEach(v => {
          if (v.created_at) {
            v.created_at = this.formatDate(v.created_at)
          }
          if (v.signState === 0) {
            v.signState = '未签约'
          }
          if (v.signState === 1) {
            v.signState = '已签约'
          }
          if (v.checkState === 0) {
            v.checkState = false
          }
          if (v.checkState === 1) {
            v.checkState = true
          }
        })
        return res
      },
      // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      },
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否删除
      confirmDelete (next) {
        return this.$confirm('此操作将删除该标签，删除后，所有被打上该标签的题目都将与该标签解除关联。是否继续删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 单行记录、多行记录、未选择记录操作生成id数组
      selectIds (value) {
        this.selectedIds = []
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组，未选择记录未传参数
        if (value !== undefined) {
          if (value.length === undefined) {
            this.selectedIds.push(value)
          } else {
            this.selectedIds = value.map(v => {
              return v.id
            })
          }
        }
      },
      toAddStatus () {
        this.openDialog('新增标签')
      },
      toEditStatus (id) {
        this.$router.push({
          path: '/admin/test/library/label/edit',
          query: {
            id: id
          }
        })
      },
      openDialog (value, id) {
        this.editingId = id
        this.dialogTitle = value
        this.dialogFormVisible = true
      },
      closeDialog () {
        this.dialogFormVisible = false
        this.dialogTitle = ''
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      }
    },
    components: {
    },
    mounted () {
      this.getList()
    }
  }
</script>

<style scoped>
  
</style>