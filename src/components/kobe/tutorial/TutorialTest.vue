<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="card-title">学毕测试</span>
      <template v-for="item, index in data.data">
        <el-switch
          class="float-right"
          v-model="toggleSwitch"
          v-if="item.type === 'switch'"
          @change="onSwitchChange(index)"
          >
        </el-switch>
      </template>
    </div>
    <div v-if="toggleSwitch">
      <template v-for="item, index in data.data">
        <div v-if="item.type === 'input'">
          {{ item.title }}
          <el-input
            v-model="url"
            @change="onChange(index)"
            placeholder="请输入外部连接"
            >
          </el-input>
        </div>
      </template>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'kobe-tutorial-test',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      toggleSwitch: true,
      url: ''
    }
  },
  computed: {
    form () {
      const data = this.data.data[0]
      const item = [{
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.toggleSwitch ? 1 : 0
          }]
        }
      }]
      return item
    }
  },
  methods: {
    onSwitchChange (index) {
      const data = this.data.data[index]
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.toggleSwitch ? 1 : 0
          }]
        }
      }
      this.form[index] = item
      this.$emit('test', this.form)
    },
    onChange (index) {
      const data = this.data.data[index]
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.url
          }]
        }
      }
      this.form[index] = item
      this.$emit('test', this.form)
    }
  },
  mounted () {
  }
}
</script>
