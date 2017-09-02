<template>
    <div class="bf-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">基本信息</el-tab-pane>
            <el-tab-pane label="车辆信息" name="second">车辆信息</el-tab-pane>
            <el-tab-pane label="人员信息" name="third">人员信息</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'second'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>
.bf-container {
    padding: 1rem 2rem;
}  
</style>