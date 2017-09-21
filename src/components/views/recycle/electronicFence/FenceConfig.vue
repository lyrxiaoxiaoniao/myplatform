<template>
  <div class="sc-fence-config">
    <el-button @click="back"
               type="primary"
               icon="d-arrow-left">返回</el-button>
    <el-tabs @tab-click="tabClick"
             v-model="activeName">
      <el-tab-pane label="限制车辆"
                   name="vehicle">
        <el-card class="box-card">
          <div class="clearfix"
               slot="header">
            <span style="line-height: 36px;font-size: 18px;">{{form.name}}</span>
          </div>
          <kobe-table>
            <div class="kobe-table-header"
                 slot="kobe-table-header">
              <el-row type="flex"
                      justify="space-between">
                <el-col>
                  <el-button type="primary"
                             @click="openDialog('addLimitedVisible')">添加</el-button>
                  <el-button type="primary"
                             @click="deleteList">批量删除</el-button>
                </el-col>
                <el-col :span="7">
                  <el-input placeholder="请输入关键字"
                            class="sc-table-header-select"
                            v-model="keyword1">
                    <el-button slot="append"
                               class="sc-table-search-btn"
                               icon="search"
                               @click="getVehicle({keyword: keyword1})"></el-button>
                  </el-input>
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
                        border
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column label="ID"
                                 prop="id"></el-table-column>
                <el-table-column label="车辆号"
                                 prop="number"></el-table-column>
                <el-table-column label="GPS标识"
                                 prop="gps_slug"></el-table-column>
                <el-table-column label="车辆品牌"
                                 prop="brand"></el-table-column>
                <el-table-column label="所属清运公司">
                  <template scope="scope">
                    {{scope.row.recycleVO.name}}
                  </template>
                </el-table-column>
                <el-table-column label="状态">
                  <template scope="scope">
                    <div v-if="scope.row.gpsVO">
                      <div v-if="scope.row.gpsVO.position_status === 0">
                        正常
                      </div>
                      <div v-else
                           class="red">
                        超出范围
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="200">
                  <template scope="scope">
                    <el-button icon="information"
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
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="设置区域"
                   name="map">
        <el-card class="box-card">
          <div class="clearfix"
               slot="header">
            <span style="line-height: 36px;font-size: 18px;">基本信息</span>
            <el-button style="float: right;margin-right: 20px;"
                       type="primary"
                       @click="submit">保存</el-button>
          </div>
          <el-form ref="form"
                   :model="form"
                   label-width="80px">
            <el-form-item label="围栏名称">
              <div class="inputWrapper">
                <el-input v-model="tempForm.name"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="围栏描述">
              <div class="inputWrapper">
                <el-input v-model="tempForm.description"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="划分方式">
              <el-select v-model="type"
                         placeholder="请选择活动区域">
                <el-option label="多边形划分"
                           value="1"></el-option>
                <el-option label="行政区域划分"
                           value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行政区域"
                          v-if="type === '0'">
              <el-select v-model="region"
                         placeholder="请选择活动区域">
                <el-option v-for="item in regionOption"
                           :value="item.title"
                           :label="item.title"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地图展示">
              <div class="mapWrapper">
                <div id="map1"
                     v-show="type === '1'"></div>
                <div id="map2"
                     v-show="type === '0'"></div>
              </div>
              <el-button type="primary"
                         v-if="!isEditing && type === '1'"
                         @click="editPolygon">开始编辑多边形</el-button>
              <el-button type="danger"
                         v-if="isEditing && type === '1'"
                         @click="finishPolygon">结束编辑多边形</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="addLimitedVisible"
               title="添加限制车辆">
      <kobe-table>
        <div class="kobe-table-header"
             slot="kobe-table-header">
          <el-row type="flex"
                  justify="end">
            <el-col :span="7">
              <el-input placeholder="请输入关键字"
                        class="sc-table-header-select"
                        v-model="keyword2">
                <el-button slot="append"
                           class="sc-table-search-btn"
                           icon="search"
                           @click="getUnrelevancev({keyword: keyword2})"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <div slot="kobe-table-content"
             class="kobe-table">
          <el-table :data="limitedResponse.data"
                    border
                    @selection-change="addHandleSelectionChange">
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column label="ID"
                             prop="id"></el-table-column>
            <el-table-column label="品牌"
                             prop="brand"></el-table-column>
            <el-table-column label="车辆号"
                             prop="number"></el-table-column>
            <el-table-column label="所属清运公司">
              <template scope="scope">
                {{scope.row.recycleVO.name}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="kobe-table-footer"
             class="kobe-table-footer">
          <el-row type="flex"
                  justify="center">
            <el-col :span="12">
              <el-pagination @size-change="unHandleSizeChange"
                             @current-change="unHandleCurrentChange"
                             :current-page="limitedResponse.currentPage"
                             :page-sizes="[10, 20, 50, 100]"
                             :page-size="limitedResponse.pageSize"
                             :total="limitedResponse.count"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </kobe-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="hideDialog('addLimitedVisible')">取消</el-button>
        <el-button type="primary"
                   @click="addUnrelevence">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data() {
    return {
      activeName: 'vehicle',
      id: '',
      form: {
        name: '',
        description: ''
      },
      tempForm: {
        name: '',
        description: ''
      },
      response: {},
      addLimitedVisible: false,
      limitedResponse: {},
      type: '1',
      regionOption: [
      ],
      region: '罗湖区',
      region_id: '',
      map1: null,
      map2: null,
      polygon: null,
      isEditing: false,
      fenceList1: [],
      fenceList2: [],
      addMultipleSelection: [],
      multipleSelection: [],
      keyword1: '',
      keyword2: ''
    }
  },
  watch: {
    region(val) {
      this.getBoundary(`深圳市${val}`)
    },
    type(val) {
      if (val === '1') {
        this.$nextTick(() => {
          this.map1Init()
        })
      } else if (val === '0') {
        this.$nextTick(() => {
          this.map2Init()
        })
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    openDialog(e) {
      this[e] = true
    },
    hideDialog(e) {
      this[e] = false
    },
    configItem(id) {
      this.$router.push({path: 'gps', query: {id}})
    },
    addHandleSelectionChange(val) {
      this.addMultipleSelection = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getID() {
      this.id = this.$route.query.id
    },
    tabClick(tab) {
      this.$nextTick(() => {
        if (this.type === '1') {
          this.map1Init()
        } else if (this.type === '0') {
          this.map2Init()
          this.regionOption.forEach(i => {
            if (i.id === this.region_id) {
              this.region = i.title
            }
          })
        }
      })
    },
    getFenceInfo() {
      api.GET(config.fence.query, { id: this.id }).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.form.name = res.data.data.name
          this.form.description = res.data.data.description
          this.tempForm.name = res.data.data.name
          this.tempForm.description = res.data.data.description
          this.type = res.data.data.type + ''
          if (res.data.data.region_id) {
            this.region_id = res.data.data.region_id
          }
          if (this.type === '1') {
            this.fenceList1 = res.data.data.rubFencePointVOS
          } else if (this.type === '2') {
            this.fenceList2 = res.data.data.rubFencePointVOS
          }
        }
      })
    },
    getVehicle(data = {}) {
      api.GET(config.fence.vehicleIndex, { id: this.id, ...data }).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.response = res.data.data
        } else if (res.status === 200 && res.data.errcode === '5000') {
          this.response.data = []
        }
      })
    },
    getUnrelevancev(data = {}) {
      api.GET(config.fence.vehicleUnrelevance, { id: this.id, ...data }).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.limitedResponse = res.data.data
        } else if (res.status === 200 && res.data.errcode === '5000') {
          this.limitedResponse.data = []
        }
      })
    },
    addUnrelevence() {
      let ids = []
      this.addMultipleSelection.forEach(i => {
        ids.push(i.id)
      })
      api.POST(config.fence.addVehicle, { fence_id: this.id, ids }).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.hideDialog('addLimitedVisible')
          this.getVehicle()
          this.getUnrelevancev()
        }
      })
    },
    getRegion() {
      api.GET(config.fence.region).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.regionOption = res.data.data[0].children[0].children
        }
      })
    },
    deleteItem(id) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.fence.deleteVehicle, { ids: [id] }).then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.getVehicle()
            this.getUnrelevancev()
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
    deleteList() {
      let ids = []
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'info',
          message: '请选择需要删除的条目'
        })
        return
      }
      this.multipleSelection.forEach(i => {
        ids.push(i.id)
      })

      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.fence.deleteVehicle, { ids }).then(res => {
          if (res.status === 200 && res.data.errcode === '0000') {
            this.getVehicle()
            this.getUnrelevancev()
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
    handleSizeChange(value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        keyword: this.keyword1
      }
      this.getVehicle(data)
    },
    handleCurrentChange(value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        keyword: this.keyword1
      }
      this.getVehicle(data)
    },
    unHandleSizeChange(value) {
      const data = {
        currentPage: this.limitedResponse.currentPage,
        pageSize: value,
        keyword: this.keyword2
      }
      this.getUnrelevancev(data)
    },
    unHandleCurrentChange(value) {
      const data = {
        currentPage: value,
        pageSize: this.limitedResponse.pageSize,
        keyword: this.keyword2
      }
      this.getUnrelevancev(data)
    },
    map1Init() {
      /* eslint-disable */
      const map1 = new BMap.Map("map1", {enableMapClick:false})
      this.map1 = map1
      map1.centerAndZoom('深圳', 14)
      map1.enableScrollWheelZoom(true)
      if (!this.fenceList1.length) {
        const polygon = new BMap.Polygon([
        new BMap.Point(114.045877, 22.570249),
        new BMap.Point(114.105468, 22.570249),
        new BMap.Point(114.105468, 22.551959),
        new BMap.Point(114.045877, 22.551959),
        ], { strokeColor: "red", strokeWeight: 2})
        this.polygon = polygon
        map1.addOverlay(polygon)
      } else {
        let arr = []
        this.fenceList1.forEach(i => {
          arr.push(new BMap.Point(i.lng, i.lat))
        })
        const polygon = new BMap.Polygon(arr, { strokeColor: "red", strokeWeight: 2})
        console.log(polygon)
        this.polygon = polygon
        map1.addOverlay(polygon)
      }

    },
    map2Init() {
      // const that = this
      /* eslint-disable */
      const map2 = new BMap.Map("map2", {enableMapClick:false})
      this.map2 = map2
      map2.centerAndZoom('深圳', 14)
      map2.enableScrollWheelZoom(true)
      this.$nextTick(() => {
        this.getBoundary('深圳市罗湖区')
      })

    },
    editPolygon() {
      this.polygon.enableEditing()
      this.isEditing = true
    },
    finishPolygon() {
      this.polygon.disableEditing()
      this.isEditing = false
      this.fenceList1 = this.polygon.getPath()
    },
    getBoundary(e) {
      const bdary = new BMap.Boundary()
      bdary.get(e, (rs) => {
        this.map2.clearOverlays()
        const count = rs.boundaries.length
        let pointArray = []
        for (let i = 0; i < count; i++) {
          const ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "red" })
          this.map2.addOverlay(ply)
          pointArray = pointArray.concat(ply.getPath())
          this.fenceList2 = JSON.parse(JSON.stringify(pointArray))
        }
      })
    },
    submit() {
      if (this.form.name === '') {
        this.$message.error('请输入围栏名称')
        return
      }
      if (this.form.description === '') {
        this.$message.error('请输入围栏描述')
        return
      }

      const fenceList = this.type === '1' ? this.fenceList1 : this.fenceList2
      fenceList.forEach((e, i) => {
        e.map_number = i
      })

      let region_id = ''
      if (this.type === '0') {
        this.regionOption.forEach(i => {
          if (i.title === this.region) {
            region_id = i.id
          }
        })
      }

      const obj = { ...this.form, rubFencePointBeans: fenceList, type: this.type, region_id, id: this.id }
      api.POST(config.fence.update, obj).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push('index')
        } else {
          this.$message.error('系统异常，修改失败')
        }
      })
        .catch(err => {
          if (err) {
            this.$message.error('系统异常，修改失败')
          }
        })
    }
  },
  mounted() {
    this.getID()
    this.getFenceInfo()
    this.getVehicle()
    this.getUnrelevancev()
    this.getRegion()
  }
}
</script>

<style scoped>
.sc-fence-config {
  margin: 1rem 2rem;
  font-size: 14px;
}

.method {
  margin-top: 1rem;
}

.mapWrapper {
  height: 500px;
}

#map1 {
  height: 100%;
}

#map2 {
  height: 100%;
}

.inputWrapper {}

.btnWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.red {
  color: #FF4949;
}
</style>
