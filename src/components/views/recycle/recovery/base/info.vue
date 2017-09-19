<template>
	<div class="lh-container">
		<div class="lh-top">
      <div class="lh-header">
        <div>{{selected.name}}</div>
        <div>
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary">修改</el-button>
        </div>
      </div>
      <div class="lh-form">
        <el-form :model="selected" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="单位名称">
                <el-input v-model="selected.name" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="固定电话">
                <el-input v-model="selected.mobile" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="详细地址">
                <el-input v-model="selected.detailAddress" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="12">
              <el-form-item label="业务类型">
                <el-select @change="selectedType" v-model="selected.businessType" class="fullwidth" placeholder="请选择业务类型">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="负责人">
                <el-input v-model="selected.dutyName" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="负责人电话">
                <el-input v-model="selected.phone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="8">
              <el-form-item label="组织机构代码">
                <el-input v-model="selected.orgCode" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>  
            <el-col :span="24">
              <el-form-item label="企业说明">
                <el-input v-model="selected.memo" type="textarea" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="营业执照">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="selected.license" :src="selected.license" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="el-upload__tip" slot="tip">上传有效、清晰的营业执照图片（最多上传1张，每张最大10M）</div>
              </el-upload>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
		<div class="lh-bottom">
      <street-table
        v-if="isLine"
        :companyId="id">
      </street-table>
      <!-- <line-table
        v-else
        :companyId="id">
      </line-table> -->
    </div>
	</div>      
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import streetTable from '../addTable/street'
// import lineTable from '../addTable/line'
export default {
  props: ['id'],
  data () {
    return {
      // id: this.$route.query.id,
      uploadURL: config.serverURI + config.uploadFilesAPI,
      selected: {
        license: '',
        memo: '',
        orgCode: '',
        phone: '',
        dutyName: '',
        businessType: null,
        detailAddress: '',
        mobile: '',
        name: ''
      },
      options: [{
        value: 1,
        label: '大件垃圾'
      }, {
        value: 2,
        label: '餐厨垃圾'
      }],
      isLine: true
    }
  },
  components: {
    streetTable
  },
  methods: {
    selectedType (val) {
      if (val === 1) {
        this.isLine = true
      } else if (val === 2) {
        this.isLine = false
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      this.selected.license = res.data[0]
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    getData () {
      api.GET(config.recovery.show, {id: this.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.selected = response.data.data
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.lh-container {
    // padding: 1rem 2rem;
    .lh-top {
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 100%;
      background-color: #fff;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
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