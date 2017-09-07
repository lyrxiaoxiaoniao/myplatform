<template>
  <div class="top">
    <div class="table-head">
      <h4>罗湖文锦地磅点</h4>
      <el-button type="primary">返回列表</el-button>
    </div>
    <div class="table-body">
      <table>
        <tr>
          <td>负责人：杨洋</td>
          <td>负责人电话：15655653523</td>
        </tr>
        <tr>
          <td>详细地址：深圳市罗湖区文锦街道XXX物流公司</td>
          <td>垃圾类型：大件垃圾</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .loadometerStatistics-container {
    padding: 1rem 2rem;
    .top {
      border: 1px solid lightgray;
      background-color: #fff;
      border-radius: 5px;
      width: 100%;
      padding-bottom: 1rem;
    }
    .table-head {
      padding: 0 2rem;
      width: 100%;
      display: flex;
      align-items: center;
      height: 60px;
    }
    .table-body {
      margin: 1rem 2rem;
    }
    .top {
      .table-head {
        border-bottom: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
      }
      table {
        width: 100%;
        font-size: 14px;
        tr {
          height: 40px;
        }
        td {
          width: 50%;
        }
      }
    }
  }
</style>