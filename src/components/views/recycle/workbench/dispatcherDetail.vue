<template>
<div>
    <div class="lh-container">
    <div class="lh-top">
      <div class="lh-header">
        <div>基本信息</div>
        <div>
          <!-- <el-button>返回</el-button> -->
          <el-button @click="back" type="primary">返回</el-button>
          <el-button type="primary">处理</el-button>
        </div>
      </div>
      <div class="lh-form">
        <el-form :model="info" label-width="100px" label-position="right">
          <el-row>
            <el-col :span="11"> 
              <el-form-item label="提交单位" class="form-item-margin">
                <p class="border">{{info.name}}</p>
              </el-form-item>
            </el-col>     
            <el-col :span="11" :offset="2">      
              <el-form-item disabled label="工单编号" class="form-item-margin">
                <p class="border">{{info.name}}</p>
              </el-form-item> 
            </el-col>
            <el-col :span="11"> 
              <el-form-item label="联系人" class="form-item-margin">
                <p class="border">{{info.name}}</p>
              </el-form-item>
            </el-col>     
            <el-col :span="11" :offset="2">      
              <el-form-item disabled label="联系电话" class="form-item-margin">
                <p class="border">{{info.name}}</p>
              </el-form-item> 
            </el-col>
            <el-col :span="11"> 
              <el-form-item label="固定电话" class="form-item-margin">
                <p class="border">{{info.name}}</p>
              </el-form-item>
            </el-col>     
            <el-col :span="11" :offset="2">      
              <el-form-item label="所属街道" prop="region_id" class="form-item-margin">
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
          <el-col :span="11"> 
            <el-form-item label="回收地址" class="form-item-margin">
              <p class="border">{{info.name}}</p>
            </el-form-item>
          </el-col>     
          <el-col :span="11" :offset="2">      
            <el-form-item label="回收日期" class="form-item-margin">
              <p class="border">{{info.name}}</p>
            </el-form-item> 
          </el-col>
          <el-row>
            <el-col :span="11"> 
              <el-form-item label="回收点图片">       
                <img style="width:58px;height:58px;display: inline-block" :src="info.mobile" @click="bigImg(info.mobile)" alt="">
                <img style="width:58px;height:58px;display: inline-block" :src="info.mobile" @click="bigImg(info.mobile)" alt="">
              </el-form-item>
            </el-col> 
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="lh-bottom">
      <div class="lh-header">
        <div>处理步骤</div>
      </div>
      <div> 
        <ul style="position: relative">
          <li class="clearfix" v-for="i in doList" style="list-style: none">
            <el-row>
              <el-col :span="2" class="float-l">
                <img style="width:40px;height:40px;display: inline-block;border:1px solid;margin-top: 12%;position: relative;z-index: 4;background-color: blue" :src="i.licesen" @click="bigImg(info.mobile)" alt="">
              </el-col>   
              <el-col :span="22" class="float-r text-line">
                <el-row>
                  <el-col :span="10">{{i.name}}</el-col>
                  <el-col :span="10">{{i.time}}</el-col>
                </el-row> 
                <el-row>
                  <el-col :span="10" style="border-bottom:1px solid lightgray;padding-bottom: 15px">{{i.action}}</el-col>
                  <el-col :span="10" style="border-bottom:1px solid lightgray;padding-bottom: 15px">{{i.active}}</el-col>
                </el-row> 
              </el-col>
            </el-row>
          </li>
          <div style="height:90%;position: absolute;z-index: 2;border-left: 1px dotted lightgray;top:5%;left: 60px"></div>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      doList: [{
        name: '李一',
        time: '2017-9-20',
        action: '发起工单',
        active: '已完成',
        licesen: ''
      }, {
        name: '李一',
        time: '',
        action: '发起工单',
        active: '已完成',
        licesen: ''
      }, {
        name: '李一',
        time: '2017-9-20',
        action: '发起工单',
        active: '已完成',
        licesen: ''
      }, {
        name: '李一',
        time: '',
        action: '发起工单',
        active: '已完成',
        licesen: ''
      }, {
        name: '李一',
        time: '2017-9-20',
        action: '发起工单',
        active: '已完成',
        licesen: ''
      }, {
        name: '李一',
        time: '',
        action: '发起工单',
        active: '已完成',
        licesen: ''
      }],
      tenementId: this.$route.query.id,
      data: [],
      response: {
        data: null
      },
      info: {
        name: '文锦小区',
        duty_name: '贾克斯',
        mobile: '14718436328',
        address: '深圳',
        count: '1',
        id: this.$route.query.id
      },
      firstId: true,
      secondId: false,
      thirdId: false,
      activeName: 'first',
      form: {
        keyword: '',
        value: ''
      }
    }
  },
  methods: {
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    updateCount (data) {
      this.getForm()
    },
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.firstId = true
        this.secondId = false
        this.thirdId = false
      }
      if (tab.name === 'second') {
        this.firstId = false
        this.secondId = true
        this.thirdId = false
      }
      if (tab.name === 'third') {
        this.firstId = false
        this.secondId = false
        this.thirdId = true
      }
    },
    getForm () {
      api.GET(config.server.indexOne, {id: this.$route.query.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.info = response.data.data
          this.info.count = response.data.data.rubCommunityTenementVOS[0].count
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    back: function () {
      this.$router.push('/admin/recycle/server/index')
    }
  },
  mounted () {
    // this.getForm()
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
      padding-bottom: 1rem;
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
    .lh-bottom {
      margin-top: 1rem;
      border-radius: 5px;
      border: 1px solid lightgray;
      width: 100%;
      background-color: #fff;
      padding-bottom: 1rem;
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
    }
}
.border {
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  padding-left: 10px;
  color: #1f2d3d;
  word-wrap: break-word; 
  word-break: normal;
}
.float-r {
  float:right
}
.float-l {
  float:left
}
.clearfix:after {
  content: '';
  display:block;
  clear: both;
  height: 0;
  visibility:hidden
}
.text-line {
  line-height: 32px;
}
.form-item-margin {
  margin-bottom: 0;
}
</style>