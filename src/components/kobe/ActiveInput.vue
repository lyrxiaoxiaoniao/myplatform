<template>
  <el-form-item :label="data.title">
    <el-input
      v-model="data.value"
      @change="onChange"
      :placeholder="data.description"
      ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-active-input',
  props: {
    data: {
      type: Object,
      default: {
        title: '',
        value: '',
        id: ''
      }
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onChange () {
      const data = {
        ...this.data,
        index: this.index,
        value: this.data.value
      }
      this.$emit('input', data)
    }
  },
  mounted () {
  }
}
</script>
