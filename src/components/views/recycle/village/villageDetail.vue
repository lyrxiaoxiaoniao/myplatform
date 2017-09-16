<template>
  <div class="lh-container">
    <el-tabs type="border-card" @tab-click="showMap">
      <el-tab-pane label="基本信息" class="lh-top">
        <div class="table-head">
          <div>基本信息</div>
          <div>
            <el-button @click="back">返回</el-button>  
            <el-button type="primary" @click="submitForm('detailForm')" style="margin-left: 10px;">保存</el-button>
          </div>
        </div>
        <div class="table-body">
          <el-form  :model="detailForm" :rules="rules" ref="detailForm"  class="demo-ruleForm padding" :label-position="labelPosition" label-width="100px">
            <el-row>
              <el-col :span="10"> 
                  <el-form-item label="小区名称" prop="name">
                    <el-input v-model="detailForm.name" placeholder="请输入小区名称"></el-input>
                  </el-form-item>
              </el-col>
          
              <el-col :offset="4" :span="10">      
                <el-form-item label="固定电话" prop="phone">
                  <el-input v-model="detailForm.phone" placeholder="请输入电话"></el-input>
                </el-form-item> 
               </el-col>
            </el-row>
            <el-row>
              <el-col :span="10"> 
                  <el-form-item label="负责人" prop="duty_name">
                    <el-input v-model="detailForm.duty_name" placeholder="请输入负责人姓名"></el-input>
                  </el-form-item>
              </el-col>
           
              <el-col :offset="4" :span="10">      
                <el-form-item label="联系方式" prop="mobile">
                  <el-input v-model="detailForm.mobile" placeholder="请输入负责人联系电话"></el-input>
                </el-form-item> 
               </el-col>
            </el-row>           
           <el-row>
              <el-col :span="10"> 
                <el-form-item label="所属街道">
                  <el-cascader
                      :options="cascaderData"
                      :props="props"
                      :change-on-select="true"
                      v-model="ids"
                      @change="handleChange"
                      style="width:100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                  <el-col :span="24"> 
                      <el-form-item label="小区说明" prop="memo">
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入内容"
                          v-model="detailForm.memo">
                        </el-input>
                      </el-form-item>
                  </el-col>
            </el-row>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="地图定位" class="lh-middle">
        <div class="table-head">
          <div>地图定位</div>
          <div></div>
        </div>
        <div class="table-body">
          <el-form :model="form" label-width="100px">
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
    </el-tabs>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    var phone = (rule, value, callback) => {
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
      ids: [],
      point: {},
      pointAddress: '',
      map: null,
      geoc: null,
      showContract: true,
      searchInput: '',
      cascaderData: [],
      labelPosition: 'left',
      props: {
        children: 'children',
        label: 'title',
        value: 'id'
      },
      detailForm: {
        name: '',
        phone: '',
        duty_name: '',
        mobile: '',
        region_id: '',
        detail_address: '',
        memo: '',
        id: this.$route.query.id
      },
      rules: {
        phone: [
          { required: true, validator: phone, trigger: 'blur' }
        ],
        duty_name: [
          { required: true, message: '请输入小区负责人', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: phone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
        console.log(e)
        if (e) {
          map.centerAndZoom(e, 17)
          map.addOverlay(new BMap.Marker(e))
          this.detailForm.longitude = e.lng
          this.detailForm.latitude = e.lat
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
      if (this.searchInput === '') {
        map.centerAndZoom('深圳', 14)
      }  
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
        console.log(1111)
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
        console.log(e.point)
        that.point = JSON.parse(JSON.stringify(e.point))
        that.detailForm.longitude = that.point.lng
        that.detailForm.latitude = that.point.lat
        // that.point.lat = e.point.lat
        // that.point.lng = e.point.lng
        // console.log(that.point)
        // console.log('that.detailForm' + that.detailForm)
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
          this.posMarker()
        })
      }
    },
    handleChange(value) {
      console.log(value)
      this.detailForm.region_pid = value[0]
      this.detailForm.region_id = value[1]
    },
    back () {
      this.$router.push('/admin/recycle/village/index')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.detailForm.detail_address = this.searchInput
          api.POST(config.village.update, this.detailForm)
          .then(response => {
            this.onSuccess('修改成功！')
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请填写完整修改信息后再提交。',
            type: 'success'
          })
        }
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    getForm () {
      api.GET(config.village.indexOne, {id: this.$route.query.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.detailForm = response.data.data
          this.ids.push(response.data.data.region_pid)
          this.ids.push(response.data.data.region_id)
          this.searchInput = response.data.data.detail_address
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getTree () {
      api.GET(config.village.streetTree)
      .then(response => {
        var newData = response.data.data[0].children[0].children
        this.iteration(newData)
        this.data = newData
        this.cascaderData = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    }
  },
  mounted () {
    this.getForm()
    this.getTree()
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