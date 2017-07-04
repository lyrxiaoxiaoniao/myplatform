<template>
    <div class="FS-container">
        <div class="FS-left">
            <!--<el-checkbox v-model="checked">包括子文件夹内容</el-checkbox>-->
            <p>文件目录结构</p>
            <el-tree :data="data" :props="defaultProps"
                    accordion
                    :highlight-current="true"
                    node-key="id"
                    :current-node-key="treeKey"
                    :default-expanded-keys="treeOpen"
                    @node-click="handleNodeClick"
                    style="max-height:600px;overflow:auto;">
            </el-tree>
        </div>
        <!--批量移动弹出框-->
        <el-dialog title="移动" v-model="dialogVisibleMove" size="tiny">
            <div style="width:100%">
                <el-row type="flex" justify="center">
                    <el-col :span="4">
                      <p class="FS-moveName">移动到</p>
                    </el-col>
                    <el-col :span="20">
                       <el-cascader
                          style="width:100%;"
                          change-on-select
                          :options="data"
                          :props="props"
                          v-model="selectedOptions"
                          @change="handleChange">
                      </el-cascader>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleMove = false">取 消</el-button>
                <el-button type="primary" @click="confirmMove">确 定</el-button>
            </span>
        </el-dialog>
        <div class="FS-right clearfix">
            <div class="FS-right-header">
                <el-button @click="filesUpdate">文件上传</el-button>
                <el-button @click="createFiles">新建文件夹</el-button>
                <el-button @click="showDialog">选择文件</el-button>
                <el-select v-model="selectval" style="width:80px; margin-left:10px;" placeholder="批量" @change="batchOperate">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-button style="margin-left:10px;" @click="showFileList({id: parentId})">刷新</el-button>
                <div class="FS-right-search">
                    <el-input placeholder="按照文件夹或者文件/图片名称搜索" v-model="form.name">
                        <el-button slot="append" icon="search" @click="onSearch"></el-button>
                    </el-input>
                </div>
            </div>
            <div class="FS-right-content">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选当前显示的文件夹与文件</el-checkbox>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" style="border-top: 1px solid lightgray;padding-top:5px;">
                <ul>
                    <li v-for="(city, index) in cities.data" :key="city.id">
                        <div v-if="city.typeId === 5" class="FS-view">
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <div @dblclick="enterFile(city.id)" class="FS-folder"></div>
                            <!--<img style="width:100%;height:100%;cursor:pointer;" src="../../../assets/folder.png" alt="" @dblclick="enterFile(city.id)">-->
                        </div>
                        <div v-else-if="city.typeId === 0" class="FS-view">
                            <span class="FS-view-mask">
                                <i class="el-icon-view FS-view-icon" @click="bigImg(city.remoteUrl)"></i>
                            </span>
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <img style="width:100%;height:100%;" :src="city.remoteUrl" alt="">
                        </div>
                        <div v-else-if="city.typeId === 1" class="FS-view">
                            <span class="FS-view-mask">
                                <a :href="city.remoteUrl" target="_blank"><i class="fa fa-arrow-down FS-view-icon" ></i></a>
                            </span>
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <div class="FS-folder FS-word"></div>
                        </div>
                        <div v-else-if="city.typeId === 2" class="FS-view">
                            <span class="FS-view-mask">
                                <a :href="city.remoteUrl" target="_blank"><i class="fa fa-arrow-down FS-view-icon" ></i></a>
                            </span>
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <div class="FS-folder FS-pdf"></div>
                        </div>
                        <div v-else-if="city.typeId === 3" class="FS-view">
                            <span class="FS-view-mask">
                                <a :href="city.remoteUrl" target="_blank"><i class="fa fa-arrow-down FS-view-icon" ></i></a>
                            </span>
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <div class="FS-folder FS-txt"></div>
                        </div>
                        <div v-else-if="city.typeId === 4" class="FS-view">
                            <span class="FS-view-mask">
                                <a :href="city.remoteUrl" target="_blank"><i class="fa fa-arrow-down FS-view-icon" ></i></a>
                            </span>
                            <el-checkbox :label="city.id" class="FS-right-check"></el-checkbox>
                            <div class="FS-folder FS-zip"></div>
                        </div>
                        <div>
                            <P v-show="city.changeVal" @dblclick="dbChangeName(city, $event, index)" class="FS-name">{{city.name}}</P>
                            <template>
                                <el-input v-show="! city.changeVal"
                                    ref="folderName"
                                    class="FS-view-name"
                                    icon="edit"
                                    :autofocus="true"
                                    @focus="onFocus(city)"
                                    @blur="onBlur(city)"
                                    @keyup.enter.native="handleIconClick"
                                    v-model="city.name"
                                    :on-icon-click="handleIconClick">
                                </el-input>
                            </template>
                        </div>  
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
        </div>
        <!--t图片弹出框-->
        <el-dialog v-model="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>    
        <!--点击上传弹出框 -->
        <el-dialog
            title="上传文件"
            :visible.sync="uploadVisible">
            <div class="FS-load-content">
                <div class="FS-load-net">
                    <label>网络图片</label>
                    <el-input v-model="netUploadurl" placeholder="请网络图片地址" style="padding:0 80px;"></el-input>
                    <el-button type="primary" class="net-btn" @click="onNetImg">提取</el-button>
                    <div class="net-img-url">
                        <div v-for="(item, index) in netImgsURL" :key="index" class="net-img-item">
                            <span class="net-img-url-mask">
                                <i class="el-icon-delete2 net-img-url-icon" @click="netImgdelet(index)"></i>
                            </span>
                            <img style="width:100%;height:100%;"
                            :src="item" alt="">
                        </div>
                    </div>
                </div>
                <div class="FS-load-local">
                    <span class="FS-load-font">本地图片</span>
                    <el-upload
                        style="margin-left:80px;"
                        :action="uploadURL"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-success="uploadSuccess">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveURL">确 定</el-button>
            </div>
        </el-dialog>
        <upload-file
            @close="onFilesClose"
            @confirm="onFilesfirm"
            title="选择文件资源"
            :show="uploadShowDialod"
            :multiselect="false">
        </upload-file>
    </div>  
