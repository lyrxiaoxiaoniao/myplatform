<template>
  <div class="kobe-tutorial-publish">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-publish-form',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      form: {
        properties: [
        ]
      }
    }
  }
}
</script>

<style>
</style>
