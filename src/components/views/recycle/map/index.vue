<template>
<!-- 罗湖大件垃圾地图组件 -->
<div class="map-container">
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
      id="b_map"
      v-loading.body="loading"
      element-loading-text="定位中...">
    </div>
    <div id="bresult"></div>
</div>
</template>
<script>
export default {
  data () {
    return {
      loading: true,
      geo: null,
      map: null,
      mapData: {
        zoom: 14,
        center: {
          lng: '116.404',
          lat: '39.915'
        }
      },
      address: '',
      point: {
        lng: null,
        lat: null
      }
    }
  },
  methods: {
    // 百度地图
    onSearch () {
      /* eslint-disable */
      if (this.address === '') return
      // this.geo = new BMap.Geocoder();
      const city = this.mapData.address ? this.mapData.address.city : '深圳市'
      this.geo.getPoint(this.address, point => {
        if (point) {
          this.map.centerAndZoom(point, 14)
          this.map.addOverlay(new BMap.Marker(point))
        } else {
          this.$message.info('无法搜索该地址')
        }
      }, city)
      var local = new BMap.LocalSearch(this.map, {
        renderOptions: {map: this.map, panel: "bresult"},
        onSearchComplete: (res) => {
          console.log(res)
        }
      })
      local.search(this.address)
      /* eslint-enable */
    },
    init () {
      /* eslint-disable */
      this.map = new BMap.Map('b_map')
      this.map.enableScrollWheelZoom()
      this.map.clearOverlays()
      this.geo = new BMap.Geocoder();  

      const point = new BMap.Point(this.mapData.center.lng, this.mapData.center.lat)
      this.map.centerAndZoom(point, 14)
      const marker = new BMap.Marker(point)
      this.map.addOverlay(marker)

      // let geolocation = new BMap.Geolocation()
      // geolocation.getCurrentPosition(r => {
      //   this.loading = false
      //   if (geolocation.getStatus() === window.BMAP_STATUS_SUCCESS) {
      //     this.mapData.address = r.address
      //     let marker = new BMap.Marker(r.point)
      //     this.map.addOverlay(marker)
      //     this.map.panTo(r.point)
      //     console.log(r, 11111)
      //   }
      // }, {enableHighAccuracy: true})
      
      // 禁止拖动地图
      this.map.disableDragging()
      // 搜索关键字
      var local = new BMap.LocalSearch(this.map, {
        renderOptions: {map: this.map, panel: "bresult"},
        onSearchComplete: (res) => {
          console.log(res,111)
        }
      })
      local.search('鸿昌广场')
      this.loading = false

      // 点击地图事件
      this.map.addEventListener('click', (e) => {
        if (e.ab) {
          this.point = e.ab.point;
          this.geo.getLocation(this.point, function(rs){
            // var addComp = rs.addressComponents;
            console.log(rs)
          }); 
        }  
      })
      /* eslint-enable */
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>
<style lang="scss" scoped>
.map-container {
  #b_map {
    float: right;
    width: 75%;
    min-height: 500px;
    margin-top: 10px;
  }
  #bresult {
    float: left;
    width: 25%;
    height: 500px;
    margin-top: 10px;
    overflow: auto;
  }
}
</style>