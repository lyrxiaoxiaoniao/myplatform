<template>
    <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
        <el-row type="flex" justify="end">
        <el-col :span="8">
            <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
            <el-button slot="append" @click="onSearch" icon="search"></el-button>
            </el-input>
        </el-col>
        <el-button icon="plus" type="primary" style="margin-left:10px;"></el-button>
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
        <el-table-column prop="title" label="element"></el-table-column>
        <el-table-column prop="type_key" label="type"></el-table-column>
        <el-table-column prop="brief" label="label"></el-table-column>
        <el-table-column prop="sort" label="name"></el-table-column>
        <el-table-column prop="val" label="value"></el-table-column>
        <!--<el-table-column label="启用" width="80">
            <template scope="scope">
            {{ scope.row.active | isOpen }}
            </template>
        </el-table-column>-->
        <el-table-column 
            width="180"
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
      isDialogDisabled: false,
      showStepsDialog: false,
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      }
    }
  },
  methods: {
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