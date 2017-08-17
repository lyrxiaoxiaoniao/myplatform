<template>
  <div style="display: inline-block;width: 49.5%;">
    <el-form-item :label="data.title">
      <el-date-picker
        v-model="time"
        type="datetime"
        placeholder="选择时间范围"
        @change="onChange"
        >
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-date',
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
        this.time = JSON.parse(value.value)
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: this.time
            }]
          }
        }
        this.$emit('upload', data)
      }
    },
    onChange () {
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: new Date(this.time).getTime()
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

<style>
</style>
