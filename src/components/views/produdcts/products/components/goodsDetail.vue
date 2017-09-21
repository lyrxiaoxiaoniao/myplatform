<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品摘要">
            <el-input type="textarea" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍">
            <vue-html5-editor :content="form.content" @change="updateData"></vue-html5-editor>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
  data () {
    return {
      form: {}
    }
  },
  props: ['getInfo'],
  methods: {
    updateData (data) {
      console.log(data)
      this.form.content = data
    }
  }
}
</script>

