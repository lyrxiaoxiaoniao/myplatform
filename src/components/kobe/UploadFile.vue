<template>
  <el-dialog @close="onClose" :title="title" v-model="isShow">
    <div class="FS-container">
        <div class="FS-left">
            <el-tree :data="data"
            :props="defaultProps"
            :highlight-current="true"
            :default-expanded-keys="treeOpen"
            node-key="id"
            @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="FS-right clearfix">
            <div class="FS-right-header">
                <el-button @click="uploadDialod = true">点击上传</el-button>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-left:10px;">选择全部图片</el-checkbox>
                <div class="FS-right-search">
                    <el-input placeholder="按照图片名称搜索" v-model="form.name">
                        <el-button slot="append" icon="search" @click="onSearch"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="FS-right-content">
                <el-checkbox-group  v-model="checkedCities" @change="handleCheckedCitiesChange" style="border-top: 1px solid lightgray;padding-top:5px;">
                <ul>
                    <li v-for="city in cities.data"  :key="city">
                        <div class="FS-view">
                            <span class="FS-view-mask">
                                <i class="el-icon-view FS-view-icon" @click="onbigImg(city.remoteUrl)"></i>
                            </span>
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <template>
                                <img style="width:100%;height:100%;" :src="city.remoteUrl" alt="">
                            </template>
                        </div>
                         <P class="FS-name">{{city.name}}</P>
                    </li>
                </ul>
                </el-checkbox-group>
                <div style="margin-top:15px;">
                    <el-row type="flex" justify="center">
                        <el-col :span="12">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="cities.currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="cities.pageSize"
                            :total="cities.count"
                            layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!--图片弹出框-->
            <el-dialog title="选择图片资源" :modal="false" v-model="uploadDialod" size="small">
                <el-upload
                    :action="uploadURL"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="uploadSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="uploadDialod = false">取 消</el-button>
                    <el-button type="primary" @click="saveURL">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog v-model="dialogVisible" :modal="false">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div> 
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from 'src/api'
import config from 'src/config'
export default {
  name: 'upload-file',
  props: {
    title: {
      type: String
    },
    show: {
      type: Boolean,
      default: false
    },
    multiselect: {
      type: Boolean
    }
  },
  data () {
    return {
      uploadURL: config.serverURI + config.uploadFilesAPI,
      localImgs: [],
      type: 0,
      parentId: 704,
      treeOpenval: [],
      treeKey: null,
      uploadDialod: false,
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        name: ''
      },
      checked: true,
      data: [],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true
    }
  },
  computed: {
    treeOpen () {
      this.treeOpenval = []
      this.treeOpenval.push(this.parentId)
      return this.treeOpenval
    },
    isShow () {
      return !!this.show
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    onConfirm () {
      var urls = this.getImgRUL(this.cities.data)
      this.$emit('confirm', urls)
    },
    // 获取图片url
    getImgRUL (obj) {
      var urls = []
      this.checkedCities.forEach(v => {
        obj.forEach(k => {
          if (v === k.id) {
            urls.push(k.remoteUrl)
          }
        })
      })
      return urls
    },
    // 本地图片上传
    saveURL () {
      var obj = {}
      obj.urls = this.localImgs
      obj.parentId = this.parentId
      obj.typeId = this.type
      api.POST(config.saveFilesAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.showFileList({id: this.parentId, typeId: this.type})
          this.uploadDialod = false
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success'
          })
        }
      })
    },
    uploadSuccess (response, file, fileList) {
      console.log(response)
      this.localImgs = []
      this.removeImg(fileList)
    },
    removeImg (obj) {
      for (var v of obj) {
        this.localImgs.push(v.response.data[0])
      }
    },
    // 图片方大方法
    onbigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 树形目录
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.showFileList({id: this.parentId, typeId: this.type})
    },
    getIds (val) {
      var arr = []
      val.data.forEach(v => {
        arr.push(v.id)
      })
      return arr
    },
    // 全选方法
    handleCheckAllChange (event) {
      this.checkedCities = event.target.checked ? this.getIds(this.cities) : []
      this.isIndeterminate = false
    },
    // 获取已经选择的方法
    handleCheckedCitiesChange (value) {
      if (!this.multiselect) {
        let lastSel = []
        lastSel.push(this.checkedCities.pop())
        this.checkedCities = lastSel
      }
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 获取树形文件夹数据
    getTreeData () {
      api.GET(config.filesAPI, {id: 0})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.data = response.data.data
        }
      })
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 渲染文件列表
    showFileList (obj) {
      api.GET(config.showFilesAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          if (response.data.data.count === 0) {
            this.cities = {}
          } else {
            this.cities = response.data.data
          }
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    // 搜索文件
    onSearch () {
      let data = {
        currentPage: this.cities.currentPage,
        pageSize: this.cities.pageSize,
        id: this.parentId,
        typeId: this.type,
        ...this.form
      }
      this.showFileList(data)
    },
    handleSizeChange (value) {
      let data = {
        currentPage: this.cities.currentPage,
        pageSize: value,
        id: this.parentId,
        typeId: this.type,
        ...this.form
      }
      this.showFileList(data)
    },
    handleCurrentChange (value) {
      let data = {
        currentPage: value,
        pageSize: this.cities.pageSize,
        id: this.parentId,
        typeId: this.type,
        ...this.form
      }
      this.showFileList(data)
    }
  },
  mounted () {
    this.getTreeData()
    this.showFileList({id: this.parentId, typeId: this.type})
  }
}
</script>
<style scoped>
.upload-dialog .el-dialog .el-dialog__body{
  padding: 0;
}
.FS-container{
    height: 450px;  
    /*margin-top: 1.5rem;*/
    margin: -20px 0;
    padding: 1rem 0;
    border-top: 1px solid lightgray;
    position: relative;
}
.FS-left{
    width: 20%;
    overflow: auto;
}
.FS-right{
    width:80%;
    padding: 1rem;
    position: absolute;
    top: 0;
    right: 0;
}
.FS-right-header{
    margin-bottom: 10px;
}
.FS-right-search{
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 250px;
}
.FS-right-content ul{
    min-height: 230px;
    max-height: 350px;
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: auto;
}
.FS-right-content ul li{
    width: 100px;
    height: 130px;
    padding: 5px;
}
.FS-view:hover .FS-view-mask{
    display: block;
}
.FS-view-mask{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    display: none;
    position: absolute;
    top: 0;
    left: 0;
}
.FS-view-icon{
    cursor: pointer;
    z-index: 100;
    width: 40px;
    height: 40px;
    font-size: 20px;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -20px 0 0 -20px;
    text-align: center;
    line-height: 40px;
}
.FS-right-content ul li .FS-view{
    width: 100%;
    height: 100px;
    /*border: 1px solid lightgray;*/
    position: relative;
    overflow: hidden;
}
.FS-right-content li>div .FS-right-check{
    width: 18px;
    height: 18px;
    position: absolute;
    top: 0;
    right: 2px;
}
.FS-name{
    margin: 0;
    height: 24px;
    width: 100%;
    line-height: 24px;
    text-align: center;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
