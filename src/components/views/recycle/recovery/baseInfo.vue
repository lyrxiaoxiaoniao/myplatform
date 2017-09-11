<template>
    <div class="bf-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
              <info-tab :id="id"></info-tab>
            </el-tab-pane>
            <el-tab-pane label="车辆信息" name="second">
              <car-tab :id="id"></car-tab>
            </el-tab-pane>
            <el-tab-pane label="人员信息" name="third">
              <person-tab :id="id"></person-tab>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import infoTab from './base/info'
import carTab from './base/car'
import personTab from './base/person'
export default {
  data () {
    return {
      id: this.$route.query.id,
      activeName: 'first'
    }
  },
  components: {
    infoTab,
    carTab,
    personTab
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