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
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="围栏描述">
          <el-input></el-input>
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

  </div>
</template>

<script>
export default {
  data() {
    return {
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
</style>
