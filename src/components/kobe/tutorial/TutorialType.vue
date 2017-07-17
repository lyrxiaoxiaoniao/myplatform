<template>
  <el-form-item :label="data.title">
    <el-select>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-tutorial-type',
  props: {
    data: {
      type: Object
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
