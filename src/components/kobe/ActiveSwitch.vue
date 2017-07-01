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
  // used for activity active form
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
    },
    index: {
      type: Number
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
      value: true
    }
  },
  methods: {
    onChange () {
      let value
      if (this.value) {
        value = 1
      } else {
        value = 0
      }

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
      this.$emit('switch', data)
    }
  }
}
</script>
