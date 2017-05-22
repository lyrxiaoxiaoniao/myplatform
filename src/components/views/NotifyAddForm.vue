<template>
  <div class="sc-notify-form-add">
    <div class="sc-notify-form-header">
      <el-steps :space="300" :active="active">
        <el-step title="配置通知"></el-step>
        <el-step title="配置模板消息"></el-step>
      </el-steps>
    </div>
    <div class="sc-notify-form-content" v-if="templates">
      <el-form 
        class="notify-form" 
        ref="notifyForm" 
        :model="notifyForm" 
        label-width="120px"
        v-if="active === 1"
        >
        <el-form-item label="通知名称" required>
          <el-input class="notify-title" v-model="notifyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" required>
          <el-select v-model="notifyForm.templateId">
            <el-option 
              class="notify-options"
              v-for="template in templates" 
              :label="template.name"
              :value="template.templateId"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户组" required>
          <el-select v-model="notifyForm.tags">
          </el-select>
        </el-form-item>
        <el-form-item label="通知描述" required>
          <el-input class="notify-description" type="textarea" v-model="notifyForm.description"></el-input>
        </el-form-item>
      </el-form>
      <ActiveForm
        :form="notifyForm"
        v-if="active === 2 && activeFormData"
        >
      </ActiveForm>
    </div>
    <div class="sc-notify-form-footer">
      <div class="notify-footer-stepOne" v-if="active === 1">
        <el-button @click="stepNext" type="primary">下一步</el-button>
      </div>
      <div class="notify-footer-stepTwo" v-if="active === 2">
        <el-button @click="saveForm" type="primary">保存</el-button>
        <el-button @click="sendForm" type="primary">立即发送</el-button>
        <el-button @click="cancelForm" type="primary">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'
import ActiveForm from 'src/components/views/ActiveForm'

export default {
  name: '',
  components: {
    ActiveForm
  },
  data () {
    return {
      response: null,
      error: null,
      templates: null,
      activeFormData: null,
      templateTypeURL: config.templateTypeAPI,
      templateGetURL: config.templateGetAPI,
      templateSaveURL: config.templateSaveAPI,
      active: 1,
      notifyForm: {
        name: '',
        templateId: '',
        tags: '',
        description: '',
        url: ''
      }
    }
  },
  methods: {
    saveForm () {
      api.POST(this.templateSaveURL, this.notifyForm)
        .then(response => {
          console.log('save data')
          console.log(response.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    sendForm () {
    },
    cancelForm () {
      this.active = 1
    },
    stepNext () {
      if (this.notifyForm.templateId === '') {
        this.$message('请选择模板类型')
        return
      }
      api.GET(this.templateGetURL, {
        templateId: this.notifyForm.templateId
      })
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          this.$message.error(this.error)
          return
        }
        if (response.data.errcode === '0000') {
          this.activeFormData = response.data.data
          this.$store.commit('SET_NOTIFY_ACTIVE_FORM', this.activeFormData)
          console.log(this.activeFormData)
          this.active = 2
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getTemplateTypes () {
      api.GET(this.templateTypeURL)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            this.$message.error(this.error)
            return
          }
          if (response.data.errcode === '0000') {
            this.templates = response.data.data
            console.log(this.templates)
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
    }
  },
  mounted () {
    this.getTemplateTypes()
  }
}
</script>

<style scoped>
.sc-notify-form-header {
  margin-left: 2rem;
  margin-top: 20px;
  border-bottom: 1px solid lightgray;
}
.sc-notify-form-content {
  margin-top: 2rem;
  margin-left: 2rem;
}
.notify-title {
  width: 300px;
}
.notify-description {
  width: 300px;
}
.notify-options {
  width: 300px;
}
.sc-notify-form-footer {
  margin-left: 8.5rem;
  margin-top: 2rem;
}
</style>
