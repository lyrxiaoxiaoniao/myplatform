<template>
  <div class="sc-firm-detail-component" v-if="response">
    <el-row type="flex">
      <el-col :span="12" class="sc-firm-detail-content">
        <el-card class="sc-firm-card">
          <div slot="header">
            <span class="sc-firm-card-title">企业登记信息</span>
          </div>
          <div class="sc-firm-detail">
            <div>企业名称: <span>{{ response.company }}</span></div>
            <div>企业地址: <span>{{ response.address }}</span></div>
            <div>所属行业: <span>{{ response.industryName }}</span></div>
            <div>企业人数: <span>{{ response.pnum }}</span></div>
            <div>所属街道: <span>{{ response.regionName }}</span></div>
            <div>安全证书编号: <span>{{ response.safecert }}</span></div>
            <div>提交时间: <span>{{ response.createdAt | toDate }}</span> </div>
          </div>
        </el-card>

        <el-card class="sc-firm-card">
          <div slot="header">
            <span class="sc-firm-card-title">组织信息</span>
          </div>
          <div class="sc-firm-detail">
            <div>组织名称: <span>{{ response.orgaName }}</span></div>
            <div>统一信用代码: <span>{{ response.orgaCode }}</span></div>
            <div>详细地址: <span>{{ response.orgaAddress }}</span> </div>
          </div>
        </el-card>

        <el-card class="sc-firm-card" v-if="response.status !== 0">
          <div slot="header">
            <span class="sc-firm-card-title">受理信息</span>
          </div>
          <div class="sc-firm-detail">
            <div>受理时间: <span>{{ response.updatedAt | toDate }}</span></div>
            <div>受理状态: <span>{{ response.status | statusCodeToMsg }}</span></div>
            <div>受理意见: <span>{{ response.summary }}</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6" class="sc-firm-image-content" v-if="response.safecertUrl">
        <div class="sc-firm-detail-safecert">
          <img class="img-responsive" :src="response.safecertUrl">
          企业主要负责人安全培训合格证书
        </div>
        <div class="sc-firm-detail-organphoto" v-if="response.orgaPhotoUrl">
          <img class="img-responsive" :src="response.orgaPhotoUrl">
          组织机构代码证
        </div>
      </el-col>
    </el-row>
    <el-row class="sc-firm-detail-action" type="flex" justify="end">
      <el-button type="primary">审核</el-button>
      <el-button type="primary" @click="back">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-firm-detail',
  data () {
    return {
      response: null,
      error: null
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    getFirmDetail (id) {
      api.GET(config.firmDetailAPI, {
        id
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
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.getFirmDetail(this.id)
  }
}
</script>

<style scoped>
.sc-firm-card-title {
  font-size: 18px;
  line-height: 36px;
}
.sc-firm-card {
  margin-top: 1rem;
  margin-left: 1rem;
}
.sc-firm-image-content {
  margin-left: 1rem;
  margin-top: 1rem;
}
.sc-firm-detail-action {
  margin-top: 10px;
  margin-right: 30rem;
  padding-bottom: 10px;
}
</style>
