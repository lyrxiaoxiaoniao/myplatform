<template>
  <el-form-item :label="data.title">
    <el-select v-model="selected" placeholder="课程类型" @change="onChange">
      <el-option
        v-for="item in data.options"
        :label="item.title"
        :value="item.title"
        >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-tutorial-type',
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
      selected: ''
    }
  },
  methods: {
    init () {
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        this.selected = value.value
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: this.selected
            }]
          }
        }
        this.$emit('change', data)
      }
    },
    onChange () {
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: this.selected
          }]
        }
      }
      this.$emit('change', data)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
