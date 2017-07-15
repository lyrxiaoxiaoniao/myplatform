<template>
  <kobe-table>
    <div slot="kobe-table-header" style="border-bottom:none" class="kobe-table-header"> 
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <el-card class="sc-cityservice-wrap">
        <div slot="header">
          <span style="font-size:18px">交易设置</span>
          <el-switch @change="statusChange" style="float:right" v-model="switched" on-text="开" off-text="关"></el-switch>
        </div>
        <el-form>
          <el-form-item label="待付款订单取消时间设置">
            <el-row>
              <el-col :offset="1">
                <span>拍下未付款订单</span>
                <el-input :disabled="disable" placeholder="0" style="width:10%"></el-input>
                <span>分钟内未付款，自动取消订单</span>
              </el-col>
            </el-row>  
          </el-form-item>
          <el-form-item label="发货后自动确认收货时间设置">
            <el-row>
              <el-col :offset="1">
                <span>发货后</span>
                <el-input :disabled="disable" placeholder="7" style="width:10%"></el-input>
                <span>天，自动确认收货</span>
              </el-col>
            </el-row>  
          </el-form-item>
          <el-form-item>
            <el-button :disabled="disable" style="margin-left:9rem;margin-top:5rem" type="primary" @click="submitForm2('dataForm')">保 存</el-button>
          </el-form-item>
        </el-form> 
      </el-card>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">
      
    </div>
  </kobe-table>
</template>

<script>
export default {
  name: 'sc-ordersetting-cityservice',
  data () {
    return {
      switched: true,
      disable: false
    }
  },
  methods: {
    statusChange () {
      if (this.switched) {
        this.disable = true
      } else {
        this.disable = false
      }
    },
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
