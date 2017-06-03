<template>
  <div class="kobe-table-component">
    <slot name="kobe-table-header" class="kobe-table-header">
      <el-row type="flex">
      </el-row>
    </slot>

    <slot name="kobe-table-content" class="kobe-table">
      <el-table
        :data="tableData"
        >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="id" label="ID" sortable width="80"></el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </slot>

    <slot name="kobe-table-footer" class="kobe-table-footer">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'kobe-table',
  props: {
  },
  data () {
    return {
      tableData: {
        default: {
        },
        type: Object
      }
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style>
.kobe-table-header {
  margin: 1rem 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
}
.kobe-table {
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 1rem;
}
.kobe-table-footer {
  padding-bottom: 1rem;
}
</style>
