<template>
  <div class="kobe-info-dialog">
    <el-dialog :title="title" v-model="isShow">
      <div class="kobe-info-dialog-cell" v-for="value, key in data">{{ key }}: {{ value }}</div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'kobe-info-dialog',
  props: {
    data: {
      type: Object,
      default: {
      }
    },
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'title'
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>
.kobe-info-dialog-cell {
  border-bottom: 1px solid lightgray;
  margin-bottom: 1rem;
}
</style>
