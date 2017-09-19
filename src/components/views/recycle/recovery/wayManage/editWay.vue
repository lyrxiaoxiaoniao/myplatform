<template>
<div class="lh-container">
    <div class="lh-top">
        <div class="lh-header">
            <div>基本信息</div>
            <div>
                <el-button @click="goBack">返回</el-button>
                <!-- <el-button type="primary">添加</el-button> -->
            </div>
        </div>
        <div class="lh-form">
            <el-form :model="response" label-width="110px">
            <el-row :gutter="20">
                <el-col :span="12">
                <el-form-item label="线路名称:">
                    <p>{{response.name}}</p>
                    <!-- <el-input disabled v-model="response.name" placeholder="请输入"></el-input> -->
                </el-form-item>
                </el-col>  
                <el-col :span="12">
                <el-form-item label="所属清运公司:">
                    <p>{{response.companyName}}</p>
                    <!-- <el-input disabled v-model="response.companyName" placeholder="请输入"></el-input> -->
                </el-form-item>
                </el-col>  
                <el-col :span="24">
                <el-form-item label="线路描述:">
                    <p>{{response.description}}</p>
                    <!-- <el-input disabled v-model="response.description" type="textarea" placeholder="请输入"></el-input> -->
                </el-form-item>
                </el-col> 
            </el-row>
            </el-form>
        </div>
    </div>
    <div>
        <!-- 清除车辆 -->
        <clear-car-table v-if="response.recycleId" :recycleId="response.recycleId" :wayId="id"></clear-car-table>
    </div>
    <div>
        <!-- 服务企业 -->
        <service-table v-if="response.recycleId" :recycleId="response.recycleId" :wayId="id"></service-table>
    </div>
</div>
</template>
<script>
import clearCarTable from './wayTable/clearCarTable'
import serviceTable from './wayTable/serviceTable'
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      id: this.$route.query.id,
      response: {
        name: null,
        id: null,
        companyName: null,
        description: null,
        recycleId: null
      },
      multipleSelection: [],
      ids: []
    }
  },
  components: {
    clearCarTable,
    serviceTable
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getList (data = {}) {
      api.GET(config.recovery.wayShow, {...data, id: this.id})
      .then(response => {
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
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    padding: 1rem 2rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        // padding-bottom: 1rem;
        margin-bottom: 1rem;
        .lh-header {
            padding: 0 2rem;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px;
            border-bottom: 1px solid lightgray;
            div:nth-of-type(1){
                font-size: 16px;
            }
        }
        .lh-form {
            margin: 1rem 2rem;
        }
    }
}
</style>