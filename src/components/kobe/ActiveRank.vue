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
  // rank award toggle card
  // used for kobe active rank
  name: 'kobe-active-rank',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      switchOn: true,
      number: ''
    }
  },
  computed: {
    form () {
      const data = this.data.data[0]
      const obj = [{
        id: data.id,
        index: data.index,
        type_key: data.type_key,
        options: [{
          title: this.switchOn ? 1 : 0
        }]
      }]
      return obj
    }
  },
  watch: {
    number (newVal, oldVal) {
    }
  },
  methods: {
    onNumberChange (index) {
      const obj = this.data.data[index]
      let item = {
        id: obj.id,
        index: obj.index,
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
        index: obj.index,
        type_key: obj.type_key,
        options: [{
          title: this.switchOn ? 1 : 0
        }]
      }
      this.form[index] = item
      this.$emit('rank', this.form)
    },
    init () {
      this.data.data.forEach((item, index) => {
        if (item.values && item.values.length) {
          const key = item.values[0].key
          const value = item.values[0].value
          switch (key) {
            case 'activity_property_rank':
              if (value === 1 || value === '1') {
                this.switchOn = true
              } else {
                this.switchOn = false
              }
              let obj = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: this.switchOn ? 1 : 0
                }]
              }
              this.form[index] = obj
              break
            case 'activity_property_rank_number':
              this.number = value
              let number = {
                id: item.id,
                index: item.index,
                type_key: item.type_key,
                options: [{
                  title: this.number
                }]
              }
              this.form[index] = number
              break
          }
        }
      })
      this.$emit('rank', this.form)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.card-title {
  font-size: 16px;
}
</style>
