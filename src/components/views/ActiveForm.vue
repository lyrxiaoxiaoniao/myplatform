<template>
  <el-form 
    ref="active-form" 
    v-if="form"
    :rules="rules"
    :model="form" 
    label-width="120px"
    >
    <template v-for="item in data">
      <el-form-item :label="item.name" required>
        <el-input 
          class="notify-form-input"
          v-if="item.type === 0" 
          v-model="form.model[item.key]"
          :placeholder="'请输入'+item.name"
          >
        </el-input>
        <el-date-picker
          v-else-if="item.type === 1"
          v-model="form.model[item.key]"
          :placeholder="'请输入'+item.name"
          type="datetime"
          >
        </el-date-picker>
        <el-input
          type="textarea"
          class="notify-form-input"
          v-else-if="item.type === 2"
          v-model="form.model[item.key]"
          :placeholder="'请输入'+item.name"
          >
        </el-input>
      </el-form-item>
    </template>
    <el-form-item
      class="url-form-item"
      >
      <el-checkbox-group
        class="radio"
        v-model="hasURL"
        >
        <el-checkbox>
        链接
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item 
      v-if="hasURL">
      <el-input
        class="notify-form-input"
        v-model="form.model.url"
        placeholder="请输入链接地址"
        required
        >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'sc-active-form',
  props: ['form'],
  data () {
    return {
      data: null,
      hasURL: false,
      rules: {
      }
    }
  },
  watch: {
    hasURL (newVal, oldVal) {
      if (newVal === true) {
        this.rules.url = [{
          required: true,
          message: '请填写链接地址',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
  },
  mounted () {
    this.data = this.$store.state.activeFormData
    this.data.forEach(item => {
      this.form.model[item.key] = ''
      this.rules[item.key] = [{
        required: true,
        message: `请填写${item.name}`,
        trigger: 'change'
      }]
    })
  }
}
</script>

<style scoped>
.notify-form-input {
  width: 300px;
}
.url-form-item {
  margin-bottom: 0;
}
</style>
