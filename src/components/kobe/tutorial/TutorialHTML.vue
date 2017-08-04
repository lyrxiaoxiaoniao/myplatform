<template>
  <div :class="['kobe-tutorial-html', typeClass]">
    <el-form-item :label="data.title">
      <vue-html5-editor
        :content="content"
        @change="onChange"
        >
      </vue-html5-editor>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-html',
  props: {
    typeClass: {
      type: String
    },
    data: {
      type: Object
    },
    index: {
      type: Number
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
        this.$emit('change', data)
      }
    },
    onChange (value) {
      let data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: value
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
