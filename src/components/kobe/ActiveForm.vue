<template>
  <div class="kobe-active-form">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item in data">
        <kobe-active-input
          v-if="item.type === 'input'"
          :data="item"
          @input="onInputChange"
          >
        </kobe-active-input>
        <kobe-number-input
          v-if="item.type === 'number'"
          :data="item"
          @number="onInputChange"
          >
        </kobe-number-input>
        <kobe-date-input
          v-if="item.type === 'datetime'"
          :data="item"
          @date="onTimeChange"
          >
        </kobe-date-input>
      </template>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button @click="onSubmit">确定</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'kobe-active-form',
  props: {
    data: {
      type: Array,
      default: [{
        type: '',
        data: {
          title: 'title',
          value: 'value'
        }
      }]
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
      // console.log(value)
    },
    onTimeChange (value) {
    },
    onSubmit () {
      this.$emit('submit', this.form)
    },
    onReset () {
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
