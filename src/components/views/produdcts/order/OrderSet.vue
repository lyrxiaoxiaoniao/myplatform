<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">  
    </div>
    
    <div slot="kobe-table-content" class="kobe-table">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="上门自提" name="first">
          <take-self></take-self>
        </el-tab-pane>
        <el-tab-pane label="同城配送" name="second">
          <city-service></city-service>
        </el-tab-pane>
        <el-tab-pane label="快递发货" name="third">
          <express-goods></express-goods>
        </el-tab-pane>
        <el-tab-pane label="交易设置" name="fourth">
          <trade-set></trade-set>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer"> 
    </div>

  </kobe-table>
</template>

<script>
import takeSelf from './ordersetting/TakeSelf'
import cityService from './ordersetting/CityService'
import expressGoods from './ordersetting/ExpressGoods'
import tradeSet from './ordersetting/TradeSet'

export default {
  name: 'sc-ordersetting',
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  },
  components: {
    takeSelf,
    cityService,
    expressGoods,
    tradeSet
  }
}
</script>

<style scoped>
.sc-takeself-footer{
  margin-top: 28px;
}
</style>
