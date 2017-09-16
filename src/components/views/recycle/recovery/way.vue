<template>
<div class="sb-container">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="现有线路" name="first">
      <now-table v-if="tabFirst"></now-table>
    </el-tab-pane>
    <el-tab-pane label="历史线路" name="second">
      <history-table v-if="tabSecond"></history-table>
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
      activeName: 'first',
      tabFirst: true,
      tabSecond: false
    }
  },
  components: {
    nowTable,
    historyTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.tabFirst = true
        this.tabSecond = false
      } else if (tab.name === 'second') {
        this.tabFirst = false
        this.tabSecond = true
      }
    }
  }
}
</script>
<style scoped>
.sb-container {
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  margin: 1rem;
}
</style>