<template>
  <div class="calendar">
    <table>
      <tbody>
        <tr>
          <th>日(闭馆)</th>
          <th>一</th>
          <th>二</th>
          <th>三</th>
          <th>四</th>
          <th>五</th>
          <th>六(闭馆)</th>
        </tr>
        <tr v-for="item in group">
          <!-- {{group}} -->
          <td v-for="innerItem in item" @mouseenter.stop="showSetBtn"  @mouseleave.stop="hideSetBtn">
            <div class="cell"
                 v-if="innerItem !== 0">{{innerItem}}</div>
            <div class="cell"
                 v-else></div>
            <div class="setBtn" v-if="active">
              <el-button size="small"
                         v-if="configured" class="btn">编辑</el-button>
              <el-button size="small"
                         v-if="!configured" class="btn">设置</el-button>
              <el-button size="small"
                         v-if="!configured" class="btn" type="danger">闭馆</el-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['year', 'month', 'day'],
  data() {
    return {
      configured: false,
      active: false
    }
  },
  computed: {
    groupNum() {
      return Math.ceil((this.days - (7 - this.day)) / 7) + 1
    },
    isLeapYear() {
      return (this.year % 4 === 0 && this.year % 100 !== 0) || (this.year % 400 === 0)
    },
    days() {
      let days = 0
      switch (this.month + 1) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          days = 31
          break
        case 4:
        case 6:
        case 9:
        case 11:
          days = 30
          break
        case 2:
          if (this.isLeapYear) {
            days = 29
          } else {
            days = 28
          }
      }
      return days
    },
    group() {
      /* eslint-disable */
      let arr = Array(this.days).fill(0).map((i, j) => i = j + 1)
      let headArr = Array(this.day).fill(0)
      let endArr = Array(this.groupNum * 7 - 30 - headArr.length).fill(0)
      arr.unshift(...headArr)
      arr.push(...endArr)
      let newArr = []
      for (let i = 0; i < this.groupNum; i++) {
        newArr.push(arr.slice(i * 7, (i + 1) * 7))
      }
      return newArr
      /* eslint-enable */
    }
  },
  methods: {
    showSetBtn() {
      console.log(1)
      this.active = true
    },
    hideSetBtn() {
      console.log(2)
      this.active = false
    }
  }

}
</script>

<style scoped lang="scss">
.calendar {
  table {
    margin: 20px auto;
    tr {
      >th {
        padding: 10px 0;

        text-align: center;
        color: #8391a5;
        border: 1px solid lightgray;
      }
      >td {
        padding: 35px;
        border: 1px solid lightgray;
        position: relative;
        &:first-child {
          color: #ddd;
        }
        &:last-child {
          color: #ddd;
        }
        .setBtn {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          background-color: #e4e8f1;
          .btn {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
