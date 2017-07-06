<template>
<div class="TM-container">
    <div class="TM-header">
        <el-button type="primary">返回列表</el-button>
        <el-select v-model="selectMode" placeholder="请选择处理方式">
            <el-option label="审核" value="审核"></el-option>
            <el-option label="认证" value="认证"></el-option>
        </el-select>
    </div>
    <div class="TM-left">
        <div>
            <h4>团队logo</h4>
        </div>
        <div>
            <h4>认证照片信息</h4>
        </div>
    </div>
    <div class="TM-right"></div>
</div>
</template>
<script>
export default {
  data () {
    return {
      selectMode: ''
    }
  },
  methods: {}
}
</script>

<style scoped>
.TM-container{
    padding: 1rem 2rem;
}
.TM-header{
    margin-top: 10px;
}
</style>
