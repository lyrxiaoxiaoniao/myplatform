<template>
  <el-form-item :label="data.title">
    <el-radio></el-radio>
  </el-form-item>
</template>

<script>
export default {
  name: '',
  data () {
    return {
    }
  },
  props: {
    data: {
      type: Object,
      default: {
      }
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
