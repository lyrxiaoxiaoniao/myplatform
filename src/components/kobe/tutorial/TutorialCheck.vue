<template>
  <el-checkbox
    @change="onChange"
    v-model="checked"
    >
    {{ this.data.title }}
  </el-checkbox>
</template>

<script>
export default {
  name: 'kobe-tutorial-check',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    init () {
    },
    onChange () {
    }
  },
  mounted () {
  }
}
</script>
