<template>
  <el-form-item :label="data.title">
    <el-switch
      v-model="value"
      :on-text="onText"
      :off-text="offText"
      :on-color="onColor"
      :off-color="offColor"
      @change="onChange"
      >
    </el-switch>
  </el-form-item>  
</template>

<script>
export default {
  name: 'kobe-active-switch',
  props: {
    onText: {
      type: String,
      default: '开'
    },
    offText: {
      type: String,
      default: '关'
    },
    onColor: {
      type: String,
      default: '#13ce66'
    },
    offColor: {
      type: String,
      default: '#ff4949'
    }
  },
  data () {
    return {
      value: true
    }
  },
  methods: {
    onChange () {
      this.$emit('switch', this.value)
    }
  }
}
</script>
