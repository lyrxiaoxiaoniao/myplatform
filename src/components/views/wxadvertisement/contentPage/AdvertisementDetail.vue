<template>
<div class="sc-top-line">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
          <el-form-item label="内容名称">
            <p v-text="ruleForm.title"></p>
          </el-form-item>
          <el-form-item label="内容分类">
            <p v-text="ruleForm.type"></p>
          </el-form-item>
          <el-form-item label="广告素材">
            <img class="SC-imgContent" :src="ruleForm.poster" alt="头像">
          </el-form-item>
          <el-form-item label="链接方式">
            <p v-text="ruleForm.linkType"></p>
          </el-form-item>
          <el-form-item label="链接地址">
            <p v-text="ruleForm.link"></p>
          </el-form-item>
          <el-form-item label="文字链">
            <p v-text="ruleForm.content"></p>
          </el-form-item>
          <el-form-item label="内容备注">
            <p v-text="ruleForm.memo"></p>
          </el-form-item>
          <el-form-item label="内容标签">
            <el-tag
              v-for="tag in tags"
              type="danger"
              style="margin: 0 5px;"
            >
            {{tag}}
            </el-tag>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toEdit()">修改基本信息</el-button>
            <el-button type="primary" @click="goback()">返回管理首页</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="上画情况" name="second">
        <div class="sc-article-table-content">
          <el-button type="primary"  @click="toUpContent()" class="sc-header">上画管理</el-button>
          <el-table :data="response.data" border stripe style="width:100%;">
            <el-table-column type="index" label="ID" width="50"></el-table-column>
            <el-table-column prop="title" label="点位名称" min-width="100"></el-table-column>
            <el-table-column prop="slug" label="点位标识" width="150"></el-table-column>
            <el-table-column prop="beginTime" label="上画时间" width="180px"></el-table-column>
            <el-table-column prop="endTime" label="下画时间" width="100px"></el-table-column>
            <el-table-column prop="limitCount" label="限量" width="120"></el-table-column>
            <el-table-column prop="watchcount" label="展示量"></el-table-column>
            <el-table-column prop="type" label="上画方式"></el-table-column>
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
          </el-table>
          <el-button type="primary"  @click="goback()" class="sc-footer">返回管理首页</el-button>
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
            style="width:55%">
          </el-date-picker>
          <el-button type="primary"  @click="searchEchart()">搜索</el-button>
        </div>
        <div id="myChart" style="width: 1100px; height:500px; margin-top:35px;"></div>
        <div class="sc-echarts"><el-button type="primary"  @click="goback()">返回管理首页</el-button></div>
      </el-tab-pane>
    </el-tabs>
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
        activeName2: 'first',
        tags: [],
        ruleForm: {
          title: '',
          poster: '',
          link: '',
          linkType: '',
          memo: '',
          content: '',
          typeId: '',
          tagList: ''
        },
        response: {},
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
            return time.getTime() < Date.now() - 3600 * 1000 * 24 * 30 || time.getTime() > Date.now()
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
      /**
       * echarts 初始化最近七天的数据
      */
      handleClick (tab, event) {
        var obj = {}
        obj.id = this.id
        obj.beginTime = new Date().getTime() - 3600 * 1000 * 24 * 7
        obj.endTime = new Date().getTime()
        this.queryCount(obj)
      },
      queryCount (obj) {
        api.GET(config.getCountAPI, obj)
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
            this.getPointData()
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
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.echartData.dateTime
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
      getData () {
        api.GET(config.showAdvertisementAPI, {id: this.id})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            const res = response.data.data
            this.ruleForm = response.data.data
            this.tags = res.tagList.split(',')
          }
        })
      },
      getPointData () {
        api.GET(config.getAdvertisementAPI, {id: this.id, isvalid: 1})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000' && response.data.data) {
              const res = response.data.data
              this.response = this.transformDate(res)
              this.response.state = this.changeBoolean(res.state)
            }
          })
      },
      goback () {
        this.$router.push({
          path: '/admin/ad/content/index'
        })
      },
      toEdit () {
        this.$router.push({
          path: '/admin/ad/content/edit',
          query: {
            id: this.id
          }
        })
      },
      toUpContent () {
        this.$router.push({
          path: '/admin/ad/upload/index',
          query: {
            id: this.id
          }
        })
      },
      handleSizeChange (value) {
        this.updateList({
          currentPage: this.response.currentPage,
          pageSize: value
        })
      },
      handleCurrentChange (value) {
        this.updateList({
          currentPage: value,
          pageSize: this.response.pageSize
        })
      },
      // 为调接口
      updateList (obj) {
        api.GET(config.advPointListAPI, obj)
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
      changeBoolean (state) {
        if (state) {
          return true
        } else {
          return false
        }
      }
    },
    mounted () {
      this.getPointData()
      this.getData()
    }
  }
</script>
<style scoped>
	.SC-imgContent {
  	margin-top: 5px;
    margin-bottom: 5px;
    width: 56px;
    height: 56px;
  }
  .sc-top-line {
    margin-top: 2rem; 
    padding: 1rem 2rem;
    border-top: 1px solid lightgray;
    background-color: #fff;
  }
  .sc-echarts {
    text-align: center;
    margin-top: 10px;
  }
  .sc-footer {
    float: right;
    margin-top: 10px;
  }
  .sc-header {
    float: right;
    margin-bottom: 10px;
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