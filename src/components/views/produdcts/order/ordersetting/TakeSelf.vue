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
                <el-switch @change="statusChange" style="float:right;" v-model="switched" on-text="开" off-text="关"></el-switch>
            </div>
            <el-button @click="singleAdd" :disabled="disables" style="margin-bottom:28px" type="primary">新增自提点</el-button>
            <div class="sc-disabled-statu">
              <el-table :data="response.data" border stripe>
                <el-table-column prop="id" label="ID" width="80"></el-table-column>
                <el-table-column prop="name" label="自提点名称"></el-table-column>
                <el-table-column prop="province" label="省份"></el-table-column>
                <el-table-column prop="city" label="城市"></el-table-column>
                <el-table-column prop="region" label="地区"></el-table-column>
                <el-table-column prop="address" label="联系地址"></el-table-column>
                <el-table-column prop="phone" label="联系电话"></el-table-column>
                <el-table-column prop="active" label="启用" width="80">
                  <template scope="scope">
                      <el-checkbox :disabled="disables" v-model="scope.row.active" @change="enableSubmit"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column width="120" label="操作">
                  <template scope="scope">
                    <el-button type="small" :disabled="disables" @click="singleEdit" icon="edit"></el-button>
                    <el-button type="small" :disabled="disables" @click="singleDelete(scope.row.id)" icon="delete2"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="margin-top:32px" class="sc-takeself-footer">
                <el-row type="flex" justify="center">
                  <el-col :span="12">
                      <el-pagination 
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :page-sizes="[10, 20, 50, 100]"
                      :current-page="response.currentPage"
                      :page-size="response.pageSize"
                      :total="response.count"
                      layout="total, sizes, prev, pager, next, jumper">
                      </el-pagination>
                  </el-col>
                </el-row>
              </div>
              <div :class="{popDisabledWrap: disables }"></div>
            </div>
          </el-card>
        </div>
        <!--增加或修改自提点-->
        <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
          <el-tabs type="border-card" v-model="activeName2" @tab-click="showMap">
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
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  >
                  <img v-if="imageURL" :src="imageURL" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="地图定位" name="second">
              <div class="table-head">
                <div>地图定位</div>
              </div>
            <div class="table-body">
              <el-form :model="pickupInfo"
                      label-width="100px">
                <el-form-item label="详细地址">
                  <el-row>
                    <el-col :span="12">
                      <el-input v-model="pickupInfo.detailAddress"></el-input>
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
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" v-show="dialog.title === '新增自提点'" @click="addSubmit">保 存</el-button>
            <el-button type="primary" v-show="dialog.title === '修改自提点'" @click="editSubmit">保 存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer"> 
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-ordersetting-takeself',
    data () {
      return {
        response: {
          data: null
        },
        getListParamsObj: {
          currentPage: 1,
          pageSize: 10
        },
        point: {},
        pointAddress: '',
        map: null,
        geoc: null,
        switched: true,
        activeName2: 'first',
        value3: '',
        value4: '',
        disables: false,
        imageUrl: '',
        dialog: {
          visible: false,
          title: '',
          size: 'small'
        },
        pickupInfo: {},
        isBatchOperation: false, // 是否是批量操作
        needInput: false, // 是否需要打开输入对话框
        needWarning: false, // 是否需要打开警告对话框
        next: true, // 是否进行下一步
        selectedIds: [],
        selectedId: 0
      }
    },
    methods: {
      /* http请求函数开始 */
      getList (data = {}) {
        api.GET(config.integralMall.order.indexPickup, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      deletePost () {
        api.POST(config.integralMall.order.deletePickup, {ids: this.selectedIds})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.selectedIds.length = 0
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      addPost () {
        console.log('发起新增http请求')
      },
      updatePost () {
        console.log('发起修改http请求')
      },
      /* http请求函数结束 */
      /* 用户行为触发改、删、增操作的函数开始 */
      singleAdd () {
        this.isBatchOperation = false
        this.needInput = true
        this.needWarning = false
        this.operate('新增自提点', '')
      },
      singleEdit () {
        this.isBatchOperation = false
        this.needInput = true
        this.needWarning = false
        this.operate('修改自提点', '')
      },
      singleDelete (id) {
        this.selectedIds.length = 0
        this.selectedIds.push(id)
        this.isBatchOperation = false
        this.needInput = false
        this.needWarning = true
        this.operate('删除', '此操作将删除选定的记录。是否继续删除？')
      },
      addSubmit () {
        // 获取表格数据
        this.addPost()
      },
      editSubmit () {
        // 获取表格数据
        this.updatePost()
      },
      enableSubmit () {
        // 调用启用的http请求
      },
      /* 用户行为触发改、删、增操作的函数结束 */
      /* 用户行为触发查操作的函数开始 */
      handleSizeChange (value) {
        this.getListParamsObj.pageSize = value
        this.getListByParams()
      },
      handleCurrentChange (value) {
        this.getListParamsObj.currentPage = value
        this.getListByParams()
      },
      // 以getListParamsObj为基础，构造getList的参数
      getListByParams () {
        let obj = JSON.parse(JSON.stringify(this.getListParamsObj))
        for (var keyName in obj) {
          if (obj[keyName] === '') {
            delete obj[keyName]
          }
        }

        this.getList(obj)
      },
      /* 用户行为触发查操作的函数结束 */
      /* 用户行为触发改或删操作的流程开始 */
      async operate (operationName, warnContent, dialogSize) {
        this.next = true
        // 如果是批量操作，是否有选中的记录
        if (this.isBatchOperation) {
          if (!this.selectedIds.length) {
            this.next = await this.warnSelection(this.next, warnContent)
          }
        }
        // 弹出输入对话框或警告对话框
        if (this.next) {
          if (this.needInput) {
            this.next = false
            this.openDialog(operationName, dialogSize)
          }
          if (this.needWarning) {
            // 弹出警告对话框
            this.next = await this.confirmOperation(this.next, warnContent)
          }
        }
        // 警告对话框点击确定后的执行函数
        if (this.next) {
          switch (operationName) {
            case '删除':
              this.deletePost()
              // console.log('警告对话框点击确定后发起彻底删除http请求')
              break
          }
        }
      },
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否执行操作
      confirmOperation (next, str) {
        return this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      /* 用户行为触发改或删操作的流程结束 */
      transformData (res) {
        let obj = res
        if (obj.currentPage !== undefined) {
          obj.data.forEach(v => {
            if (v.created_at) {
              v.created_at = this.formatDate(v.created_at)
            }
            this.changeState(v)
          })
        } else {
          if (obj.created_at) {
            obj.created_at = this.formatDate(obj.created_at)
          }
          this.changeState(obj)
        }
        return obj
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
      changeState (obj) {
        switch (obj.active) {
          case 0:
            obj.active = false
            break
          case 1:
            obj.active = true
            break
        }
      },
      statusChange () {
        if (this.switched) {
          this.disables = false
        } else {
          this.disables = true
        }
      },
      handleAvatarSuccess (res, file) {
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
      useClick() {
        this.pickupInfo.detailAddress = this.pointAddress
      },
      posMarker() {
        /* eslint-disable */
        const map = this.map
        const geoc = this.geoc
        const that = this
        map.clearOverlays()
        geoc.getPoint(this.pickupInfo.detailAddress, function(e) {
          if (e) {
            that.point = JSON.parse(JSON.stringify(e))
            that.pickupInfo.longitude = that.point.lng
            that.pickupInfo.latitude = that.point.lat
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
          that.pickupInfo.longitude = that.point.lng
          that.pickupInfo.latitude = that.point.lat
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
      // 勾选多行生成selectedIds数组
      selectIds (value) {
        let arr = value.map(v => {
          return v.id
        })
        this.selectedIds = JSON.parse(JSON.stringify(arr))
      },
      // 点击单行按钮生成selectedId值
      selectId (value) {
        this.selectedId = value
      },
      openDialog (value, size) {
        this.dialog.title = value
        this.dialog.visible = true
        this.dialog.size = size
      },
      closeDialog () {
        this.dialog.visible = false
        this.dialog.title = ''
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
      this.getList()
    }
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
#map {
  height: 400px;
}
</style>
