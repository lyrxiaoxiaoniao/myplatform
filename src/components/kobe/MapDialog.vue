<template>
  <el-dialog
    :title="title"
    v-model="show"
    @close="onClose"
    >
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <el-input
          v-model="address"
          placeholder="搜索地址"
          >
          <el-button
            @click="onSearch"
            @keyup.enter.native="onSearch"
            slot="append"
            icon="search"
            >
          </el-button>
        </el-input>
      </el-col>
    </el-row>
    <div
      id="bmap"
      v-loading.body="loading"
      element-loading-text="定位中...">
    </div>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button @click="onConfirm">确定</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'kobe-map-dialog',
  props: {
    title: {
      type: String,
      default: '地图'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show () {
      return !!this.isShow
    }
  },
  data () {
    return {
      loading: true,
      geo: {
      },
      map: {
      },
      mapData: {
        zoom: 14,
        center: {
          lng: '116.404',
          lat: '39.915'
        }
      },
      address: ''
    }
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal === true) {
        this.$nextTick(_ => {
          this.init()
        })
      }
    }
  },
  methods: {
    onSearch () {
      /* eslint-disable */
      if (this.address === '') return
      this.geo = new BMap.Geocoder();
      const city = this.mapData.address ? this.mapData.address.city : '北京市'
      this.geo.getPoint(this.address, point => {
        if (point) {
          this.map.centerAndZoom(point, 14)
          this.map.addOverlay(new BMap.Marker(point))
        } else {
          this.$message.info('无法搜索该地址')
        }
      }, city)
      /* eslint-enable */
    },
    onConfirm () {
      this.$emit('confirm')
    },
    onClose () {
      this.$emit('close')
    },
    init () {
      /* eslint-disable */
      this.map = new BMap.Map('bmap')
      this.map.enableScrollWheelZoom()
      this.map.clearOverlays()

      const point = new BMap.Point(this.mapData.center.lng, this.mapData.center.lat)
      this.map.centerAndZoom(point, 14)
      const marker = new BMap.Marker(point)
      this.map.addOverlay(marker)

      let geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(r => {
        this.loading = false
        if (geolocation.getStatus() === window.BMAP_STATUS_SUCCESS) {
          this.mapData.address = r.address
          let marker = new BMap.Marker(r.point)
          this.map.addOverlay(marker)
          this.map.panTo(r.point)
        }
      }, {enableHighAccuracy: true})
      /* eslint-enable */
    }
  },
  mounted () {
  }
}
</script>

<style>
#bmap {
  width: 95%;
  min-height: 500px;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
