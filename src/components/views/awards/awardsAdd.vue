<template>
  <div class="ap-container">
    <div>
      <el-button @click="goBack" type="primary">返回列表</el-button>  
      <el-button type="primary">商品预览</el-button>
      <el-button type="primary">提交发布</el-button> 
    </div>
    <div class="ap-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="ap-content-left">
            <h4>头图及属性</h4>
            <div class="left-img">
              <img :src="1111" alt="">
            </div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" style="padding:0 10px;">
                <el-form-item label="商品类型">
                    <el-select v-model="ruleForm.region" placeholder="商品类型" style="width:100%;">
                    <el-option label="实物商品（物流发货）" value="1"></el-option>
                    <el-option label="虚拟商品（无须物流）" value="2"></el-option>
                    <el-option label="电子卡券（无须物流）" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品摘要">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="ap-content-right">
            
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        region: ''
      },
      activeName: 'second'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    goBack () {
      this.$router.push({
        path: '/admin/awards/product'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ap-container {
  width: 100%;
  padding: 1rem;
  .ap-content {
    margin-top: 1rem;
    border-top: 1px solid lightgray;
    padding-top: 1rem;
    .ap-content-left {
      background-color: #fff;
      border: 1px solid lightgray;
      height: 500px;
      h4 {
        padding: 10px;
        border-bottom: 1px solid lightgray;
      }
      .left-img {
        text-align: center;
        width: 100%;
        height: 250px;
        padding: 10px 30px;
      }
    }
    .ap-content-right {
      border: 1px solid lightgray;
    }
  }
}
</style>