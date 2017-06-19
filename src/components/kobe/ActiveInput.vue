<template>
  <el-form-item :label="data.key">
    <el-input v-model="data.value" @change="onChange"></el-input>
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
    onChange () {
      this.$emit('input', this.data.value)
    }
  },
  mounted () {
  }
}
</script>
