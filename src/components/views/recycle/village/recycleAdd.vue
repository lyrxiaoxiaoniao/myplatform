<template>
  <div class="lh-container">
    <el-tabs type="border-card" @tab-click="showMap">
      <el-tab-pane label="基本信息" class="lh-top">
        <div class="table-head">
          <div>基本信息</div>
          <div>
            <el-button @click="back">返回</el-button>  
            <el-button type="primary" @click="submitForm('form')" style="margin-left: 10px;">添加</el-button> 
          </div>
        </div>
        <div class="table-body">
          <el-form :model="form" :rules="rules" ref="form"  class="demo-ruleForm" :label-position="labelPosition" label-width="100px">
            <el-row>
              <el-col :span="10"> 
                  <el-form-item label="小区名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入小区名称"></el-input>
                  </el-form-item>
              </el-col>
          
              <el-col :offset="4" :span="10">      
                <el-form-item label="固定电话" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
                </el-form-item> 
               </el-col>
            </el-row>
            <el-row>
              <el-col :span="10"> 
                  <el-form-item label="负责人" prop="duty_name">
                    <el-input v-model="form.duty_name" placeholder="请输入负责人姓名"></el-input>
                  </el-form-item>
              </el-col>
           
              <el-col :offset="4" :span="10">     
                <el-form-item label="联系方式" prop="mobile">
                  <el-input v-model="form.mobile" placeholder="请输入负责人联系电话"></el-input>
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
                  <el-form-item label="小区说明">
                    <el-input
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="form.memo">
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
      point: {},
      pointAddress: '',
      map: null,
      geoc: null,
      showContract: true,
      searchInput: '',
      selectedOptions: [],
      labelPosition: 'left',
      form: {
        name: '',
        phone: '',
        duty_name: '',
        mobile: '',
        ids: [],
        memo: '',
        region_pid: '',
        region_id: ''
      },
      cascaderData: [],
      props: {
        children: 'children',
        label: 'title',
        value: 'id'
      },
      rules: {
        name: [
          { required: true, message: '请输入小区名', trigger: 'blur' }
        ],
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
        // console.log(e)
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
        that.form.longitude = that.point.lng
        that.form.latitude = that.point.lat
        // that.point.lat = e.point.lat
        // that.point.lng = e.point.lng
        // console.log(that.point)
        // console.log('that.form' + that.form)
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
    handleChange(value) {
      this.form.region_pid = value[0]
      this.form.region_id = value[1]
    },
    getTree () {
      api.GET(config.village.streetTree)
      .then(response => {
        var newData = response.data.data[0].children[0].children
        this.iteration(newData)
        this.data = newData
        this.cascaderData = newData
        // console.log(this.cascaderData)
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
    },
    back () {
      this.$router.push('/admin/recycle/village/index')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.searchInput === '') {
            this.$notify({
              title: '提示',
              message: '请前往地图定位选择详细地址后再添加',
              type: 'info'
            })
            return
          }
          const data = {
            detail_address: this.searchInput,
            ...this.form
          }
          api.POST(config.village.create, data)
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('添加成功！')
              this.$router.push({path: '/admin/recycle/village/index'})
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请填写完整信息后再提交。',
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
    }
  },
  mounted () {
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