</template>
<script>
import api from 'src/api'
import config from 'src/config'
import UploadFile from 'src/components/kobe/UploadFile.vue'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      inputNameId: null,
      change: false,
      props: {
        children: 'children',
        label: 'label',
        value: 'id'
      },
      moveVal: null,
      selectedOptions: [],
      dialogVisibleMove: false,
      treeKey: null,
      parentId: 704,
      treeOpenval: [],
      localImgs: [],
      uploadURL: config.serverURI + config.uploadFilesAPI,
      netImgsURL: [],
      netUploadurl: '',
      uploadShowDialod: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadVisible: false,
      options: [{
        value: '1',
        label: '批量'
      }, {
        value: '2',
        label: '删除'
      }, {
        value: '3',
        label: '移动'
      }],
      input2: '',
      selectval: '1',
      form: {
        name: ''
      },
      checked: true,
      data: [],
      checkAll: false,
      checkedCities: [],
      cities: {},
      isIndeterminate: true
    }
  },
  computed: {
    treeOpen () {
      this.treeOpenval = []
      this.treeOpenval.push(this.parentId)
      return this.treeOpenval
    }
  },
  methods: {
    // 选择历史图片文件 返回urls数组
    onFilesfirm (urls) {
      this.uploadShowDialod = false
    },
    onFilesClose () {
      this.uploadShowDialod = false
    },
    // 搜索文件
    onSearch () {
      let data = {
        currentPage: this.cities.currentPage,
        pageSize: this.cities.pageSize,
        id: this.parentId,
        ...this.form
      }
      this.showFileList(data)
    },
    // 新建文件夹
    createFiles () {
      api.POST(config.createFilesAPI, {parentId: this.parentId})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getTreeData()
          this.showFileList({id: this.parentId})
        }
      })
    },
    showDialog () {
      this.uploadShowDialod = true
    },
    dbChangeName (val, evt, index) {
      this.$nextTick(() => {
        this.$refs.folderName[index].$refs.input.focus()
      })
      this.inputNameId = null
      val.changeVal = false
      this.inputNameId = val
    },
    onFocus (val) {
      this.inputNameId = null
      this.inputNameId = val
    },
    onBlur (value) {
      return (value.changeVal = true)
    },
    // 点击事件
    handleIconClick (ev) {
      // updateNameFilesAPI
      if (this.inputNameId) {
        var obj = {}
        obj.id = this.inputNameId.id
        obj.name = this.inputNameId.name
        api.POST(config.updateNameFilesAPI, obj)
        .then(response => {
          if (response.data.errcode === '0000') {
            this.inputNameId.changeVal = true
            this.$notify({
              title: '成功',
              message: '文件名修改成功',
              type: 'success'
            })
            this.showFileList({id: this.parentId})
          }
          if (response.data.errcode === '5000') {
            this.$notify.info({
              title: '警告',
              message: '文件名有重复'
            })
          }
        })
      }
    },
    // 图片方大方法
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    // 树形目录点击事件
    handleNodeClick (data, node) {
      this.parentId = data.id
      this.showFileList({id: this.parentId})
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
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 弹出框方法  本地文件上传
    filesUpdate () {
      this.uploadVisible = true
      this.localImgs = []
      this.netImgsURL = []
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadSuccess (response, file, fileList) {
      this.localImgs = []
      this.removeImg(fileList)
    },
    removeImg (obj) {
      for (var v of obj) {
        this.localImgs.push(v.response.data[0])
      }
    },
    // 网络图片获取
    onNetImg () {
      if (this.netUploadurl) {
        this.netImgsURL.push(this.netUploadurl)
        this.netUploadurl = ''
      }
    },
    netImgdelet (index) {
      this.netImgsURL.splice(index, 1)
    },
    saveURL () {
      var obj = {}
      obj.urls = this.localImgs.concat(this.netImgsURL)
      obj.parentId = this.parentId
      // console.log(obj)
      api.POST(config.saveFilesAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.showFileList({id: this.parentId})
          this.uploadVisible = false
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success'
          })
        }
      })
    },
    // 获取树形文件夹数据
    getTreeData () {
      api.GET(config.filesAPI, {id: 0})
      .then(response => {
        if (response.data.errcode === '0000') {
          this.data = response.data.data
          this.iteration(this.data)
        }
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
    // 双击进入文件
    enterFile (id) {
      let data = {
        id: id
      }
      this.parentId = id
      this.showFileList(data)
      this.getTreeData()
      this.treeKey = id
    },
    // 批量删除
    batchOperate() {
      let obj = {}
      obj.ids = this.checkedCities
      if (this.selectval === '2') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            // deleteFilesAPI
          api.POST(config.deleteFilesAPI, obj)
          .then(response => {
            if (response.data.errcode === '0000') {
              console.log(response, 'test')
              this.getTreeData()
              this.showFileList({id: this.parentId})
              this.selectval = '1'
              this.$notify({
                title: '成功',
                message: '文件删除成功',
                type: 'success'
              })
            }
          }).catch(error => {
            this.$message.error(error)
          })
        }).catch(() => {
          this.$notify.info({
            title: '取消',
            message: '取消删除'
          })
          this.selectval = '1'
        })
      }
      if (this.selectval === '3') {
        this.dialogVisibleMove = true
        this.selectval = '1'
      }
    },
    // 批量移动
    confirmMove () {
      this.parentId = null
      this.parentId = this.moveVal.pop()
      var obj = {}
      obj.ids = this.checkedCities
      obj.id = this.parentId
      api.POST(config.moveFilesAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.dialogVisibleMove = false
          this.getTreeData()
          this.showFileList({id: this.parentId})
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    handleChange (value) {
      this.moveVal = value
    },
    addchangeVal (res) {
      res.data.forEach(v => {
        v.changeVal = true
      })
      return res
    },
    // 渲染文件列表
    showFileList (obj) {
      api.GET(config.showFilesAPI, obj)
      .then(response => {
        if (response.data.errcode === '0000') {
          if (response.data.data.count === 0) {
            this.cities = {}
          } else {
            this.cities = this.addchangeVal(response.data.data)
          }
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    handleSizeChange (value) {
      let data = {
        currentPage: this.cities.currentPage,
        pageSize: value,
        id: this.parentId,
        ...this.form
      }
      this.showFileList(data)
    },
    handleCurrentChange (value) {
      let data = {
        currentPage: value,
        pageSize: this.cities.pageSize,
        id: this.parentId,
        ...this.form
      }
      this.showFileList(data)
    }
  },
  mounted () {
    this.getTreeData()
    this.showFileList({id: this.parentId})
  }
}
</script>
<style scoped>
.FS-folder {
  width: 100%;
  height: 100%;
  background: url('/static/img/folder.png') no-repeat center center;
  background-size: 50% 40%;
  cursor: pointer;
}
.FS-word {
  background: url('/static/img/word.png') no-repeat center center;
}
.FS-txt {
  background: url('/static/img/txt.png') no-repeat center center;
}
.FS-pdf {
  background: url('/static/img/pdf.png') no-repeat center center;
}
.FS-zip {
  background: url('/static/img/zip.png') no-repeat center center;
}
.FS-container{
    height: 100%;
    margin-top: 1.5rem;
    padding: 1rem 2rem;
    border-top: 1px solid lightgray;
    position: relative;
}
.FS-left{
    width: 15%;
}
.FS-right{
    width:83%;
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
    width: 350px;
}
.FS-right-content ul{
    background-color: #fff;
    min-height: 320px;
    max-height: 480px;
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow: auto;
}
.FS-right-content ul li{
    width: 150px;
    height: 185px;
    padding: 5px;
    /*border: 1px solid lightgray;*/
}
.FS-right-content ul li .FS-view{
    width: 100%;
    height: 140px;
    position: relative;
    overflow: hidden;
    border: 1px solid lightgray;
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
.FS-view-name{
    padding: 0;
}
.FS-name{
    margin: 0;
    height: 36px;
    width: 100%;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
.FS-right-content li>div .FS-right-check{
    width: 18px;
    height: 18px;
    position: absolute;
    top: 0;
    right: 2px;
}
.FS-load-content{
    padding: 1rem 3rem;
}
.FS-load-net{
    width: 100%;
    border-bottom: 1px solid lightgray;
    position: relative;
    padding-bottom: 15px;
}
.FS-load-net label {
    position: absolute;
    top: 7px;
    left: 0;
}
.FS-load-net .net-btn{
    position: absolute;
    top: 0;
    right: 0;
}
.net-img-url{
    margin: 10px 0 0 80px;
}
.net-img-item{
    width: 130px;
    height: 130px;
    border: 1px solid lightgray;
    position: relative;
    margin:0 5px;
    display: inline-block;
}
.net-img-item:hover .net-img-url-mask{
    display: block;
}
.net-img-url-mask{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    display: none;
    position: absolute;
    top: 0;
    left: 0;
}
.net-img-url-icon{
    cursor: pointer;
    z-index: 100;
    width: 30px;
    height: 30px;
    font-size: 20px;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -15px 0 0 -15px;
    text-align: center;
    line-height: 30px;
}
.FS-load-local{
    position: relative;
    margin-top: 30px;
}
.FS-load-font{
    font-size: 14px;
    color: #48576a;
    font-weight: 600;
    position: absolute;
    top: 10px;
}
.FS-moveName{
    font-weight: 600;
    font-size: 14px;
    margin: 7px 0 0 7px;
}
</style>
