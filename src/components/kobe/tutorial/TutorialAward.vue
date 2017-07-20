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
      <div
        class="kobe-tutorial-award-item"
        v-for="item, index in components"
        v-if="item.type === 'radio'"
        >
        <div>{{ index+1 }}. {{ item.title }}</div>
        <el-radio-group
          v-model="item.value"
          >
          <div v-for="(obj, sort) in item.options">
            <el-radio label="index">{{ obj.title }}</el-radio>
          </div>
        </el-radio-group>
      </div>
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
      toggleSwitch: true
    }
  },
  computed: {
    components () {
      let arr = []
      this.data.data.forEach(item => {
        item.value = ''
        arr.push(item)
      })
      return arr
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style>
.kobe-tutorial-award-item {
  border-bottom: 1px solid lightgray;
}
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
</style>
