<template>
  <div>
    <el-form-item :label="data.title">
      <el-date-picker
        v-model="time"
        type="datetimerange"
        placeholder="选择时间范围"
        @change="onChange"
        >
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-time',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      time: ''
    }
  },
  methods: {
    init () {
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        const time = JSON.parse(value.value)
        let timerange = []
        time.forEach(item => {
          timerange.push(new Date(item))
        })
        this.time = timerange
        let arr = this.transformTime(this.time)
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: arr
            }]
          }
        }
        this.$emit('time', data)
      }
    },
    transformTime (data) {
      let arr = []
      data.forEach(item => {
        let date = new Date(item).getTime()
        arr.push(date)
      })
      return arr
    },
    onChange () {
      let arr = this.transformTime(this.time)
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: arr
          }]
        }
      }
      this.$emit('time', data)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
