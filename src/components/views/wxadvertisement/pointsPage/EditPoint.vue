<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="padding:3rem 3rem 0 0;">
    <el-form-item label="点位名称" prop="spacename">
      <el-input v-model="ruleForm.spacename" placeholder="简单为宜"></el-input>
    </el-form-item>
    <el-form-item label="点位标识" prop="slug">
      <el-input v-model="ruleForm.slug" placeholder="缩写，全英文，64字以内，如：app.weicome.first，用于引用的"></el-input>
    </el-form-item>
    <el-form-item label="点位分类" required>
      <template>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :label="item.type"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
    <el-form-item label="点位标签" prop="tagList" required>
      <el-tag
        :key="tag"
        v-for="tag in dynamicTags"
        :closable="true"
        :close-transition="false"
        @close="handleClose(tag)"
        type="danger"
        style="margin:0 5px"
      >
      {{tag}}
      </el-tag>
      <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
    </el-form-item>
    <el-form-item label="有效控制" required>
      <el-switch
        v-model="ruleForm.state"
        on-text="开"
        off-text="关">
      </el-switch>
    </el-form-item>
    <el-form-item label="点位说明" prop="description">
      <el-input type="textarea" v-model="ruleForm.description" placeholder="分类描述50字以内"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存修改内容</el-button>
      <el-button type="primary" @click="resetForm()">返回管理首页</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  export default {
    data () {
      return {
        id: this.$route.query.id,
        activeName2: 'first',
        options: [],
        value: '',
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        ruleForm: {
          description: '',
          slug: '',
          spacename: '',
          typename: null,
          value: '',
          tagList: []
        },
        rules: {
          spacename: [
            { required: true, message: '请输入点位名称', trigger: 'blur' }
          ],
          slug: [
            { required: true, message: '请输入点位标识', trigger: 'blur' }
          ],
          typename: [
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
      changeBoolean (state) {
        if (state) {
          return true
        } else {
          return false
        }
      },
      changeState (state) {
        if (state) {
          return 1
        } else {
          return 0
        }
      },
      handleClose (tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm () {
        let inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      getData () {
        const id = this.$route.query.id
        if (this.options) {
          api.GET(config.showAdvPointAPI, {id: id})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000' && response.data.data) {
              const res = response.data.data
              this.ruleForm = res
              this.ruleForm.state = this.changeBoolean(res.state)
              this.value = this.transformTypeid(this.ruleForm.typename)
              this.dynamicTags = res.tagList.split(',')
            }
          })
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            obj.typeId = Number(this.value)
            obj.description = this.ruleForm.description
            obj.slug = this.ruleForm.slug
            obj.spacename = this.ruleForm.spacename
            obj.tagList = this.dynamicTags.join(',')
            obj.state = this.changeState(this.ruleForm.state)
            obj.id = this.id
            api.POST(config.editAdvePointAPI, obj)
              .then(response => {
                if (response.status !== 200) {
                  this.error = response.statusText
                  return
                }
                if (response.data.errcode === '0000') {
                  this.$message('修改内容保存成功！！！')
                }
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm () {
        this.$router.push({
          path: 'advpoint'
        })
      },
      getTypeId () {
        api.GET(config.getTypeAdvPointAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.options = this.transformNumber(response.data.data)
            this.getData()
          }
        })
      },
      transformNumber (res) {
        res.forEach(v => {
          v.id = String(v.id)
        })
        return res
      },
      transformTypeid (res) {
        if (this.options) {
          this.options.forEach(v => {
            if (v.type === res) {
              res = v.id
            }
          })
          return res
        }
      }
    },
    mounted () {
      this.getTypeId()
    }
  }
</script>
<style scoped>
	
</style>