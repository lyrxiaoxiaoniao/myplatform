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
          <el-form-item label="培训名称" required>
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
          <el-form-item label="培训地址">
            <el-input v-model="basicForm.address">
              <el-button @click="openMap" slot="append" class="fa fa-map-marker"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="宣传海报">
            <el-upload
              class="cover-upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload">
              <img v-if="coverURL" :src="coverURL" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="培训内容">
            <vue-html5-editor :content="basicForm.brief" @change="onEditorChange"></vue-html5-editor>
          </el-form-item>
          <el-form-item label="标签">
            <kobe-tag-group
              >
            </kobe-tag-group>
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
          <el-form-item label="培训附件">
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
      @change="togglteExtraProperty">
      附加属性
    </el-checkbox>
    <div
      v-if="selectedTab === '-1' && showExtraInput"
      class="activity-extra-property"
      >
      <el-form
        :model="extraForm"
        ref="extraForm"
        class="activity-extraForm"
        label-position="left"
        label-width="120px">
        <el-row type="flex">
          <el-col :span="8">
            <el-select
              v-if="extraProperties"
              placeholder="已有的附加属性"
              multiple
              @change="onSelectExtraProperties"
              @remove-tag="onRemoveExtraProperty"
              v-model="chosenProperties"
              >
              <el-option
                v-for="item in extraProperties"
                :label="item.label"
                :value="item"
                >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="extraProperty"
              placeholder="请输入属性名称"
              @keyup.enter.native="addExtraProperty">
              <el-button slot="append" @click="addExtraProperty">添加</el-button>
            </el-input>
          </el-col>
        </el-row>

        <template
          class="active-extra-property"
          v-for="item,index in activeProperties"
          >
          <el-row type="flex">
            <el-col :span="12">
              <el-form-item
                :label="item.label">
                <el-input
                  @blur="addExtraPropertyValue(item)"
                  @keyup.enter.native="addExtraPropertyValue(item)"
                  v-model="item.value">
                  <el-button @click="deleteExtraPro(index, item)" slot="append" icon="delete2"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </div>
    <div class="activity-action-container">
      <el-row type="flex" justify="center">
        <el-button
          v-if="selectedTab === '-1'"
          @click="toTrainingList">
          培训列表
        </el-button>
        <el-button @click="onCreateActivity">提交表单</el-button>
      </el-row>
    </div>
    <kobe-map-dialog
      :isShow="showMap"
      @close="closeMap"
      @confirm="onMapConfirm"
      >
    </kobe-map-dialog>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  name: 'sc-training-publish',
  data () {
    return {
      // activity category id for training
      categoryTrainingID: 12,
      coverURL: '',
      selectedTab: '-1',
      showExtraInput: false,
      error: null,
      response: null,
      active: true,
      showMap: false,
      extraProperty: '',
      extraProperties: null,
      chosenProperties: [],
      activeProperties: [],
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
        number: '',
        catgr_id: this.categoryTrainingID,
        active: '',
        brief: ''
      },
      extraForm: {
      },
      addedExtraProperties: []
    }
  },
  methods: {
    openMap () {
      this.showMap = true
    },
    closeMap () {
      this.showMap = false
    },
    onMapConfirm () {
      // TODO
      this.showMap = false
    },
    toTrainingList () {
      this.$router.push({
        path: '/admin/training/index'
      })
    },
    handleCoverSuccess () {
    },
    beforeCoverUpload () {
    },
    deleteExtraPro (index, item) {
      let deleteItem
      this.chosenProperties.forEach((item, index) => {
        if (item.id === item.key_id) {
          deleteItem = index
        }
      })
      this.chosenProperties.splice(deleteItem, 1)
      this.activeProperties.splice(index, 1)
    },
    onRemoveExtraProperty (data) {
      let index
      this.activeProperties.forEach(item => {
        if (item.key_id === data.value.id) {
          index = this.activeProperties.indexOf(item)
        }
      })
      this.activeProperties.splice(index, 1)
    },
    addExtraPropertyValue(item) {
      api.POST(config.activity.extraPropertyValueAdd, {
        key_id: item.key_id,
        label: item.label
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          item.values = []
          item.values.push(response.data.data.id)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSelectExtraProperties (value) {
      const equal = value.length + this.addedExtraProperties.length === this.activeProperties.length
      if (equal) return
      if (!value || !value[value.length - 1]) return
      if (!this.activeProperties) {
        this.activeProperties = []
      }

      const item = value[value.length - 1]
      let obj = {
        activity_id: this.basicForm.catgr_id,
        key_id: item.id,
        label: item.label,
        value: '',
        values: [
        ]
      }

      this.activeProperties.push(obj)
    },
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
          this.addedExtraProperties.push(1)  // hacks
          let obj = {
            activity_id: this.basicForm.catgr_id,
            key_id: response.data.data.id,
            label: this.extraProperty,
            value: '',
            values: [
            ]
          }
          if (this.activeProperties) {
            this.activeProperties.push(obj)
          } else {
            this.activeProperties = [obj]
          }
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
        if (response.data.errcode === '0000') {
          this.extraProperties = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onCreateActivity () {
      this.basicForm.start_date = this.toTimestamp(this.basicForm.start_date)
      this.basicForm.end_date = this.toTimestamp(this.basicForm.end_date)

      this.form.exts = this.activeProperties
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
      this.form.stages[value.index] = value
    },
    getTrainingSteps () {
      api.GET(config.activity.activitySelectCatlg, {
        category_id: this.categoryTrainingID
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getTrainingSteps()
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
.cover-upload .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-upload .el-upload:hover {
  border-color: #20a0ff;
}
.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.cover {
  width: 178px;
  height: 178px;
  display: block;
}
.activity-extraForm .el-select {
  width: 20rem;
}
</style>
