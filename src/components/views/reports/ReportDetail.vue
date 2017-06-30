<template>
  <div v-if="response" class="sc-report-detail">
    <div class="sc-report-detail-content">
      <el-row class="detailBtnWrap" type="flex" justify="end">
        <el-col :span="2">
          <el-button @click="detailDeal" type="primary">处理</el-button>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="10" :offset="1" style="padding: 1rem">
          <ul class="sc-report-detail-content-basement">
            <li><h4>基本信息</h4></li>
            <li>
              <div>举报人: <span>{{ response.reportName }}</span></div>
            </li>
            <li>
              <div>联系方式：<span>{{ response.mobile }}</span></div>
            </li>
            <li>
              <div>分类名称：<span>{{ response.catlgName }}</span></div>
            </li>
            <li>
              <el-row type="flex">
                <div>
                  案件地址： 
                  <el-button size="small" class="fa fa-map-marker" @click="openMap"></el-button>
                  <span>{{ response.address }}</span>
                </div>
              </el-row>
            </li>
            <li>
              <div>案件描述：<span>{{ response.description }}</span></div>
            </li>
            <li>
              <div>隐患单位：<span>{{ response.hiddenUnit }}</span></div>
            </li>
            <li>
              <div>提交时间：<span>{{ response.createdAt | toDateTime }}</span></div>
            </li>
            <li>
              <div>提交IP：<span>{{ response.createOn }}</span></div>
            </li>
            <li>
              <el-row type="flex">
                <el-col :span="4">
                  <div>是否匿名: </div>
                </el-col>
                <el-checkbox v-model="isAnonymous" :disabled="true">
                </el-checkbox>
              </el-row>
            </li>
          </ul>
          <ul class="sc-report-detail-content-deal" v-if="response.status !== 1">
            <li><h4>受理信息</h4></li>
            <li>
              <div>受理编号：<span>{{ response.acceptNo }}</span></div>
            </li>
            <li>
              <div>上报时间： <span>{{ response.createdAt | toDate }}</span></div>
            </li>
            <li v-if="response.acceptDate">
              <div>受理时间： <span>{{ response.acceptDate | toDate }}</span></div>
            </li>
            <li>
              <div>受理状态：<span>{{ status }}</span></div>
            </li>
            <li>
              <div>受理意见：<span>{{ response.summary }}</span></div>
            </li>
          </ul>
        </el-col>
        <el-col :span="11" :offset="1" class="imgListWrapper">
          <h4>图片列表</h4>
          <ul class="sc-report-detail-img-wrapper">
            <li v-for="(item,index) in response.images" :key="item">
              <a href="javascript:;" class="thumbnail" @click="openImg(item.fileUrl,index)">
                <img :src="item.fileUrl" :alt="item.fileName">
              </a>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="案件处理" v-model="dialogFormVisible" class="deal-dialog">
      <el-form :model="form">
        <el-form-item label="处理方式" :label-width="formLabelWidth">
          <el-select v-model="detailDealForm.status" placeholder="请选择处理方案">
            <el-option label="结案" value="2"></el-option>
            <el-option label="驳回" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="detailDealForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :on-remove="uploadRemove"
            :on-error="onUploadError"
            :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-checkbox label="是否短信通知" v-model="detailDealForm.mail" :disabled="isSMSNotify"></el-checkbox>
          <el-checkbox label="是否微信通知" v-model="detailDealForm.wx" :disabled="isWXNotify"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="postDetail">确 定</el-button>
      </div>
    </el-dialog>
    <div class="mapDialog" v-if="dialogMapVisible">
      <div class="mapMask" @click="closeMap"></div>
      <div class="mapDialogWrapper">
        <div class="mapDialogHeader">地图显示</div>
        <div id="mapWrapper"></div>
        <div class="mapDialogFooter">
          <el-row type="flex" justify="end">
            <el-button @click="closeMap">关闭</el-button>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog title="现场照片" v-model="dialogImgVisible" size="small">
      <el-carousel
        indicator-position="outside"
        :autoplay="false"
        height="500px"
        @change="changeImg"
        ref="carousel">
        <el-carousel-item v-for="(item, index) in response.images" :key="item" :name="item.fileName">
          <img :src="item.fileUrl" height="500px">
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImgVisible = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

let map = {
  1: '进行中',
  2: '已结案',
  3: '已驳回'
}

