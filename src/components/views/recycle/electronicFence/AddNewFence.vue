<template>
  <div class="sc-new-fence">
    <el-card class="box-card">
      <div class="clearfix"
           slot="header">
        <span style="line-height: 36px;font-size: 18px;">基本信息</span>
      </div>
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="围栏名称">
          <div class="inputWrapper">
            <el-input v-model="form.name"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="围栏描述">
          <div class="inputWrapper">
            <el-input v-model="form.description"></el-input>
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
        <el-form-item>
          <div class="btnWrapper">
            <el-button type="primary"
                       @click="submit">添加</el-button>
            <el-button @click="back">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data() {
    return {
      form: { name: '', description: '' },
      regionOption: [
      ],
      region: '罗湖区',
      type: '1',
      map1: null,
      map2: null,
      polygon: null,
      isEditing: false,
      fenceList: null
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
    getRegion() {
      api.GET(config.fence.region).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.regionOption = res.data.data[0].children[0].children
        }
      })
    },
    map1Init() {
      // const that = this
      /* eslint-disable */
      const map1 = new BMap.Map("map1", {enableMapClick:false})
      this.map1 = map1
      map1.centerAndZoom('深圳', 14)
      map1.enableScrollWheelZoom(true)

      const polygon = new BMap.Polygon([
        new BMap.Point(114.045877, 22.570249),
        new BMap.Point(114.105468, 22.570249),
        new BMap.Point(114.105468, 22.551959),
        new BMap.Point(114.045877, 22.551959),
      ], { strokeColor: "red", strokeWeight: 2})
      this.polygon = polygon
      map1.addOverlay(polygon)
      this.fenceList = this.polygon.getPath()
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
      this.fenceList = this.polygon.getPath()
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
          this.fenceList = JSON.parse(JSON.stringify(pointArray))
        }
        // this.map2.setViewport(pointArray)
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

      const fenceList = this.fenceList
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

      const obj = { ...this.form, rubFencePointBeans: fenceList, type: this.type, region_id }
      api.POST(config.fence.create, obj).then(res => {
        if (res.status === 200 && res.data.errcode === '0000') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push('index')
        } else {
          this.$message.error('系统异常，添加失败')
        }
      })
        .catch(err => {
          if (err) {
            this.$message.error('系统异常，添加失败')
          }
        })
    }
  },
  mounted() {
    this.getRegion()
    this.$nextTick(() => {
      this.map1Init()
    })
  }
}
</script>

<style scoped>
.sc-new-fence {
  margin: 1rem 2rem;
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
