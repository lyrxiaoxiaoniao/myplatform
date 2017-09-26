<template>
  <kobe-table>
    <div slot="kobe-table-header" style="border-bottom:none" class="kobe-table-header"> 
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <el-card class="sc-cityservice-wrap">
        <div slot="header">
          <span style="font-size:18px">同城配送功能</span>
          <el-switch @change="statusChange" style="float:right" v-model="switched" on-text="开" off-text="关"></el-switch>
        </div>
        <el-form label-width="100px">
          <el-form-item label="配送范围介绍">
            <el-input :disabled="disable" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="起送金额">
            <el-input :disabled="disable" placeholder="0"></el-input>
          </el-form-item>
          <el-form-item label="配送费用">
            <el-input :disabled="disable" placeholder="0"></el-input>
          </el-form-item>
          <el-form-item label="配送范围图片">
            <el-upload :disabled="disable"
              class="avatar-uploader"
              action="uploadUrl"
              :show-file-list="false"
              :on-success="onUploadSuccess"
              :on-remove="onRemovePic"
              :on-error="onUploadError"
              :before-upload="beforeAvatarUpload"
              >
              <img v-if="imageURL" :src="imageURL" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="disable" @click="editSubmit('dataForm')">保 存</el-button>
          </el-form-item>
        </el-form> 
      </el-card>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">  
    </div>
  </kobe-table>
</template>

<script>
export default {
  name: 'sc-ordersetting-cityservice',
  data () {
    return {
      switched: true,
      disable: false
    }
  },
  methods: {
    statusChange () {
      if (this.switched) {
        this.disable = false
      } else {
        this.disable = true
      }
    },
    editSubmit () {
      // 获取表格数据
      this.updatePost()
    }
  }
}
</script>

<style scoped>

</style>
