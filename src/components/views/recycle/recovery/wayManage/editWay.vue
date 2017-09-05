<template>
<div class="lh-container">
    <div class="lh-top">
        <div class="lh-header">
            <div>基本信息</div>
            <div>
                <el-button>返回</el-button>
                <el-button type="primary">添加</el-button>
            </div>
        </div>
        <div class="lh-form">
            <el-form :model="selected" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12">
                <el-form-item label="线路名称">
                    <el-input placeholder="请输入"></el-input>
                </el-form-item>
                </el-col>  
                <el-col :span="12">
                <el-form-item label="所属清运公司">
                    <el-input placeholder="请输入"></el-input>
                </el-form-item>
                </el-col>  
                <el-col :span="24">
                <el-form-item label="线路描述">
                    <el-input type="textarea" placeholder="请输入"></el-input>
                </el-form-item>
                </el-col> 
            </el-row>
            </el-form>
        </div>
    </div>
    <div class="lh-top">
        <!-- 清除车辆 -->
        <clear-car-table></clear-car-table>
    </div>
    <div class="lh-top">
        <!-- 服务企业 -->
        <service-table></service-table>
    </div>
</div>
</template>
<script>
import clearCarTable from './wayTable/clearCarTable'
import serviceTable from './wayTable/serviceTable'
export default {
  data () {
    return {
      response: {
        data: null
      },
      multipleSelection: [],
      ids: []
    }
  },
  components: {
    clearCarTable,
    serviceTable
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
.lh-container {
    padding: 1rem 2rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        // padding-bottom: 1rem;
        margin-bottom: 1rem;
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
        .lh-form {
            margin: 1rem 2rem;
        }
    }
}
</style>