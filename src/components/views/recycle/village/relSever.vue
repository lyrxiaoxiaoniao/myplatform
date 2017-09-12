<template>
<div>
    <div class="lh-container">
    <div class="lh-top">
      <div class="lh-header">
        <div>{{info.name}}</div>
        <div>
          <!-- <el-button>返回</el-button> -->
          <el-button @click="back" type="primary">返回</el-button>
        </div>
      </div>
      <div class="lh-form">
        <el-form :model="info" label-width="120px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="10"> 
              <el-form-item label="联系人" prop="duty_name">
                <el-input disabled v-model="info.duty_name"></el-input>
              </el-form-item>
            </el-col>     
            <el-col :span="10" :offset="4">      
              <el-form-item disabled label="联系人电话" prop="mobile">
                <el-input disabled v-model="info.mobile"></el-input>
              </el-form-item> 
             </el-col>
             <el-col :span="10"> 
              <el-form-item label="详细地址" prop="detail_address">
                <el-input disabled v-model="info.detail_address"></el-input>
              </el-form-item>
            </el-col>     
            <el-col :span="10" :offset="4">      
              <el-form-item label="已关联物业数量" prop="count">
                <el-input disabled v-model="info.count"></el-input>
              </el-form-item> 
             </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="lh-bottom">
      <el-tabs class="margin" v-model="activeName"  @tab-click="handleClick" style="margin:0 2em">
        <el-tab-pane label="已关联物业" name="first">
          <rel-tab v-if='firstId'></rel-tab>
        </el-tab-pane>
        <el-tab-pane label="未关联物业" name="second">
          <norel-tab v-if='secondId'></norel-tab>
        </el-tab-pane>
        <el-tab-pane label="历史关联" name="third">
          <history v-if='thirdId'></history>
        </el-tab-pane>    
      </el-tabs>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
import config from 'src/config'
import api from 'src/api'
import relTab from './relTable/reled'
import norelTab from './relTable/noRel'
import history from './relTable/history'
export default {
  data () {
    return {
      data: [],
      response: {
        data: null
      },
      firstId: true,
      secondId: false,
      thirdId: false,
      info: {
        name: '',
        duty_name: '',
        mobile: '',
        detail_address: '',
        count: ''
      },
      activeName: 'first',
      form: {
        keyword: '',
        value: ''
      }
    }
  },
  components: {
    relTab,
    norelTab,
    history
  },
  methods: {
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
      api.GET(config.village.indexOne, {id: this.$route.query.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.info = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    back: function () {
      this.$router.push('/admin/recycle/village/index')
    }
  },
  mounted () {
    this.getForm()
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
</style>