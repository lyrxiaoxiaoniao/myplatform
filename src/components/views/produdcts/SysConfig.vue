<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <div class="sc-systemconfig-wrap" >
        <div class="sc-siteconfig">
          <el-card>
            <div slot="header">
              <span style="font-size:18px;">站点配置</span>
              <el-button type="primary" class="sc-siteconfig-btn" @click="siteConfigPost">保存</el-button>
            </div>
            <div class="sc-siteconfig-form">
              <el-form label-width="100px">
                <el-row type="flex">
                  <el-col :span="12">
                    <el-form-item label="站点名称">
                      <el-input placeholder="请输入站点名称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item  label="站点别名">
                      <el-input placeholder="请输入站点别名"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="关键字">
                  <el-input placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                  <el-input type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="域名信息">
                  <el-input placeholder="请输入域名信息"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-card>  
        </div>
        <div class="sc-shopconfig">
          <el-card>
            <div slot="header">
              <span style="font-size:18px;">商品设置</span>
              <el-button type="primary" class="sc-siteconfig-btn" @click="shopConfigPost">保存</el-button>
            </div>
            <div class="sc-siteconfig-content">
              <el-row type="flex">
                <el-col style="line-height:60px;">
                  <span>商品列表显示设置</span>
                  <el-radio-group style="margin-left:42px;" v-model="radio">
                    <el-radio :label="1">按SKU显示</el-radio>
                    <el-radio :label="3">按SPU显示</el-radio>
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col style="line-height:60px;">
                  <span>商品销售量显示设置</span>
                  <el-checkbox style="margin-left:30px;" v-model="checked1">按照最近三个月销售量</el-checkbox>
                </el-col>
              </el-row>
              <el-row type="flex">
                <el-col style="line-height:60px;">
                  <span>评价默认好评设置</span>
                  <el-checkbox style="margin-left:42px;" v-model="checked2">商品默认好评</el-checkbox>
                </el-col>
              </el-row>
            </div>
          </el-card>  
        </div>
        <div class="sc-watermark">
          <el-card>
            <div slot="header">
              <span style="font-size:18px;">水印设置</span>
              <el-button type="primary" class="sc-siteconfig-btn" @click="watermarkPost">保存</el-button>
            </div>
            <div class="sc-siteconfig-content">
              <el-form label-width="100px" label-position="left">
                <el-row type="flex">
                  <el-col>
                    <el-form-item label="是否开启水印">
                      <el-switch v-model="value1" on-text="开" off-text="关"></el-switch>
                    </el-form-item> 
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col>
                    <el-form-item label="水印文字">
                      <el-input placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col>
                    <el-row>
                      <el-col :span="2"><el-form-item label="文字属性"></el-form-item></el-col>
                      <el-col :span="6">
                        <el-form-item label="字体大小">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>   
                      <el-col :span="6">
                        <el-form-item label="颜色">
                          <el-input></el-input>  
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="透明度">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>  
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col>
                    <el-row>
                      <el-col :span="2"><el-form-item label="文字位置"></el-form-item></el-col>
                      <el-col :span="6">
                        <el-form-item label="字体位置">
                          <el-select v-model="value2" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                      </el-col>   
                      <el-col :span="6">
                        <el-form-item label="水平偏移">
                          <el-input></el-input>  
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="垂直偏移">
                          <el-input></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row type="flex">
                  <el-col>
                    <el-form-item label="水印图片">
                      <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="onUploadSuccess"
                        :on-remove="onRemovePic"
                        :on-error="onUploadError">
                        <img v-if="imageURL" :src="imageURL" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    
    <div slot="kobe-table-footer" class="kobe-table-footer"></div>
  </kobe-table>
  
  
</template>

<script>
  // import config from 'src/config'
  // import api from 'src/api'

  export default {
    name: 'sc-systemconfig',
    data () {
      return {
        radio: 3,
        checked1: true,
        checked2: true,
        value1: true,
        options: [{
          value: 1,
          label: '左上角'
        }, {
          value: 2,
          label: '右上角'
        }, {
          value: 3,
          label: '右下角'
        }, {
          value: 4,
          label: '左下角'
        }],
        value2: 3
      }
    },
    methods: {
      /* http请求函数开始 */
      siteConfigPost () {
        console.log('发起保存站点配置http请求')
      },
      shopConfigPost () {
        console.log('发起保存商品设置http请求')
      },
      watermarkPost () {
        console.log('发起保存水印设置http请求')
      },
      /* http请求函数结束 */
      onUploadSuccess () {
        console.log(1)
      }
    }
  }
</script>

<style scoped>
.sc-siteconfig,.sc-shopconfig,.sc-watermark{
    margin-top: 20px;
}
.sc-siteconfig-btn{
  float: right;
  color: #fff;
}
</style>
