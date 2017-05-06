<template>
  <div v-if="response" class="sc-report-detail">
    <template>
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="item in 6">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </template>
    <div class="sc-report-detail-content">
      <h3>基本信息</h3>
      <el-row type="flex">
        <el-col :span="15" :offset="2">
          <el-form labelWidth="120px" label-position="left">
            <el-form-item label="用户昵称">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input :disabled="true" :model="response.mobile"></el-input>
            </el-form-item>
            <el-form-item label="分类名称">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="案件地址" :model="response.address">
              <el-input :disabled="true">
                <el-button slot="append" icon="picture" @click="openMap"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="案件描述">
              <el-input :disabled="true" :model="response.description"></el-input>
            </el-form-item>
            <el-form-item label="提交时间">
              <el-input :disabled="true" :model="response.createdAt"></el-input>
            </el-form-item>
            <el-form-item label="提交ip">
              <el-input :disabled="true" :model="response.createOn"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="sc-report-detail-deal">
      <h3>受理信息</h3>
      <el-row type="flex">
        <el-col :span="15" :offset="2">
          <el-form labelWidth="120px" labelPosition="left">
            <el-form-item label="受理编号">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="案件编号">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="上报时间">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="受理时间">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="处理时间">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="处理部门">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="受理意见">
              <el-input :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-row class="detailBtnWrap" type="flex" justify="center">
      <el-col :span="4">
        <el-button @click="detailDeal" type="primary">案件处理</el-button>
        <el-button @click="detailBack">返回上一页</el-button>
      </el-col>
    </el-row>
    <el-dialog title="案件处理" v-model="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="处理方式" :label-width="formLabelWidth">
          <el-select v-model="detailDealForm.method" placeholder="请选择处理方案">
            <el-option label="结案" value="0"></el-option>
            <el-option label="驳回" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-checkbox label="是否短信通知"></el-checkbox>
          <el-checkbox label="是否微信通知"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="案件地址" v-model="dialogMapVisible">
      <div class="mapWrapper">
        <el-amap vid="amap" :zoom="mapData.zoom" :center="mapData.center">
          <el-amap-marker v-for="marker in mapData.markers" :position="marker.position" :visible="marker.visible"
                          :draggable="marker.draggable"></el-amap-marker>
        </el-amap>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMapVisible = false" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import config from 'src/config'

  export default {
    name: 'sc-report-detail',
    data () {
      return {
        response: {},
        error: null,
        dialogFormVisible: false,
        dialogMapVisible: false,
        detailDealForm: {
          method: '',
          status: ''

        },
        mapData: {
          zoom: 14,
          center: [114.130888, 22.553357],
          markers: [
            {
              position: [114.130888, 22.553357],
              visible: true,
              draggable: false
            }
          ]
        },
        formLabelWidth: '120px'
      }
    },
    computed: {
      reportDetailURL () {
        return config.serverURI + config.caseDetailAPI
      },
      caseID () {
        return this.$route.params.id
      }
    },
    methods: {
      getCaseDetail (id) {
        axios.get(this.reportdetail, {
          id: this.caseID
        })
          .then(response => {
            console.log(`Case Detail response ${response}`)

            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.response = response.data.data
              console.log('case detail')
              console.log(this.response, 'aaa')
            }
          })
          .catch(error => {
            console.log(error)
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
      }
    },
    mounted () {
      console.log('Report Detail Mounted')
    }
  }
</script>

<style>
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .mapWrapper {
    height:500px;
  }
</style>
