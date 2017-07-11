<template>
  <el-card class="box-card kobe-active-attendence-mode">
    <div slot="header">
      <span class="card-title">培训考勤模式配置</span>
    </div>
    <div
      v-for="item, index in data.data">
      <el-form-item
        :label="item.title"
        v-if="item.type === 'radiogroup' && index === 0"
        >
        <el-radio-group
          @change="onSigninChange"
          v-model="signin">
          <el-radio
            :label="radio.title"
            v-for="radio in item.options"
            >
            {{ radio.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        :label="item.title"
        v-if="item.type === 'radiogroup' && index === 1"
        >
        <el-radio-group
          @change="onSignoutChange"
          v-model="signout">
          <el-radio
            :label="radio.title"
            v-for="radio in item.options"
            >
            {{ radio.title }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'kobe-active-attendence-mode',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      signin: '',
      signout: '',
      form: []
    }
  },
  methods: {
    onSigninChange () {
      const obj = this.data.data[0]
      let item = {
        id: obj.id,
        index: 0,
        type_key: obj.type_key,
        options: [{
          title: this.signin
        }]
      }
      this.form[0] = item
      this.$emit('mode', this.form)
    },
    onSignoutChange () {
      const obj = this.data.data[1]
      let item = {
        id: obj.id,
        index: 1,
        type_key: obj.type_key,
        options: [{
          title: this.signout
        }]
      }
      this.form[1] = item
      this.$emit('mode', this.form)
    }
  },
  mounted () {
  }
}
</script>

<style>
.kobe-active-attendence-mode {
  margin-bottom: 1rem;
}
</style>
