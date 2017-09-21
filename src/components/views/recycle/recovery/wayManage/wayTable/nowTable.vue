<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button type="primary" @click="openDialog">添加</el-button>
                <el-button type="primary" @click="handleCommand">批量删除</el-button>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                  <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button icon="upload2" type="primary"  style="margin-left:10px;"></el-button>
            <!-- <el-button icon="setting" type="primary"></el-button> -->
            <el-button  type="primary"><i class="newicon-config newicon"></i></el-button>
            </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
            ref="multipleTable"
            border
            stripe
            :data="response.data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="name" label="线路名称"></el-table-column>
            <el-table-column prop="description" label="线路描述"></el-table-column>
            <el-table-column prop="caterCount" label="服务商户数量"></el-table-column>
            <el-table-column prop="vehicleCount" label="清运车辆数量"></el-table-column>
            <el-table-column prop="companyName" label="所属清运公司"></el-table-column>
            <el-table-column label="控制" width="120">
              <template scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  on-text="开"
                  off-text="关"
                  @change="toswitch(scope.row.state, scope.row.id)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column 
                width="120"
                label="操作"
                >
                <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
                <el-button @click="openEdit(scope.row.id)" size="small" icon="edit" title="修改"></el-button>
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
                :page-sizes="[10 ,15 , 20, 50, 100]"
                :page-size="response.pageSize"
                :total="response.count"
                layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </el-col>
            </el-row>
        </div>
    </kobe-table>
    <el-dialog title="添加线路" v-model="showDialog" size="tiny">
         <el-form :model="selected" label-width="80px" ref="selected">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="清运公司">
                        <el-select v-model="selected.recycleId" placeholder="请选择清运公司" class="fullwidth">
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="线路名称">
                        <el-input v-model="selected.name" placeholder="请输入线路名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="线路描述">
                        <el-input type="textarea" v-model="selected.description" placeholder="请输入线路描述"></el-input>
                    </el-form-item>
                </el-col>
            </el-row> 
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button @click="addType" type="primary">确定</el-button>
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
      response: {
        data: null
      },
      form: {
        keyword: ''
      },
      ids: [],
      options: [],
      showDialog: false,
      selected: {
        state: null,
        name: null,
        recycleId: null,
        description: null
      }
    }
  },
  methods: {
    handleCommand () {
      this.deleteType()
    },
    transformDate (res) {
      res.data.forEach(v => {
        if (v.state === 1) {
          v.state = true
        }
        if (v.state === 0) {
          v.state = false
        }
      })
      return res
    },
    openEdit (id) {
      this.$router.push({
        path: '/admin/recycle/recovery/way/edit',
        query: {
          id: id
        }
      })
    },
    toswitch (state, id) {
      let data = {
        pageSize: this.response.pageSize,
        currentPage: this.response.currentPage
      }
      var obj = {
        id: id,
        state: Number(state)
      }
      api.POST(config.recovery.wayActive, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改状态成功！',
            type: 'success'
          })
          this.getList(data)
        }
      })
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
    // 删除表单
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选线路？', '错误', {
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
      this.$confirm('是否确认删除该线路', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.recovery.wayRemove, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    // 模态框显示
    openDialog () {
      this.showDialog = true
      this.getCompany()
    },
    closeDialog () {
      this.showDialog = false
    },
    addType () {
      this.selected.state = Number(this.selected.state)
      api.POST(config.recovery.wayAdd, this.selected)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('添加成功')
          this.closeDialog()
        } else {
          this.$message.error('发生错误，请重试')
        }
      })
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
      api.GET(config.recovery.wayIndex, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformDate(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getCompany (data = {}) {
      api.GET(config.recovery.wayRecycle, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.options = response.data.data
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
<style scoped>
</style>