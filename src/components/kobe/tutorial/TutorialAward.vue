<template>
  <el-card class="box-card tutorial-award">
    <div slot="header" class="clearfix">
      <span class="card-title">课程奖励</span>
      <template v-for="item, index in components">
        <el-switch
          class="float-right"
          v-model="toggleSwitch"
          v-if="item.type === 'switch'"
          >
        </el-switch>
      </template>
    </div>
    <div class="kobe-tutorial-card-content" v-if="toggleSwitch">
      <div>课程报名学习完毕之后,系统将会对学员进行奖励</div>
      <template
        v-for="item, index in components"
        >
        <div
          class="kobe-tutorial-award-item"
          v-if="item.type === 'radio'"
          >
          <div>{{ index+1 }}. {{ item.title }}</div>
          <el-radio-group
            @change="onFreqChange(index)"
            v-model="frequency"
            v-if="item.type_key === 'activity_property_tutorial_frequently'"
            >
            <div v-for="(obj, sort) in item.options">
              <el-radio :label="obj.type_key">{{ obj.title }}</el-radio>
            </div>
          </el-radio-group>
          <el-radio-group
            @change="onQualifyChange(index)"
            v-model="qualify"
            v-if="item.type_key === 'activity_property_tutorial_award_'"
            >
            <div v-for="(obj, sort) in item.options">
              <el-radio :label="obj.type_key">{{ obj.title }}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <el-row
          type="flex"
          v-if="item.type === 'number'"
          class="kobe-tutorial-award-min">
          <el-input-number
            class="kobe-tutorial-award-min"
            v-model="minutes"
            size="small"
            :disabled="qualify !== 'activity_option_award_time'"
            >
          </el-input-number>
          <span>
            分钟
          </span>
        </el-row>
      </template>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'kobe-tutorial-award',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      controlIndex: '',
      toggleSwitch: true,
      frequency: '',
      qualify: '',
      minutes: ''
    }
  },
  computed: {
    components () {
      let arr = []
      this.data.data.forEach((item, index) => {
        item.value = ''
        if (item.type === 'switch') {
          this.controlIndex = index
        }
        arr.push(item)
      })
      return arr
    },
    form () {
      const data = this.data.data[this.controlIndex]
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
  watch: {
    minutes (newVal, oldVal) {
      let data, num
      this.data.data.forEach((item, index) => {
        if (item.type_key === 'activity_property_tutorial_time_length') {
          data = item
          num = index
        }
      })
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: newVal
          }]
        }
      }
      this.form[num] = item
      this.$emit('award', this.form)
    }
  },
  methods: {
    onFreqChange (index) {
      const data = this.data.data[index]
      const item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.frequency
          }]
        }
      }
      this.form[index] = item
      this.$emit('award', this.form)
    },
    onQualifyChange (index) {
      const data = this.data.data[index]
      const item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.qualify
          }]
        }
      }
      this.form[index] = item
      this.$emit('award', this.form)
    },
    init () {
      if (this.data.data && this.data.data.length) {
        this.data.data.forEach((item, index) => {
          if (!item.values) return
          let data
          switch (item.type_key) {
            case 'activity_property_tutorial_reward':
              const value = item.values[0].value
              this.toggleSwitch = (value === '1' || value === 1)
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: this.toggleSwitch ? 1 : 0
                  }]
                }
              }
              break
            case 'activity_property_tutorial_frequently':
              const freq = item.values[0].value
              this.frequency = freq
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: this.frequency
                  }]
                }
              }
              break
            case 'activity_property_tutorial_award_':
              const qualify = item.values[0].value
              this.qualify = qualify
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: this.qualify
                  }]
                }
              }
              break
            case 'activity_property_tutorial_time_length':
              const time = item.values[0].value
              this.minutes = time
              data = {
                index: item.index,
                data: {
                  id: item.id,
                  type_key: item.type_key,
                  options: [{
                    title: this.minutes
                  }]
                }
              }
              break
          }
          this.form[index] = data
        })
        this.$emit('award', this.form)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style>
.float-right {
  float: right;
}
.tutorial-award {
  margin-bottom: 1rem;
}
.kobe-tutorial-award-item {
  margin-top: 1rem;
}
.kobe-tutorial-award-item .el-radio {
  padding-left: 2rem;
  font-size: 12px;
}
.kobe-tutorial-award-item .el-radio__label {
  font-size: 12px;
  font-weight: 400;
}
.kobe-tutorial-award-min {
  margin-left: 3rem;
}
.kobe-tutorial-award-min span {
  margin-left: 1rem;
  line-height: 2rem;
}
</style>
