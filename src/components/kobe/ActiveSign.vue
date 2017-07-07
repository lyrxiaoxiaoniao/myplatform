<template>
  <el-card
    class="box-card kobe-active-sign">
    <div slot="header" class="clearfix">
      <span class="card-title">活动报名总开关</span>
    </div>
    <div v-for="item, index in data.data">
      <el-form-item
        :label="item.title"
        v-if="item.type === 'switch'"
        >
        <el-switch
          v-model="toggleSwitch"
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
        v-if="item.type === 'timerange' && toggleSwitch"
        >
        <el-date-picker
          v-model="timerange"
          type="datetimerange"
          placeholder="选择时间范围"
          ></el-date-picker>
      </el-form-item>
      <el-form-item
        :label="item.title"
        v-if="item.type === 'checkboxgroup' && toggleSwitch"
        >
        <el-checkbox-group
          v-model="checklist"
          >
          <!-- <el-checkbox -->
          <!--   :label="item.title" -->
          <!--   v-for="item in checkboxs"> -->
          <!-- </el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
    </div>
  </el-card>
</template>

<script>
export default {
  // active signin toggle card
  // used for kobe active form
  name: 'kobe-active-sign',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      toggleSwitch: true,
      timerange: ''
    }
  },
  computed: {
    checkboxs () {
      let arr = [
        ...this.data.options
      ]
      return arr
    }
  },
  methods: {
    onSwitchChange(index) {
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
