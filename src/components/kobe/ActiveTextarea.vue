<template>
  <el-form-item :label="data.title">
    <el-input
      :type="type"
      v-model="data.value"
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
            title: this.data.value
          }]
        }
      }
      this.$emit('text', data)
    }
  },
  mounted () {
  }
}
</script>
