<template>
  <div class="kobe-number-input">
    <el-form-item :label="data.key">
      <el-input-number
        @change="onChange"
        v-model="data.value"
        :min="min"
        :max="max"
        >
      </el-input-number>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'kobe-number-input',
  props: {
    data: {
      type: Object,
      default: {
        key: '',
        value: ''
      }
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 99999
    }
  },
  data () {
    return {
      number: ''
    }
  },
  computed: {
  },
  methods: {
    onChange () {
      this.$emit('number', this.data.value)
    }
  },
  mounted () {
  }
}
</script>
