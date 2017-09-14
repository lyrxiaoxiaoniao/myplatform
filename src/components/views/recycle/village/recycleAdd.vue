<template>
  <div class="lh-container">
    <div class="lh-top">
      <div class="lh-header">
        <div>基本信息</div>
        <div>
          <el-button @click="back">返回</el-button>  
          <el-button type="primary" @click="submitForm('form')" style="margin-left: 10px;">保存</el-button> 
        </div>
      </div>
      <div class="lh-form">
        <el-form :model="form" :rules="rules" ref="form"  class="demo-ruleForm" :label-position="labelPosition" label-width="100px">
              <el-row>
                <el-col :span="10"> 
                    <el-form-item label="小区名称" prop="name">
                      <el-input v-model="form.name" placeholder="请输入小区名称"></el-input>
                    </el-form-item>
                </el-col>
            
                <el-col :offset="4" :span="10">      
                  <el-form-item label="固定电话" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
                  </el-form-item> 
                 </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"> 
                    <el-form-item label="负责人" prop="duty_name">
                      <el-input v-model="form.duty_name" placeholder="请输入负责人姓名"></el-input>
                    </el-form-item>
                </el-col>
             
                <el-col :offset="4" :span="10">     
                  <el-form-item label="联系方式" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入负责人联系电话"></el-input>
                  </el-form-item> 
                 </el-col>
              </el-row>       
            <el-row>
              <el-col :span="10"> 
                <el-form-item label="所属街道">
                  <el-cascader
                      :options="cascaderData"
                      :props="props"
                      :change-on-select="true"
                      v-model="region_id"
                      @change="handleChange"
                      style="width:100%;">
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="24"> 
                    <el-form-item label="小区说明">
                      <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="form.memo">
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
      selectedOptions: [],
      labelPosition: 'left',
      form: {
        name: '',
        phone: '',
        duty_name: '',
        mobile: '',
        region_id: '',
        detail_address: '',
        memo: ''
      },
      cascaderData: [],
      props: {
        children: 'children',
        label: 'title',
        value: 'id'
      },
      rules: {
        name: [
          { required: true, message: '请输入小区名', trigger: 'blur' }
        ],
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
    getTree () {
      api.GET(config.village.streetTree)
      .then(response => {
        var newData = response.data.data[0].children[0].children
        this.iteration(newData)
        this.data = newData
        this.cascaderData = newData
        console.log(this.cascaderData)
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    iteration (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] instanceof Object) {
            if (obj[key].length === 0) {
              obj[key] = null
            } else {
              this.iteration(obj[key])
            }
          }
        }
      }
    },
    back () {
      this.$router.push('/admin/recycle/village/index')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.POST(config.village.create, this.form)
          .then(response => {
            this.onSuccess('添加成功！')
          })
          .catch(error => {
            this.$message.error(error)
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请填写完整信息后再提交。',
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
    }
  },
  mounted () {
    this.getTree()
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