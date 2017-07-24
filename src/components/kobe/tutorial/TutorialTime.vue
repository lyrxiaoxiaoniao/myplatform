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
    onChange () {
      let arr = []
      this.time.forEach(item => {
        let date = new Date(item).getTime()
        arr.push(date)
      })
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
  }
}
</script>
