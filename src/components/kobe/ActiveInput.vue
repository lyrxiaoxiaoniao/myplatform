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
        value: ''
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.data.value)
    }
  },
  mounted () {
  }
}
</script>
