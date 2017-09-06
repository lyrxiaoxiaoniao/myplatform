<template>
<div>
    <kobe-table class="border margin" style="margin: 20px 40px;background-color: white;">    
        <div slot="kobe-table-header" class="kobe-table-header" style="border-bottom: 1px solid gainsboro">
           <el-row>
               <el-col :span="16" class="text-v-center" style="color: black;font-size: 13px;line-height: 36px;font-weight: bold">基本信息</el-col>
               <el-col :offset="2" :span="6">
                   <el-button @click="back">返回</el-button>  
                   <el-button type="primary" @click="submitForm('detailForm')" style="margin-left: 10px;">保存</el-button>  
               </el-col>
           </el-row>  
        </div>
        <div slot="kobe-table-content" class="kobe-table">
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
    </kobe-table>
</div>
</template>
<script>
import config from 'src/config/recycle.js'
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
<style scoped>
.border {
  border: 1px solid gainsboro;
  border-radius: 5px;
}
.padding {
  padding: 30px 50px 30px 100px;
}
</style>