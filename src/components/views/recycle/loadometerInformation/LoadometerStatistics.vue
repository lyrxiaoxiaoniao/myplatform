<template>
  <div class="loadometerStatistics-container">
    <TopInfo></TopInfo>
    <div class="bottom">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
            <el-button type="primary" icon="upload2" style="margin-left: 10px"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="按天" name="byDay">
              <el-table 
                :data="response.data"
                border
                stripe
                @selection-change="selectIds">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="地磅点" width="150"></el-table-column>
                <el-table-column prop="display_name" label="时间（天）" width="150"></el-table-column>
                <el-table-column prop="articleCount" label="垃圾类型" width="200"></el-table-column>
                <el-table-column prop="display_name" label="日净重量（吨）" width="150"></el-table-column>
                <el-table-column prop="display_name" label="日进场次数"></el-table-column>
                <el-table-column label="操作" width="120px">
                  <template scope="scope">
                    <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
                    <el-button size="small" icon="information" @click="toDetail(scope.row.id)" title="详情"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="按月" name="byMonth">
              <el-table 
                :data="response.data"
                border
                stripe
                @selection-change="selectIds">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="地磅点" width="150"></el-table-column>
                <el-table-column prop="display_name" label="时间（月）" width="150"></el-table-column>
                <el-table-column prop="articleCount" label="垃圾类型" width="200"></el-table-column>
                <el-table-column prop="display_name" label="日净重量（吨）" width="150"></el-table-column>
                <el-table-column prop="display_name" label="日进场次数"></el-table-column>
                <el-table-column label="操作" width="80px">
                  <template scope="scope">
                    <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="按年" name="byYear">
              <el-table 
                :data="response.data"
                border
                stripe
                @selection-change="selectIds">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="地磅点" width="150"></el-table-column>
                <el-table-column prop="display_name" label="时间（年）" width="150"></el-table-column>
                <el-table-column prop="articleCount" label="垃圾类型" width="200"></el-table-column>
                <el-table-column prop="display_name" label="日净重量（吨）" width="150"></el-table-column>
                <el-table-column prop="display_name" label="日进场次数"></el-table-column>
                <el-table-column label="操作" width="80px">
                  <template scope="scope">
                    <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
          <el-row type="flex" justify="center">
            <el-button type="text" style="color: #48576a; padding:5px 0;" @click="deleteData()">删除</el-button>
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
    </div>
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  import TopInfo from './TopInfo.vue'

  export default {
    name: 'sc-loadometerStatistics-table',
    data () {
      return {
        response: {
          data: null
        },
        loadometerSelectedIds: [],
        loadometerId: 0, //  表格操作单行时的id
        activeTab: 'byDay'
      }
    },
    components: {
      TopInfo
    },
    computed: {},
    methods: {
      handleSizeChange (value) {
        // const data = {
        //   currentPage: this.response.currentPage,
        //   pageSize: value,
        //   ...this.form
        // }
        switch (this.activeTab) {
          case 'byDay':
            // 请求按天统计数据
            console.log('请求按天统计数据')
            break
          case 'byMonth':
            console.log('请求按天统计数据')
            break
          case 'byYear':
            console.log('请求按天统计数据')
            break
        }
      },
      handleCurrentChange (value) {
        // const data = {
        //   currentPage: value,
        //   pageSize: this.response.pageSize,
        //   ...this.form
        // }

        switch (this.activeTab) {
          case 'byDay':
            // 请求按天统计数据
            console.log('请求按天统计数据')
            break
          case 'byMonth':
            console.log('请求按天统计数据')
            break
          case 'byYear':
            console.log('请求按天统计数据')
            break
        }
      },
      handleTabClick () {
        switch (this.activeTab) {
          case 'byDay':
            console.log('获取按天统计数据')
            break
          case 'byMonth':
            console.log('获取按月统计数据')
            break
          case 'byYear':
            console.log('获取按年统计数据')
            break
        }
      },
      // 确认是否已选择要操作的数据
      warnSelection () {
        this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return true
        }).catch(() => {
          return false
        })
      },
      // 确认是否删除
      confirmDelete () {
        this.$confirm('此操作将删除选定的文章。是否继续删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return true
        }).catch(() => {
          return false
        })
      },
      deleteData (value) {
        var next = 1
        this.selectIds(value)
        if (!this.loadometerSelectedIds) {
          next = this.warnSelection()
        }
        if (next) {
          next = this.confirmDelete()
        }
        if (next) {
          switch (this.activeTab) {
            case 'byDay':
              // 请求删除按天统计数据
              api.POST(config.deleteCategoryAPI, {ids: this.loadometerSelectedIds})
                .then(response => {
                  if (response.status !== 200) {
                    this.error = response.statusText
                    return
                  }
                  if (response.data.errcode === '0000') {
                    this.onSuccess('删除成功')
                    this.getList()
                  }
                })
                .catch(error => {
                  this.$message.error(error)
                })
              break
            case 'byMonth':
              console.log('请求删除按天统计数据')
              break
            case 'byYear':
              console.log('请求删除按天统计数据')
              break
          }
        }
      },
      // 单行记录和多行记录操作生成id数组
      selectIds (value) {
        this.loadometerSelectedIds = []
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组
        if (value.length === undefined) {
          this.loadometerSelectedIds.push(value)
        } else {
          this.loadometerSelectedIds = value.map(v => {
            return v.id
          })
        }
      },
      toDetail (id) {
        this.$router.push({
          path: '/admin/recycle/loadometerInformation/detail',
          query: {
            id: id
          }
        })
      }
    },
    mounted () {
      // 获取地磅点信息
      // 获取地磅点按天信息统计信息
    }
  }
</script>

<style lang="scss" scoped>
  .loadometerStatistics-container {
    padding: 1rem 2rem;
    .bottom {
      border: 1px solid lightgray;
      background-color: #fff;
      border-radius: 5px;
      width: 100%;
      padding-bottom: 1rem;
    }
    .bottom {
      margin-top: 1rem;
    }
    .table-head {
      padding: 0 2rem;
      width: 100%;
      display: flex;
      align-items: center;
      height: 60px;
    }
    .table-body {
      margin: 1rem 2rem;
    }
  }
</style>