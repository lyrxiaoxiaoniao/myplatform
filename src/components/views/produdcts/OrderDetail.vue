<template>
    <div class="OD-container">
        <div style="width:480px;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="line-height: 36px;font-size:18px;font-weight:600;">待发货</span>
                    <el-button style="float: right;" type="primary">发货</el-button>
                    <p><span>订单备注：</span></p>
                </div>
                <div>
                    <h4>买家信息：</h4>
                    <p><span>收货地址：</span>林先生，13688811903，广东 深圳市 南山区 前海路鼎太风华一期D4栋1103 <a href="javascript:;">修改地址</a></p>
                    <p><span>下单账号：</span>13688811903 <a href="javascript:;">联系买家</a></p>
                    <p><span>买家留言：无</span></p> 
                </div>
            </el-card>
        </div>
        <div class="OD-right">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="商品信息" name="first">
                    <el-table
                        border
                        stripe
                        :data="response.data">
                        <el-table-column prop="logo" label="商品名称">
                        <template scope="scope">
                            <img width="100%" :src="scope.row.logo" @click="bigImg(scope.row.logo)" alt="">
                        </template>
                        </el-table-column>
                        <el-table-column prop="title" label="型号" width="200"></el-table-column>
                        <el-table-column prop="created_at" label="发货状态" width="200"></el-table-column>
                        <el-table-column prop="number" label="退款状态" width="200"></el-table-column>
                        <el-table-column prop="status" label="价格" width="150"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="物流信息" name="second">物流信息</el-tab-pane>
            </el-tabs>  
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      response: {
        data: null
      },
      activeName: 'first'
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
.OD-container{
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
}
.sendHeader{
    background-color: #fff;
}
.OD-right{
    flex: 1;
    padding-left: 10px; 
}
.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}

.box-card {
    width: 480px;
}
</style>
