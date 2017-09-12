<template>
	<div class="lh-container">
    <el-tabs type="border-card" @tab-click="showMap">
      <el-tab-pane label="基本信息" class="lh-top">
        <div class="table-head">
          <div>基本信息</div>
          <div>
            <el-button>返回</el-button>
            <el-button type="primary">保存</el-button>
          </div>
        </div>
        <div class="table-body">
          <el-form :model="restaurantInfo" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="企业名称">
                  <el-input placeholder="请输入企业名称" v-model="restaurantInfo.name"></el-input>
                </el-form-item>
              </el-col>  
              <el-col :span="12">
                <el-form-item label="固定电话">
                  <el-input placeholder="请输入电话" v-model="restaurantInfo.phone"></el-input>
                </el-form-item>
              </el-col>  
              <el-col :span="12">
                <el-form-item label="负责人">
                  <el-input placeholder="请输入负责人姓名" v-model="restaurantInfo.dutyName"></el-input>
                </el-form-item>
              </el-col>  
              <el-col :span="12">
                <el-form-item label="联系电话">
                  <el-input placeholder="请输入负责人联系电话" v-model="restaurantInfo.mobile"></el-input>
                </el-form-item>
              </el-col>
              <!--
              <el-col :span="12">
                <el-form-item label="所属辖区">
                  <el-select v-model="restaurantInfo.street" placeholder="请选择所属街道" class="street-select">
                    <el-option
                      v-for="item in regionSelectOptions"
                      :label="item.id"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              -->
              <el-col :span="12">
                <el-form-item label="组织机构代码">
                  <el-input placeholder="请输入组织结构代码" v-model="restaurantInfo.orgCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核状态">
                  <el-switch on-text="已" off-text="未" v-model="restaurantInfo.checkState"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="企业说明">
                  <el-input type="textarea" placeholder="请输入" v-model="restaurantInfo.memo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="营业执照">
                  <el-upload
                      class="avatar-uploader"
                      :action="uploadURL"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="restaurantInfo.license" :src="restaurantInfo.license" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div class="el-upload__tip" slot="tip">上传有效、清晰的营业执照图片（最多上传1张，每张最大10M）</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="地图定位" class="lh-middle">
        <div class="table-head">
          <div>地图定位</div>
        </div>
        <div class="table-body">
          <el-form :model="restaurantInfo" label-width="100px">
            <el-form-item label="详细地址">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="searchInput"></el-input>
                </el-col>
                <el-col :span="12">
                  <div class="btnWrapper">
                    <el-button @click="posMarker" style="margin-left: 10px">定位到地图</el-button>
                    <el-button type="primary" @click="useClick">使用地图当前点</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="地图定位">
              <div id="map"></div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="签约信息" class="lh-bottom" v-if="showContract">
        <div class="table-head">
          <div>是否签约</div>
          <el-switch v-model="showContract" on-text="开" off-text="关" style="margin-left: 35px;"></el-switch>
        </div>
        <div class="table-body">
          <el-form :model="restaurantInfo.contractStatus" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="签约人">
                  <el-input placeholder="请输入签约人姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话">
                  <el-input placeholder="请输入签约人联系电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="回收单位">
                  <el-select v-model="restaurantInfo.street" placeholder="请选择所属街道" class="street-select">
                    <el-option
                      v-for="item in streetOptions"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同期限" class="contract-time">
                  <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
                  <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
		<!-- <div class="lh-top">
      <div class="table-head">
        <div>基本信息</div>
        <div>
          <el-button>返回</el-button>
          <el-button type="primary">保存</el-button>
        </div>
      </div>
      <div class="table-body">
        <el-form :model="restaurantInfo" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="企业名称">
                <el-input placeholder="请输入企业名称"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="固定电话">
                <el-input placeholder="请输入电话"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="负责人">
                <el-input placeholder="请输入负责人姓名"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input placeholder="请输入负责人联系电话"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="所属街道">
                <el-select v-model="restaurantInfo.street" placeholder="请选择所属街道" class="street-select">
                  <el-option
                    v-for="item in streetOptions"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="组织机构代码">
                <el-input placeholder="请输入组织结构代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="企业说明">
                <el-input type="textarea" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadURL"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="selected.banner" :src="selected.banner" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div class="el-upload__tip" slot="tip">上传有效、清晰的营业执照图片（最多上传1张，每张最大10M）</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
		<div class="lh-middle">
      <div class="table-head">
        <div>地图定位</div>
      </div>
      <div class="table-body">
        <el-form :model="restaurantInfo" label-width="100px">
          <el-form-item label="详细地址">
            <el-row>
              <el-col :span="12">
                <el-input v-model="searchInput"></el-input>
              </el-col>
              <el-col :span="12">
                <div class="btnWrapper">
                  <el-button @click="posMarker" style="margin-left: 10px">定位到地图</el-button>
                  <el-button type="primary" @click="useClick">使用地图当前点</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="地图定位">
            <div id="map"></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="lh-bottom">
      <div class="table-head">
        <div>是否签约</div>
        <el-switch v-model="showContract" on-text="开" off-text="关" style="margin-left: 35px;"></el-switch>
      </div>
      <div class="table-body" v-if="showContract">
        <el-form :model="restaurantInfo.contractStatus" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="签约人">
                <el-input placeholder="请输入签约人姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input placeholder="请输入签约人联系电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="回收单位">
                <el-select v-model="restaurantInfo.street" placeholder="请选择所属街道" class="street-select">
                  <el-option
                    v-for="item in streetOptions"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同期限" class="contract-time">
                <el-date-picker v-model="startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
                <el-date-picker v-model="endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>
      </div>
    </div> -->
	</div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    data () {
      return {
        uploadURL: config.serverURI + config.uploadFilesAPI,
        selected: {
          banner: ''
        },
        regionSelectOptions: [],
        restaurantInfo: {
          checkState: true,
          license: ''
        },
        searchInput: '',
        point: {},
        pointAddress: '',
        map: null,
        geoc: null,
        showContract: true
      }
    },
    components: {
    },
    methods: {
      /* 上传图片函数 */
      handleAvatarSuccess (res, file) {
        this.restaurantInfo.license = res.data[0]
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
        }
        return isJPG && isLt2M
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
            map.addOverlay(new BMap.Marker(e))
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
      mapInit() {
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
          that.point = JSON.parse(JSON.stringify(e.point))
          // that.point.lat = e.point.lat
          // that.point.lng = e.point.lng
          console.log(that.point)
          const marker = new BMap.Marker(e.point)
          map.addOverlay(marker)
          geoc.getLocation(e.point, function(rs) {
            that.pointAddress = rs.address
          })
        })
        /* eslint-enable */
      },
      showMap(e) {
        if (e.label === '地图定位') {
          this.$nextTick(() => {
            this.mapInit()
          })
        }
      },
      getRegion (data = {}) {
        api.GET(config.restaurants.getRegion, data)
          .then(response => {
            this.regionSelectOptions = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      transformData (res) {
        res.data.forEach(v => {
          if (v.created_at) {
            v.created_at = this.formatDate(v.created_at)
          }
          if (v.signState === 0) {
            v.signState = '未签约'
          }
          if (v.signState === 1) {
            v.signState = '已签约'
          }
          if (v.checkState === 0) {
            v.checkState = false
          }
          if (v.checkState === 1) {
            v.checkState = true
          }
        })
        return res
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
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  .lh-container {
    padding: 1rem 2rem;
    .table-head {
      padding: 0 2rem;
      width: 100%;
      display: flex;
      align-items: center;
      height: 60px;
      border-bottom: 1px solid lightgray;
      div:nth-of-type(1){
        font-size: 16px;
      }
    }
    .table-body {
      margin: 1rem 2rem;
      .street-select {
        width: 100%;
      }
    }
    #map {
      height: 500px;
    }
    .lh-top,.lh-middle,.lh-bottom {
      border: 1px solid lightgray;
      background-color: #fff;
      border-radius: 5px;
      width: 100%;
      padding-bottom: 1rem;
    }
    .lh-top {
      .table-head {
        justify-content: space-between;
      }
    }
    .lh-middle {
      margin-top: 1rem;
    }
    .lh-bottom {
      margin-top: 1rem;
      .contract-time {
        .el-date-editor--datetime {
          width: 49.6%;
        }
      }
    }
  }
</style>