<template>
  <div class="kobe-active-form">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in data">
        <kobe-active-input
          v-if="item.type === 'input'"
          :data="item"
          :index="index"
          @input="onInputChange"
          >
        </kobe-active-input>
        <kobe-number-input
          v-if="item.type === 'number'"
          :data="item"
          :index="index"
          @number="onNumberChange"
          >
        </kobe-number-input>
        <kobe-date-input
          v-if="item.type === 'datetime'"
          :index="index"
          :data="item"
          @date="onTimeChange"
          >
        </kobe-date-input>
      </template>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button @click="onSubmit">确定</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'kobe-active-form',
  props: {
    data: {
      type: Array
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      form: {
      }
    }
  },
  methods: {
    onInputChange (value) {
      this.data[value.index] = value
      this.onFormChange()
    },
    onNumberChange (value) {
      this.data[value.index] = value
      this.onFormChange()
    },
    onTimeChange (value) {
    },
    onSubmit () {
      this.$emit('submit', this.form)
    },
    onFormChange () {
      const data = {
        index: this.index,
        data: this.data
      }
      this.$emit('form-change', data)
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
