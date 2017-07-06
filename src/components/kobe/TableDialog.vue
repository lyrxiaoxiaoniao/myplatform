<template>
  <el-dialog @close="onClose" :title="title" v-model="isShow" class="kobe-table-dialog">
    <slot name="header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入关键字" v-model="keyword">
            <el-button @click="onSearch" slot="append" icon="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </slot>

    <slot name="table" class="kobe-table">
      <el-table
        boder
        stripe
        ref="table"
        :data="tableData.data">
        <el-table-column type="selection"></el-table-column>
      </el-table>
    </slot>

    <slot name="footer" class="kobe-table-footer">
      <el-row type="flex" justify="space-between">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableData.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="tableData.pageSize"
          :total="tableData.count"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <el-button @click="onConfirm" type="primary">确定</el-button>
      </el-row>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  // el-table in el-dialog
  name: 'kobe-table-dialog',
  props: {
    title: {
      type: String,
      default: '列表'
    },
    show: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Object,
      default: [
      ]
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  computed: {
    isShow () {
      return !!this.show
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    onSearch () {
      const data = {
        keyword: this.keyword,
        currentPage: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
        category_id: this.tableData.id
      }
      this.$emit('search', data)
    },
    onConfirm () {
      this.$emit('confirm', {})
    },
    handleSizeChange (value) {
      const data = {
        keyword: this.keyword,
        currentPage: this.tableData.currentPage,
        pageSize: value,
        category_id: this.tableData.id
      }
      this.$emit('sizeChange', data)
    },
    handleCurrentChange (value) {
      const data = {
        keyword: this.keyword,
        currentPage: value,
        pageSize: this.tableData.pageSize,
        category_id: this.tableData.id
      }
      this.$emit('pageChange', data)
    }
  },
  mounted () {
  }
}
</script>

<style>
.kobe-table {
  margin-bottom: 1rem;
}
.kobe-table-header {
  margin-bottom: 1rem;
}
.kobe-table-dialog .el-dialog {
  padding: 0;
}
</style>
