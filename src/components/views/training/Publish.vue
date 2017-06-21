<template>
  <div class="training-publish-component">
    <el-tabs v-model="selectedTab">
      <template v-for="item in data">
        <el-tab-pane :label="item.name" :name="item.name">
          <kobe-active-form v-if="item.name === 'first'" :data="array"></kobe-active-form>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'sc-training-publish',
  data () {
    return {
      selectedTab: '',
      array: [{
        type: 'input',
        data: {
          key: '活动名称',
          value: 'value'
        }
      }, {
        type: 'number',
        data: {
          key: '活动人数',
          value: 50
        }
      }],
      data: [
        { name: 'first', content: '111', type: 'input' },
        { name: 'second', content: '222', type: 'number' },
        { name: 'third', content: '333', type: 'input' },
        { name: 'fourth', content: '444', type: 'input' },
        { name: 'fifth', content: '555', type: 'input' }
      ],
      form: {
      }
    }
  },
  methods: {
  },
  mounted () {
    this.selectedTab = this.data[0].name
  }
}
</script>

<style>
.training-publish-component {
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
