<template>
  <div class="userAddForm">
    <el-row type="flex">
      <el-col :span="10" :offset="5">
        <el-form :model="dataForm" :rules="rules" ref="dataForm"
                 labelWidth="120px" class="addUser" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="dataForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="dataForm.password" type="password"></el-input>
          </el-form-item>
          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="dataForm.nickname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="dataForm.email" type="email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <el-form-item label="移动/固定电话" prop="phone">
                <el-input v-model="dataForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="用户类型" prop="userType">
                <el-select v-model="dataForm.userType" placeholder="请选择">
                  <el-option label="游客" value="visitor"></el-option>
                  <el-option label="投资客户" value="customer"></el-option>
                  <el-option label="管理型客户" value="manager"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="formGap"></div>
          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <el-form-item label='真实姓名' prop="realName">
                <el-input v-model="dataForm.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="身份证号">
                <el-input v-model="dataForm.pid"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="11">
              <el-form-item label="联系地址">
                <el-input v-model="dataForm.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="紧急联系人信息">
                <el-input v-model="dataForm.emergencyContact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="备注">
                <el-input v-model="dataForm.info"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label="身份证正面照">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证反面照">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="用户头像">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="space-around">
              <el-button type="primary" @click="submitForm('dataForm')">创建用户</el-button>
              <el-button @click="resetForm('dataForm')">重置</el-button>
            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'sc-user-add-form',
    data () {
      return {
        dataForm: {
          username: '',
          password: '',
          nickname: '',
          email: '',
          phone: '',
          userType: '',
          realName: '',
          pid: '',
          address: '',
          emergencyContact: '',
          info: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '请输入用户昵称', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入移动/固定电话', trigger: 'blur'}
          ],
          userType: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('创建成功')
          } else {
            console.log('出现错误')
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
<style>

  .userAddForm {
    border-top: 1px solid lightgray;
    padding-top: 4rem;
    margin-top: 2rem;
  }

  .formGap {

  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
