<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="15">
          <el-button type="primary" @click="toAddStatus">添加</el-button>
        </el-col>
        <!-- <el-col :span="2" style="margin-right:10px;">
          <el-select v-model="searchSelectValue" placeholder="所有信息" style="width:105px;" @change="searchSelect">
            <el-option
              v-for="item in searchSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col> -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="form.keyword" class="sc-table-header-select">
            <el-select v-model="searchSelectValue" slot="prepend" placeholder="所有信息" style="width:105px;">
              <el-option
                v-for="item in searchSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button slot="append" icon="search" class="sc-table-search-btn" @click="onSearch"></el-button>
          </el-input>
          <!-- <el-input v-model="form.keyword" placeholder="" class="sc-table-header-select">
            <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
          </el-input> -->
        </el-col>
        <el-button @click="openDialog('高级搜索')" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
        <el-button type="primary" icon="upload2"></el-button>
        <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>
    <div slot="kobe-table-content" class="kobe-table">
      <el-table 
        :data="response.data"
        border
        stripe
        @selection-change="selectIds">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="dutyName" label="负责人" width="80"></el-table-column>
        <el-table-column prop="mobile" label="联系电话"></el-table-column>
        <el-table-column prop="license" label="营业执照">
          <template scope="scope">
                <img style="width:58px;height:58px;" :src="scope.row.license" @click="bigImg(scope.row.license)" alt="">
              </template>
        </el-table-column>
        <el-table-column prop="signState" label="签约状态" width="100"></el-table-column>
        <el-table-column prop="checkState" label="审核状态" width="120">
          <template scope="scope">
            <el-switch on-text="已" off-text="未" v-model="scope.row.checkState" @change="toggleSwicth(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="detailAddress" label="详细地址"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="toEditStatus(scope.row.id)" title="修改"></el-button>
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" v-show="scope.row.signState==='未签约'" @click="openDialog('签约',scope.row.id,'tiny')">签约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-button type="text" style="color: #48576a; padding:5px 0;" @click="deleteData()">删除</el-button>
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
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible" :size="dialogSize">
        <div class="dialog-advancedSearch" v-show="dialogTitle==='高级搜索'">
          <el-form :model="advancedSearchForm" ref="advancedSearchForm" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="advancedSearchForm.name" placeholder="例：京鹏"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="detailAddress">
              <el-input v-model="advancedSearchForm.detailAddress" placeholder="例：深圳市罗湖区"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="advancedSearchForm.mobile" placeholder="例：13132541515"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码" prop="orgCode">
              <el-input v-model="advancedSearchForm.orgCode" placeholder="例：HJDHHJD5656d"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="dutyName">
              <el-input v-model="advancedSearchForm.dutyName" class="name" placeholder="例：帅帅"></el-input>
            </el-form-item>
            <el-form-item label="签约状态" prop="signState">
              <el-radio class="radio" v-model="advancedSearchForm.signState" :label="0">未签约</el-radio>
              <el-radio class="radio" v-model="advancedSearchForm.signState" :label="1">已签约</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
            </el-row>
          </div>
        </div>
        <div class="dialog-contract" v-show="dialogTitle==='签约'">
          <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="80px">
            <el-form-item label="签约人" prop="sign_name">
              <el-input v-model="contractForm.sign_name" placeholder="请输入签约人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="sign_phone">
              <el-input v-model="contractForm.sign_phone" placeholder="请输入签约人联系电话"></el-input>
            </el-form-item>
            <el-form-item label="回收单位" prop="recycle_id">
              <el-select v-model="contractForm.recycle_id" clearable placeholder="请选择签约回收单位">
                <el-option
                  v-for="item in recycleSelectOptions"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同期限" required>
              <el-col :span="11">
                <el-form-item prop="begin_time">
                  <el-date-picker v-model="contractForm.begin_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">~~</el-col>
              <el-col :span="11">
                <el-form-item prop="end_time">
                  <el-date-picker v-model="contractForm.end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="updateContract('contractForm')">保存</el-button>
            </el-row>
          </div>
        </div>
      </el-dialog>
       <!-- 营业执照弹框 -->
      <el-dialog v-model="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-restaurants-table',
    data () {
      var phoneValidator = (rule, value, callback) => {
        let phone = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        if (!value) {
          return callback(new Error('号码不能为空'))
        } else if (!phone.test(value)) {
          callback(new Error('请输入正确号码'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: false,
        dialogImageUrl: '',
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        advancedSearchForm: {
          name: '',
          detailAddress: '',
          mobile: '',
          orgCode: '',
          dutyName: '',
          signState: 0
        },
        contractForm: {
          begin_time: '',
          end_time: '',
          recycle_id: ''
        },
        dialogTitle: '',
        dialogFormVisible: false,
        dialogSize: 'small',
        searchSelectOptions: [{
          value: '',
          label: '所有信息'
        }, {
          value: 0,
          label: '未签约'
        }, {
          value: 1,
          label: '已签约'
        }],
        searchSelectValue: '', // 列表页顶部选择器的值
        restaurantsSelectedIds: [],
        editingId: 0,
        recycleSelectOptions: [],
        rules: {
          sign_name: [
            { required: true, message: '请输入签约人姓名', trigger: 'blur' }
          ],
          sign_phone: [
            { required: true, validator: phoneValidator, trigger: 'blur' }
          ],
          recycle_id: [
            { type: 'number', required: true, message: '请选择签约回收单位', trigger: 'change' }
          ],
          begin_time: [
            { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          end_time: [
            { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
          ]
        }
      }
    },
    computed: {},
    methods: {
      bigImg (url) {
        this.dialogImageUrl = url
        this.dialogVisible = true
      },
      getList (data = {}) {
        api.GET(config.restaurants.index, data)
          .then(response => {
            this.response = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      getRecycle (data = {}) {
        api.GET(config.restaurants.getRecycle, data)
          .then(response => {
            this.recycleSelectOptions = response.data.data
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      async deleteData (value) {
        // next表示是否进行下一步
        var next = true
        if (value) {
          this.selectIds(value)
        }
        if (!this.restaurantsSelectedIds.length) {
          next = await this.warnSelection(next)
        }
        if (next) {
          next = await this.confirmDelete(next)
        }
        if (next) {
          api.POST(config.restaurants.delete, {ids: this.restaurantsSelectedIds})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.onSuccess('删除成功')
              this.restaurantsSelectedIds = []
              this.getList()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
        }
      },
      toggleSwicth (value) {
        value.checkState = Number(value.checkState).toString()
        api.POST(config.restaurants.updateCheck, {id: value.id, checkState: value.checkState})
          .then(response => {
            if (response.data.errcode === '0000') {
              this.onSuccess('修改成功')
              let data = {
                pageSize: this.response.pageSize,
                currentPage: this.response.currentPage,
                contractStatus: this.searchSelectValue, // 签约状态
                ...this.form
              }
              this.getList(data)
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      updateContract (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Object.assign(this.contractForm, {id: this.editingId})
            api.POST(config.restaurants.updateSign, this.contractForm)
            .then(response => {
              if (response.data.errcode === '0000') {
                this.onSuccess('修改成功')
                let data = {
                  pageSize: this.response.pageSize,
                  currentPage: this.response.currentPage,
                  contractStatus: this.searchSelectValue, // 签约状态
                  ...this.form
                }
                this.getList(data)
                this.$refs[formName].resetFields()
                this.closeDialog()
                // this.contractForm = {
                //   begin_time: '',
                //   end_time: '',
                //   recycle_id: ''
                // }
              }
            })
            .catch(error => {
              this.$message.error(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleSizeChange (value) {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: value,
          signState: this.searchSelectValue, // 签约状态
          ...this.form
        }
        this.getList(data)
      },
      handleCurrentChange (value) {
        const data = {
          currentPage: value,
          pageSize: this.response.pageSize,
          signState: this.searchSelectValue, // 签约状态
          ...this.form
        }
        this.getList(data)
      },
      // searchSelect () {
      //   const data = {
      //     currentPage: this.response.currentPage,
      //     pageSize: this.response.pageSize,
      //     signState: this.searchSelectValue, // 签约状态
      //     ...this.form
      //   }
      //   this.getList(data)
      // },
      // 搜索按钮
      onSearch () {
        let data = {
          currentPage: 1,
          pageSize: this.response.pageSize,
          signState: this.searchSelectValue, // 签约状态
          ...this.form
        }
        this.getList(data)
      },
      // 高级搜索
      onAdvancedSearch () {
        // 清空选择器和搜索框
        this.searchSelectValue = ''
        this.form.keyword = ''
        var obj = this.advancedSearchForm
        const data = {
          currentPage: 1,
          pageSize: this.response.pageSize,
          ...obj
        }
        api.GET(config.restaurants.index, data)
          .then(response => {
            this.response = this.transformData(response.data.data)
            this.advancedSearchForm = {
              name: '',
              detailAddress: '',
              mobile: '',
              orgCode: '',
              dutyName: '',
              signState: 0
            }
            this.closeDialog()
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      transformData (res) {
        res.data.forEach(v => {
          if (v.created_at) {
            v.created_at = this.formatDate(v.created_at)
          }
          if (v.signState === 0) {
            v.signState = '未签约'
          }
          if (v.signState === 1) {
            v.signState = '已签约'
          }
          if (v.checkState === 0) {
            v.checkState = false
          }
          if (v.checkState === 1) {
            v.checkState = true
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
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否删除
      confirmDelete (next) {
        return this.$confirm('此操作将删除选定的企业。是否继续删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 单行记录、多行记录、未选择记录操作生成id数组
      selectIds (value) {
        this.restaurantsSelectedIds = []
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组，未选择记录未传参数
        if (value !== undefined) {
          if (value.length === undefined) {
            this.restaurantsSelectedIds.push(value)
          } else {
            this.restaurantsSelectedIds = value.map(v => {
              return v.id
            })
          }
        }
      },
      toAddStatus () {
        this.$router.push({
          path: '/admin/recycle/restaurants/add'
        })
      },
      toEditStatus (id) {
        this.$router.push({
          path: '/admin/recycle/restaurants/edit',
          query: {
            id: id
          }
        })
      },
      openDialog (value, id, size) {
        this.editingId = id
        this.dialogTitle = value
        this.dialogFormVisible = true
        this.dialogSize = size
        if (this.dialogTitle === '签约') {
          this.getRecycle()
        }
      },
      closeDialog () {
        this.dialogFormVisible = false
        this.dialogTitle = ''
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      }
    },
    components: {
    },
    mounted () {
      this.getList()
    }
  }
</script>

<style scoped>
  .name {
    width: 20%;
  }

 .el-date-editor.el-input {
    width: 100%;
  }
</style>