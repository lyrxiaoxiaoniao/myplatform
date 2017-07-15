<template>
  <kobe-table>
    <div slot="kobe-table-header" style="border-bottom:none" class="kobe-table-header"> 
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <div class="sc-takeself-wrap">
        <div class="sc-takeself-content">
          <el-card>
            <div slot="header">
                <span style="font-size:18px;">买家上门自提功能</span>
                <el-switch @change="statuChange" style="float:right;" v-model="switched" on-text="开" off-text="关"></el-switch>
            </div>
            <el-button @click="addShow=true" :disabled="disables" style="margin-bottom:28px" type="primary">新增自提点</el-button>
            <div class="sc-disabled-statu">
              <el-table :data="test" border stripe>
                <el-table-column prop="id" label="ID" width="80"></el-table-column>
                <el-table-column prop="name" label="自提点名称"></el-table-column>
                <el-table-column label="省份"></el-table-column>
                <el-table-column label="城市"></el-table-column>
                <el-table-column label="地区"></el-table-column>
                <el-table-column label="联系地址"></el-table-column>
                <el-table-column label="联系电话"></el-table-column>
                <el-table-column label="启用">
                  <template scope="scope">
                      <el-checkbox :disabled="disables" v-model="checked"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column width="120" label="操作">
                  <template scope="scope">
                    <el-button type="small" :disabled="disables" @click="editShow=true" icon="edit"></el-button>
                    <el-button type="small" :disabled="disables" @click="rowDataDel" icon="delete2"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top:32px" class="sc-takeself-footer">
                <el-row type="flex" justify="center">
                  <el-col :span="12">
                      <el-pagination 
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :page-sizes="[15, 20, 25, 30]"
                      :total="20"
                      layout="total, sizes, prev, pager, next, jumper">
                      </el-pagination>
                  </el-col>
                </el-row>
              </div>
              <div :class="{popDisabledWrap: disables }"></div>
            </div>
          </el-card>
        </div>

        <!--新增自提点-->  
        <div class="sc-takeself-addform">
          <el-dialog title="新增自提点" v-model="addShow">
            <el-tabs type="border-card" v-model="activeName1" @tab-click="handleClick">
              <el-tab-pane label="基本信息" name="first">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="自提点名称">
                    <el-input placeholder="请输入名称"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话">
                    <el-input placeholder="请输入电话"></el-input>
                  </el-form-item>
                  <el-row type="flex">
                    <el-form-item style="margin-bottom:0" label="接待时间">
                      <el-time-select style="margin-right:12px"
                          v-model="value1"
                          :picker-options="{
                          start: '08:30',
                          step: '00:15',
                          end: '18:30'
                          }"
                          placeholder="选择时间">
                      </el-time-select>
                      <el-time-select
                          v-model="value2"
                          :picker-options="{
                              start: '08:30',
                              step: '00:15',
                              end: '18:30'
                          }"
                          placeholder="选择时间">
                      </el-time-select> 
                    </el-form-item>
                  </el-row>
                  <el-form-item><el-checkbox v-model="checked1">节假日正常</el-checkbox></el-form-item>
                  <el-form-item label="商家推荐">
                    <el-input :rows="4" type="textarea"></el-input>
                  </el-form-item>
                  <el-form-item label="自提点照片">
                      <el-upload
                      class="avatar-uploader"
                      action="uploadUrl"
                      :show-file-list="false"
                      :on-success="onSuccess"
                      :before-upload="beforeAvatarUpload"
                      >
                      <img v-if="imageURL" :src="imageURL" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="地图定位" name="second">地图定位</el-tab-pane>
            </el-tabs> 
            <div slot="footer" class="dialog-footer">
              <el-button @click="addShow = false">取 消</el-button>
              <el-button type="primary" @click="addSubmit">保 存</el-button>
            </div>
          </el-dialog>
        </div>
        <!--修改自提点-->
        <div class="sc-takeself-editform">
          <el-dialog title="修改自提点" v-model="editShow">
            <el-tabs type="border-card" v-model="activeName2" @tab-click="handleClick">
              <el-tab-pane label="基本信息" name="first">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="自提点名称">
                    <el-input placeholder="请输入名称"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话">
                    <el-input placeholder="请输入电话"></el-input>
                  </el-form-item>
                  <el-row type="flex">
                    <el-form-item style="margin-bottom:0" label="接待时间">
                      <el-time-select style="margin-right:12px"
                        v-model="value3"
                        :picker-options="{
                        start: '08:30',
                        step: '00:15',
                        end: '18:30'
                        }"
                        placeholder="选择时间">
                      </el-time-select>  
                      <el-time-select
                        v-model="value4"
                        :picker-options="{
                          start: '08:30',
                          step: '00:15',
                          end: '18:30'
                        }"
                        placeholder="选择时间">
                      </el-time-select>
                    </el-form-item>      
                  </el-row>
                  <el-form-item><el-checkbox v-model="checked1">节假日正常</el-checkbox></el-form-item>
                  <el-form-item label="商家推荐">
                      <el-input :rows="4" type="textarea"></el-input>
                  </el-form-item>
                  <el-form-item label="自提点照片">
                    <el-upload
                    class="avatar-uploader"
                    action="uploadUrl"
                    :show-file-list="false"
                    :on-success="onSuccess"
                    :before-upload="beforeAvatarUpload"
                    >
                    <img v-if="imageURL" :src="imageURL" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="地图定位" name="second">
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
              </el-tab-pane>
            </el-tabs>
              
            <div slot="footer" class="dialog-footer">
              <el-button @click="editShow = false">取 消</el-button>
              <el-button type="primary" @click="editSubmit">保 存</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer"> 
    </div>
  </kobe-table>
</template>

<script>
export default {
  name: 'sc-ordersetting-takeself',
  data () {
    return {
      test: [{
        id: 1,
        name: 'test'
      }],
      switched: true,
      activeName1: 'first',
      activeName2: 'first',
      addShow: false,
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      editShow: false,
      disables: false,
      imageUrl: '',
      // 地图
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
      // 地图
    }
  },
  methods: {
    addSubmit () {
      this.addShow = false
    },
    editSubmit () {
      this.editShow = false
    },
    rowDataDel (id) {
      this.$confirm('此操作将删除选定的记录。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    },
    statuChange () {
      if (this.switched) {
        this.disables = true
      } else {
        this.disables = false
      }
    },
    handleClick(tab, event) {
      console.log(tab.name)
      if (tab.name) {
        this.$nextTick(() => {
          this.init()
        })
      }
    },
    handleSizeChange (value) {
      console.log(value)
    },
    handleCurrentChange (value) {
      console.log(value)
    },
    onSuccess (res, file) {
      this.imageUrl = file.url
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 百度地图
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
      var local = new BMap.LocalSearch(this.map, {
        renderOptions: {map: this.map, panel: "bresult"}
      })
      local.search(this.address)
      /* eslint-enable */
    },
    init () {
      /* eslint-disable */
      console.log('bmap')
      this.map = new BMap.Map('b_map')
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
  mounted () {}
}
</script>

<style scoped>
.sc-disabled-statu{
  position: relative;
}
.popDisabledWrap{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #eef1f6;
  opacity: 0.2;
  cursor: not-allowed;
}
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
</style>
