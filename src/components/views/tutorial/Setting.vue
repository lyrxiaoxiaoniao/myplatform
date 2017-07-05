<template>
  <div class="sc-tutorial-setting-component">
    <el-card class="sc-tutorial-setting-site">
      <div slot="header" class="clearfix">
        <span class="sc-card-title">线上课堂站点配置</span>
        <el-button class="right">保存</el-button>
      </div>
      <div class="">
        <el-form :model="siteForm" label-width="120px">
          <el-row type="flex">
            <el-form-item label="站点名称">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="站点别名">
              <el-input></el-input>
            </el-form-item>
          </el-row>
          <el-form-item label="关键字">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="域名信息">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="访问链接">
            <el-input></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="sc-tutorial-setting-frontpage">
      <div slot="header" class="clearfix">
        <span class="sc-card-title">首页配置信息</span>
        <el-button class="right">保存</el-button>
      </div>
      <div>
        <el-form :model="pageForm" label-width="120px">
          <el-form-item label="首页广告信息">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="推荐课程数量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="最新课程数量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="最热课程数量">
            <el-input></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'sc-tutorial-setting',
  data () {
    return {
      siteForm: {
      },
      pageForm: {
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
.sc-tutorial-setting-component {
  margin-left: 2rem;
  margin-top: 2rem;
  padding-bottom: 1rem;
}
.sc-tutorial-setting-site {
  width: 600px;
  margin-bottom: 1rem;
}
.sc-tutorial-setting-frontpage {
  width: 600px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.right {
  float: right;
}
.sc-card-title {
  font-size: 18px;
}
</style>
