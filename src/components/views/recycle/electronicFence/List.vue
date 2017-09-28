<template>
  <div class="sc-fence-list">
    <kobe-table>
      <div class="kobe-table-header"
           slot="kobe-table-header">
        <el-row type="flex"
                justify="space-between">
          <el-col>
            <el-button type="primary"
                       icon="plus"
                       @click="addFence">新增</el-button>
          </el-col>
          <el-col :span="14">
            <el-input placeholder="请输入关键字"
                      class="sc-table-header-select"
                      v-model="searchForm.keyword">
              <el-select v-model="searchForm.type"
                         placeholder="请选择"
                         slot="prepend"
                         style="width:130px;"
                         >
                <el-option v-for="item in options"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <el-button slot="append"
                         class="sc-table-search-btn"
                         icon="search"
                         @click="getList(searchForm)"></el-button>
            </el-input>
          </el-col>
          <el-button type="primary"
                     icon="upload2"
                     style="margin-left: 10px"
                     ></el-button>
          <el-button type="primary"
                     icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content"
           class="kobe-table">
        <el-table :data="response.data"
                  border>
          <el-table-column label="ID"
                           prop="id"></el-table-column>
          <el-table-column label="围栏名称"
                           prop="name"></el-table-column>
          <el-table-column label="围栏描述"
                           prop="description"></el-table-column>
          <el-table-column label="划分方式"
                           prop="typeName"></el-table-column>
          <el-table-column label="限制车辆数"
                           prop="confine_vehicle"></el-table-column>
          <el-table-column label="操作"
                           width="200">
            <template scope="scope">
              <el-button icon="setting"
                         size="small"
                         @click="configItem(scope.row.id)"></el-button>
              <el-button icon="delete2"
                         @click="deleteItem(scope.row.id)"
                         size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer"
           class="kobe-table-footer">
        <el-row type="flex"
                justify="center">
          <el-col :span="12">
            <el-pagination @size-change="handleSizeChange"
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
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data() {
    return {
      listData: [{ id: 0 }],
      response: {},
      selectValue: '',
      options: [{
        value: 1,
        label: '按多边形划分'
      },
      {
        value: 0,
        label: '行政区域划分'
      },
      {
        value: '',
        label: '全部分类'
      }],
      advanceVisible: false,
      advanceSearchForm: {
        keyword: '',
        name: '',
        mobile: '',
        person: '',
        address: ''
      },
      searchForm: {
        keyword: '',
        type: ''
      },
      infoVisible: false,
      info: {
        infoForm: {}
      },
      fileList: [],
      content: '',
      searchInput: '',
      point: {},
      pointAddress: '',
      map: null,
      geoc: null
    }
  },
  methods: {
    openDialog(e) {
      this[e] = true
    },
    hideDialog(e) {
      this[e] = false
    },
    addFence() {
      this.$router.push('new')
    },
    configItem(id) {
      this.$router.push({ path: 'config', query: { id } })
    },
    deleteItem(id) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.fence.delete, { ids: [id] }).then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    transformData(data) {
      data.data.forEach(i => {
        if (i.type === 0) {
          i.typeName = '行政区域划分'
        } else if (i.type === 1) {
          i.typeName = '多边形划分'
        }
      })
      return data
    },
    getList(data = {}) {
      api.GET(config.fence.index, data).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.response = this.transformData(res.data.data)
        } else if (res.status === 200 && res.data.errcode === '5000') {
          this.response.data = []
        }
      })
    },
    handleSizeChange(value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.searchForm
      }
      this.getList(data)
    },
    handleCurrentChange(value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.searchForm
      }
      this.getList(data)
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>

</style>
