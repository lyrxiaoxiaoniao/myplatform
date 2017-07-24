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
    },
    index: {
      type: Number
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
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: this.checked ? 1 : 0
          }]
        }
      }
      this.$emit('check', data)
    }
  },
  mounted () {
  }
}
</script>
