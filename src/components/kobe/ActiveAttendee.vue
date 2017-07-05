<template>
  <el-card class="box-card kobe-active-attendee">
    <div slot="header" class="clearfix">
      <span class="card-title">活动指定参加人员</span>
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
      <el-table
        v-if="tableData && toggleSwitch"
        border
        stripe
        :data="tableData"
        >
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'kobe-active-attendee',
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      tableData: null,
      toggleSwitch: true
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
.kobe-active-attendee {
  margin-top: 1rem;
}
</style>
