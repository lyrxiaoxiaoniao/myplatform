<template>
  <div class="sc-tutorial-publish">
    <el-row type="flex">
      <el-button @click="toTutorialList">返回列表</el-button>
      <el-button>课程预览</el-button>
      <el-button @click="onSubmit(0, '保存成功')">保存草稿</el-button>
      <el-button @click="onSubmit(1, '创建活动成功')">提交发布</el-button>
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
            <kobe-tutorial-publish-form
              :data="item"
              :index="index"
              :typeClass="[(index === 1 || index === 2) ? 'tutorial-publish-border': '', 'tutorial-publish-form']"
              @form-change="onFormChange"
              >
            </kobe-tutorial-publish-form>
          </el-tab-pane>
        </el-tabs>

        <div class="tutorial-action" v-if="response">
          <el-row type="flex" justify="center">
            <el-button @click="onPrevTab" v-if="selectedTab !== '1'" type="primary">上一步</el-button>
            <el-button @click="onNextTab" v-if="selectedTab !== String(response.length-1)" type="primary">下一步</el-button>
          </el-row>
        </div>
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
      response: null,
      form: {
        stages: [
        ],
        exts: [
        ]
      }
    }
  },
  methods: {
    toTutorialList () {
      this.$router.push({
        path: '/admin/tutorial/index'
      })
    },
    onSubmit (active, msg) {
      let canSubmit = true
      console.log(this.form)
      this.form.stages.forEach((stage, index) => {
        if (index === 1 && stage.properties.length !== 7) {
          this.$message.error('请填写完整信息')
          canSubmit = false
        }
      })

      if (!canSubmit) {
        return
      }

      const data = {
        catgr_id: this.categoryID,
        active: active,
        ...this.form
      }
      api.POST(config.activity.add, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            type: 'success',
            message: msg
          })
          this.$router.push({
            path: '/admin/tutorial'
          })
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onFormChange (value) {
      this.form.stages[value.index] = value
    },
    onPrevTab () {
      const current = Number(this.selectedTab)
      this.selectedTab = String(current - 1)
    },
    onNextTab () {
      const current = Number(this.selectedTab)
      this.selectedTab = String(current + 1)
    },
    getStages () {
      api.GET(config.tutorial.stages, {
        category_id: this.categoryID
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          this.response.forEach((item, index) => {
            let obj = {
              index: index,
              id: item.id,
              type_key: item.type_key,
              properties: []
            }
            this.form.stages.push(obj)
          })
          console.log(this.form.stages, '456')
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
.tutorial-publish-form {
  margin-left: 1rem;
  padding: 2rem;
}
.tutorial-publish-border {
  border: 1px solid lightgray;
}
.tutorial-action {
  margin-top: 1rem;
  padding-bottom: 1rem;
}
</style>
