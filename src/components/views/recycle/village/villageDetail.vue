<template>
  <div class="lh-container">
    <div class="lh-top">
      <div class="lh-header">
        <div>基本信息</div>
        <div>
          <el-button @click="back">返回</el-button>  
          <el-button type="primary" @click="submitForm('detailForm')" style="margin-left: 10px;">保存</el-button>
        </div>
      </div>
      <div class="lh-form">
        <el-form  :model="detailForm" :rules="rules" ref="detailForm"  class="demo-ruleForm padding" :label-position="labelPosition" label-width="100px">
              <el-row>
                <el-col :span="10"> 
                    <el-form-item label="小区名称" prop="name">
                      <el-input v-model="detailForm.name" placeholder="请输入小区名称"></el-input>
                    </el-form-item>
                </el-col>
            
                <el-col :offset="4" :span="10">      
                  <el-form-item label="固定电话" prop="phone">
                    <el-input v-model="detailForm.phone" placeholder="请输入电话"></el-input>
                  </el-form-item> 
                 </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"> 
                    <el-form-item label="负责人" prop="duty_name">
                      <el-input v-model="detailForm.duty_name" placeholder="请输入负责人姓名"></el-input>
                    </el-form-item>
                </el-col>
             
                <el-col :offset="4" :span="10">      
                  <el-form-item label="联系方式" prop="mobile">
                    <el-input v-model="detailForm.mobile" placeholder="请输入负责人联系电话"></el-input>
                  </el-form-item> 
                 </el-col>
              </el-row>
            
        <el-row>
                <el-col :span="10"> 
                    <el-form-item label="所属街道" prop="region_id">
                       <el-cascader
                          :options="cascaderData"
                          :props="props"
                          :change-on-select="true"
                          v-model="stepsSelection"
                          @change="handleChange"
                          style="width:100%;">
                      </el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"> 
                    <el-form-item label="小区说明" prop="memo">
                      <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="detailForm.memo">
                      </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
          </el-form>
      </div>
    </div>  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    var phone = (rule, value, callback) => {
      let phone = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
      if (!value) {
        return callback(new Error('号码不能为空'))
      } else if (!phone.test(value)) {
        callback(new Error('请输入正确号码'))
      } else {
        callback()
      }
    }
    return {
      cascaderData: [],
      labelPosition: 'left',
      detailForm: {
        name: '',
        phone: '',
        duty_name: '',
        mobile: '',
        region_id: '',
        detail_address: '',
        memo: '',
        id: this.$route.query.id
      },
      rules: {
        phone: [
          { required: true, validator: phone, trigger: 'blur' }
        ],
        duty_name: [
          { required: true, message: '请输入小区负责人', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: phone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    back () {
      this.$router.push('/admin/recycle/village/index')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.village.update, this.detailForm)
          .then(response => {
            this.onSuccess('修改成功！')
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请填写完整修改信息后再提交。',
            type: 'success'
          })
        }
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    getForm () {
      api.GET(config.village.indexOne, {id: this.$route.query.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.detailForm = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getForm()
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    padding: 1rem 2rem;
    .lh-top {
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 100%;
      background-color: #fff;
      padding-bottom: 1rem;
      .lh-header {
        padding: 0 2rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid lightgray;
        div:nth-of-type(1){
          font-size: 16px;
        }
      }
      .lh-form {
        margin: 1rem 2rem;
      }
    }
    .lh-bottom {
      margin-top: 1rem;
      border-radius: 5px;
      border: 1px solid lightgray;
      width: 100%;
      background-color: #fff;
      padding-bottom: 1rem;
      .lh-header {
        padding: 0 2rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid lightgray;
        div:nth-of-type(1){
          font-size: 16px;
        }
      }
    }
}
</style>