<template>
  <el-form-item label="data.key">
    <el-input v-model="data.value"></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-active-input',
  props: {
    data: {
      type: Object,
      default: {
        key: '',
        value: ''
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