export default {
  name: 'sc-report-detail',
  data () {
    return {
      response: {},
      error: null,
      id: this.$route.query.id,
      dialogFormVisible: false,
      dialogMapVisible: false,
      dialogImgVisible: false,
      showImgUrl: '',
      detailDealForm: {
        status: '',
        summary: '',
        imageName: [],
        mail: '',
        wx: ''
      },
      mapData: {
        zoom: 14,
        center: {}
      },
      formLabelWidth: '120px',
      uploadUrl: config.serverURI + config.uploadImgAPI,
      fileList: [],
      imgNaturalWidth: ''
    }
  },
  computed: {
    isAnonymous () {
      return this.response.isAnonymous
    },
    status () {
      return map[this.response.status]
    },
    isSMSNotify () {
      if (this.response && this.response.isNotify && this.response.isNotify.indexOf('sms') !== -1) {
        this.detailDealForm.mail = true
        return true
      }

      this.detailDealForm.mail = false
      return false
    },
    isWXNotify () {
      if (this.response && this.response.isNotify && this.response.isNotify.indexOf('wx') !== -1) {
        this.detailDealForm.wx = true
        return true
      }

      this.detailDealForm.wx = false
      return false
    }
  },
  methods: {
    detailDeal () {
      this.dialogFormVisible = true
    },
    openMap () {
      this.dialogMapVisible = true
      this.$nextTick(function () {
        this.mapInit()
      })
    },
    closeMap (e) {
      e.stopPropagation()
      this.dialogMapVisible = false
    },
    openImg (url, i) {
      this.dialogImgVisible = true
      this.showImgUrl = url
      const imgNHeight = document.getElementsByClassName('sc-report-detail-img-wrapper')[0].getElementsByTagName('img')[i].naturalHeight
      this.imgNaturalWidth = imgNHeight + 'px'
      this.setActiveItem(i)
    },
    uploadRemove (file, fileList) {
      if (!file) {
        return
      }
      const index = this.detailDealForm.imageName.indexOf(file.response.data[0])
      if (index !== -1) {
        this.detailDealForm.imageName.splice(index, 1)
      }
    },
    mapInit () {
      /* eslint-disable */
      const map = new BMap.Map('mapWrapper')
      const point = new BMap.Point(this.mapData.center.lng, this.mapData.center.lat)
      map.centerAndZoom(point, 15)
      const marker = new BMap.Marker(point)
      map.addOverlay(marker)
      /* eslint-enable */
    },
    beforeAvatarUpload (file) {
      if (this.detailDealForm.imageName.length >= 4) {
        this.$message.error('最多只能上传四张图片')
        return false
      }
      return true
    },
    uploadSuccess (response, file, fileList) {
      if (response && response.errcode === '0000') {
        this.detailDealForm.imageName.push(response.data[0])
      }
    },
    onUploadError (error, file) {
      this.$message.error(error)
    },
    postDetail () {
      if (this.detailDealForm.status === '') {
        this.$message({
          type: 'info',
          message: '请选择处理方式'
        })
        return
      }
      if (this.detailDealForm.summary === '') {
        this.$message({
          type: 'info',
          message: '请填写处理意见'
        })
        return
      }
      this.dialogFormVisible = false
      let form = {
        status: this.detailDealForm.status,
        summary: this.detailDealForm.summary,
        imageNames: this.detailDealForm.imageName,
        isNotify: [],
        id: this.response.id
      }
      if (this.detailDealForm.wx === true) {
        form.isNotify.push('wx')
      }
      if (this.detailDealForm.mail === true) {
        form.isNotify.push('sms')
      }
      form.isNotify = form.isNotify.join()
      api.POST(config.updateCaseAPI, form)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '处理成功',
              type: 'success'
            })
            setTimeout(this.$router.push({
              path: '/admin/report/index'
            }), 2000)
          }
        })
        .catch(error => {
          this.$message({
            type: 'info',
            message: error
          })
        })
    },
    changeImg (i) {
      const imgNHeight = document.getElementsByClassName('sc-report-detail-img-wrapper')[0].getElementsByTagName('img')[i].naturalHeight
      this.imgNaturalWidth = imgNHeight + 'px'
    },
    setActiveItem (i) {
      if (this.$refs.carousel) {
        this.$refs.carousel.setActiveItem(i)
      }
    },
    getDetail () {
      api.GET(config.report.detail, {
        id: this.id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          const posArr = this.response.position.split(',').map((item) => {
            return Number(item)
          })
          this.mapData.center.lng = posArr[0]
          this.mapData.center.lat = posArr[1]
          this.response.isAnonymous = !!this.response.isAnonymous
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  created () {
    this.getDetail()
  }
}
</script>

<style>
  .detailBtnWrap {
    margin-right: 2rem;
  }
  .sc-report-detail {
    padding-top: 1rem;
  }

  .el-carousel__item {
    text-align: center;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .sc-report-detail-content {
    margin-right: 2rem;
  }
  .sc-report-detail-content-basement, .sc-report-detail-content-deal {
    list-style: none;
    font-size: 1rem;
    color: #666;
    border: 1px solid lightgray;
    background-color: white;
    padding-right: 2rem;
  }

  .sc-report-detail-content-basement li, .sc-report-detail-content-deal li {
    border-bottom: 1px solid lightgray;
    padding: .5rem 0;
  }

  .sc-report-detail-content-basement li:last-child, .sc-report-detail-content-deal li:last-child {
    border: none;
  }

  .imgListWrapper {
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 2rem;

    border: 1px solid lightgray;
    background-color: white;
  }

  .imgListWrapper h3 {
    margin-left: 3rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid lightgray;
  }

  .sc-report-detail-img-wrapper {
    list-style: none;
    display: flex;
  }

  .sc-report-detail-img-wrapper img {
    width: 200px;
    height: 200px;
  }

  .imgWrapper {
    display: flex;
    justify-content: center;
  }

  .imgWrapper img {
    width: 100%;
    height: 100%;
  }
  .mapDialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .mapMask {
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.2);
  }
  .mapDialogWrapper {
    position: absolute;
    left: 25%;
    top: 25%;
    width: 50%;
    height: 60%;
    padding: 1rem;
    z-index: 20;

    background-color: white;
  }
  .mapDialogHeader {
    font-size: 1.5rem;
    margin-bottom: 1%;
    padding-bottom: 1%;
  }
  .mapDialogFooter {
    margin-top: 1%;
  }
  #mapWrapper {
    width: 95%;
    height: 80%;
    margin: 0 auto;
  }
</style>
