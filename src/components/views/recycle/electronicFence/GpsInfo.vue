<template>
  <div class="gps-info">
    <kobe-table>
      <div class="kobe-table-header"
           slot="kobe-table-header">
        <el-row type="flex"
                justify="space-between">
          <el-col>
            <el-button type="primary"
                       @click="back"
                       icon="d-arrow-left">返回列表</el-button>
            <el-button type="primary">
              <i class="fa fa-refresh"
                 aria-hidden="true"></i> 刷新</el-button>
          </el-col>
          <el-col :span="7">
            <el-date-picker v-model="dateValue"
                            type="datetimerange"
                            placeholder="选择时间范围">
            </el-date-picker>
          </el-col>
          <el-button type="primary"
                     icon="upload2"></el-button>
          <el-button type="primary"
                     icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content"
           class="kobe-table">
        <el-table :data="listData"
                  border>
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label="ID"
                           prop="id"></el-table-column>
          <el-table-column label="时间"></el-table-column>
          <el-table-column label="车辆" width="200"></el-table-column>
          <el-table-column label="经度"></el-table-column>
          <el-table-column label="纬度"></el-table-column>
          <el-table-column label="速度"></el-table-column>
          <el-table-column label="位置"></el-table-column>
          <el-table-column label="状态"></el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer"
           class="kobe-table-footer">
        <el-row type="flex"
                justify="center">
          <el-col :span="12">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="response.currentPage"
                           :page-sizes="[10, 20, 50, 100]"
                           :page-size="response.pageSize"
                           :total="response.count"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </kobe-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [{ id: 0 }],
      response: {},
      dateValue: ''
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
