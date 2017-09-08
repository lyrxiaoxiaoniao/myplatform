<template>
  <div class="loadometerStatistics-container">
    <TopInfo></TopInfo>
    <div class="bottom">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <!--
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
          -->
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
                <el-table-column prop="name" label="地磅点"></el-table-column>
                <el-table-column prop="time" label="时间（天）" width="150"></el-table-column>
                <el-table-column prop="type" label="垃圾类型" width="150"></el-table-column>
                <el-table-column prop="suttle_day" label="日净重量（吨）" width="150"></el-table-column>
                <el-table-column prop="time_day" label="日进场次数" width="150"></el-table-column>
                <el-table-column label="操作" width="120px">
                  <template scope="scope">
                    <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
                    <el-button size="small" icon="information" @click="toDetail(scope.row.id,scope.row.time)" title="详情"></el-button>
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
                <el-table-column prop="name" label="地磅点"></el-table-column>
                <el-table-column prop="time" label="时间（月）" width="150"></el-table-column>
                <el-table-column prop="type" label="垃圾类型" width="150"></el-table-column>
                <el-table-column prop="suttle_day" label="日净重量（吨）" width="150"></el-table-column>
                <el-table-column prop="time_day" label="日进场次数" width="150"></el-table-column>
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
                <el-table-column prop="name" label="地磅点"></el-table-column>
                <el-table-column prop="time" label="时间（年）" width="150"></el-table-column>
                <el-table-column prop="type" label="垃圾类型" width="150"></el-table-column>
                <el-table-column prop="suttle_day" label="日净重量（吨）" width="150"></el-table-column>
                <el-table-column prop="time_day" label="日进场次数" width="150"></el-table-column>
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
        loadometerId: 0, //  此地磅点的id
        activeTab: 'byDay'
      }
    },
    components: {
      TopInfo
    },
    computed: {},
    methods: {
      handleSizeChange (value) {
        console.log('切换显示条数后value' + value)
        var data = this.getHttpParams()
        Object.assign(data, {
          currentPage: this.response.currentPage,
          pageSize: value
        })
        // const data = {
        //   currentPage: this.response.currentPage,
        //   pageSize: value,
        //   ...this.form
        // }
        switch (this.activeTab) {
          case 'byDay':
            this.getListByDay(data)
            break
          case 'byMonth':
            this.getListByMonth(data)
            break
          case 'byYear':
            this.getListByYear(data)
            break
        }
      },
      handleCurrentChange (value) {
        var data = this.getHttpParams()
        Object.assign(data, {
          currentPage: value,
          pageSize: this.response.pageSize
        })
        // const data = {
        //   currentPage: value,
        //   pageSize: this.response.pageSize,
        //   ...this.form
        // }
        switch (this.activeTab) {
          case 'byDay':
            this.getListByDay(data)
            break
          case 'byMonth':
            this.getListByMonth(data)
            break
          case 'byYear':
            this.getListByYear(data)
            break
        }
      },
      handleTabClick () {
        var data = this.getHttpParams()
        switch (this.activeTab) {
          case 'byDay':
            this.getListByDay(data)
            break
          case 'byMonth':
            this.getListByMonth(data)
            break
          case 'byYear':
            this.getListByYear(data)
            break
        }
      },
      async deleteData (value) {
        // next表示是否进行下一步
        var next = true
        if (value) {
          this.selectIds(value)
        }
        if (!this.loadometerSelectedIds.length) {
          next = await this.warnSelection(next)
        }
        if (next) {
          next = await this.confirmDelete(next)
        }
        if (next) {
          console.log('发起请求')
          this.loadometerSelectedIds = []
          // api.POST(config.loadometer.delete, {ids: this.loadometerSelectedIds})
          // .then(response => {
          //   if (response.status !== 200) {
          //     this.error = response.statusText
          //     return
          //   }
          //   if (response.data.errcode === '0000') {
          //     this.onSuccess('删除成功')
          //     this.getList()
          //   }
          // })
          // .catch(error => {
          //   this.$message.error(error)
          // })
        }
      },
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否删除
      confirmDelete (next) {
        return this.$confirm('此操作将删除选定的文章。是否继续删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      getListByDay (data = {}) {
        api.GET(config.loadometer.suttleDay, data)
          .then(response => {
            this.response.data = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      getListByMonth (data = {}) {
        data = this.getHttpParams()
        api.GET(config.loadometer.suttleMonth, data)
          .then(response => {
            // console.log('之前this.response.data' + this.response.data)
            this.response.data = this.transformData(response.data.data)
            // console.log('之后this.response.data' + this.response.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      getListByYear (data = {}) {
        data = this.getHttpParams()
        api.GET(config.loadometer.suttleYear, data)
          .then(response => {
            this.response.data = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      transformData (res) {
        res.forEach(v => {
          if (v.created_at) {
            v.created_at = this.formatDate(v.created_at)
          }
          if (v.type === 0) {
            v.type = '大件垃圾'
          }
          if (v.type === 1) {
            v.type = '餐厨垃圾'
          }
        })
        return res
      },
      // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      },
      getHttpParams () {
        // 获取id参数和年份参数
        var obj = {}
        var date = new Date()
        obj.time = date.getFullYear().toString()
        obj.id = this.$route.query.id
        return obj
      },
      // 单行记录、多行记录、未选择记录操作生成id数组
      selectIds (value) {
        this.loadometerSelectedIds = []
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组，未选择记录未传参数
        if (value !== undefined) {
          // console.log('有选中记录')
          if (value.length === undefined) {
            this.loadometerSelectedIds.push(value)
          } else {
            // console.log('选中多行')
            this.loadometerSelectedIds = value.map(v => {
              return v.id
            })
          }
        }
      },
      toDetail (id, time) {
        this.$router.push({
          path: '/admin/recycle/loadometerInformation/detail',
          query: {
            id,
            time
          }
        })
      }
    },
    mounted () {
      this.loadometerId = this.$route.query.id
      this.response.currentPage = 1
      this.response.pageSize = 10
      var data = this.getHttpParams()
      this.getListByDay(data)
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