<template>
<div class="sb-container">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="现有线路" name="first">
      <now-table></now-table>
    </el-tab-pane>
    <el-tab-pane label="历史线路" name="second">
      <history-table></history-table>
    </el-tab-pane>
  </el-tabs>
</div>
</template>
<script>
import nowTable from './wayManage/wayTable/nowTable'
import historyTable from './wayManage/wayTable/historyTable'
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  components: {
    nowTable,
    historyTable
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>
.sb-container {
  background-color: #fff;
  margin: 1rem;
}
</style>