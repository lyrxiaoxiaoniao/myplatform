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
          :data="item.data"
          @input="onInputChange"
          >
        </kobe-active-input>
        <kobe-number-input
          v-if="item.type === 'number'"
          :data="item.data"
          @number="onInputChange"
          >
        </kobe-number-input>
      </template>
    </el-form>
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
          key: 'key',
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
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
