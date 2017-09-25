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
            <el-button @click="singleAdd" :disabled="disables" style="margin-bottom:28px" type="primary">新增自提点</el-button>
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
                      <el-checkbox :disabled="disables" v-model="checked" @change="enableSubmit"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column width="120" label="操作">
                  <template scope="scope">
                    <el-button type="small" :disabled="disables" @click="singleEdit" icon="edit"></el-button>
                    <el-button type="small" :disabled="disables" @click="singleDelete" icon="delete2"></el-button>
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
        <!--增加或修改自提点-->
        <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
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
        address: '',
        dialog: {
          visible: false,
          title: '',
          size: 'small'
        },
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
        api.GET(config.goodsListAPI, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      deletePost () {
        console.log('发起删除http请求')
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
      singleDelete () {
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
        const data = {
          currentPage: this.response.currentPage,
          pageSize: value,
          ...this.form
        }

        this.getList(data)
      },
      handleCurrentChange (value) {
        const data = {
          currentPage: value,
          pageSize: this.response.pageSize,
          ...this.form
        }

        this.getList(data)
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
        // 弹出输入对话框或警告对话框/直接发起http请求
        if (this.next) {
          if (this.needInput) {
            this.next = false
            this.openDialog(operationName, dialogSize)
          }
          if (this.needWarning) {
            // 弹出警告对话框
            this.next = await this.confirmOperation(this.next, warnContent)
          }
          if (!this.needInput && !this.needWarning) {
            this.next = false
            // 发起http请求
            console.log('直接发起http请求')
          }
        }
        // 警告对话框点击确定后的执行函数
        if (this.next) {
          switch (operationName) {
            case '':
              console.log('')
              break
            case '删除':
              console.log('警告对话框点击确定后发起彻底删除http请求')
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
      statuChange () {
        if (this.switched) {
          this.disables = false
        } else {
          this.disables = true
        }
      },
      handleClick(tab, event) {
        if (tab.name) {
          this.$nextTick(() => {
            this.init()
          })
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
        var local = new BMap.LocalSearch(this.map, {
          renderOptions: {map: this.map, panel: "bresult"}
        })
        local.search('鸿昌广场')
        /* eslint-enable */
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
</style>
