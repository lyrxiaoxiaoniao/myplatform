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
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="商品类型:">
                    <p v-text="ruleForm.title"></p>
                </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="ap-content-right">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="商品信息" name="first" class="ap-tabpane">
                    <goods-message></goods-message>
                    <div style="text-align:center;">
                      <el-button @click="activeName = 'second'" type="primary">下一步</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="规格设置" name="second" class="ap-tabpane">
                    <standard-setting></standard-setting>
                    <div style="text-align:center;">
                      <el-button @click="activeName = 'first'" type="primary">上一步</el-button>
                      <el-button @click="activeName = 'third'" type="primary">下一步</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="商品详情" name="third" class="ap-tabpane">
                    <goods-detail></goods-detail>
                    <div style="text-align:center;">
                      <el-button @click="activeName = 'second'" type="primary">上一步</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import goodsMessage from './goodsMessage'
import standardSetting from './standardSetting'
import goodsDetail from './goodsDetail'
export default {
  data () {
    return {
      ruleForm: {},
      activeName: 'second'
    }
  },
  components: {
    goodsMessage,
    standardSetting,
    goodsDetail
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    goBack () {
      this.$router.push({
        path: '/admin/goods/product'
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
      .ap-tabpane {
        padding: 1rem 2rem;
      }
    }
  }
}
</style>

