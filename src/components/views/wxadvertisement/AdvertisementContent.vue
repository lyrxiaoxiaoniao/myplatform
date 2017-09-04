<template> 
  <div class="sc-advertisement">
		<el-row class="sc-top-header" type="flex">
		  <el-col :span="14">
        <el-button type="primary" class="sc-top-btn" @click="addData">新增</el-button>
      </el-col>
      <el-select v-model="value1" placeholder="请选择" style="float:right;margin-right:10px;width:110px;">
        <el-option
          v-for="item in option"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
		  <el-col :span="8">
        <div class="grid-content">
          <el-input placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="search" class="hover-search" @click="searchKeyword()"></el-button>
          </el-input>
        </div>
      </el-col>
        <el-button class="sc-top-font" icon="upload2" type="primary"></el-button>
        <el-button class="sc-top-font" icon="setting" type="primary"></el-button>
		</el-row>
	  	<div class="sc-article-table-content">
	      <el-table :data="data.data" border stripe
          @selection-change="handleSelectionChange"
          ref="multipleTable">
          <el-table-column type="selection" width="55"></el-table-column>
	        <el-table-column type="index" label="ID" width="50"></el-table-column>
	        <el-table-column prop="title" label="广告标题" ></el-table-column>
	        <el-table-column prop="type" label="广告分类" width="120"></el-table-column>
	        <el-table-column prop="clickcount" label="点击量" width="80"></el-table-column>
	        <el-table-column prop="watchcount" label="展示量" width="80"></el-table-column>
	        <el-table-column prop="createdAt" label="上线时间" width="180px"></el-table-column>
          <el-table-column label="状态" width="100px">
            <template scope="scope">
              <el-switch
                v-model="scope.row.state"
                on-text="开"
                off-text="关"
                @change="toswitch(scope.row.state, scope.row.id)">
              </el-switch>
            </template> 
          </el-table-column>
	        <el-table-column label="操作" width="170">
	          <template scope="scope">
	            <el-button size="small" icon="edit" @click="editData(scope.row.id)" title="修改"></el-button>
	            <el-button size="small" icon="date" @click="onUpAdv(scope.row.id)" title="上画"></el-button>
              <!--<el-button size="small" icon="information" @click="toAdvertisementDetail(scope.row.id)" title="查看"></el-button>-->
	            <el-button size="small" icon="delete2" @click="onDeleteAdvertisement(scope.row.id)" title="删除"></el-button>
	          </template>
	        </el-table-column>
	      </el-table>
	    </div>
	    <div class="sc-article-table-footer">
	      <el-row type="flex" justify="center">
          <el-button type="text" style="color: #48576a; padding:5px 0;" @click="onDeleteAdvertisement()">删除</el-button>
	        <el-col :span="12">
	          <el-pagination
	            @size-change="handleSizeChange"
	            @current-change="handleCurrentChange"
	            :current-page="data.currentPage"
	            :page-sizes="[10, 20, 50, 100]"
	            :page-size="data.pageSize"
	            :total="data.count"
	            layout="total, sizes, prev, pager, next, jumper">
	          </el-pagination>
	        </el-col>
	      </el-row>
	    </div>
    <el-dialog :title="isEdit ? '修改广告内容' : '新增广告内容'" v-model="dialogFormVisible">
       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
         <el-form-item label="点位分类" prop="typeId" required>
          <template>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :label="item.type"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item> 
        <el-form-item label="广告内容" prop="poster" required>
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :file-list="imageList"
            :on-success="onUploadSuccess"
            :on-remove="onRemovePic"
            :on-error="onUploadError"
            :before-upload="beforeAvatarUpload"
            list-type="picture">
            <img v-if="imageURL !== ''" :src="imageURL" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg图片文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
         <el-form-item label="链接方式" prop="linkType" required>
          <el-radio-group v-model="ruleForm.linkType">
            <el-radio label="1">不跳转链接</el-radio>
            <el-radio label="2">完整地址链接</el-radio>
            <el-radio label="3">系统内部链接</el-radio>
          </el-radio-group>
        </el-form-item> 
        <el-form-item label="链接地址" prop="link">
          <el-input v-model="ruleForm.link" placeholder="请输入对应ID"></el-input>
        </el-form-item>
        <el-form-item label="文字链接" prop="content">
          <el-input v-model="ruleForm.content" placeholder="文字链内容，替换alt"></el-input>
        </el-form-item>
        <el-form-item label="内容备注" prop="memo">
          <el-input v-model="ruleForm.memo" placeholder="内容备注"></el-input>
        </el-form-item>
        <el-form-item label="内容标签" prop="tagList">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            :closable="true"
            :close-transition="false"
            @close="handleClose(tag)"
            type="danger"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import config from 'src/config'
