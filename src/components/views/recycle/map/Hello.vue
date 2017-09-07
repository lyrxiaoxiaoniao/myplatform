<template>
  <div class="map">
    <div class="searchWrapper" @click="showSearch">
      <div class="searchBtn" v-if="!showList">
        <img src="static/img/mirror.png">
        <span class="text">搜索</span>
      </div>
      <div class="searchInput" v-else>
        <img src="static/img/arrow.png" @click="hideList">
        <div class="inputWrapper">
          <img src="static/img/mirror.png">
          <input type="text" placeholder="搜索地点" v-model="keyword" @click="stop">
        </div>
        <div class="btnWrapper" @click="search">搜索</div>
      </div>
    </div>
    <div class="mapWrapper" v-show="!showList">
      <div id="map"></div>
      <div class="marker">
        <img src="static/img/marker.png">
      </div>
    </div>
    <div class="searchList" v-show="!showList">
      <div class="currentPosition" :class="{active: current.active}" @click="toCurrent">{{current.address}}</div>
      <div class="searchItem" v-for="(item, index) in current.surroundingPois" @click="moveTo(item.point, index)" :class="{active: item.active}">
        <div class="item">{{item.title}}</div>
        <div class="address">{{item.address}}</div>
      </div>
    </div>
    <div class="mainSearchList" v-show="showList">
      <div class="searchItem" v-for="(item, index) in searchList" @click="clickTo(item.point, index)" :class="{active: item.active}" v-if="searchList.length">
        <div class="item">{{item.title}}</div>
        <div class="address">{{item.address}}</div>
      </div>
      <div class="text" v-if="noResult">
        无搜索结果
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'map',
  data() {
    return {
      current: {},
      searchList: [],
      map: null,
      reSearch: true,
      showList: false,
      keyword: '',
      noResult: false
    }
  },
  methods: {
    /* eslint-disable */
    moveTo(point, index) {
      this.current.active = false
      this.current.surroundingPois.forEach((i, j) => {
        i.active = false
      })
      this.current.surroundingPois[index].active = true
      this.map.clearOverlays()
      var myIcon = new BMap.Icon('static/img/current.png', new BMap.Size(15, 15), {
        imageSize: new BMap.Size(15, 15)
      })
      var marker = new BMap.Marker(point, { icon: myIcon })
      this.map.addOverlay(marker)
      this.map.panTo(point)
    },
    stop(e) {
      e.stopPropagation()
    },
    toCurrent() {
      this.current.active = true
      this.current.surroundingPois.forEach(i => {
        i.active = false
      })
      this.map.clearOverlays()
      this.map.panTo(this.current.point)
    },
    showSearch(e) {
      e.stopPropagation()

      this.keyword = ''
      this.searchList = []
      this.showList = true
    },
    hideList(e) {
      e.stopPropagation()

      this.showList = false
    },
    search(e) {
      e.stopPropagation()

      var that = this
      var options = {
        onSearchComplete: function (results) {
          // 判断状态是否正确
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            results.vr.forEach(i => {
              i.active = false
            })
            that.searchList = results.vr
          } else {
            that.searchList = []
            that.noResult = true
          }
        }
      };
      var local = new BMap.LocalSearch(this.map, options);
      local.search(this.keyword)
    },
    clickTo(point, index) {
      var that = this

      this.current.active = false
      setTimeout(() => {
        this.showList = false
      }, 200)
      this.searchList.forEach((i, j) => {
        i.active = false
      })
      this.searchList[index].active = true
      this.map.clearOverlays()
      var myIcon = new BMap.Icon('static/img/current.png', new BMap.Size(15, 15), {
        imageSize: new BMap.Size(15, 15)
      })
      var marker = new BMap.Marker(point, { icon: myIcon })
      this.map.addOverlay(marker)
      setTimeout(() => {
        this.map.panTo(point)
      }, 500)


      var geo = new BMap.Geocoder()
      var option = {
        poiRadius: 1000,
        numPois: 12
      }

      geo.getLocation(point, (e) => {
        e.active = false

        e.surroundingPois.forEach(i => {
          i.active = false
        })
        that.current = e

        that.current.active = true
      }, option)

    },
  },
  mounted() {

    const that = this

    // 生成地图实例
    var map = new BMap.Map("map")
    this.map = map
    map.centerAndZoom(new BMap.Point(114.136912, 22.549828), 15)
    map.enableScrollWheelZoom()

    // 搜索配置
    var geo = new BMap.Geocoder()
    var option = {
      poiRadius: 1000,
      numPois: 12
    }

    // 当前位置定位
    var geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        map.panTo(r.point)
        var myIcon = new BMap.Icon('static/img/point.png', new BMap.Size(15, 15), {
          imageSize: new BMap.Size(15, 15)
        })
        var marker = new BMap.Marker(r.point, { icon: myIcon, enableMassClear: false })
        map.addOverlay(marker)

        geo.getLocation(r.point, (e) => {
          e.active = false

          e.surroundingPois.forEach(i => {
            i.active = false
          })
          that.current = e

          that.current.active = true
        }, option)
      }
      else {
        alert('failed' + this.getStatus())
      }
    }, { enableHighAccuracy: true })

    // 添加定位控件
    var navigationControl = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      type: BMAP_NAVIGATION_CONTROL_SMALL,
      enableGeolocation: true
    });
    map.addControl(navigationControl)

    var geolocationControl = new BMap.GeolocationControl()

    geolocationControl.addEventListener("locationSuccess", function (e) {
      // 定位成功事件
      map.clearOverlays()
      geo.getLocation(e.point, (e) => {
        e.active = false

        e.surroundingPois.forEach(i => {
          i.active = false
        })
        that.current = e

        that.current.active = true
      }, option)
    })

    geolocationControl.addEventListener("locationError", function (e) {
      // 定位失败事件
      alert(e.message);
    })
    map.addControl(geolocationControl)

    map.addEventListener("dragend", function (e) {   //鼠标拖动事件    
      console.log(1)
      const Point = new BMap.Point(map.getCenter().lng, map.getCenter().lat)

      geo.getLocation(Point, (e) => {
        e.active = false

        e.surroundingPois.forEach(i => {
          i.active = false
        })
        that.current = e

        that.current.active = true
      }, option)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.map {
  height: 100vh;
  position: relative;

  color: #454545;
  font-size: 14px;
  .searchWrapper {
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: white;
    .searchBtn {
      width: 80%;
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;

      background: lightgray;
      border-radius: 50px;
      img {
        height: 70%;
      }
      .text {
        color: white;
      }
    }
    .searchInput {
      position: fixed;
      top: 0;
      height: 35px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;

      background-color: #373a41;
      img {
        height: 70%;
      }
      .inputWrapper {
        height: 60%;
        width: 70%;
        position: relative;
        display: flex;
        align-items: center;

        border-bottom: 1px solid #1aac19;
        &::before {
          position: absolute;
          content: '';
          top: 25%;
          left: -10px;
          height: 60%;

          border-left: 1px solid #2e3138;
        }
        img {
          margin-right: 10px;
          object-fit: cover;
          height: 100%;
        }
        input {
          width: 90%;
          height: 100%;

          border: none;
          outline: none;
          background-color: #373a41;
          color: white;
        }
      }
      .btnWrapper {
        height: 80%;
        width: 50px;
        margin-right: 5px;
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: #1aac19;
        color: white;
        font-size: 12px;
        border-radius: 3px;
      }
    }
  }
  .mapWrapper {
    position: relative;
    height: 40%;
    #map {
      height: 100%;
    }
    .marker {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -24px;
      margin-left: -10px;
    }
  }
  .searchList {
    height: 55%;
    overflow: scroll;
    .currentPosition {
      height: 55px;

      line-height: 55px;
      padding: 0 10px;
      border-bottom: 1px solid #e5e5e5;
    }
    .searchItem {
      height: 55px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      padding: 0 40px 0 10px;
      border-bottom: 1px solid #e5e5e5;
      .address {
        font-size: 12px;
        color: #9a9a9a;
      }
    }
    .active {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        display: block;
        box-sizing: border-box;
        top: 50%;
        right: 7px;
        margin-top: -8px;

        border-radius: 50px;
        border: 1px solid #38993a;
      }
      &::before {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        display: block;
        box-sizing: border-box;
        top: 50%;
        right: 10px;
        margin-top: -5px;

        border-radius: 50px;
        background-color: #22ab27;
      }
    }
  }
  .mainSearchList {
    @extend .searchList;
    height: 95%;
    .text {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 12px;
      color: #909090;
    }
  }
}
</style>
