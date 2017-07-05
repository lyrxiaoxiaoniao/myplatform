<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button icon="plus" type="primary" style="margin-left:10px;" @click="add"></el-button>
            <el-button icon="upload2" type="primary"></el-button>
            <el-button icon="setting" type="primary"></el-button>
            </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
            border
            stripe
            :data="response.data">
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="method"></el-table-column>
            <el-table-column prop="type_key" label="action"></el-table-column>
            <el-table-column prop="brief" label="accept_charset"></el-table-column>
            <el-table-column prop="sort" label="class"></el-table-column>
            <el-table-column 
                width="220"
                label="操作"
                >
                <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                <el-button @click="openDialog(e, scope.row, 'edit')" size="small" icon="edit"></el-button>
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
    <el-dialog title="编辑表单" v-model="showDialog">
        <el-form :model="selected" label-width="120px">
          <el-form-item label="method">
              <el-input placeholder="示例:post/get" v-model="selected.url"></el-input>
          </el-form-item>
          <el-form-item label="action">
              <el-input placeholder="示例:https://www.example.com" v-model="selected.url"></el-input>
          </el-form-item>
          <el-form-item label="accept_charset">
              <el-input placeholder="示例:utf-8" v-model="selected.url"></el-input>
          </el-form-item>
          <el-form-item label="enctype">
              <el-input placeholder="默认:application/x-www-form-urlencoded" v-model="selected.brief"></el-input>
          </el-form-item>
          <el-form-item label="role">
              <el-input placeholder="form" v-model="selected.content"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="createType" v-if="dialogType === 'add'">确定</el-button>
            <el-button @click="editType" v-if="dialogType === 'edit'">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      data: [],
      response: {
        data: null
      },
      error: null,
      showDialog: false,
      showStepsDialog: false,
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      },
      selected: {}
    }
  },
  methods: {
    add () {
      this.showDialog = true
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.showFileList({id: this.parentId})
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
    // 模态框显示
    openDialog (e, data = null, type = null) {
      if (data !== null && type === 'edit') {
        this.dialogType = 'edit'
        this.isDialogDisabled = false
        this.selected = {
          ...this.selected,
          ...data
        }
      } else {
        this.isDialogDisabled = false
        this.dialogType = 'add'
        Object.keys(this.selected).forEach(key => {
          this.selected[key] = ''
        })
      }
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    // 新增form确认
    createType () {
      this.showDialog = false
      // api.POST(config.activity.typeCreate, this.selected)
      // .then(response => {
      //   if (response.data.errcode === '0000') {
      //     this.onSuccess('添加成功')
      //   }
      // })
      // .catch(error => {
      //   this.$message.error(error)
      // })
    },
    // 修改form确认
    editType () {
      this.showDialog = false
      // api.POST(config.activity.typeUpdate, this.selected)
      // .then(response => {
      //   if (response.data.errcode === '0000') {
      //     this.onSuccess('修改成功')
      //   }
      // })
      // .catch(error => {
      //   this.$message.error(error)
      // })
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
    getList (data = {}) {
      console.log(1)
      // api.GET(config.activity.typeList, data)
      // .then(response => {
      //   this.response = response.data.data
      // })
      // .catch(error => {
      //   this.$message.error(error)
      // })
    }
  }
}
</script>
<style scoped>
</style>

