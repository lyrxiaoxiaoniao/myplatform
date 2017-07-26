<template>
  <div class="sc-tutorial-edit">
    <el-row type="flex">
      <el-button @click="back">返回列表</el-button>
      <el-button>课程预览</el-button>
      <el-button>保存草稿</el-button>
      <el-button>提交发布</el-button>
    </el-row>

    <el-row type="flex">
      <el-col :span="6">
        <el-card class="box-card" v-if="stages">
          <div slot="header" class="clearfix">
            <span class="card-title">{{ stages[0].title }}</span>
          </div>

          <div>
            <kobe-tutorial-publish-basic
              :data="stages[0]"
              :index="0"
              @form-change="onFormChange"
              >
            </kobe-tutorial-publish-basic>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-tabs v-model="selectedTab">
          <el-tab-pane
            v-for="(item, index) in stages"
            v-if="stages && index !== 0"
            :label="item.title"
            :name="index.toString()"
            >
            <kobe-tutorial-publish-form
              :data="item"
              :index="index"
              :typeClass="[(index === 1 || index === 2) ? 'tutorial-publish-border': '', 'tutorial-publish-form']"
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
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-tutorial-edit',
  data () {
    return {
      id: this.$route.query.id,
      categoryID: 14,
      stages: null,
      selectedTab: '1',
      form: {
        stages: [
        ],
        exts: [
        ]
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    onFormChange () {
    },
    onSave () {
    },
    getDetail (id) {
      api.GET(config.tutorial.detail, {
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          console.log(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getStages () {
      api.GET(config.tutorial.stages, {
        category_id: this.categoryID
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.stages = response.data.data
          this.stages.forEach((item, index) => {
            let obj = {
              index: index,
              id: item.id,
              type_key: item.type_key,
              properties: []
            }
            this.form.stages.push(obj)
          })
          this.getDetail(this.id)
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
</style>
