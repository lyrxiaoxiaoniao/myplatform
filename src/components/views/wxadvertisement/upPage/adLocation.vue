<template>
  <div class="UP-container">
    <div  class="sc-header">
      <el-button type="primary" @click="goBack()"><<返回</el-button>
      <el-button type="primary" @click="toDialog()">选择广告内容</el-button>
    </div>
    <div class="up-adcontent">
        <div class="up-adcontent-header">
            <el-col :span="20" style="margin-top:10px;"><h4 style="margin-left:2rem;">广告位基本信息</h4></el-col>
            <el-col :span="4" v-show="false" style="margin-top:10px;"><el-button style="float:right;margin-right:10px;" @click="toDetail()">详情</el-button></el-col>
        </div>
        <div class="up-point-content">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="点位名称:">
                <p v-text="ruleForm.spacename"></p>
            </el-form-item>
            <el-form-item label="点位分类:">
                <p v-text="ruleForm.typename"></p>
            </el-form-item>
            <el-form-item label="点位说明:">
                <p v-text="ruleForm.description"></p>
            </el-form-item>
          </el-form>   
        </div> 
    </div>
    <div class="up-content-right">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:10px;">
          <el-tab-pane label="当前内容" name="first">
              <el-table :data="data.data" border stripe
                  @selection-change="handleSelectionChange"
                  ref="multipleTable"
                  style="max-height:500px;overflow:auto;">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column type="index" label="ID" width="50"></el-table-column>
                  <el-table-column prop="title" label="广告内容名称" ></el-table-column>
                  <el-table-column prop="poster" label="素材" width="120">
                    <template scope="scope">
                      <img width="100%" :src="scope.row.poster" @click="bigImg(scope.row.poster)" alt="">
                      <el-dialog v-model="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                      </el-dialog>
                    </template>
                  </el-table-column>
                  <el-table-column prop="beginTime" label="上画时间" width="140"></el-table-column>
                  <el-table-column prop="endTime" label="下画时间" width="140"></el-table-column>
                  <el-table-column prop="watchcount" label="限量" width="80px"></el-table-column>
                  <el-table-column prop="type" label="上画模式" width="100px"></el-table-column>
                  <el-table-column label="状态" width="100px">
                  <template scope="scope">
                      <el-switch
                      v-model="scope.row.state"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.state, scope.row.id)">
                      </el-switch>
                  </template> 
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                      <template scope="scope">
                      <el-button size="small" icon="delete2" @click="removepointToAdv(scope.row.id)" title="删除"></el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div style="margin-top: 15px;">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="color: #48576a; padding:5px 0;" @click="removepointToAdv()">删除</el-button>
                    <el-col :span="12">
                        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="data.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="data.pageSize"
                        :total="data.count"
                        layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </el-col>
                  </el-row>
              </div>
          </el-tab-pane>
          <el-tab-pane label="历史内容" name="second">
              <el-table :data="response.data" border stripe
                  @selection-change="handleSelectionChange"
                  ref="multipleTable"
                  style="max-height:500px;overflow:auto;">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column type="index" label="ID" width="50"></el-table-column>
                  <el-table-column prop="title" label="广告内容名称" ></el-table-column>
                  <el-table-column prop="poster" label="素材" width="120">
                    <template scope="scope">
                      <img width="100%" :src="scope.row.poster" @click="bigImg(scope.row.poster)" alt="">
                    </template>
                  </el-table-column>
                  <el-table-column prop="beginTime" label="上画时间" width="140"></el-table-column>
                  <el-table-column prop="endTime" label="下画时间" width="140"></el-table-column>
                  <el-table-column prop="watchcount" label="限量" width="80px"></el-table-column>
                  <el-table-column prop="type" label="上画模式" width="100px"></el-table-column>
                  <el-table-column label="状态" width="100px">
                  <template scope="scope">
                      <el-switch
                      v-model="scope.row.state"
                      on-text="开"
                      off-text="关"
                      @change="toswitch(scope.row.state, scope.row.id)">
                      </el-switch>
                  </template> 
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                      <template scope="scope">
                      <el-button size="small" icon="delete2" @click="removepointToAdv(scope.row.id)" title="删除"></el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div style="margin-top: 15px;">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="color: #48576a; padding:5px 0;" @click="removepointToAdv()">删除</el-button>
                    <el-col :span="12">
                        <el-pagination
                        @size-change="handleSizeChange1"
                        @current-change="handleCurrentChange1"
                        :current-page="response.currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="response.pageSize"
                        :total="response.count"
                        layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                    </el-col>
                  </el-row>
              </div>
          </el-tab-pane>
          <el-tab-pane label="点击统计" name="third">
            <div class="block echart-search" >
              <span class="demonstration">点击及展示统计情况:</span>
              <el-date-picker
                v-model="value4"
                type="daterange"
                :picker-options="pickerOptions2"
                placeholder="选择时间范围30天以内"
                align="center"
                style="width:620px">
              </el-date-picker>
              <el-button type="primary"  @click="searchEchart()">搜索</el-button>
            </div>
            <div id="myChart" style="width: 800px; height:400px;margin-top:35px;"></div>
          </el-tab-pane>
      </el-tabs>
      <!--弹出框-->
      <el-dialog title="选择广告内容" v-model="dialogTableVisible">
          <div>
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="上画方式">
                      <el-select v-model="formInline.type" placeholder="活动区域">
                      <el-option label="按上画时间" value="1"></el-option>
                      <el-option label="按点击量" value="2"></el-option>
                      <el-option label="按展示量" value="3"></el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="上限数量">
                      <el-input-number
                      :disabled="Number(formInline.type) < 2"
                      v-model="formInline.num"
                      :min="0" :max="99999"></el-input-number>
                  </el-form-item>
                  <el-form-item label="起止时间">
                      <el-date-picker
                          v-model="value3"
                          type="datetimerange"
                          placeholder="选择时间范围">
                      </el-date-picker>
                  </el-form-item>
              </el-form>
          </div>
          <div style="border-top: 1px solid lightgray;padding-top: 1rem;">
              <div class="grid-content">
                  <el-input placeholder="请输入内容" v-model="keyword" style="width:35%;float:right;margin:0 10px 10px 0">
                      <el-button slot="append" icon="search" @click="searchKeyword"></el-button>
                  </el-input>
              </div>
              <template>
                  <el-table
                      class="dialog-table"
                      ref="multipleTable"
                      :data="tableData3"
                      border
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange">
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column type="index" label="ID" width="50"></el-table-column>
                      <el-table-column prop="title" label="内容名称" width="120"></el-table-column>
                      <el-table-column prop="poster" label="内容素材" width="120">
                      <template scope="scope">
                        <img width="100%" :src="scope.row.poster" @click="bigImg(scope.row.poster)" alt="">
                      </template>
                      </el-table-column>
                      <el-table-column prop="memo" label="内容说明" show-overflow-tooltip></el-table-column>
                  </el-table>
              </template>
          </div>
          <div class="up-dialog-footer">
              <el-button @click="dialogTableVisible = false">取消</el-button>
              <el-button type="primary" @click="pointToAdv">保存</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import echarts from 'echarts'
