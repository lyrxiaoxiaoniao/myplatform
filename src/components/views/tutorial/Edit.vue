<template>
  <div class="sc-tutorial-edit">
    <el-row type="flex">
      <el-button @click="back">返回列表</el-button>
      <el-button>课程预览</el-button>
      <el-button @click="onSbumit(0, '保存成功')">保存草稿</el-button>
      <el-button @click="onSubmit(1, '修改活动成功')">修改发布</el-button>
    </el-row>

    <el-row type="flex" class="sc-tutorial-publish-content">
      <el-col :span="6">
        <el-card class="box-card" v-if="stages">
          <div slot="header" class="clearfix">
            <span class="card-title">{{ stages[0].title }}</span>
          </div>

          <div>
            <kobe-tutorial-publish-basic
              v-if="stages[0].properties"
              :data="stages[0]"
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
      response: null,
      selectedTab: '1',
      basicForm: {
      },
      form: {
        stages: [
        ]
      }
    }
  },
  methods: {
    onPrevTab () {
      const current = Number(this.selectedTab)
      this.selectedTab = String(current - 1)
    },
    onNextTab () {
      const current = Number(this.selectedTab)
      this.selectedTab = String(current + 1)
    },
    back () {
      this.$router.go(-1)
    },
    onFormChange () {
    },
    onSubmit (active, msg) {
      const data = {
        catgr_id: this.categoryID,
        active: active,
        ...this.form
      }
      api.POST(config.tutorial.update, data)
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
    },
    showDetail (data) {
      let attributes = []
      data.category.stages.forEach(stage => {
        if (stage.attributes.length) {
          stage.attributes.forEach(attribute => {
            attributes.push(attribute)
          })
        }
      })
      this.response.forEach(stage => {
        if (stage.properties.length) {
          stage.properties.forEach(property => {
            const typeKey = property.type_key
            attributes.forEach(attribute => {
              if (typeKey === attribute.attr_key) {
                property.values.push({
                  key: attribute.attr_key,
                  value: attribute.attr_value
                })
              }
            })
          })
        }
      })
      this.stages = this.response
    },
    getDetail (id) {
      api.GET(config.tutorial.detail, {
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.showDetail(response.data.data)
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
          response.data.data.forEach((item, index) => {
            let obj = {
              index: index,
              id: item.id,
              type_key: item.type_key,
              properties: []
            }
            this.form.stages.push(obj)
            if (item.properties.length) {
              item.properties.forEach(property => {
                property.values = []
              })
            }
          })
          this.response = response.data.data
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
.sc-tutorial-edit {
  margin-top: 1rem;
  margin-left: 1rem;
}
</style>
