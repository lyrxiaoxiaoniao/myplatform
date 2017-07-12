<template>
  <el-card class="box-card kobe-active-attendence">
    <div slot="header">
      <span class="card-title">考勤时间设置</span>
      <el-button type="primary" @click="addTimeRange" class="card-add-button">添加时间段</el-button>
    </div>
    <div v-for="item, index in data.data">
      <el-form-item
        class="card-toggle-item"
        :label="item.title"
        v-if="item.type === 'switch'"
        >
        <el-switch
          v-model="toggleSwitch"
          on-text="开"
          off-text="关"
          on-color="#13ce66"
          off-color="#ff4949"
          @change="onSwitchChange(index)"
          >
        </el-switch>
      </el-form-item>
      <div
        v-if="toggleSwitch && item.type === 'infogroup'"
        class="attendence-timerange-list"
        v-for="obj, sort in timeRange"
        >
        <el-form-item
          label="场次名称"
          >
          <el-input
            v-model="obj.attend_name"
            placeholder="活动场次名称"
            @change="onInputChange(index)"
            >
          </el-input>
        </el-form-item>
        <el-form-item
          label="考勤时间"
          >
          <el-row type="flex">
            <el-date-picker
              @change="onTimeChange(index)"
              type="datetime"
              v-model="obj.start_time"
              placeholder="选择开始时间"
              >
            </el-date-picker>
            <el-date-picker
              @change="onTimeChange(index)"
              type="datetime"
              v-model="obj.end_time"
              placeholder="选择结束时间"
              >
            </el-date-picker>
          </el-row>
        </el-form-item>
        <el-form-item
          label="考勤有效时间"
          >
          <el-row type="flex" justify="space-between">
            <el-select
              placeholder="请选择"
              v-model="obj.validate_time">
              <el-option
                v-for="value in options"
                :label="value.label"
                :value="value.value"
                >
              </el-option>
            </el-select>
            <el-button @click="onDleteTimeRange(sort)">删除</el-button>
          </el-row>
        </el-form-item>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  // active attendence toggle card
  // used for kobe active attendence
  name: 'kobe-active-attendence',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      toggleSwitch: true,
      timeRange: [{
        attend_name: '',
        start_time: '',
        end_time: '',
        validate_time: ''
      }],
      options: [{
        label: '30分钟',
        value: '30分钟'
      }, {
        label: '45分钟',
        value: '45分钟'
      }, {
        label: '一小时',
        value: '一小时'
      }, {
        label: '两小时',
        value: '两小时'
      }],
      form: []
    }
  },
  methods: {
    onSwitchChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        index: index,
        type_key: obj.type_key,
        options: [{
          title: this.toggleSwitch ? 1 : 0
        }]
      }
      this.form[index] = item
      this.$emit('attendence', this.form)
    },
    onInputChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        index: index,
        type_key: obj.type_key,
        options: [{
          title: JSON.stringify(this.timeRange)
        }]
      }
      this.form[index] = item
      this.$emit('attendence', this.form)
    },
    onTimeChange (index) {
      this.timeRange.forEach(item => {
        item.start_time = this.formateTime(item.start_time)
        item.end_time = this.formateTime(item.end_time)
      })

      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        index: index,
        type_key: obj.type_key,
        options: [{
          title: JSON.stringify(this.timeRange)
        }]
      }
      this.form[index] = item
      this.$emit('attendence', this.form)
    },
    addTimeRange () {
      let item = {
        attend_name: '',
        start_time: '',
        end_time: '',
        validate_time: ''
      }
      this.timeRange.push(item)
    },
    onDleteTimeRange(index) {
      this.timeRange.splice(index, 1)
    },
    formateTime (time) {
      if (!time) return ''
      const date = new Date(time).getTime()
      return date
    }
  },
  mounted () {
    if (this.data.data[1].values.length) {
      const arr = JSON.parse(this.data.data[1].values[0].value)
      this.timeRange = [
        ...arr
      ]
    }
  }
}
</script>

<style>
.card-add-button {
  float: right;
}
.card-toggle-item {
  border-bottom: 1px solid lightgray;
}
.attendence-timerange-list {
  margin-top: 1rem;
  border-bottom: 1px solid lightgray;
}
</style>
