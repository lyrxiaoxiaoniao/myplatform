<template>
  <div class="userAddForm">
    <el-form :model="dataForm" :rules="rules" ref="dataForm"
             labelWidth="120px" class="addUser">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="dataForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email"></el-input>
      </el-form-item>
      <el-form-item label='真实姓名' prop="realname">
        <el-input v-model="dataForm.realname"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="dataForm.pid"></el-input>
      </el-form-item>
      <el-form-item label="身份证正面照">
        <el-upload
          class="pid-front-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="身份证反面照">
        <el-upload
          class="pid-back-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="移动/固定电话">
        <el-input v-model="dataForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="dataForm.address"></el-input>
      </el-form-item>
      <el-form-item label="紧急联系人信息">
        <el-input v-model="dataForm.emergencyContact"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="dataForm.userType" placeholder="请选择">
          <el-option label="游客" value="visitor"></el-option>
          <el-option label="投资客户" value="customer"></el-option>
          <el-option label="管理型客户" value="manager"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="dataForm.info"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')">创建用户</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
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
          realname: '',
          pid: '',
          phont: '',
          address: '',
          emergencyContact: '',
          userType: '',
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
            {required: true, message: '请输入固定/移动电话号码', trigger: 'blur'}
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
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
