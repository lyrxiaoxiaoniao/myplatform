<template>
<div class="st-container">
    <div class="lh-header">
        <div>服务企业</div>
        <div>
          <el-button>解除</el-button>
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
            <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
            <el-table-column prop="name" label="企业名称" width="200"></el-table-column>
            <el-table-column prop="memo" label="详细地址"></el-table-column>
            <el-table-column prop="dutyName" label="负责人"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column width="95" label="操作">
              <template scope="scope">
                <el-button>解除</el-button>
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
    <el-dialog title="添加服务企业" v-model="showDialog">
      <kobe-table>
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
              <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
              <el-table-column prop="brand" label="企业名称"></el-table-column>
              <el-table-column prop="companyName" label="详细地址"></el-table-column>
              <el-table-column prop="number" label="负责人" width="140"></el-table-column>
              <el-table-column prop="id" label="联系电话" width="140"></el-table-column>
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
      selected: {
        data: null
      },
      showDialog: false,
      form: {
        keyword: null
      }
    }
  },
  methods: {
    openAdd () {
      this.showDialog = true
    },
    closeDialog () {
      this.showDialog = false
    },
    addConfirm () {
      console.log(1)
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
      api.GET(config.recovery.wayCater, {...data, recycleId: this.recycleId, id: this.wayId})
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
      // api.GET(config.recovery.wayCar, {...data, recycleId: this.recycleId, id: this.wayId})
      // .then(response => {
      //   if (response.data.errcode === '0000') {
      //     this.response = response.data.data
      //   }
      // })
      // .catch(error => {
      //   this.$message.error(error)
      // })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
 .st-container{
    margin-top: 1rem;
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