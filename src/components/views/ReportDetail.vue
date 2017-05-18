<template>
  <div v-if="response" class="sc-report-detail">
    <div class="sc-report-detail-content">
      <el-row class="detailBtnWrap" type="flex" justify="end">
        <el-button @click="detailDeal" type="primary">案件处理</el-button>
        <el-button @click="detailBack">返回上一页</el-button>
      </el-row>
      <el-row type="flex">
        <el-col :span="10" :offset="1" style="padding: 1rem">
          <ul class="sc-report-detail-content-basement">
            <li><h3>基本信息</h3></li>
            <li>
              <el-row :span="10">
                <el-col :span="5">举报人： </el-col>
                <el-col :span="19">{{ response.reportName }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">联系方式： </el-col>
                <el-col :span="19">{{ response.mobile }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">分类名称： </el-col>
                <el-col :span="19">{{ response.catlgName }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">案件地址：</el-col>
                <el-col :span="15">{{ response.address }}</el-col>
                <el-col :span="4">
                  <el-button icon="picture" @click="openMap"></el-button>
                </el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">案件描述：</el-col>
                <el-col :span="19">{{ response.description }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">隐患单位：</el-col>
                <el-col :span="19">{{ response.hiddenUnit }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">提交时间：</el-col>
                <el-col :span="19">{{ response.createdAt }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">提交IP：</el-col>
                <el-col :span="19">{{ response.createOn }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">是否匿名：</el-col>
                <el-col :span="19">
                  <el-checkbox v-model="isAnonymous" :disabled="true">
                  </el-checkbox>
                </el-col>
              </el-row>
            </li>
          </ul>
          <ul class="sc-report-detail-content-deal">
            <li><h3>受理信息</h3></li>
            <li>
              <el-row :span="10">
                <el-col :span="5">受理编号： </el-col>
                <el-col :span="19">{{ response.acceptNo }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">上报时间： </el-col>
                <el-col :span="19">{{ response.createdAt }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">受理时间： </el-col>
                <el-col :span="19">{{ response.acceptDate }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">受理状态：</el-col>
                <el-col :span="15">{{ status }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">处理部门：</el-col>
                <el-col :span="19">{{ }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">受理意见：</el-col>
                <el-col :span="19">{{ response.statusRemark }}</el-col>
              </el-row>
            </li>
            <li>
              <el-row :span="10">
                <el-col :span="5">备注信息：</el-col>
                <el-col :span="19">{{ }}</el-col>
              </el-row>
            </li>
          </ul>
        </el-col>
        <el-col :span="11" :offset="1" class="imgListWrapper">
          <h3>图片列表</h3>
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
          <el-upload class="upload-demo" :action="uploadUrl"
                     :on-remove="uploadRemove" :file-list="fileList"
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
    <el-dialog title="案件地址" v-model="dialogMapVisible">
      <div class="mapWrapper">
        <el-amap vid="amap" :zoom="mapData.zoom" :center="mapData.center">
          <el-amap-marker 
            v-for="marker in mapData.markers" 
            :position="marker.position" 
            :visible="marker.visible"
            :draggable="marker.draggable"></el-amap-marker>
        </el-amap>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMapVisible = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="现场照片" v-model="dialogImgVisible">
      <el-carousel indicator-position="outside" :autoplay="false" :height="imgNaturalWidth" @change="changeImg"
                   ref="carousel">
        <el-carousel-item v-for="(item, index) in response.images" :key="item" :name="item.fileName">
          <img :src="item.fileUrl">
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogImgVisible = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import config from 'src/config'

let map = {
  0: '新案件',
  1: '待立案',
  2: '立案通过',
  3: '专业部门处理',
  4: '结案，作废',
  5: '结案'
}

export default {
  name: 'sc-report-detail',
  data () {
    return {
      response: {},
      error: null,
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
        center: [],
        markers: [
          {
            position: [],
            visible: true,
            draggable: false
          }
        ]
      },
      formLabelWidth: '120px',
      uploadUrl: config.serverURI + config.uploadCaseImgAPI,
      updateURL: config.serverURI + config.updateCaseAPI,
      fileList: [],
      imgNaturalWidth: ''
    }
  },
  computed: {
    reportDetailURL () {
      return config.serverURI + config.caseDetailAPI
    },
    caseID () {
      return this.$route.params.id
    },
    isAnonymous () {
      return this.response.isAnonymous
    },
    status () {
      return map[this.response.status]
    },
    isSMSNotify () {
      if (this.response.isNotify.indexOf('sms') !== -1) {
        this.detailDealForm.mail = true
        return true
      }

      this.detailDealForm.mail = false
      return false
    },
    isWXNotify () {
      if (this.response.isNotify.indexOf('wx') !== -1) {
        this.detailDealForm.wx = true
        return true
      }

      this.detailDealForm.wx = false
      return false
    }
  },
  methods: {
    getCaseDetail (id) {
      axios.get(this.reportdetail, {
        id: this.caseID
      })
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = response.data.data
          }
        })
        .catch(error => {
          this.$message({
            type: 'info',
            message: error
          })
        })
    },
    detailBack () {
      window.history.back()
    },
    detailDeal () {
      this.dialogFormVisible = true
    },
    openMap () {
      this.dialogMapVisible = true
    },
    openImg (url, i) {
      this.dialogImgVisible = true
      this.showImgUrl = url
      const imgNHeight = document.getElementsByClassName('sc-report-detail-img-wrapper')[0].getElementsByTagName('img')[i].naturalHeight
      this.imgNaturalWidth = imgNHeight + 'px'
      this.setActiveItem(i)
    },
    uploadRemove (file, fileList) {
      const index = this.detailDealForm.imageName.indexOf(file.response.errmsg)
      if (index !== -1) {
        this.detailDealForm.imageName.split(index, 1)
      }
    },
    uploadSuccess (response, file, fileList) {
      this.detailDealForm.imageName.push(response.errmsg)
    },
    postDetail () {
      this.dialogFormVisible = false
      let form = {
        status: this.detailDealForm.status,
        summary: this.detailDealForm.summary,
        imageName: this.detailDealForm.imageName,
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
      axios.post(this.updateURL, form)
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
            setTimeout(this.$router.push('reports'), 2000)
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
      this.$refs.carousel.setActiveItem(i)
    }
  },
  created () {
    this.response = this.$store.state.selectedCase
    this.mapData.center = this.response.position.split(',').map((item) => {
      return Number(item)
    })
    this.mapData.markers[0].position = this.mapData.center
    this.response.isAnonymous = !!this.response.isAnonymous
  }
}
</script>

<style>

  .sc-report-detail {
    border-top: 1px solid lightgray;
    padding-top: 4rem;
    margin-top: 2rem;
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

  .mapWrapper {
    height: 500px;
  }

  .sc-report-detail-content-basement, .sc-report-detail-content-deal {
    list-style: none;
    font-size: 1.5rem;
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

</style>
