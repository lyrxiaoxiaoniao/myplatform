<template> 
  <div class="sc-advertisement">
		<el-row class="sc-top-header">
		  <el-col :span="12">
        <el-button type="primary" class="sc-top-btn" @click="addData()">新增</el-button>
      </el-col>
		  <el-col :span="3">
         <template>
          <el-select v-model="value1" placeholder="请选择" style="float:right;margin-right:10px;width:100px;">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-col>
		  <el-col :span="6">
        <div class="grid-content">
          <el-input placeholder="请输入内容" v-model="keyword">
            <el-button slot="append" icon="search" class="hover-search" @click="searchKeyword()"></el-button>
          </el-input>
        </div>
      </el-col>
		  <el-col :span="3">
        <el-button icon="upload2" type="primary" style="margin-left:20px;"></el-button>
        <el-button icon="setting" type="primary"></el-button>
      </el-col>
		</el-row>
	  	<div class="sc-article-table-content">
	      <el-table :data="response.data" border stripe
          @selection-change="handleSelectionChange"
          ref="multipleTable">
          <el-table-column type="selection" width="55"></el-table-column>
	        <el-table-column type="index" label="ID" width="50"></el-table-column>
	        <el-table-column prop="spacename" label="点位名称" min-width="100"></el-table-column>
	        <el-table-column prop="slug" label="点位标识" width="150"></el-table-column>
	        <el-table-column prop="typename" label="分类" width="120"></el-table-column>
	        <el-table-column prop="count" label="点击量"></el-table-column>
	        <el-table-column prop="createdAt" label="创建时间" width="180px"></el-table-column>
	        <el-table-column prop="upCount" label="当前上画" width="100px"></el-table-column>
	        <el-table-column label="状态" width="100px">
            <template scope="scope">
              <el-switch
                v-model="scope.row.state"
                on-text="开"
                off-text="关"
                @change="toswitch(scope.row.state,scope.row.id)">
              </el-switch>
            </template> 
          </el-table-column>
	        <el-table-column label="操作" width="160">
	          <template scope="scope">
	            <el-button size="small" icon="edit" @click="editData(scope.row.id)" title="修改"></el-button>
              <el-button size="small" icon="date" @click="onUpadv(scope.row.id)" title="上画"></el-button>
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
	            :current-page="response.currentPage"
	            :page-sizes="[10, 20, 50, 100]"
	            :page-size="response.pageSize"
	            :total="response.count"
	            layout="total, sizes, prev, pager, next, jumper">
	          </el-pagination>
	        </el-col>
	      </el-row>
	    </div>
      <el-dialog :title="isEdit ? '修改广告点位' : '新增广告点位'" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="点位名称" prop="spacename">
          <el-input v-model="ruleForm.spacename" placeholder="简单为宜"></el-input>
        </el-form-item>
        <el-form-item label="点位标识" prop="slug">
          <el-input v-model="ruleForm.slug" placeholder="缩写，全英文，64字以内，如：app.weicome.first，用于引用的"></el-input>
        </el-form-item>
        <el-form-item label="点位分类" required>
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
        <el-form-item label="点位标签" prop="tagList" required>
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
        <el-form-item label="有效控制" required>
          <el-switch
            v-model="ruleForm.state"
            on-text="开"
            off-text="关">
          </el-switch>
        </el-form-item>
        <el-form-item label="点位说明" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" placeholder="分类描述50字以内"></el-input>
        </el-form-item>
        <!--<el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存修改内容</el-button>
          <el-button type="primary" @click="resetForm()">返回管理首页</el-button>
        </el-form-item>-->
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
      return {
        id: null,
        isEdit: false,
        dialogFormVisible: false,
        multipleSelection: [],
        ids: [],
        option: [{
          value: '1',
          label: '点位标识'
        }, {
          value: '2',
          label: '点位名称'
        }],
        value1: '',
        response: {},
        keyword: null,
        options: [],
        value: '',
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        ruleForm: {
          description: '',
          slug: '',
          spacename: '',
          typename: null,
          value: '',
          tagList: []
        },
        rules: {
          spacename: [
            { required: true, message: '请输入点位名称', trigger: 'blur' }
          ],
          slug: [
            { required: true, message: '请输入点位标识', trigger: 'blur' }
          ],
          typename: [
            { required: true, message: '请选择一个点位类型', trigger: 'change' }
          ],
          description: [
            { required: false, message: '分类描述50字以内', trigger: 'blur' },
            { min: 0, max: 50, message: '分类描述长度在50字以内', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 新增
      addData () {
        this.isEdit = false
        this.dialogFormVisible = true
        this.ruleForm = {
          description: '',
          slug: '',
          spacename: '',
          typename: null,
          value: '',
          tagList: []
        }
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
      changeBoolean (state) {
        if (state) {
          return true
        } else {
          return false
        }
      },
      changeState (state) {
        if (state) {
          return 1
        } else {
          return 0
        }
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
      getData (id) {
        // const id = this.$route.query.id
        if (this.options) {
          api.GET(config.showAdvPointAPI, {id: id})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000' && response.data.data) {
              const res = response.data.data
              this.ruleForm = res
              this.ruleForm.state = this.changeBoolean(res.state)
              this.value = this.transformTypeid(this.ruleForm.typename)
              this.dynamicTags = res.tagList.split(',')
            }
          })
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            var sendURL
            obj.typeId = Number(this.value)
            obj.description = this.ruleForm.description
            obj.slug = this.ruleForm.slug
            obj.spacename = this.ruleForm.spacename
            obj.tagList = this.dynamicTags.join(',')
            obj.state = this.changeState(this.ruleForm.state)
            if (this.isEdit) {
              obj.id = this.id
              sendURL = config.editAdvePointAPI
            } else {
              sendURL = config.addAdvPointAPI
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
                    message: '操作成功！！！',
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
            // this.getData()
          }
        })
      },
      transformNumber (res) {
        res.forEach(v => {
          v.id = String(v.id)
        })
        return res
      },
      transformTypeid (res) {
        if (this.options) {
          this.options.forEach(v => {
            if (v.type === res) {
              res = v.id
            }
          })
          return res
        }
      },
      // 新增
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
        var obj = {
          id: id,
          state: this.changeNum(state)
        }
        api.POST(config.updateStateAdvPointAPI, obj)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '修改状态成功！！！',
              type: 'success'
            })
          }
        })
      },
      // 将数据中所有的时间转换成 yyyy-mm-dd hh:mm:ss  state 状态值
      transformDate (res) {
        res.data.forEach(v => {
          if (v.createdAt) {
            v.createdAt = this.formatDate(v.createdAt)
          }
          if (v.beginTime) {
            v.beginTime = this.formatDate(v.beginTime)
          }
          if (v.endTime) {
            v.endTime = this.formatDate(v.endTime)
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
      showList () {
        api.GET(config.advPointListAPI)
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.response = this.transformDate(response.data.data)
          }
        })
      },
      onUpadv (id) {
        this.$router.push({
          path: '/admin/ad/upload/point',
          query: {
            id: id
          }
        })
      },
      onDeleteAdvertisement (deleteid) {
        if (deleteid) {
          this.ids = []
          this.ids.push(deleteid)
        }
        this.$confirm('此操作将删除该广告点位，删除后，数据无法恢复。是否继续删除？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          api.POST(config.deleteAdvPointAPI, {ids: this.ids})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '删除成功',
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
      // 关键字搜索
      searchKeyword () {
        if (this.value1 === '1') {
          this.updateList({
            slug: this.keyword
          })
        }
        if (this.value1 === '2') {
          this.updateList({
            spacename: this.keyword
          })
        }
      },
      handleSizeChange (value) {
        this.updateList({
          currentPage: this.response.currentPage,
          pageSize: value,
          ...this.response.data
        })
      },
      handleCurrentChange (value) {
        this.updateList({
          currentPage: value,
          pageSize: this.response.pageSize,
          ...this.response.data
        })
      },
      // 为调接口
      updateList (obj) {
        api.GET(config.advPointListAPI, obj)
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.response = this.transformDate(response.data.data)
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
    margin-top: 2rem;
    padding:2rem 1rem;
    border-top: 1px solid lightgray;
  }
  .sc-top-btn {
  	margin-bottom: 1rem;
  }
  .sc-top-header {
	margin-bottom: 1rem;
	padding: 0 2rem;
  }
  .hover-search:hover {
	color: #50bfff;
  }
</style>