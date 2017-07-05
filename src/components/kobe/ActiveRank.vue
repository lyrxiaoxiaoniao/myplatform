<template>
  <el-card
    class="box-card">
    <div slot="header" class="clearfix">
      <span class="card-title">积分奖励</span>
    </div>
    <div v-for="item, index in data.data">
      <el-form-item
        :label="item.title"
        v-if="item.type === 'switch'">
        <el-switch
          v-model="switchOn"
          on-text="开"
          off-text="关"
          on-color="#13ce66"
          off-color="#ff4949"
          @change="onSwitchChange(index)"
          >
        </el-switch>
      </el-form-item>
      <el-form-item
        :label="item.title"
        v-if="item.type === 'number' && switchOn"
        >
        <el-input-number
          v-model="number"
          @change="onNumberChange(index)"
          >
        </el-input-number>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'kobe-active-rank',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      switchOn: true,
      number: '',
      form: [
      ]
    }
  },
  computed: {
  },
  methods: {
    onNumberChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        type_key: obj.type_key,
        options: [{
          title: this.number
        }]
      }
      this.form[index] = item
      this.$emit('rank', this.form)
    },
    onSwitchChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        type_key: obj.type_key,
        options: [{
          title: this.switchOn
        }]
      }
      this.form[index] = item
      this.$emit('rank', this.form)
    }
  },
  mounted () {
  }
}
</script>

<style>
.card-title {
  font-size: 16px;
}
</style>
