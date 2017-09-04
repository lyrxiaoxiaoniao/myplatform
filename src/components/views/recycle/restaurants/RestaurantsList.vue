<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="15">
          <el-button type="primary" @click="openDialog('新增专题')">添加</el-button>
        </el-col>
        <el-col :span="2" style="margin-right:10px;">
          <el-select v-model="searchSelectValue" placeholder="所有信息" style="width:105px;" @change="searchSelect">
            <el-option
              v-for="item in searchSelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.keyword" placeholder="" class="sc-table-header-select">
            <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
          </el-input>
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
        <el-table-column prop="display_name" label="企业名称"></el-table-column>
        <el-table-column prop="articleCount" label="负责人" width="80"></el-table-column>
        <el-table-column prop="display_name" label="联系电话"></el-table-column>
        <el-table-column prop="display_name" label="营业执照">
          <template scope="scope">
            <img :src="scope.row.is_recommend" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="签约状态"></el-table-column>
        <el-table-column prop="is_recommend" label="审核状态" width="120">
          <template scope="scope">
            <el-switch on-text="已" off-text="未" v-model="scope.row.is_recommend" @change="toggleSwicth(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="详细地址"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template scope="scope">
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" icon="edit" @click="openDialog('修改专题',scope.row.id)" title="修改"></el-button>
            <el-button size="small" v-if="scope.row.id" @click="openDialog('签约',scope.row.id)">签约</el-button>
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
      <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
        <div class="dialog-advancedSearch" v-show="dialogTitle==='高级搜索'">
          <el-form :model="advancedSearchForm" :rules="rules" ref="advancedSearchForm" label-width="100px">
            <el-form-item label="企业名称" prop="display_name" style="margin-bottom:30px;">
              <el-input v-model="advancedSearchForm.display_name" placeholder="例：京鹏" @blur="checkSubjectName"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="sort">
              <el-input v-model="advancedSearchForm.display_name" placeholder="例：深圳市罗湖区"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="description">
              <el-input v-model="advancedSearchForm.description" placeholder="例：13132541515"></el-input>
            </el-form-item>
            <el-form-item label="组织机构代码" prop="description">
              <el-input v-model="advancedSearchForm.description" placeholder="例：HJDHHJD5656d"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="description">
              <el-input v-model="advancedSearchForm.description" class="name" placeholder="例：帅帅"></el-input>
            </el-form-item>
            <el-form-item label="签约状态" prop="description">
              <el-radio class="radio" v-model="advancedSearchForm.contractStatus" label="0">未签约</el-radio>
              <el-radio class="radio" v-model="advancedSearchForm.contractStatus" label="1">已签约</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm('advancedSearchForm')">搜索</el-button>
            </el-row>
          </div>
        </div>
        <div class="dialog-contract" v-show="dialogTitle==='签约'">
          <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="100px">
            <el-form-item label="签约人" prop="display_name">
              <el-input v-model="contractForm.display_name" placeholder="请输入签约人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="sort">
              <el-input v-model="contractForm.display_name" placeholder="请输入签约人联系电话"></el-input>
            </el-form-item>
            <el-form-item label="回收单位" prop="description">
              <el-input v-model="contractForm.description" placeholder="请输入签约回收单位"></el-input>
            </el-form-item>
            <el-form-item label="合同期限" prop="description">
              <el-date-picker v-model="contractForm.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
              <el-date-picker v-model="contractForm.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="editForm">保存</el-button>
            </el-row>
          </div>
        </div>
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
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        advancedSearchForm: {
          contractStatus: '0'
        },
        contractForm: {
        },
        dialogTitle: '',
        dialogFormVisible: false,
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
        restaurantsSelectedIds: []
      }
    },
    computed: {},
    methods: {
      handleSizeChange (value) {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: value,
          contractStatus: this.searchSelectValue, // 签约状态
          ...this.form
        }
        this.getList(data)
      },
      handleCurrentChange (value) {
        const data = {
          currentPage: value,
          pageSize: this.response.pageSize,
          contractStatus: this.searchSelectValue, // 签约状态
          ...this.form
        }
        this.getList(data)
      },
      searchSelect () {
        const data = {
          currentPage: this.response.currentPage,
          pageSize: this.response.pageSize,
          contractStatus: this.searchSelectValue, // 签约状态
          ...this.form
        }
        this.getList(data)
      },
      // 搜索按钮
      onSearch () {
        let data = {
          currentPage: 1,
          pageSize: this.response.pageSize,
          contractStatus: this.searchSelectValue, // 签约状态
          ...this.form
        }
        // console.log(typeof this.selectValue)
        // const data = {
        //   currentPage: 1,
        //   pageSize: this.response.pageSize,
        //   ...this.form
        // }
        this.getList(data)
      },
      // 高级搜索
      onAdvancedSearch () {
        // 清空选择器和搜索框
        this.searchSelectValue = ''
        this.form.keyword = ''
        var obj = this.advancedSearchForm
        // obj.is_recommend = this.changeState(obj.is_recommend)
        // obj.is_topped = this.changeState(obj.is_topped)
        // obj.category_id = this.cascaderValue[this.cascaderValue.length - 1]
        const data = {
          currentPage: 1,
          pageSize: this.response.pageSize,
          ...obj
        }
        api.POST(config.content.list, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
          this.closeDialog()
          this.advancedSearchForm = {
            keyword: '',
            start_time: '',
            end_time: '',
            states: [],
            types: [],
            author: ''
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      getList (data = {}) {
        api.GET(config.categoryIndexAPI, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
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
          if (v.status === 0) {
            v.status = '待审核'
          }
          if (v.status === 1) {
            v.status = '已审核'
          }
          if (v.status === 2) {
            v.status = '退回'
          }
          if (v.status === 3) {
            v.status = '已归档'
          }
          if (v.status === 4) {
            v.status = '出档'
          }
          switch (v.active) {
            case 0:
              v.active = false
              break
            case 1:
              v.active = true
              break
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
      deleteData (value) {
        this.selectIds(value)
        api.POST(config.deleteCategoryAPI, {ids: this.restaurantsSelectedIds})
          .then(response => {
            if (response.status !== 200) {
              this.error = response.statusText
              return
            }
            if (response.data.errcode === '0000') {
              this.onSuccess('删除成功')
              this.getList()
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      toggleSwicth (value) {
        value.is_recommend = Number(value.is_recommend)
        api.POST(config.subject.update, value)
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            })
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
      // 单行记录和多行记录操作生成id数组
      selectIds (value) {
        this.restaurantsSelectedIds = []
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组
        if (value.length === undefined) {
          this.restaurantsSelectedIds.push(value)
        } else {
          this.restaurantsSelectedIds = value.map(v => {
            return v.id
          })
        }
      },
      openDialog (value, id) {
        this.dialogTitle = value
        this.dialogFormVisible = true
      },
      closeDialog () {
        this.dialogFormVisible = false
        this.dialogTitle = ''
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
  /*
  .sc-report-table {
    margin-left: 2rem;
    margin-right: 2rem;
    padding-bottom: 1rem;
  }

  .search-form {
    padding: 1rem;
  }

  .sc-report-table-header {
    margin: 1rem 2rem;
    padding-bottom: 1rem;
  }

  .sc-report-table-content {
    margin-bottom: 20px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .top-ruleForm .el-form-item {
    margin-bottom: 10px;
  }
  */

  .name {
    width: 20%;
  }

  .el-date-editor--datetime {
    width: 49.6%;
  }
</style>