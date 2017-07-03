<template>
  <el-form-item :label="data.title">
    <el-select
      clearable
      v-model="selected"
      @change="onChange">
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
  name: 'kobe-active-select',
  props: {
    data: {
      type: Object,
      default: {
      }
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
  computed: {
  },
  methods: {
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
      this.$emit('select', data)
    }
  }
}
</script>
