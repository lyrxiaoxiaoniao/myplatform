<template>
  <div class="activity-add-component">
    <el-tabs class="activity-add-tabs" v-model="selectedTab" type="card">
      <el-tab-pane
        label="基本信息"
        name="-1"
        >
        <el-form
          :model="basicForm"
          label-width="120px"
          label-position="left">
          <el-form-item label="活动名称" required>
            <el-input v-model="basicForm.title"></el-input>
          </el-form-item>
          <el-form-item label="举办时间" required>
            <el-col :span="11">
              <el-date-picker
                type="datetime"
                placeholder="开始时间"
                v-model="basicForm.start_date"
                >
              </el-date-picker>
            </el-col>
            <el-col :span="2">
              ---
            </el-col>
            <el-col :span="11">
              <el-date-picker
                type="datetime"
                placeholder="结束时间"
                v-model="basicForm.end_date"
                >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="活动地址">
            <el-input v-model="basicForm.address">
              <el-button slot="append" class="fa fa-map-marker"></el-button>
            </el-input>
          </el-form-item>
          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <el-form-item label="分类" required>
                <el-select
                  v-if="categories"
                  v-model="basicForm.catgr_id"
                  @change="selectCategoty"
                  placeholder="活动分类">
                  <el-option
                    v-for="item in categories"
                    :label="item.title"
                    :value="item.category_id"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-form-item label="报名">
              <el-switch
                v-model="hasSign"
                on-text="开启"
                off-text="关闭"
                on-color="#13ce66"
                off-color="#ff4949"
                >
              </el-switch>
            </el-form-item>
          </el-row>
          <el-form-item v-if="hasSign" label="报名时间">
            <el-col :span="11">
              <el-date-picker
                type="datetime"
                placeholder="报名开始时间"
                v-model="basicForm.start_sign"
                >
              </el-date-picker>
            </el-col>
            <el-col :span="2">
              ---
            </el-col>
            <el-col :span="11">
              <el-date-picker
                type="datetime"
                placeholder="报名结束时间"
                v-model="basicForm.end_sign"
                >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="宣传海报">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="活动内容">
            <vue-html5-editor :content="basicForm.brief" @change="onEditorChange"></vue-html5-editor>
          </el-form-item>
          <el-form-item label="标签">
            <kobe-tag-group></kobe-tag-group>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="active"
              on-text="开启"
              off-text="关闭"
              on-color="#13ce66"
              off-color="#ff4949"
              @change="onActiveSwitch"
              >
            </el-switch>
          </el-form-item>
          <el-form-item label="活动附件">
            <el-button>点击上传</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        v-if="response"
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
    <el-checkbox
      v-if="selectedTab === '-1'"
      :disabled="basicForm.catgr_id === ''"
      @change="togglteExtraProperty">
      附加属性
    </el-checkbox>
    <div
      v-if="selectedTab === '-1' && showExtraInput"
      class="activity-extra-property"
      >
      <el-form :model="extraForm" ref="extraForm" label-width="120px">
      </el-form>
      <el-row type="flex"
        >
        <el-col :span="6">
          <el-input
            v-model="extraProperty"
            placeholder="请输入属性名称"
            @keyup.enter.native="addExtraProperty">
            <el-button slot="append" @click="addExtraProperty">添加</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="activity-action-container">
      <el-row type="flex" justify="center">
        <el-button @click="onCreateActivity">提交表单</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-activity-add',
  data () {
    return {
      selectedTab: '-1',
      showExtraInput: false,
      error: null,
      response: null,
      categories: [],
      active: true,
      extraProperty: '',
      hasSign: false,
      form: {
        stages: [
        ],
        exts: [
        ]
      },
      basicForm: {
        title: '',
        address: '',
        start_date: '',
        end_date: '',
        start_sign: '',
        end_sign: '',
        number: '',
        catgr_id: '',
        active: '',
        brief: ''
      },
      extraForm: {
      }
    }
  },
  methods: {
    togglteExtraProperty () {
      this.showExtraInput = !this.showExtraInput
      if (this.showExtraInput) {
        this.getExtraPros()
      }
    },
    addExtraProperty () {
      api.POST(config.activity.extraPropertyAdd, {
        label: this.extraProperty,
        category_id: this.basicForm.catgr_id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.extraProperty = ''
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getExtraPros () {
      api.GET(config.activity.extraProperty, {
        category_id: this.basicForm.catgr_id
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onCreateActivity () {
      this.basicForm.start_date = this.toTimestamp(this.basicForm.start_date)
      this.basicForm.end_date = this.toTimestamp(this.basicForm.end_date)

      const data = {
        ...this.form,
        ...this.basicForm
      }
      api.POST(config.activity.add, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '创建活动成功'
          })
          this.$router.push({
            path: '/admin/activity'
          })
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onActiveSwitch () {
      if (this.active) {
        this.basicForm.active = 1
      } else {
        this.basicForm.active = 0
      }
    },
    toTimestamp (date) {
      if (!date) return ''
      return new Date(date).getTime()
    },
    onEditorChange (data) {
      this.basicForm.brief = data
    },
    onFormChange (value) {
      console.log('on form change')
      console.log(value)
      this.form.stages[value.index] = value
    },
    selectCategoty (value) {
      api.GET(config.activity.activitySelectCatlg, {
        category_id: value
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getCategories () {
      api.GET(config.activity.typeList)
      .then(response => {
        if (response.data.errcode === '0000') {
          response.data.data.data.forEach(item => {
            let object = {
              title: item.title,
              category_id: item.id
            }
            this.categories.push(object)
          })
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getCategories()
  }
}
</script>

<style>
.activity-add-component {
  margin-top: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  padding-bottom: 2rem;
}
.activity-add-component .el-form-item {
  margin-bottom: 1.5rem;
}
.activity-add-tabs .el-tab-pane {
  max-width: 50rem;
}
.activity-action-container {
  margin-top: 1rem;
}
</style>
