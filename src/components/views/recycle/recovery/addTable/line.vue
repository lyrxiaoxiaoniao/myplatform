<template>
  <div>
    <div class="lh-header">
        <div>服务线路列表</div>
        <div>
          <el-button type="primary">添加</el-button>
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
            <el-table-column prop="id" label="线路" width="200"></el-table-column>
            <el-table-column prop="id" label="描述"></el-table-column>
            <el-table-column prop="id" label="服务商户数量" width="120"></el-table-column>
            <el-table-column width="80" label="操作">
              <template scope="scope">
                <el-button size="small" icon="delete2" title="删除"></el-button>
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

      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['companyId'],
  data () {
    return {
      response: {
        data: null
      },
      multipleSelection: [],
      ids: [],
      showDialog: false
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
    getList (data = {}) {
      console.log(1111)
      // api.GET(config.showWordSourceListAPI, data)
      // .then(response => {
      //   this.response = response.data.data
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