<template>
  <div class="ap-container">
    <div>
      <el-button @click="goBack" type="primary">返回列表</el-button>
      <el-button @click="addAward" type="primary">更新发布</el-button> 
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
                  <img v-if="ruleForm.first_figure" :src="ruleForm.first_figure" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="80px" class="demo-ruleForm" style="padding:0 10px;">
                <el-form-item label="商品类型">
                    <el-select v-model="ruleForm.goods_type_id" placeholder="商品类型" style="width:100%;">
                      <el-option label="实物商品（物流发货）" value="0"></el-option>
                      <el-option label="虚拟商品（无须物流）" value="1"></el-option>
                      <el-option label="电子卡券（无须物流）" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品摘要">
                    <el-input type="textarea" v-model="ruleForm.brief" placeholder="请输入商品摘要"></el-input>
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
                      v-model="categryId"
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
                    <el-input v-model="formData.unit" placeholder="请输入计量单位"></el-input>
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
                      :on-change="cardChange"
                      :file-list="fileList2"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove">
                      <i class="el-icon-plus"></i>
                      <div class="el-upload__tip" slot="tip">建议尺寸：800*800PX，单张大小不超过2M，最多可上传10张</div>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="el-row-class" style="margin-top: 15px;">
                <el-col :span="24">
                  <el-form-item label="价值">
                      <template>
                         <el-input-number v-model="formData.credit_sell_price" :step="5" :min="0"></el-input-number>
                      </template>
                      <!-- <el-input placeholder="请输入" v-model="formData.credit_sell_price" style="width:150px;">
                          <template slot="prepend">￥</template>
                      </el-input>&nbsp;&nbsp;&nbsp;元 -->
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="启用">
                    <el-radio-group @change="radioChange" v-model="formData.active" style="display:block;padding:8px 0;font-size: 14px;"> 
                        <el-row style="margin-bottom:20px;">
                            <el-col :span="5">
                                <el-radio label="1">立即启用</el-radio>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="5">
                                <el-radio label="0">指定时间</el-radio>
                            </el-col>
                            <el-col :span="8" style="margin-top:-9px;">
                                <el-date-picker
                                    v-show="activeShow"
                                    style="width:224px;"
                                    v-model="formData.sell_at"
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
                        :data="formData.skus"
                        border
                        style="width: 100%">
                        <el-table-column prop="attributes.pro_id" label="规格ID"></el-table-column>
                        <el-table-column prop="attributes.attr_key" label="规格名"></el-table-column>
                        <el-table-column prop="attributes.attr_value" label="规格属性"></el-table-column>
                        <el-table-column prop="price" label="价格"></el-table-column>
                        <el-table-column prop="inventory" label="库存"></el-table-column>
                        <el-table-column prop="code" label="商家编码"></el-table-column>
                        <el-table-column prop="sale" label="销量"></el-table-column>
                    </el-table>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="总库存">
                    <template>
                        <el-input-number v-model="formData.total_inventory" :min="0" :disabled="true"></el-input-number>
                    </template>
                    <p>总库存为0的时候，商品会上架到售罄分类，无法进行销售</p>
                  </el-form-item>
                </el-col>
                 <!-- <el-col :span="24">
                  <el-form-item label="商家编码">
                    <el-input v-model="formData.name" placeholder="请输入商家编码"></el-input>
                  </el-form-item>
                </el-col>  -->
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
            <el-select v-model="selected.attributes.pro_id" placeholder="规格:比如内存大小/颜色/等等" style="width:100%;">
              <el-option
                v-for="item in option"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="规格属性">
            <el-input placeholder="示例:红色" v-model="selected.attributes.attr_value"></el-input>
        </el-form-item>
        <el-form-item label="商家编码">
            <el-input placeholder="示例:DSG99-0890432423" v-model="selected.code"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="价格">
                <template>
                  <el-input-number v-model="selected.price" :step="5" :min="0" style="width:100%;"></el-input-number>
                </template>
                <!-- <el-input placeholder="示例:500" v-model="selected.price"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <span style="display:inline-block;line-height:36px;">&nbsp;&nbsp;&nbsp;元</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="库存">
                <template>
                  <el-input-number v-model="selected.inventory" :min="0" style="width:100%;"></el-input-number>
                </template>
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
      id: this.$route.query.id,
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
        attributes: {
          pro_id: null,
          attr_key: '',
          attr_value: ''
        },
        code: '',
        price: null,
        inventory: null,
        icon: ''
      },
      ruleForm: { // 头图与属性
        goods_type_id: null,
        brief: '',
        first_figure: ''
      },
      options: [],
      props: {
        children: 'children',
        label: 'display_name',
        value: 'id'
      },
      activeShow: false,
      formData: {
        name: '',
        category_id: [],
        unit: null,
        url: '',
        tags: [],
        images: [],
        credit_sell_price: '',
        active: null, // 0 不启用 1 启用
        sell_at: null,
        content: '',
        total_inventory: null,
        skus: []
      },
      categryId: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      cat_id: null
    }
  },
  methods: {
    /* 分类选择函数 */
    handleChange (val) {
      this.categryId = val
      this.cat_id = JSON.parse(JSON.stringify(val)).pop()
    },
    /* 上传图片函数 */
    handleAvatarSuccess (res, file) {
      this.ruleForm.first_figure = res.data[0]
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
      this.$router.go(-1)
    },
    // handleSuccess (response, file, fileList) {
    //   this.formData.images = []
    //   this.removeImg(fileList)
    //   console.log(this.fileList2)
    // },
    cardChange (file, fileList) {
      this.formData.images = []
      this.removeImg(fileList)
    },
    iconHandleAvatarSuccess (res, file) {
      this.selected.icon = res.data[0]
    },
    removeImg (obj) {
      obj.forEach(v => {
        if (v.response) {
          this.formData.images.push(v.response.data[0])
        } else {
          this.formData.images.push(v.url)
        }
      })
    },
    handleRemove (file, fileList) {
      this.formData.images.forEach((v, i) => {
        if (file.response) {
          if (v === file.response.data[0]) {
            this.formData.images.splice(i, 1)
          }
        } else if (v === file.url) {
          this.formData.images.splice(i, 1)
        }
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /* 计算总库存函数 */
    getTotalInventory (data) {
      let all = 0
      data.forEach(v => {
        all += v.inventory
      })
      this.formData.total_inventory = all
    },
    /* 获取 attr_key 的值 */
    getAttrkey (data, id) {
      let res = ''
      data.forEach(v => {
        if (v.id === id) {
          res = v.value_type
        }
      })
      return res
    },
    addSetting () {
      this.showDialog = false
      this.selected.attributes.attr_key = this.getAttrkey(this.option, this.selected.attributes.pro_id)
      const newSelected = JSON.parse(JSON.stringify(this.selected)) // 深拷贝
      this.formData.skus.push(newSelected)
      this.getTotalInventory(this.formData.skus)
    },
    /* 添加项目规格弹出框 */
    openDialog () {
      Object.keys(this.selected).forEach(v => {
        if (this.selected[v] instanceof Object) {
          Object.keys(this.selected[v]).forEach(k => {
            this.selected[v][k] = null
          })
        } else this.selected[v] = ''
      })
      this.showDialog = true
      this.getOption({cat_id: this.cat_id})
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
    radioChange (val) {
      if (this.formData.active === '1') {
        this.formData.sell_at = Date.now()
        this.activeShow = false
      } else {
        this.activeShow = true
        this.formData.sell_at = Date.parse(new Date(this.formData.sell_at))
      }
    },
    addAward () {
      this.formData.id = Number(this.id)
      this.formData.category_id = this.cat_id
      this.formData.cids = this.categryId.join(',')
      this.formData.tags = this.dynamicTags
      // this.formData.active = Number(this.formData.active)
      // console.log(this.ruleForm, '头图及属性')
      // console.log(this.formData, '奖品详情')
      let obj = {
        ...this.formData,
        ...this.ruleForm
      }
      obj.active = Number(obj.active)
      obj.goods_type_id = Number(obj.goods_type_id)
      api.POST(config.editGoodsAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改商品成功！！！',
            type: 'success'
          })
          this.goBack()
        } else {
          this.$notify({
            title: '错误',
            message: response.data.errmsg,
            type: 'info'
          })
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
        this.options = newData
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getGoodsData () {
      api.GET(config.showGoodsAPI, {id: this.id})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.showRuleForm(response.data.data)
          this.showFormData(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    /* 商品数据处理函数 */
    showFormData (data) {
      for (var k in this.formData) {
        this.formData[k] = data[k]
      }
      this.formData.skus.forEach(v => {
        v.attributes = v.attributes[0]
      })

      this.formData.cids = data.cids.split(',')
      let ids = []
      this.formData.cids.forEach(v => {
        ids.push(Number(v))
      })
      this.formData.cids = ids
      this.cat_id = this.formData.category_id
      this.categryId = this.formData.cids
      this.formData.active = String(this.formData.active)
      this.formData.tags.forEach(v => {
        this.dynamicTags.push(v.name)
      })
      // this.fileList2 = this.formData.images
      this.formData.images.forEach((v, i) => {
        this.fileList2.push({url: v})
      })
    },
    /* 商品数据处理函数 */
    showRuleForm (data) {
      this.ruleForm.goods_type_id = String(data.goods_type_id)
      this.ruleForm.brief = data.brief
      this.ruleForm.first_figure = data.first_figure
    }
  },
  mounted () {
    this.getTree()
    this.getGoodsData()
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