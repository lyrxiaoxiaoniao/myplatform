<template>
  <el-form-item :label="data.title">
    <el-radio-group v-model="selected" @change="onChange">
      <el-radio v-for="item in data.options"></el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-active-radio',
  data () {
    return {
      selected: ''
    }
  },
  props: {
    data: {
      type: Object,
      default: {
      }
    },
    index: {
      type: Number
    }
  },
  methods: {
    onChange () {
      this.$emit('radio')
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
