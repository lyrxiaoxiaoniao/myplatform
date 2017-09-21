<template>
  <div class="gps-info">
    <kobe-table>
      <div class="kobe-table-header"
           slot="kobe-table-header">
        <el-row type="flex"
                justify="space-between">
          <el-col>
            <el-button type="primary"
                       @click="back"
                       icon="d-arrow-left">返回列表</el-button>
            <el-button type="primary" @click="getList">
              <i class="fa fa-refresh"
                 aria-hidden="true"></i> 刷新</el-button>
          </el-col>
          <el-col :span="10">
            <el-date-picker v-model="dateValue"
                            type="datetimerange"
                            placeholder="选择时间范围"
                            @change="getDate">
            </el-date-picker>
          </el-col>
          <el-button type="primary"
                     icon="upload2"></el-button>
          <el-button type="primary"
                     icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content"
           class="kobe-table">
        <el-table :data="response.data"
                  border>
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="ID"
                           prop="id"></el-table-column>
          <el-table-column label="时间">
            <template scope="scope">
              {{scope.row.created_at | toDateTime}}
            </template>
          </el-table-column>
          <el-table-column label="车辆">
            <template scope="scope">
              <div v-if="scope.row.vehicleVO.number">
                {{scope.row.vehicleVO.number}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="经度" prop="latitude"></el-table-column>
          <el-table-column label="纬度" prop="longitude"></el-table-column>
          <el-table-column label="速度">
            <template scope="scope">
              {{scope.row.speed}} km/h
            </template>
          </el-table-column>
          <el-table-column label="位置" prop="position"></el-table-column>
          <el-table-column label="状态">
            <template scope="scope">
              <div v-if="scope.row.position_status === 1">
                运行
              </div>
              <div v-if="scope.row.position_status === 0" class="red">
                停止
              </div>
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
      response: {},
      dateValue: '',
      start_time: '',
      end_time: ''
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    handleSizeChange(value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value
      }
      console.log(3)
      this.getList(data)
    },
    handleCurrentChange(value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize
      }
      this.getList(data)
    },
    getList(data = {}) {
      api.GET(config.fence.gpsInfo, { vehicle_id: this.id, ...data }).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.response = res.data.data
        } else if (res.status === 200 && res.data.errcode === '5000') {
          this.response.data = []
        }
      })
    },
    getDate(val) {
      const obj = {
        start_time: val.slice(0, 19),
        end_time: val.slice(22)
      }
      this.getList(obj)
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
.red {
  color: #FF4949;
}
</style>
