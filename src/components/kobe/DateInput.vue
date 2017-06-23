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
  name: 'kobe-date-input',
  props: {
    data: {
      type: Object
    },
    type: {
      type: String,
      default: 'datetime'
    }
  },
  data () {
    return {
      time: ''
    }
  },
  methods: {
    onChange () {
      this.$emit('date', this.time)
    }
  }
}
</script>

<style>
</style>
