<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入搜索关键字">
            <el-button slot="append" icon="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div slot="kobe-table-content" class="kobe-table">
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">
    </div>
  </kobe-table>
</template>

<script>
export default {
  name: 'sc-activity-list',
  data () {
    return {
      response: null,
      error: null
    }
  },
  methods: {
    getActivityList (data = null) {
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
