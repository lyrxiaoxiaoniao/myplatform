<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
    <el-form-item label="点位名称" prop="spacename">
      <el-input v-model="ruleForm.spacename" placeholder="简单为宜"></el-input>
    </el-form-item>
    <el-form-item label="点位标识" prop="slug">
      <el-input v-model="ruleForm.slug" placeholder="缩写，全英文，64字以内，如：app.weicome.first，用于引用的"></el-input>
    </el-form-item>
    <el-form-item label="点位类型" prop="typeId" required>
      <el-radio-group v-model="ruleForm.typeId">
        <el-radio label="1">图片链接</el-radio>
        <el-radio label="2">文字链接</el-radio>
        <el-radio label="3">视频链接</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="具体描述" prop="description">
      <el-input type="textarea" v-model="ruleForm.description" placeholder="分类描述50字以内"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        ruleForm: {
          description: '',
          slug: '',
          spacename: '',
          typeId: null
        },
        rules: {
          spacename: [
            { required: true, message: '请输入点位名称', trigger: 'blur' }
          ],
          slug: [
            { required: true, message: '请输入点位标识', trigger: 'change' }
          ],
          typeId: [
            { required: true, message: '请选择一个点位类型', trigger: 'change' }
          ],
          description: [
            { required: false, message: '分类描述50字以内', trigger: 'blur' },
            { min: 0, max: 50, message: '分类描述长度在50字以内', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // console.log(this.ruleForm)
            var obj = {}
            obj.description = this.ruleForm.description
            obj.slug = this.ruleForm.slug
            obj.spacename = this.ruleForm.spacename
            obj.type_id = Number(this.ruleForm.typeId)
            console.log(obj)
            api.POST(config.addAdvPointAPI, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                console.log(response)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style scoped>
	
</style>