import api from 'src/api'

export default {
  data () {
    var getposter = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请上传图片'))
      } else {
        callback()
      }
    }
    return {
      id: null,
      isEdit: false,
      dialogFormVisible: false,
      multipleSelection: [],
      ids: [],
      option: [{
        value: '0',
        label: '全部'
      }, {
        value: '1',
        label: '广告标题'
      }, {
        value: '2',
        label: '广告分类'
      }],
      value1: '',
      data: {},
      keyword: null,
      options: [],
      value: '',
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      imageList: [],
      imageURL: '',
      uploadUrl: config.serverURI + config.uploadImgAPI,
      ruleForm: {
        title: '',
        poster: '',
        link: '',
        linkType: '',
        memo: '',
        content: '',
        typeId: '',
        tagList: []
      },
      inpValue: [],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入对应ID', trigger: 'blur' }
        ],
        poster: [
          { validator: getposter, trigger: 'change' }
        ],
        linkType: [
          { required: true, message: '请输入广告类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    // 新增方法
    addData () {
      this.isEdit = false
      this.dialogFormVisible = true
      this.ruleForm = {
        title: '',
        poster: '',
        link: '',
        linkType: '2',
        memo: '',
        content: '',
        typeId: '1',
        tagList: ''
      }
      this.value = '1'
      this.imageURL = ''
      this.dynamicTags = []
      this.getTypeId()
    },
    editData (id) {
      this.id = id
      this.isEdit = true
      this.dialogFormVisible = true
      this.getData(id)
      this.getTypeId()
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
    // 上传
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    },
    onUploadSuccess (response, file, fileList) {
      if (response.errcode === '0000') {
        this.imageURL = file.url
        this.ruleForm.poster = response.data[0]
      }
      // console.log(this.ruleForm.poster)
    },
    onUploadError (error, file) {
      this.$message.error(error)
    },
    onRemovePic (file, fileList) {
      this.ruleForm.poster = ''
    },
    getData (id) {
      if (this.options) {
        api.GET(config.showAdvertisementAPI, {id: id})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000' && response.data.data) {
            const res = response.data.data
            this.responseData = res
            this.ruleForm = res
            this.ruleForm.linkType = String(res.linkType)
            this.value = String(res.typeId)
            this.imageURL = res.poster
            this.dynamicTags = res.tagList.split(',')
          }
        })
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var sendURL
          var obj = {}
          obj.typeId = Number(this.value)
          // obj.typeId = 1
          obj.link = this.ruleForm.link
          obj.linkType = Number(this.ruleForm.linkType)
          obj.content = this.ruleForm.content
          obj.title = this.ruleForm.title
          obj.poster = this.ruleForm.poster
          obj.memo = this.ruleForm.memo
          obj.tagList = this.dynamicTags.join(',')
          if (this.isEdit) {
            obj.id = this.id
            sendURL = config.editAdvertisementAPI
          } else {
            sendURL = config.addAdvertisementAPI
          }
          api.POST(sendURL, obj)
            .then(response => {
              if (response.status !== 200) {
                this.error = response.statusText
                return
              }
              if (response.data.errcode === '0000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功！！',
                  type: 'success'
                })
                this.showList()
                this.dialogFormVisible = false
              }
            })
        } else {
          return false
        }
      })
    },
    getTypeId () {
      api.GET(config.getTypeAdvPointAPI)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.options = this.transformNumber(response.data.data)
        }
      })
    },
    transformNumber (res) {
      res.forEach(v => {
        v.id = String(v.id)
      })
      return res
    },
    // 新增方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    changeNum (val) {
      if (val) {
        val = 1
      } else {
        val = 0
      }
      return val
    },
    toswitch (state, id) {
      let data = {
        pageSize: this.data.pageSize,
        currentPage: this.data.currentPage
      }
      var obj = {
        id: id,
        state: this.changeNum(state)
      }
      console.log(111)
      api.POST(config.updatestateAdvAPI, obj)
      .then(response => {
        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '修改状态成功！',
            type: 'success'
          })
          this.updateList(data)
        }
      })
    },
    // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss
    transformDate (res) {
      res.data.forEach(v => {
        if (v.createdAt) {
          v.createdAt = this.formatDate(v.createdAt)
        }
        if (v.state === 1) {
          v.state = true
        }
        if (v.state === 0) {
          v.state = false
        }
      })
      return res
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
    formatDate (value) {
      let date = new Date(value)
      let M = date.getMonth() + 1
      M = M < 10 ? ('0' + M) : M
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      // let h = date.getHours()
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
      return value
    },
    // 页面表格列表展示
    showList () {
      api.GET(config.advertisementListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.data = this.transformDate(response.data.data)
          }
        })
    },
    onUpAdv (id) {
      this.$router.push({
        path: '/admin/ad/upload/index',
        query: {
          id: id
        }
      })
    },
     /**
     * 删除该条广告信息
     * id ： 当前所在行deleteId
     * */
    onDeleteAdvertisement (deleteid) {
      if (deleteid) {
        this.ids = []
        this.ids.push(deleteid)
      }
      if (this.ids.length === 0) {
        this.$confirm('请进行正确操作，请优先勾选点位？', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          return
        }).catch(() => {
          return
        })
        return
      }
      this.$confirm('此操作将删除该广告点位，删除后，数据无法恢复。是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        api.POST(config.deleteAdvertisementAPI, {ids: this.ids})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '删除成功!',
                type: 'success'
              })
              this.showList()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      }).catch(() => {
        this.$notify.info({
          title: '消息',
          message: '已取消删除'
        })
      })
    },
    /**
     * 根据搜索关键字来搜索匹配的字段
    */
    searchKeyword () {
      if (this.value1 === '0') {
        this.updateList({
          keyword: this.keyword
        })
      }
      if (this.value1 === '1') {
        this.updateList({
          title: this.keyword
        })
      }
      if (this.value1 === '2') {
        this.updateList({
          type: this.keyword
        })
      }
    },
    handleSizeChange (value) {
      this.updateList({
        currentPage: this.data.currentPage,
        pageSize: value
      })
    },
    handleCurrentChange (value) {
      this.updateList({
        currentPage: value,
        pageSize: this.data.pageSize
      })
    },
    // 为调接口
    updateList (obj) {
      api.GET(config.advertisementListAPI, obj)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.data = this.transformDate(response.data.data)
          }
        })
    }
  },
  mounted () {
    this.showList()
  }
}
</script>
<style scoped>
  .sc-advertisement {
    /* margin-top: 2rem; */
    padding:1rem;
  }
  .sc-top-header {
	margin: 1rem 2rem;
  }
  .sc-top-font {
    height: 36px;
  }
  .hover-search:hover {
	color: #108ce8;
  }
  .sc-top-btn {
  	margin-bottom: 1rem;
  }
  .SC-imgContent {
  	margin-top: 5px;
    margin-bottom: 5px;
    width: 56px;
    height: 56px;
  }
</style>
