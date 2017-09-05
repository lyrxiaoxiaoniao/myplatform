<template>
  <div class="sc-reservation-foundation-list">
    <kobe-table>
      <div class="kobe-table-header" slot="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-button type="primary" icon="plus" @click="openDialog('infoVisible')">新增</el-button>
          </el-col>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-col :span="7">
            <el-input placeholder="请输入关键字" class="sc-table-header-select">
              <el-button slot="append" class="sc-table-search-btn" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button type="primary" @click="openDialog('advanceVisible')" icon="search">高级</el-button>
          <el-button type="primary" icon="upload2"></el-button>
          <el-button type="primary" icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table :data="listData" border>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="基地名称"></el-table-column>
          <el-table-column label="基地电话"></el-table-column>
          <el-table-column label="基地照片">
            <template scope="scope">
              <img style="width:58px; height:58px;" :src="scope.row.logo" alt="">
            </template>
          </el-table-column>
          <el-table-column label="基地地址"></el-table-column>
          <el-table-column label="所属地区"></el-table-column>
          <el-table-column label="基地负责人"></el-table-column>
          <el-table-column label="负责人电话"></el-table-column>
          <el-table-column label="是否推荐">
            <template scope="scope">
              <el-switch on-text="开" off-text="关"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否允许预约"></el-table-column>
          <el-table-column label="显示状态">
            <template scope="scope">
              <el-switch on-text="开" off-text="关"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button icon="edit" size="small"></el-button>
              <el-button icon="setting" size="small" @click="configItem(scope.row.id)"></el-button>
              <el-button icon="delete2" type="danger" @click="deleteItem(scope.row.id)" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer" class="kobe-table-footer">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="response.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="response.pageSize" :total="response.count" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </kobe-table>
    <el-dialog title="高级搜索" v-model="advanceVisible" size="tiny">
      <el-form :model="advanceSearchForm" label-position="right" label-width="100px">
        <el-form-item label="关键字">
          <el-input v-model="advanceSearchForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="基地名称">
          <el-input v-model="advanceSearchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="基地电话">
          <el-input v-model="advanceSearchForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="基地负责人">
          <el-input v-model="advanceSearchForm.person"></el-input>
        </el-form-item>
        <el-form-item label="基地地址">
          <el-input v-model="advanceSearchForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer" width="150">
        <el-button type="danger" @click="hideDialog('advanceVisible')">取消</el-button>
        <el-button type="primary" @click="advanceSearch">搜索</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加" v-model="infoVisible" class="infoDialog">
      <el-tabs type="border-card" @tab-click="showMap">
        <el-tab-pane label="基本信息">
          <el-form :model="advanceSearchForm" label-position="right" :inline="true" class="infoForm">
            <el-form-item label="基地名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="基地电话">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="基地负责人">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="负责人联系电话">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="所属地区">
              <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否允许预约">
              <el-switch on-text="开" off-text="关"></el-switch>
            </el-form-item>
            <el-form-item label="基地简介" class="formTextarea">
              <el-input type="textarea" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="基地照片">
              <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="基地说明">
          <vue-html5-editor @change="updateData" :content="content"></vue-html5-editor>
        </el-tab-pane>
        <el-tab-pane label="地图定位">
          <el-row>
            <el-col :span="3">详细信息</el-col>
            <el-col :span="21">
              <el-row>
                <el-col :span="12">
                  <el-input v-model="searchInput"></el-input>
                </el-col>
                <el-col :span="12">
                  <div class="btnWrapper">
                    <el-button @click="posMarker">定位到地图</el-button>
                    <el-button type="primary" @click="useClick">使用地图当前点</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="space">
            <el-col :span="3">地图定位</el-col>
            <el-col :span="21">
              <div id="map"></div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer" slot="footer">
        <el-button type="danger" @click="hideDialog('infoVisible')">取消</el-button>
        <el-button type="primary" @click="advanceSearch">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [{ id: 0 }],
      response: {},
      selectValue: '',
      options: [{
        value: '1',
        label: '罗湖区'
      },
      {
        value: '2',
        label: '福田区'
      }],
      advanceVisible: false,
      advanceSearchForm: {
        keyword: '',
        name: '',
        mobile: '',
        person: '',
        address: ''
      },
      infoVisible: false,
      info: {
        infoForm: {}
      },
      fileList: [],
      content: '',
      searchInput: '',
      point: {},
      pointAddress: '',
      map: null,
      geoc: null
    }
  },
  methods: {
    openDialog(e) {
      this[e] = true
    },
    hideDialog(e) {
      this[e] = false
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    deleteItem(id) {
      this.$confirm('此操作将删除该安全教育基地，删除后，数据将无法恢复。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    configItem(id) {
      this.$router.push({ path: '/admin/reservation/config', query: { id } })
    },
    updateData() {
      console.log('editor')
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
        that.point.lat = e.point.lat
        that.point.lng = e.point.lng
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
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
#map {
  height: 500px;
  ;
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
</style>
