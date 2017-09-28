<template>
  <div class="lh-container">
    <el-tabs type="border-card"
             @tab-click="showMap">
      <el-tab-pane label="基本信息"
                   class="lh-top">
        <div class="table-head">
          <div>基本信息</div>
          <div>
            <el-button @click="toList">返回</el-button>
            <el-button type="primary" @click="add('restaurantInfo')">保存</el-button>
          </div>
        </div>
        <div class="table-body">
          <el-form :model="restaurantInfo"
              :rules="rules"
              ref="restaurantInfo"
              label-width="100px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="企业名称" prop="name" required>
                  <el-input placeholder="请输入企业名称"
                            v-model="restaurantInfo.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="固定电话" prop="phone" required>
                  <el-input placeholder="请输入电话"
                            v-model="restaurantInfo.phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人" prop="dutyName" required>
                  <el-input placeholder="请输入负责人姓名"
                            v-model="restaurantInfo.dutyName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="mobile" required>
                  <el-input placeholder="请输入负责人联系电话"
                            v-model="restaurantInfo.mobile"></el-input>
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
                  <el-input placeholder="请输入组织结构代码"
                            v-model="restaurantInfo.orgCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="审核状态">
                  <el-switch on-text="已"
                             off-text="未"
                             v-model="restaurantInfo.checkState"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="企业说明">
                  <el-input type="textarea"
                            placeholder="请输入"
                            v-model="restaurantInfo.memo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="营业执照">
                  <el-upload class="avatar-uploader"
                             :action="uploadURL"
                             :show-file-list="false"
                             :on-success="handleAvatarSuccess"
                             :before-upload="beforeAvatarUpload">
                    <img v-if="restaurantInfo.license"
                         :src="restaurantInfo.license"
                         class="avatar">
                    <i v-else
                       class="el-icon-plus avatar-uploader-icon"></i>
                    <div class="el-upload__tip"
                         slot="tip">上传有效、清晰的营业执照图片（最多上传1张，每张最大10M）</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="地图定位"
                   class="lh-middle">
        <div class="table-head">
          <div>地图定位</div>
        </div>
        <div class="table-body">
          <el-form :model="restaurantInfo"
            :rules="rules"
            label-width="100px">
            <el-form-item label="详细地址">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="restaurantInfo.detailAddress"></el-input>
                </el-col>
                <el-col :span="12">
                  <div class="btnWrapper">
                    <el-button @click="posMarker"
                               style="margin-left: 10px">定位到地图</el-button>
                    <el-button type="primary"
                               @click="useClick">使用地图当前点</el-button>
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
      <el-tab-pane label="签约信息"
                   class="lh-bottom">
        <div class="table-head">
          <div>是否签约</div>
          <el-switch v-model="restaurantInfo.signState"
                     on-text="开"
                     off-text="关"
                     style="margin-left: 35px;"></el-switch>
        </div>
        <div class="table-body" v-if="restaurantInfo.signState">
          <el-form :model="restaurantInfo"
            :rules="rules"
            label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="签约人" prop="sign_name" required>
                  <el-input placeholder="请输入签约人姓名" v-model="restaurantInfo.sign_name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="sign_phone" required>
                  <el-input placeholder="请输入签约人联系电话" v-model="restaurantInfo.sign_phone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="回收单位" prop="recycle_id" required>
                  <el-select v-model="restaurantInfo.recycle_id" clearable placeholder="请选择签约回收单位" class="recycle-select">
                    <el-option
                      v-for="item in recycleSelectOptions"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合同期限" class="contract-time" required>
                  <el-col :span="11">
                    <el-form-item prop="begin_time">
                      <el-date-picker v-model="restaurantInfo.begin_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2" style="text-align: center">~~</el-col>
                  <el-col :span="11">
                    <el-form-item prop="end_time">
                      <el-date-picker v-model="restaurantInfo.end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    data () {
      var phoneValidator = (rule, value, callback) => {
        let phone = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        if (!value) {
          return callback(new Error('号码不能为空'))
        } else if (!phone.test(value)) {
          callback(new Error('请输入正确号码'))
        } else {
          callback()
        }
      }
      return {
        uploadURL: config.serverURI + config.uploadFilesAPI,
        selected: {
          banner: ''
        },
        regionSelectOptions: [],
        recycleSelectOptions: [],
        restaurantInfo: {
          name: '',
          phone: '',
          dutyName: '',
          mobile: '',
          orgCode: '',
          checkState: true,
          signState: false,
          memo: '',
          license: '',
          detailAddress: '',
          longitude: 0,
          latitude: 0,
          sign_name: '',
          sign_phone: '',
          recycle_id: '',
          begin_time: '',
          end_time: ''
        },
        searchInput: '',
        point: {},
        pointAddress: '',
        map: null,
        geoc: null,
        showContract: true,
        rules: {
          name: [
            { required: true, message: '请输入企业名称', trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: phoneValidator, trigger: 'blur' }
          ],
          dutyName: [
            { required: true, message: '请输入负责人姓名', trigger: 'blur' }
          ],
          mobile: [
            { required: true, validator: phoneValidator, trigger: 'blur' }
          ],
          sign_name: [
            { required: true, message: '请输入签约人姓名', trigger: 'blur' }
          ],
          sign_phone: [
            { required: true, validator: phoneValidator, trigger: 'blur' }
          ]
        }
      }
    },
    components: {
    },
    methods: {
      add (formName) {
        let obj = JSON.parse(JSON.stringify(this.restaurantInfo))
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 必须选择地图定位才能发起添加请求
            if (obj.detailAddress === '') {
              this.$notify({
                title: '提示',
                message: '请前往地图定位选择详细地址后再添加',
                type: 'info'
              })
              return
            }
            // 如果为已签约状态，必须填写完整签约信息才能发起添加请求
            if (obj.signState) {
              if (obj.sign_name === '' ||
                obj.sign_phone === '' ||
                obj.recycle_id === '' ||
                obj.begin_time === '' ||
                obj.end_time === '') {
                this.$notify({
                  title: '提示',
                  message: '请填写完整签约信息后再添加',
                  type: 'info'
                })
                return
              }
            }
            if (obj.begin_time) {
              obj.begin_time = Date.parse(obj.begin_time)
            }
            if (obj.end_time) {
              obj.end_time = Date.parse(obj.end_time)
            }
            obj.checkState = Number(obj.checkState).toString()
            obj.signState = Number(obj.signState).toString()
            api.POST(config.restaurants.create, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.onSuccess('保存成功')
                this.toList()
              }
            })
            .catch(error => {
              this.$message.error(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
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
      getRecycle (data = {}) {
        api.GET(config.restaurants.getRecycle, data)
        .then(response => {
          this.recycleSelectOptions = response.data.data
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
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
        this.restaurantInfo.detailAddress = this.pointAddress
        // this.searchInput = this.pointAddress
      },
      posMarker() {
        /* eslint-disable */
        const map = this.map
        const geoc = this.geoc
        const that = this
        map.clearOverlays()
        geoc.getPoint(this.restaurantInfo.detailAddress, function(e) {
          if (e) {
            that.point = JSON.parse(JSON.stringify(e))
            that.restaurantInfo.longitude = that.point.lng
            that.restaurantInfo.latitude = that.point.lat
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
          that.restaurantInfo.longitude = that.point.lng
          that.restaurantInfo.latitude = that.point.lat
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
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      },
      toList () {
        this.$router.push({
          path: '/admin/recycle/restaurants/index'
        })
      }
    },
    mounted() {
      this.getRecycle()
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
    div:nth-of-type(1) {
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
  .lh-top,
  .lh-middle,
  .lh-bottom {
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
        width: 100%;
        // width: 49.6%;
      }
    }
    .recycle-select {
      width: 100%;
    }
  }
}
</style>