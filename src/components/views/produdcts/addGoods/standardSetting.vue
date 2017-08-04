<template>
    <div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品规格">
          <div style="text-align:right;margin-bottom:10px;"><el-button @click="addSetting" class="button-new-tag">添加规格项目</el-button></div>
            <el-table
                :data="form.tableData"
                border
                style="width: 100%">
                <el-table-column prop="display_name" label="规格名"></el-table-column>
                <el-table-column prop="display_name" label="规格属性"></el-table-column>
                <el-table-column prop="display_name" label="价格"></el-table-column>
                <el-table-column prop="display_name" label="库存"></el-table-column>
                <el-table-column prop="display_name" label="商家编码"></el-table-column>
                <el-table-column prop="display_name" label="销量"></el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item label="总库存">
            <template>
                <el-input-number v-model="form.num1" :min="1"></el-input-number>
            </template>
        </el-form-item>
        <el-form-item label="商家编码">
            <el-input v-model="form.num"></el-input>
        </el-form-item>
      </el-form>
      <el-dialog title="添加规格项目" v-model="showDialog">
        <el-form :model="selected" label-width="120px">
          <el-form-item label="规格" prop="name">
              <el-input placeholder="规格:比如内存大小/颜色/等等" v-model="selected.name"></el-input>
          </el-form-item>
          <el-form-item label="规格属性">
              <el-input placeholder="示例:红色" v-model="selected.name"></el-input>
          </el-form-item>
          <el-form-item label="商家编码">
              <el-input placeholder="示例:DSG99-0890432423" v-model="selected.name"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item label="价格">
                  <el-input placeholder="示例:DSG99-0890432423" v-model="selected.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <span>积分</span>
            </el-col>
            <el-col :span="11">
              <el-form-item label="库存">
                  <el-input placeholder="示例:DSG99-0890432423" v-model="selected.name"></el-input>
              </el-form-item>
             </el-col>
          </el-row>
          <el-form-item label="规格图片">
              <el-upload
                class="avatar-uploader"
                :action="uploadURL"
                :show-file-list="false"
                :on-success="iconHandleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="selected.icon" :src="selected.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取消</el-button>
            <el-button>保存</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        num1: '',
        value: '',
        tableData: []
      },
      list: {
        value: ''
      },
      showDialog: false,
      selected: {},
      // uploadURL: config.serverURI + config.uploadFilesAPI,
      obj: []
    }
  },
  methods: {
    addSetting () {
      this.showDialog = true
    },
    iconHandleAvatarSuccess(res, file) {
      this.icon = window.URL.createObjectURL(file.raw)
      this.selected.icon = res.data[0]
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

