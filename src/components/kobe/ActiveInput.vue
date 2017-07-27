<template>
  <el-form-item :label="data.title">
    <el-input
      :type="type"
      v-model="input"
      @change="onChange"
      :placeholder="data.description"
      >
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  // used for activity active form
  name: 'kobe-active-input',
  props: {
    data: {
      type: Object,
      default: {
        title: '',
        value: '',
        id: ''
      }
    },
    index: {
      type: Number
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    onChange () {
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: this.input
          }]
        }
      }
      this.$emit('input', data)
    },
    init () {
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        this.input = value.value
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: this.data.value
            }]
          }
        }
        this.$emit('input', data)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
