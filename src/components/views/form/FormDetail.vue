<template>
<div class="FD-container">
    <div class="FD-left">
        <h4>表单详细配置信息</h4>
        <el-form :model="selected" label-width="80px">
          <el-row>
              <el-col :span="24">
                <el-form-item label="name:" prop="name">
                    <p v-text="selected.name"></p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="charset:" prop="accept_charset">
                    <p v-text="selected.accept_charset"></p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="method:" prop="method">
                    <p v-text="selected.method"></p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="action:" prop="action">
                    <p v-text="selected.action"></p>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="enctype:" prop="enctype">
                    <p v-text="selected.enctype"></p>
                </el-form-item>
              </el-col>
          </el-row> 
        </el-form>
    </div>
    <div class="FD-right">
        <kobe-table>
            <div slot="kobe-table-header" class="kobe-table-header">
                <el-row type="flex" justify="end">
                    <el-button style="margin-right:10px;" @click="openDialog">选择标签</el-button>
                    <el-col :span="8">
                        <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                        <el-button slot="append" @click="onSearch" icon="search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div slot="kobe-table-content" class="kobe-table">
                <el-table
                border
                stripe
                :data="response.data">
                <el-table-column type="index" label="ID" width="50"></el-table-column>
                <el-table-column prop="name" label="element"></el-table-column>
                <el-table-column prop="type" label="type"></el-table-column>
                <el-table-column prop="label" label="label"></el-table-column>
                <el-table-column prop="sort" label="sort"></el-table-column>
                <el-table-column prop="value" label="value"></el-table-column>
                <el-table-column 
                    width="80"
                    label="操作"
                    >
                    <template scope="scope">
                    <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
                    </template>
                </el-table-column>
                </el-table>
            </div>
        </kobe-table>
    </div>
    <el-dialog title="选择标签" v-model="showDialog" style="padding:1rem;">
        <kobe-table>
            <div slot="kobe-table-header" class="kobe-table-header">
                <el-row type="flex" justify="end">
                    <el-col :span="8">
                        <el-input v-model="EleKeyword" placeholder="请输入搜索关键字">
                        <el-button slot="append" @click="onSelectSearch" icon="search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div slot="kobe-table-content" class="kobe-table">
                <el-table
                    ref="multipleTable"
                    border
                    stripe
                    :data="fieldData"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column type="index" label="ID" width="50"></el-table-column>
                    <el-table-column prop="name" label="element"></el-table-column>
                    <el-table-column prop="type" label="type"></el-table-column>
                    <el-table-column prop="label" label="label"></el-table-column>
                    <el-table-column prop="sort" label="sort"></el-table-column>
                    <el-table-column prop="value" label="value"></el-table-column>
                </el-table>
            </div>
        </kobe-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="selectField">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  data () {
    return {
      id: this.$route.query.id,
      ids: [],
      response: {
        data: null
      },
      fieldData: null,
      npm: [],
      error: null,
      showDialog: false,
      stepsSelection: [],
      tableData: null,
      dialogType: '',
      form: {
        keyword: ''
      },
      EleKeyword: '',
      selected: {}
    }
  },
  methods: {
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
    // 删除表单
    deleteType (id) {
      this.$confirm('是否确认删除该标签', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.deleteReferenceFormAPI, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList({id: this.id})
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    // 模态框显示
    openDialog () {
      this.showDialog = true
      this.getElementData({id: this.id})
    },
    closeDialog () {
      this.showDialog = false
    },
    // 新增form确认
    selectField () {
      var obj = {}
      obj.id = Number(this.id)
      obj.ids = this.ids
      if (this.ids.length) {
        api.POST(config.createreferenceFormAPI, obj)
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('添加成功')
            this.getList({id: this.id})
            this.showDialog = false
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      }
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
      const data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage,
        ...this.form
      }
      this.getList(data)
    },
    onSearch () {
      const data = {
        id: this.id,
        ...this.form
      }
      this.getList(data)
    },
    onSelectSearch () {
      const data = {
        id: this.id,
        keyword: this.EleKeyword
      }
      this.getElementData(data)
    },
    // 标签列表数据请求0
    getList (data = {}) {
      api.GET(config.getfiledFormAPI, data)
      .then(response => {
        this.response = response.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 表单详情信息请求
    getDetailData (data = {}) {
      api.GET(config.detailActivityFormAPI, data)
      .then(response => {
        this.selected = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    // 选择标签数据请求
    getElementData (data = {}) {
      api.GET(config.queryfieldFormAPI, data)
      .then(response => {
        this.fieldData = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getDetailData({id: this.id})
    this.getList({id: this.id})
  }
}
</script>
<style scoped>
.FD-container{
    padding: 1rem 2rem;
    position: relative;
}
.FD-left{
    width: 20%;
    background-color: #fff;
}
.FD-left h4{
    padding:10px;
}
.FD-right{
    position: absolute;
    top: 0;
    right: 0;
    width: 80%;
}
</style>

