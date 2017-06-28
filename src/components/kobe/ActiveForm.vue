<template>
  <div class="kobe-active-form">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in data.properties">
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
    <!-- <el-row type="flex" justify="center"> -->
    <!--   <el-button @click="onSubmit">确定</el-button> -->
    <!-- </el-row> -->
  </div>
</template>

<script>
export default {
  name: 'kobe-active-form',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      form: {
        properties: [
        ]
      }
    }
  },
  methods: {
    onInputChange (value) {
      this.form.properties[value.index] = value.data
      this.onFormChange()
    },
    onNumberChange (value) {
      this.form.properties[value.index] = value.data
      this.onFormChange()
    },
    onTimeChange (value) {
    },
    onSubmit () {
      this.$emit('submit', this.form)
    },
    onFormChange () {
      const data = {
        id: this.data.id,
        index: this.index,
        type_key: this.data.type_key,
        ...this.form
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
