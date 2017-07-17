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
        <el-card class="box-card" v-if="response">
          <div slot="header" class="clearfix">
            <span class="card-title">{{ response[0].title }}</span>
          </div>

          <div>
            <kobe-tutorial-publish-basic
              :data="response[0]"
              :index="0"
              @form-change="onFormChange"
              >
            </kobe-tutorial-publish-basic>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" class="tutorial-stage">
        <el-tabs v-model="selectedTab">
          <el-tab-pane
            v-for="(item, index) in response"
            v-if="response && index !== 0"
            :label="item.title"
            :name="index.toString()"
            >
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
      selectedTab: '1',
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
