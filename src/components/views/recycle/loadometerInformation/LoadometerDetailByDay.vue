<template>
  <div class="loadometerStatistics-container">
    <TopInfo></TopInfo>
    <div class="bottom">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <!--
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="upload2" style="margin-left: 10px"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
          -->
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-table 
            :data="response.data"
            border
            stripe
            @selection-change="selectIds">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="weight_number" label="过磅编号" width="150"></el-table-column>
            <el-table-column prop="truckNumber" label="回收车辆" width="150"></el-table-column>
            <el-table-column prop="truckPhoto" label="回收车辆照片" width="200">
              <template scope="scope">
                <img :src="scope.row.truckPhoto"/>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="日期时间" width="150"></el-table-column>
            <el-table-column prop="weight" label="地磅计量（吨）"></el-table-column>
            <el-table-column prop="weight_photo" label="地磅数值照片">
              <template scope="scope">
                <img :src="scope.row.weight_photo"/>
              </template>
            </el-table-column>
            <el-table-column prop="audit_man" label="校核员"></el-table-column>
            <el-table-column label="操作" width="120px">
              <template scope="scope">
                <el-button size="small" type="primary" @click="toEditStatus(scope.row)" v-show="!scope.row.audit_status">确认校核</el-button>
                <el-button size="small" v-show="scope.row.audit_status">已校核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
          <el-row type="flex" justify="center">
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
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny">
      <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px">
        <el-form-item label="过磅编号" prop="weight_number">
          <el-input v-model="infoForm.weight_number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="回收车辆" prop="truckNumber">
          <el-input v-model="infoForm.truckNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-input v-model="infoForm.date" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-input v-model="infoForm.time" :disabled="true"></el-input>
          </el-time-picker>
        </el-form-item>
        <!--
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="infoForm.date"
            type="date"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-time-picker
            v-model="infoForm.time"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59'
            }">
          </el-time-picker>
        </el-form-item>
        -->
        <el-form-item label="地磅计量" prop="weight">
          <el-input v-model="infoForm.weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" justify="end">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
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
        infoForm: {
        },
        loadometerSelectedIds: [],
        loadometerId: 0, //  表格操作单行时的id
        dialogTitle: '',
        dialogFormVisible: false
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
      },
      handleCurrentChange (value) {
        // const data = {
        //   currentPage: value,
        //   pageSize: this.response.pageSize,
        //   ...this.form
        // }
      },
      getList (data = {}) {
        api.GET(config.loadometer.weighDetail, data)
          .then(response => {
            this.response.count = response.data.data.count
            this.response.currentPage = response.data.data.currentPage
            this.response.pageSize = response.data.data.pageSize
            this.response.data = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      transformData (res) {
        var arr = []
        res.data.forEach(v => {
          var obj = v.rubWeighDetailVOS[0]
          obj.truckNumber = v.rubWeighDetailVOS[0].rubVehicleVO.number
          obj.truckPhoto = v.rubWeighDetailVOS[0].rubVehicleVO.photo
          if (obj.created_at) {
            obj.created_at = this.formatDate(obj.created_at)
          }
          // if (obj.type === 0) {
          //   obj.type = '大件垃圾'
          // }
          // if (obj.type === 1) {
          //   obj.type = '餐厨垃圾'
          // }
          arr.push(obj)
        })
        return arr
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
        // 获取id参数和日期参数
        var obj = {}
        obj.time = this.$route.query.time
        obj.id = this.$route.query.id
        return obj
      },
      toEditStatus (obj) {
        this.openDialog('确认校核', obj)
      },
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
      update () {
        // 发起更新和确认审核的请求
        api.POST(config.loadometer.audit, {id: this.infoForm.id, weight: this.infoForm.weight})
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('校核成功')
              // let data = {
              //   pageSize: this.response.pageSize,
              //   currentPage: this.response.currentPage
              // }
              var data = this.getHttpParams()
              data.pageSize = this.response.pageSize
              data.currentPage = this.response.currentPage
              this.getList(data)
              this.closeDialog()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      openDialog (value, obj) {
        this.loadometerId = obj.id
        var newObj = JSON.parse(JSON.stringify(obj))
        var arr = newObj.created_at.split(' ')
        newObj.date = arr[0]
        newObj.time = arr[1]
        // newObj.time = Date.parse(newObj.created_at)
        this.infoForm = newObj
        this.dialogTitle = value
        this.dialogFormVisible = true
      },
      closeDialog () {
        this.dialogFormVisible = false
        this.dialogTitle = ''
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      }
    },
    mounted () {
      var data = this.getHttpParams()
      this.getList(data)
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