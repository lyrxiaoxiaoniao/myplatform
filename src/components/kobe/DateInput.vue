<template>
  <div class="kobe-date-input">
    <el-form-item :label="data.title">
      <el-date-picker
        v-model="time"
        :type="type"
        placeholder="选择时间日期"
        @change="onChange"
        >
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  // used for activity active form
  name: 'kobe-date-input',
  props: {
    data: {
      type: Object
    },
    type: {
      type: String,
      default: 'datetime'
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
      const date = new Date(this.time).getTime()
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: date
          }]
        }
      }
      this.$emit('date', data)
    }
  }
}
</script>

<style>
</style>
