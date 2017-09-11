<template>
<!-- 罗湖大件垃圾地图组件 -->
<div class="map-container">
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <el-input
          v-model="searchInput"
          placeholder="搜索地址">
          <el-button
            @click="posMarker"
            @keyup.enter.native="posMarker"
            slot="append"
            icon="search"
            >
          </el-button>
        </el-input>
      </el-col>
      <el-button style="margin-left: 15px;" @click="useClick">使用地图当前点</el-button>
    </el-row>
    <div id="map">
    </div>
    <el-row type="flex" justify="end" style="margin-top: 25px;">
       <el-button @click="onClose">取消</el-button>
       <el-button type="primary" @click="onConfirm">确认</el-button>
    </el-row>
</div>
</template>
<script>
export default {
  props: ['localMapData'],
  data () {
    return {
      searchInput: null,
      point: {},
      pointAddress: '',
      map: null,
      geoc: null,
      allReady: false
    }
  },
  methods: {
    getData () {
      /* eslint-disable */
      this.searchInput = this.localMapData.address
      this.point.lng = this.localMapData.lng
      this.point.lat = this.localMapData.lat
      if (this.searchInput) {
        this.posMarker()
      }
      /* eslint-enable */
    },
    onClose () {
      this.$emit('close')
    },
    onConfirm () {
      var data = {
        address: this.searchInput,
        lng: this.point.lng,
        lat: this.point.lat
      }
      this.$emit('confirm', data)
    },
    useClick() {
      this.searchInput = this.pointAddress
    },
    posMarker() {
      /* eslint-disable */
      const map = this.map
      const geoc = this.geoc
      const that = this
      map.clearOverlays()
      geoc.getPoint(this.searchInput, function(e) {
        if (e) {
          map.centerAndZoom(e, 14)
          const marker = new BMap.Marker(e)
          map.addOverlay(marker)
        } else {
          that.$message({
            showClose: true,
            message: '暂无搜索结果，请确认地点是否正确',
            type: 'error'
          })
        }
      }, '深圳市')
      /* eslint-enable */
    },
    mapInit(callback) {
      const that = this
      /* eslint-disable */
      const map = new BMap.Map("map")
      this.map = map
      map.centerAndZoom('深圳', 14)
      map.enableScrollWheelZoom(true)

      const navigationControl = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_SMALL,
        enableGeolocation: true
      })
      map.addControl(navigationControl)

      const geolocationControl = new BMap.GeolocationControl()

      geolocationControl.addEventListener("locationSuccess", function(e) {
        // 定位成功事件
        console.log(e)
      })

      geolocationControl.addEventListener("locationError", function(e) {
        // 定位失败事件
        alert(e.message);
      })
      map.addControl(geolocationControl)

      const geoc = new BMap.Geocoder()
      that.geoc = geoc

      map.addEventListener('click', function(e) {
        map.clearOverlays()
        that.point.lat = e.point.lat
        that.point.lng = e.point.lng
        const marker = new BMap.Marker(e.point)
        map.addOverlay(marker)
        geoc.getLocation(e.point, function(rs) {
          that.pointAddress = rs.address
        })
      })
      setTimeout(function() {
        callback()
      }, 500)
      /* eslint-enable */
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.mapInit(this.getData)
    })
  }
}
</script>
<style lang="scss" scoped>
.map-container {
  margin-top: -25px;
  text-align: center;
  #map {
    width: 100%;
    min-height: 500px;
    margin-top: 10px;
  }
  .space {
    margin-top: 1rem;
  }

  .btn {
    width: 100%;
  }

  .btnWrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>