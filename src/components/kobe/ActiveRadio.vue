<template>
  <el-form-item :label="data.title">
    <el-radio-group v-model="selected" @change="onChange">
      <el-radio
        :label="item.title"
        v-for="item in data.options"
        >
        {{ item.title }}
      </el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'kobe-active-radio',
  data () {
    return {
      selected: ''
    }
  },
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
  methods: {
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
      this.$emit('radio', data)
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
