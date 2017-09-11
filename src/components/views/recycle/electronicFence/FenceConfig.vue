<template>
  <div class="sc-fence-config">
    <el-tabs>
      <el-tab-pane label="限制车辆">
        <el-card class="bix-card">
          <div class="clearfix"
               slot="header">
            <span style="line-height: 36px;font-size: 18px;">{{title}}</span>
            <el-button style="float: right;" @click="back">返回</el-button>
          </div>
          <kobe-table>
            <div class="kobe-table-header"
                 slot="kobe-table-header">
              <el-row type="flex"
                      justify="space-between">
                <el-col>
                  <el-button type="primary"
                             @click="openDialog('addLimitedVisible')">添加</el-button>
                  <el-button type="primary">批量删除</el-button>
                </el-col>
                <el-col :span="7">
                  <el-input placeholder="请输入关键字"
                            class="sc-table-header-select">
                    <el-button slot="append"
                               class="sc-table-search-btn"
                               icon="search"></el-button>
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
              <el-table :data="listData"
                        border>
                <el-table-column type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column label="ID"
                                 prop="id"></el-table-column>
                <el-table-column label="车辆号"></el-table-column>
                <el-table-column label="GPS标识"></el-table-column>
                <el-table-column label="限制围栏名称"></el-table-column>
                <el-table-column label="限制车辆数"></el-table-column>
                <el-table-column label="车辆品牌"></el-table-column>
                <el-table-column label="所属清运公司"></el-table-column>
                <el-table-column label="状态"></el-table-column>
                <el-table-column label="操作"
                                 width="200">
                  <template scope="scope">
                    <el-button icon="setting"
                               size="small"
                               @click="configItem(scope.row.id)"></el-button>
                    <el-button icon="delete2"
                               type="danger"
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
      <el-tab-pane label="设置区域">
        <el-card class="box-card">
          <div class="clearfix"
               slot="header">
            <span style="line-height: 36px;font-size: 18px;">基本信息</span>
            <el-button style="float: right;" @click="back">返回</el-button>
            <el-button style="float: right;margin-right: 20px;" type="primary">保存</el-button>
          </div>
          <el-form ref="form"
                   :model="form"
                   label-width="80px">
            <el-form-item label="围栏名称">
              <div class="inputWrapper">
                <el-input></el-input>
              </div>
            </el-form-item>
            <el-form-item label="围栏描述">
              <div class="inputWrapper">
                <el-input></el-input>
              </div>
            </el-form-item>
            <el-form-item label="划分方式">
              <el-select v-model="form.type"
                         placeholder="请选择活动区域">
                <el-option label="多边形划分"
                           value="duobianxing"></el-option>
                <el-option label="行政区域划分"
                           value="xingzhengquyu"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行政区域"
                          v-if="form.type === 'xingzhengquyu'">
              <el-select v-model="region"
                         placeholder="请选择活动区域">
                <el-option v-for="item in regionOption"
                           :value="item.value"
                           :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地图展示">
              <div class="mapWrapper">
                <div id="map1"
                     v-show="form.type === 'duobianxing'"></div>
                <div id="map2"
                     v-show="form.type === 'xingzhengquyu'"></div>
              </div>
              <el-button type="primary"
                         v-if="!isEditing && form.type === 'duobianxing'"
                         @click="editPolygon">开始编辑多边形</el-button>
              <el-button type="danger"
                         v-if="isEditing && form.type === 'duobianxing'"
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
                        class="sc-table-header-select">
                <el-button slot="append"
                           class="sc-table-search-btn"
                           icon="search"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <div slot="kobe-table-content"
             class="kobe-table">
          <el-table :data="LimitedData"
                    border>
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column label="ID"
                             prop="id"></el-table-column>
            <el-table-column label="品牌"></el-table-column>
            <el-table-column label="车辆号"></el-table-column>
            <el-table-column label="所属清运公司"></el-table-column>
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
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="hideDialog('addLimitedVisible')">取消</el-button>
        <el-button type="primary"
                   @click="hideDialog('addLimitedVisible')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '清水',
      desc: 'test',
      num: '5',
      methods: '多边形',
      listData: [{ id: 0 }],
      response: {},
      addLimitedVisible: false,
      limitedResponse: {},
      LimitedData: [{ id: 0 }],
      form: {
        type: 'duobianxing',
        region: 'luohuqu'
      },
      regionOption: [
        {
          label: '罗湖区',
          value: 'luohuqu'
        },
        {
          label: '福田区',
          value: 'futianqu'
        },
        {
          label: '宝安区',
          value: 'baoanqu'
        }
      ],
      region: 'luohuqu',
      map1: null,
      map2: null,
      polygon: null,
      isEditing: false,
      fenceList: null
    }
  },
  watch: {
    region(val) {
      if (val === 'luohuqu') {
        this.getBoundary('深圳市罗湖区')
      } else if (val === 'baoanqu') {
        this.getBoundary('深圳市宝安区')
      } else if (val === 'futianqu') {
        this.getBoundary('深圳市福田区')
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
    },
    deleteItem(id) { },
    map1Init() {
      // const that = this
      /* eslint-disable */
      const map1 = new BMap.Map("map1")
      this.map1 = map1
      map1.centerAndZoom('深圳', 14)
      map1.enableScrollWheelZoom(true)

      const polygon = new BMap.Polygon([
        new BMap.Point(114.065877, 22.570249),
        new BMap.Point(114.045468, 22.533934),
        new BMap.Point(114.102384, 22.551959),
      ], { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 })
      this.polygon = polygon
      map1.addOverlay(polygon);
    },
    map2Init() {
      // const that = this
      /* eslint-disable */
      const map2 = new BMap.Map("map2")
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
      this.fenceList = this.polygon.getPath()
    },
    getBoundary(e) {
      const bdary = new BMap.Boundary()
      bdary.get(e, (rs) => {
        this.map2.clearOverlays()
        const count = rs.boundaries.length
        let pointArray = []
        for (let i = 0; i < count; i++) {
          const ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2 }, { strokeColor: '#ffoooo' })
          this.map2.addOverlay(ply)
          pointArray = pointArray.concat(ply.getPath())
        }
        // this.map2.setViewport(pointArray)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map1Init()
      this.map2Init()
    })
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
</style>