export default {
  data () {
    return {
      id: this.$route.query.id,
      value3: '',
      formInline: {
        num: 99999,
        type: '1'
      },
      ruleForm: {},
      response: {},
      data: {},
      activeName: 'first',
      tableData3: [],
      multipleSelection: [],
      dialogTableVisible: false,
      ids: [],
      dialogImageUrl: '',
      dialogVisible: false,
      keyword: null,
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      value4: '',
      echartData: {
        dateTime: [],
        clickCount: [],
        showCount: []
      }
    }
  },
  methods: {
    changeDate (value) {
      let date = new Date(value)
      let M = date.getMonth() + 1
      M = M < 10 ? ('0' + M) : M
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      value = `${date.getFullYear()}-${M}-${d}`
      return value
    },
    getEchartsData (res) {
      this.echartData.dateTime = []
      this.echartData.clickCount = []
      this.echartData.showCount = []
      res.forEach(v => {
        this.echartData.dateTime.push(this.changeDate(v.date))
        this.echartData.clickCount.push(v.clikCount)
        this.echartData.showCount.push(v.showCount)
      })
    },
      /**
      * echarts 搜索的数据
    */
    searchEchart () {
      var obj = {}
      obj.id = this.id
      obj.beginTime = this.value4[0].getTime()
      obj.endTime = this.value4[1].getTime()
      this.queryCount(obj)
    },
    queryCount (obj) {
      api.GET(config.getPointCountAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.getEchartsData(response.data.data)
          this.drawEchart()
        }
      })
    },
    drawEchart () {
      var myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '点击量显示量对比图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['点击量', '显示量']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.echartData.dateTime
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '点击量',
            type: 'line',
            data: this.echartData.clickCount
          },
          {
            name: '显示量',
            type: 'line',
            data: this.echartData.showCount
          }
        ]
      })
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
    transformDate (res) {
      res.data.forEach(v => {
        if (v.createdAt) {
          v.createdAt = this.formatDate(v.createdAt)
        }
        if (v.beginTime) {
          v.beginTime = this.formatDate(v.beginTime)
        }
        if (v.endTime) {
          v.endTime = this.formatDate(v.endTime)
        }
        if (v.state === 1) {
          v.state = true
        }
        if (v.state === 0) {
          v.state = false
        }
        if (v.type === 1) {
          v.type = '按上画时间'
        }
        if (v.type === 2) {
          v.type = '按点击量'
        }
        if (v.type === 3) {
          v.type = '按显示量'
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
    toDialog () {
      this.dialogTableVisible = true
      this.advData()
    },
    searchKeyword () {
      api.GET(config.selectAdvAPI, {id: this.id, typeId: this.ruleForm.typeId, keyword: this.keyword})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.tableData3 = response.data.data
        }
      })
    },
    handleClick (tab, event) {
      if (this.activeName === 'second') {
        this.getHistory()
      }
      var obj = {}
      obj.id = this.id
      obj.beginTime = Date.now() - 3600 * 1000 * 24 * 7
      obj.endTime = Date.now()
      this.queryCount(obj)
    },
    getHistory () {
      api.GET(config.getAdvPointAPI, {id: this.id, typeId: this.ruleForm.typeId})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.response = this.transformDate(response.data.data)
        }
      })
    },
    handleSizeChange (value) {
      this.updateList({
        currentPage: this.response.currentPage,
        pageSize: value,
        id: this.id,
        isvalid: 1,
        typeId: this.ruleForm.typeId
      })
    },
    handleCurrentChange (value) {
      this.updateList({
        currentPage: value,
        pageSize: this.response.pageSize,
        id: this.id,
        isvalid: 1,
        typeId: this.ruleForm.typeId
      })
    },
    handleSizeChange1 (value) {
      this.updateList({
        currentPage: this.response.currentPage,
        pageSize: value,
        id: this.id,
        typeId: this.ruleForm.typeId
      })
    },
    handleCurrentChange1 (value) {
      this.updateList({
        currentPage: value,
        pageSize: this.response.pageSize,
        id: this.id,
        typeId: this.ruleForm.typeId
      })
    },
    // 为调接口
    updateList (obj) {
      api.GET(config.getAdvPointAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          if (obj.isvalid) {
            this.data = this.transformDate(response.data.data)
          } else {
            this.response = this.transformDate(response.data.data)
          }
        }
      })
    },
    getAdData () {
      api.GET(config.showAdvPointAPI, {id: this.id})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.ruleForm = response.data.data
          this.getPoint()
        }
      })
    },
    toDetail () {
      this.$router.push({
        path: '/admin/ad/point/detail',
        query: {
          id: this.id
        }
      })
    },
    goBack () {
      this.$router.push({
        path: '/admin/ad/point/index'
      })
    },
    getPoint () {
      api.GET(config.getAdvPointAPI, {id: this.id, isvalid: 1, typeId: this.ruleForm.typeId})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.data = this.transformDate(response.data.data)
        }
      })
    },
    advData () {
      api.GET(config.selectAdvAPI, {id: this.id, typeId: this.ruleForm.typeId})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.tableData3 = response.data.data
        }
      })
    },
    pointToAdv () {
      // pointToAdvAPI
      if (!this.value3) {
        this.$notify.info({
          title: '消息',
          message: '请选择时间区间！'
        })
      }
      var obj = {}
      obj.type = Number(this.formInline.type)
      obj.limitCount = Number(this.formInline.num)
      obj.beginTime = this.value3[0].getTime()
      obj.endTime = this.value3[1].getTime()
      obj.ids = this.ids
      obj.id = Number(this.id)
      api.POST(config.pointToAdvAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '添加成功！！！',
            type: 'success'
          })
          this.dialogTableVisible = false
          this.getPoint()
        }
      })
    },
    // removepointToAdvAPI
    removepointToAdv (deleteid) {
      if (deleteid) {
        this.ids = []
        this.ids.push(deleteid)
      }
      if (this.ids.length === 0) {
        this.$confirm('错误操作，请勾选删除对象？', '错误', {
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
      this.$confirm('此操作将删除该广告内容，删除后，数据无法恢复。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        api.POST(config.removepointToAdvAPI, {ids: this.ids})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success'
            })
            this.getPoint()
            this.getHistory()
          }
        })
      }).catch(() => {
        this.$notify.info({
          title: '消息',
          message: '已取消删除！'
        })
      })
    },
    toswitch (state, id) {
      if (state) {
        state = 1
      } else {
        state = 0
      }
      api.POST(config.stateChangeAPI, {id: id, state: state})
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.getPoint()
          this.$notify({
            title: '成功',
            message: '状态切换成功！',
            type: 'success'
          })
        }
      })
    }
  },
  mounted () {
    this.getAdData()
  }
}
</script>
<style scoped>
.UP-container {
    padding: 0 3rem 0;
    position: relative;
}
.up-adcontent {
    background-color: #fff;
    border: 1px solid lightgray;
    width: 30%;
}
.up-adcontent-header {
    border-bottom: 1px solid lightgray;
    height: 60px;
}
.up-point-content {
    margin-top: 20px;
    position: relative;
}
.up-content-right {
  width: 65%;
  position: absolute;
  right: 3rem;
  top: 45px;
}
.sc-header {
    margin: 10px 0 10px 0;
}
.up-dialog-footer{
    margin-top: 1rem;
    text-align: right;
}
.dialog-table {
    overflow: auto;
    max-height: 400px;
}
.echart-search {
  margin-bottom: 20px;
}
.echart-search span {
  font-size: 16px;
  font-weight: 700;
  margin: 0 5px;
}
</style>