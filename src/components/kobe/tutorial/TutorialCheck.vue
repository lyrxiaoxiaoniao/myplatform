<template>
  <el-checkbox
    class="margin-left-0"
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
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        this.checked = (value.value === '1' || value.value === 1)
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
    this.init()
  }
}
</script>

<style>
.margin-left-0 {
  margin-left: 0!important;
}
</style>
