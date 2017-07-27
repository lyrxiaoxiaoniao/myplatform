<template>
  <el-form-item :label="data.title">
    <el-input
      :type="type"
      v-model="content"
      @change="onChange"
      :placeholder="data.description"
      >
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  // used for activity active form
  name: 'kobe-active-textarea',
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
      default: 'textarea'
    }
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    init () {
      if (this.data.values && this.data.values.length) {
        const value = this.data.values[0]
        this.content = value.value
        let data = {
          index: this.index,
          data: {
            id: this.data.id,
            type_key: this.data.type_key,
            options: [{
              title: this.content
            }]
          }
        }
        this.$emit('text', data)
      }
    },
    onChange () {
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: this.content
          }]
        }
      }
      this.$emit('text', data)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
