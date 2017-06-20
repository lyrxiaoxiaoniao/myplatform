<template>
  <el-dialog
    :title="data.title"
    v-model="data.isShow">
    <el-form
      :model="data.form">
      <template v-for="item in data.form">
        <el-form-item label="item">
          <el-input v-model="item"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <slot name="kobe-dialog-footer">
      <el-row type="flex" justify="end">
        <el-button>取消</el-button>
        <el-button type="primary">确定</el-button>
      </el-row>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'kobe-dialog',
  props: {
    data: {
      type: Object,
      default: {
        title: 'KOBE-DIALOG',
        isShow: false,
        form: {
        }
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>
</style>
