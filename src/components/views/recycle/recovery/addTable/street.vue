<template>
<div>
    <div class="lh-header">
        <div>服务街道列表</div>
        <div>
          <el-button @click="openStreet" type="primary">添加</el-button>
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
            <el-table-column prop="id" label="ID" width="60"></el-table-column>
            <el-table-column prop="title" label="街道" width="200"></el-table-column>
            <el-table-column prop="detailAddress" label="地址"></el-table-column>
            <el-table-column width="80" label="操作">
              <template scope="scope">
                <el-button @click="deleteType(scope.row.id)" size="small" icon="delete2" title="删除"></el-button>
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
    <el-dialog v-model="showDialog" title="新增服务街道" size="tiny">
      <el-form :model="selected" label-width="40px">
        <el-form-item label="街道">
          <el-select v-model="selected.region_id" class="fullwidth" placeholder="请选择街道">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="selected.detailAddress" placeholder="请输入具体地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button @click="addStreet" type="primary">保存</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  props: ['companyId'],
  data () {
    return {
      response: {
        data: null
      },
      options: [],
      selected: {
        region_id: null,
        detailAddress: null
      },
      multipleSelection: [],
      ids: [],
      showDialog: false
    }
  },
  methods: {
    openStreet () {
      Object.keys(this.selected).forEach(key => {
        this.selected[key] = null
      })
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    addStreet () {
      const data = {
        recycle_id: Number(this.companyId),
        ...this.selected
      }
      api.POST(config.recovery.serviceAdd, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('添加服务街道成功！！')
          this.showDialog = false
          this.getList({recycle_id: this.companyId})
        }
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
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
      // if (id) {
      //   this.ids = []
      //   this.ids.push(id)
      // }
      // if (this.ids.length === 0) {
      //   this.$confirm('请进行正确操作，请先勾选服务街道？', '错误', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'error'
      //   }).then(() => {
      //     return
      //   }).catch(() => {
      //     return
      //   })
      //   return
      // }
      this.$confirm('是否确认是否删除服务街道', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.recovery.serviceRemove, {
          id: id
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.getList({recycle_id: this.companyId})
          } else {
            this.$message.error('发生错误，请重试')
          }
        })
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        recycle_id: this.companyId,
        ...this.form
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        recycle_id: this.companyId,
        ...this.form
      }
      this.getList(data)
    },
    getList (data = {}) {
      api.GET(config.recovery.service, data)
      .then(response => {
        this.response = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getDropdata () {
      api.GET(config.recovery.dropService)
      .then(response => {
        this.options = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getList({recycle_id: this.companyId})
    this.getDropdata()
  }
}
</script>
<style lang="scss" scoped>
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
</style>