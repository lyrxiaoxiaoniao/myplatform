<template>
  <div class="sc-add-test">
    <el-card class="box-card">
      <div class="clearfix" slot="header">
        <el-button @click="back" type="priamry" icon="d-arrow-left">
          返回
        </el-button>
        <el-button style="float: right;" type="primary">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>
