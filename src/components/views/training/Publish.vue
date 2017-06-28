<template>
  <div class="training-publish-component" v-if="response">
    <el-tabs v-model="selectedTab">
      <template v-for="item in response">
        <el-tab-pane :label="item.title" :name="item.title">
          <kobe-active-form
            v-if="item.properties.length !== 0"
            :data="item.properties">
          </kobe-active-form>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-training-publish',
  data () {
    return {
      error: null,
      response: null,
      selectedTab: '',
      form: {
      }
    }
  },
  methods: {
    getActivityForm () {
      api.GET(config.activity.activitySelectCatlg, {
        category_id: 12
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          console.log(response.data.data)
          this.response = response.data.data
          this.selectedTab = this.response[0].title
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getActivityForm()
  }
}
</script>

<style>
.training-publish-component {
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
