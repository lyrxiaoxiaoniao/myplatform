<template>
  <div class="sc-reservation-list">
    <kobe-table>
      <div class="kobe-table-header" slot="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-button type="primary" icon="add">新增</el-button>
          <el-col :span="7">
            <el-input placeholder="请输入关键字" class="sc-table-header-select">
              <el-button slot="append" class="sc-table-search-btn" icon="search"></el-button>
            </el-input>
            <el-button type="primary" icon="upload2"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table :data="listData">
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
          <el-table-column></el-table-column>
        </el-table>
      </div>
    </kobe-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: null
    }
  }
}
</script>

<style>

</style>
