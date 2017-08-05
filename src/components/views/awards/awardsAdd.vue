<template>
  <div class="ap-container">
    <div>
      <el-button @click="goBack" type="primary">返回列表</el-button>  
      <el-button type="primary">商品预览</el-button>
      <el-button type="primary">提交发布</el-button> 
    </div>
    <div class="ap-content">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="ap-content-left">
            <h4>头图及属性</h4>
            <div class="left-img">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadURL"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" style="padding:0 10px;">
                <el-form-item label="商品类型">
                    <el-select v-model="ruleForm.region" placeholder="商品类型" style="width:100%;">
                    <el-option label="实物商品（物流发货）" value="1"></el-option>
                    <el-option label="虚拟商品（无须物流）" value="2"></el-option>
                    <el-option label="电子卡券（无须物流）" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品摘要">
                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="ap-content-right">
            <el-form :model="formData" ref="formData" label-width="80px" class="ap-right-form">
              <el-row class="el-row-class">
                <el-col :span="24">
                  <el-form-item label="分类">
                    <el-cascader
                      style="width:100%;"
                      :options="options"
                      change-on-select
                      :props="props"
                      @change="handleChange"
                      v-model="formData.valueList"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="名称">
                    <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="计量单位">
                    <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="链接">
                    <el-input v-model="formData.url" placeholder="请输入完整的url地址链接，如果没有，请留空"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="标签">
                    <el-tag
                      :key="tag"
                      v-for="tag in dynamicTags"
                      :closable="true"
                      :close-transition="false"
                      @close="handleClose(tag)"
                      type="primary"
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
                </el-col>
                <el-col :span="24">
                  <el-form-item label="图片">
                    <el-upload
                      :action="uploadURL"
                      list-type="picture-card"
                      :file-list="fileList2"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :on-success="handleSuccess">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="el-row-class" style="margin-top: 15px;">
                <el-col :span="24">
                  <el-form-item label="价值">
                     <el-input placeholder="请输入" v-model="formData.parentName" style="width:150px;">
                        <template slot="prepend">￥</template>
                    </el-input>&nbsp;&nbsp;&nbsp;元 
                    <!-- <div>
                      <el-input placeholder="请输入内容" v-model="input3">
                        <template slot="prepend">Http://</template>
                      </el-input>
                    </div> -->
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="上架">
                    <el-radio-group v-model="formData.resource" style="display:block;padding:8px 0;font-size: 14px;"> 
                        <el-row style="margin-bottom:20px;">
                            <el-col :span="5">
                                <el-radio label="立即上架"></el-radio>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <el-radio label="指定时间"></el-radio>
                            </el-col>
                            <el-col :span="8" style="margin-top:-9px;">
                                <el-date-picker
                                    style="width:224px;"
                                    v-model="formData.value1"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-col>
                        </el-row>
                    </el-radio-group> 
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="el-row-class" style="margin-top: 15px;">
                <el-col :span="24">
                  <el-form-item label="商品规格">
                    <div style="text-align:right;margin-bottom:10px;">
                      <el-button class="button-new-tag" @click="openDialog">添加规格项目</el-button>
                    </div>
                    <el-table
                        :data="formData.tableData"
                        border
                        style="width: 100%">
                        <el-table-column prop="name" label="规格名"></el-table-column>
                        <el-table-column prop="attr" label="规格属性"></el-table-column>
                        <el-table-column prop="price" label="价格"></el-table-column>
                        <el-table-column prop="stock" label="库存"></el-table-column>
                        <el-table-column prop="code" label="商家编码"></el-table-column>
                        <el-table-column prop="sale" label="销量"></el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="总库存">
                    <template>
                        <el-input-number v-model="formData.num1" :min="0"></el-input-number>
                    </template>
                    <p>总库存为0的时候，商品会上架到售罄分类，无法进行销售</p>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="商家编码">
                    <el-input v-model="formData.name" placeholder="请输入商家编码"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="el-row-class" style="margin-top: 15px;">
                <el-col :span="24">
                  <el-form-item label="详细介绍">
                    <vue-html5-editor :content="formData.content" @change="updateData"></vue-html5-editor>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="添加规格项目" v-model="showDialog">
      <el-form :model="selected" label-width="80px">
        <el-form-item label="规格">
            <el-select v-model="selected.name" placeholder="规格:比如内存大小/颜色/等等">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="规格属性">
            <el-input placeholder="示例:红色" v-model="selected.attr"></el-input>
        </el-form-item>
        <el-form-item label="商家编码">
            <el-input placeholder="示例:DSG99-0890432423" v-model="selected.code"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="价格">
                <el-input placeholder="示例:500" v-model="selected.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <span style="display:inline-block;line-height:36px;">&nbsp;&nbsp;&nbsp;元</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="库存">
                <el-input placeholder="示例:10" v-model="selected.stock"></el-input>
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
          <el-button type="primary" @click="addSetting">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      fileList2: [],
      option: [{
        id: '0',
        title: '全部'
      }, {
        id: '1',
        title: '点位标识'
      }, {
        id: '2',
        title: '点位名称'
      }],
      uploadURL: config.serverURI + config.uploadFilesAPI,
      dialogVisible: false,
      dialogImageUrl: '',
      showDialog: false,
      selected: {
        name: ''
      },
      ruleForm: {
        region: ''
      },
      options: [],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      formData: {
        id: '',
        name: '',
        description: '',
        parentId: 0,
        imageUrl: '',
        url: '',
        icon: '',
        valueList: [],
        resource: '',
        parentName: '',
        value1: '',
        content: '',
        num1: '',
        tableData: []
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      // console.log(res, file)
      this.formData.imageUrl = res.data[0]
      // this.formData.imageUrl = window.URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    /* 富文本数据函数 */
    updateData (data) {
      this.formData.content = data
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
    goBack () {
      this.$router.push({
        path: '/admin/awards/product'
      })
    },
    handleSuccess (file, fileList) {
      this.fileList2 = []
      this.removeImg(fileList)
    },
    removeImg (obj) {
      for (var v of obj) {
        this.fileList2.push(v.response.data[0])
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    addSetting () {
      this.showDialog = false
      console.log(this.selected)
      this.formData.tableData.push(this.selected)
    },
    /* 添加项目规格弹出框 */
    openDialog () {
      this.showDialog = true
      this.getOption({cat_id: 1})
    },
    /* 规格数据获取 */
    getOption (obj = {}) {
      api.GET(config.cpAwardShowAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.option = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    /* 分类数据获取 */
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
    getTree () {
      api.GET(config.categoryTreeAPI)
      .then(response => {
        var newData = response.data.data
        this.iteration(newData)
        newData.push({ id: 0, display_name: '根级分类', label: '根级分类', value: 0 })
        this.data = newData
        this.cascaderData = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ap-container {
  width: 100%;
  padding: 1rem;
  .ap-content {
    margin-top: 1rem;
    border-top: 1px solid lightgray;
    padding-top: 1rem;
    .ap-content-left {
      background-color: #fff;
      border: 1px solid lightgray;
      height: 500px;
      h4 {
        padding: 10px;
        border-bottom: 1px solid lightgray;
      }
      .left-img {
        text-align: center;
        width: 100%;
        height: 250px;
        padding: 10px 30px;
      }
    }
    .ap-content-right {
      .ap-right-form {
        .el-row-class {
          border: 1px solid lightgray;
          padding: 20px 20px 0 0;
          background-color: #fff;
        }
      }
    }
  }
}
</style>