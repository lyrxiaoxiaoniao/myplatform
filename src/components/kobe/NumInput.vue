<template>
  <div class="kobe-number-input">
    <el-form-item :label="data.title">
      <el-input-number
        @change="onChange"
        v-model="number"
        :placeholder="data.description"
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
        id: '',
        value: 1,
        title: '',
        type_key: ''
      }
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 9999999
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      number: 0
    }
  },
  methods: {
    onChange () {
      const data = {
        index: this.index,
        data: {
          id: this.data.id,
          type_key: this.data.type_key,
          options: [{
            title: this.number
          }]
        }
      }
      this.$emit('number', data)
    }
  },
  mounted () {
  }
}
</script>
