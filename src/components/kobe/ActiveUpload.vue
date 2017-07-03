<template>
  <div class="">
    <el-form-item
      :label="data.title"
      >
      <el-upload>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'kobe-active-upload',
  props: {
    data: {
      type: Object,
      default: {
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
