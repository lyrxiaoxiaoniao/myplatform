<template>
  <div class="sc-tutorial-publish">
    <el-row type="flex">
      <el-button>返回列表</el-button>
      <el-button>课程预览</el-button>
      <el-button>保存草稿</el-button>
      <el-button>提交发布</el-button>
    </el-row>

    <el-row type="flex" class="sc-tutorial-publish-content">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">头图及属性</span>
          </div>

          <div>
            <el-form label-width="80px">
              <div class="img-upload-container">
                <img src="" alt="">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <el-form-item label="课程类型">
                <el-select></el-select>
              </el-form-item>
              <el-form-item label="主讲人">
                <el-input></el-input>
              </el-form-item>
              <el-checkbox-group>
                <el-row type="flex">
                  <el-checkbox label="原创课程"></el-checkbox>
                  <el-checkbox label="推荐本课程"></el-checkbox>
                </el-row>
                <el-row type="flex" justify="space-between">
                  <el-checkbox label="置顶课程"></el-checkbox>
                  <el-input-number size="small"></el-input-number>
                </el-row>
              </el-checkbox-group>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" class="tutorial-stage">
        <el-tabs v-model="selectedTab">
          <el-tab-pane
            v-for="(item, index) in response"
            :label="item.title"
            :name="index.toString()"
            >
            <kobe-active-form
              v-if="item.properties"
              :data="item"
              :index="index"
              @form-change="onFormChange"
              >
            </kobe-active-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-publish',
  data () {
    return {
      // activity category id for tutorial
      categoryID: 14,
      id: this.$route.query.id,
      type: this.$route.query.id ? 'edit' : 'add',
      selectedTab: '',
      response: null
    }
  },
  methods: {
    onFormChange () {
    },
    getStages () {
      api.GET(config.tutorial.stages, {
        category_id: this.categoryID
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          console.log(this.response)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getStages()
  }
}
</script>

<style>
.sc-tutorial-publish {
  margin-top: 1rem;
  margin-left: 1rem;
}
.sc-tutorial-publish-content {
  margin-top: 1rem;
}
.img-upload-container {
  margin: 1rem auto;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-upload-container:hover {
  border-color: #20a0ff;
}
.tutorial-stage {
  margin-left: 1rem;
  margin-right: 3rem;
}
</style>
