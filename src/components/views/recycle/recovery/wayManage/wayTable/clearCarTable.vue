<template>
<div class="st-container">
    <div class="lh-header">
        <div>清运车辆</div>
        <div>
          <el-button @click="allDelete">解除</el-button>
          <el-button @click="openAdd" type="primary">添加</el-button>
        </div>
    </div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header"></div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table
            ref="multipleTable"
            border
            stripe
            :data="response.data"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="id" label="ID" width="70"></el-table-column>
            <el-table-column prop="brand" label="品牌" width="150"></el-table-column>
            <el-table-column prop="companyName" label="所属清运公司"></el-table-column>
            <el-table-column prop="number" label="车牌号"></el-table-column>
            <el-table-column prop="id" label="驾驶人"></el-table-column>
            <el-table-column width="80" label="操作">
              <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2"></el-button>
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
    <el-dialog title="添加清运车辆" v-model="showDialog">
        <kobe-table style="margin-top: -20px;">
          <div slot="kobe-table-header" class="kobe-table-header">
             <el-row type="flex" justify="end">
                <el-col :span="8">
                    <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                        <el-button slot="append" @click="onSearch" icon="search"></el-button>
                    </el-input>
                </el-col>
              </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              ref="multipleTable"
              border
              stripe
              :data="selected.data"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="brand" label="品牌" width="150"></el-table-column>
              <el-table-column prop="companyName" label="所属清运公司"></el-table-column>
              <el-table-column prop="number" label="车牌号"></el-table-column>
              <el-table-column prop="id" label="驾驶人"></el-table-column>
            </el-table>
          </div>
          <div slot="kobe-table-footer" class="kobe-table-footer">
              <el-row type="flex" justify="center">
                <el-col :span="8">
                    <el-pagination
                    @size-change="handleSizeChangeDialog"
                    @current-change="handleCurrentChangeDialog"
                    :current-page="selected.currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="selected.pageSize"
                    :total="selected.count"
                    layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                </el-col>
              </el-row>
          </div>
      </kobe-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="addConfirm" type="primary">添 加</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: ['recycleId', 'wayId'],
  data () {
    return {
      response: {
        data: null
      },
      multipleSelection: [],
      ids: [],
      showDialog: false,
      selected: {
        data: null
      },
      form: {
        keyword: null
      }
    }
  },
  methods: {
    openAdd () {
      this.showDialog = true
      this.getNoList()
    },
    allDelete () {
      this.deleteType()
    },
    closeDialog () {
      this.showDialog = false
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    addConfirm () {
      api.POST(config.recovery.wayCarAdd, {
        ids: this.ids,
        id: this.wayId
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('添加成功')
          this.closeDialog()
          this.getList()
        } else {
          this.$message.error('发生错误，请重试')
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
    deleteType (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请先勾选清运车辆？', '错误', {
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
      this.$confirm('是否确认是否删除清运车辆', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.recovery.wayCarRemove, {
          ids: this.ids
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList()
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize
      }
      this.getList(data)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.selected.pageSize,
        ...this.form
      }
      this.getNoList(data)
    },
    handleSizeChangeDialog (value) {
      const data = {
        currentPage: this.selected.currentPage,
        pageSize: value,
        ...this.form
      }
      this.getNoList(data)
    },
    handleCurrentChangeDialog (value) {
      const data = {
        currentPage: value,
        pageSize: this.selected.pageSize,
        ...this.form
      }
      this.getNoList(data)
    },
    getList (data = {}) {
      api.GET(config.recovery.wayCar, {...data, recycleId: this.recycleId, id: this.wayId})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getNoList (data = {}) {
      api.GET(config.recovery.wayCarRelate, {...data, recycleId: this.recycleId, id: this.wayId})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.selected = response.data.data
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
<style lang="scss" scoped>
  .st-container{
    background-color: #fff;
    border: 1px solid lightgray;
    border-radius: 5px;
    .lh-header {
        padding: 0 2rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid lightgray;
        div:nth-of-type(1){
          font-size: 16px;
        }
      }
 }
</style>