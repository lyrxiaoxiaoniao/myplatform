<template>
  <div class="sc-fence-warining-config">
    <el-card class="box-card">
      <div class="clearfix"
           slot="header">
        <span style="line-height: 36px;font-size: 18px;">报警配置</span>
      </div>
      <div class="itemWrapper">
        <div class="title">报警方式</div>
        <div class="boxWrapper">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="短信报警"></el-checkbox>
            <el-checkbox label="平台推送"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="itemWrapper">
        <div class="title">报警次数</div>
        <div class="boxWrapper">
          <el-radio-group v-model="radio2">
            <el-radio :label="3">进出范围各报警一次</el-radio>
            <el-radio :label="6">出范围每隔五分钟报警一次</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="itemWrapper">
        <div class="title">报警时间</div>
        <div class="boxWrapper">
          <el-radio-group v-model="radio2">
            <el-radio :label="3">出范围即可报警</el-radio>
            <el-radio :label="6">出范围超过100m</el-radio>
            <el-radio :label="9">出范围超过500m</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="itemWrapper">
        <div class="title">报警对象</div>
        <div class="boxWrapper">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="城管局系统管理员"></el-checkbox>
            <el-checkbox label="城管局管理员"></el-checkbox>
            <el-checkbox label="城管局业务管理员"></el-checkbox>
            <el-checkbox label="综合派单调度员"></el-checkbox>
            <el-checkbox label="区局监控人员"></el-checkbox>
            <el-checkbox label="回收公司工作人员"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="switchWrapper">
          <el-switch v-model="value2"
                     on-color="#13ce66"
                     off-color="#ff4949">
            是否同时发送给司机
          </el-switch>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
