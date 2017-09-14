<template>
    <div class="lh-container">
		<div class="lh-top">
            <div class="lh-header">
                <div>短信发送配置</div>
                <div>
                    <el-button type="primary">保存</el-button>
                </div>
            </div>
            <div class="lh-form">
               <el-form :model="selected" label-width="85px">
                <el-row>
                    <el-col :span="24">
                    <el-form-item label="短信服务商">
                        <el-input placeholder="请输入站点名称"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="每月限量">
                        <el-input placeholder="请输入站点别名"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="短信后缀">
                        <el-input placeholder="请输入"></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>  
              </el-form>
            </div>
        </div>
    </div>    
</template>
<script>
// import config from 'src/config'
// import api from 'src/api'
export default {
  data () {
    return {
      selected: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    // padding: 1rem 2rem;
    margin-top: 1rem;
    .lh-top {
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 100%;
        background-color: #fff;
        padding-bottom: 1rem;
        .lh-form {
            padding: 1rem 1rem 0;
        }
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