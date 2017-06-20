<template>
  <div class="UP-container">
    <div class="up-adcontent">
        <div style="border-bottom:1px solid lightgray;height:60px;">
            <el-col :span="20" style="margin-top:10px;"><h4 style="margin-left:2rem;">广告位基本信息</h4></el-col>
            <el-col :span="4" style="margin-top:10px;"><el-button style="float:right;margin-right:10px;" @click="toDetail()">详情</el-button></el-col>
        </div>
        <div class="up-point-content">
          <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="border-right: 1px solid lightgray;">
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
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:20px;">
        <el-tab-pane label="当前内容" name="first">
            <el-button type="primary" @click="toDialog()" class="sc-header">选择广告内容</el-button>
            <el-table :data="data.data" border stripe>
                <el-table-column type="index" label="ID" width="50"></el-table-column>
                <el-table-column prop="title" label="广告内容名称" ></el-table-column>
                <el-table-column prop="poster" label="素材" width="120">
                  <template scope="scope">
                    <img width="100%" :src="scope.row.poster" @click="bigImg(scope.row.poster)" alt="">
                    <el-dialog v-model="dialogVisible" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </template>
                </el-table-column>
                <el-table-column prop="beginTime" label="上画时间" width="180"></el-table-column>
                <el-table-column prop="endTime" label="下画时间" width="180"></el-table-column>
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
            <div>
                <el-row type="flex" justify="center">
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
            <el-button type="primary" @click="toDialog()" class="sc-header">选择广告内容</el-button>
            <el-table :data="response.data" border stripe>
                <el-table-column type="index" label="ID" width="50"></el-table-column>
                <el-table-column prop="title" label="广告内容名称" ></el-table-column>
                <el-table-column prop="poster" label="素材" width="120">
                  <template scope="scope">
                    <img width="100%" :src="scope.row.poster" @click="bigImg(scope.row.poster)" alt="">
                  </template>
                </el-table-column>
                <el-table-column prop="beginTime" label="上画时间" width="180"></el-table-column>
                <el-table-column prop="endTime" label="下画时间" width="180"></el-table-column>
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
            <div>
                <el-row type="flex" justify="center">
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
    </el-tabs>
    <!--弹出框-->
    <el-dialog title="选择广告内容" :visible.sync="dialogTableVisible">
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
                    <el-button slot="append" icon="search" @click="searchKeyword()"></el-button>
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
            <el-button type="primary" @click="pointToAdv()">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      id: this.$route.query.id,
      value3: '',
      formInline: {
        num: 99999,
        type: ''
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
      dialogVisible1: false,
      keyword: null
    }
  },
  methods: {
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
          console.log(this.response)
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
        path: 'pointdetail',
        query: {
          id: this.id
        }
      })
    },
    getPoint () {
      console.log(this.ruleForm.typeId)
      // getAdvertisementAPI
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
      var obj = {}
      obj.type = Number(this.formInline.type)
      obj.limitCount = Number(this.formInline.num)
      obj.beginTime = this.value3[0].getTime()
      obj.endTime = this.value3[1].getTime()
      obj.ids = this.ids
      obj.id = Number(this.id)
      console.log(obj)
      api.POST(config.pointToAdvAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          console.log('config')
          this.$message('添加成功！！！')
          this.dialogTableVisible = false
          this.getPoint()
        }
      })
    },
    // removepointToAdvAPI
    removepointToAdv (deleteid) {
      this.$confirm('此操作将删除该广告点位，删除后，数据无法恢复。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        console.log('确定')
        api.POST(config.removepointToAdvAPI, {id: deleteid})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPoint()
            this.getHistory()
          }
        })
      }).catch(() => {
        console.log('取消')
        this.$message({
          type: 'info',
          message: '已取消删除'
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
          console.log('config')
          this.getPoint()
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
    padding: 1rem 3rem 0;
    margin-top: 1rem;
    border-top: 1px solid lightgray;
}
.up-adcontent {
    border: 1px solid lightgray;
}
.up-point-content {
    margin-top: 20px;
    position: relative;
}
.sc-header {
    float: right;
    margin-bottom: 10px;
}
.up-dialog-footer{
    margin-top: 1rem;
    text-align: right;
}
.dialog-table {
    overflow: auto;
    max-height: 400px;
}
</style>