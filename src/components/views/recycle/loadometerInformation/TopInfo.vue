<template>
  <div class="top">
    <!--
    <div class="table-head">
      <h4>罗湖文锦地磅点</h4>
      <el-button type="primary" @click="toList">返回列表</el-button>
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
    -->
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-loadometer-topinfo',
    data () {
      return {
        response: {
          data: null
        }
      }
    },
    props: ['theId'],
    components: {
    },
    computed: {},
    methods: {
      toList () {
        this.$router.push({
          path: '/admin/recycle/loadometerInformation/index'
        })
      },
      getOne () {
        console.log(this.theId)
        api.GET(config.loadometer.indexOne, {id: this.theId})
          .then(response => {
            this.response.data = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      transformData (res) {
        if (res.created_at) {
          res.created_at = this.formatDate(res.created_at)
        }
        if (res.type === 0) {
          res.type = '大件垃圾'
        }
        if (res.type === 1) {
          res.type = '餐厨垃圾'
        }
        return res
      },
      // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      }
    },
    mounted () {
      this.getOne()
    }
  }
</script>

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