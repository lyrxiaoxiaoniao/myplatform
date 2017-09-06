<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="15">
          <el-button type="primary" @click="toAddStatus">添加</el-button>
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
        <el-col :span="5" style="margin-right:10px;">
          <el-input v-model="form.keyword" placeholder="" class="sc-table-header-select">
            <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
          </el-input>
        </el-col>
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
        <el-table-column prop="id" label="地磅站点编号" width="120"></el-table-column>
        <el-table-column prop="display_name" label="站点名称"></el-table-column>
        <el-table-column prop="articleCount" label="垃圾类型" width="100"></el-table-column>
        <el-table-column prop="display_name" label="负责人" width="100"></el-table-column>
        <el-table-column prop="display_name" label="联系电话"></el-table-column>
        <el-table-column prop="sort" label="详细地址"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="toEditStatus(scope.row.id)" title="修改"></el-button>
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" icon="information" @click="toStatistics(scope.row.id)" title="详情"></el-button>
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
        <el-form :model="loadometerInfoForm" :rules="rules" ref="loadometerInfoForm" label-width="100px">
          <el-form-item label="站点名称" prop="display_name">
            <el-input v-model="loadometerInfoForm.display_name" placeholder="请输入站点名称"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="sort">
            <el-input v-model="loadometerInfoForm.display_name" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="固定电话" prop="description">
            <el-input v-model="loadometerInfoForm.description" placeholder="请输入固定电话"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="description">
            <el-input v-model="loadometerInfoForm.description" placeholder="请输入负责人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="description">
            <el-input v-model="loadometerInfoForm.description" placeholder="请输入负责人联系电话"></el-input>
          </el-form-item>
          <el-form-item label="垃圾类型" prop="description">
            <el-dropdown>
              <el-button type="primary">
                请选择<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>大件垃圾</el-dropdown-item>
                <el-dropdown-item>餐厨垃圾</el-dropdown-item>
                <el-dropdown-item>烟花爆竹</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-row type="flex" justify="end">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="addLoadometer" v-show="dialogTitle==='新增地磅点'">确定</el-button>
            <el-button type="primary" @click="updateLoadometer" v-show="dialogTitle==='详情/编辑'">确定</el-button>
          </el-row>
        </div>
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-loadometerInformation-table',
    data () {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        loadometerInfoForm: {
        },
        dialogTitle: '',
        dialogFormVisible: false,
        searchSelectOptions: [], // 列表页顶部选择器的可选值
        searchSelectValue: '', // 列表页顶部选择器选中的值
        loadometerSelectedIds: [],
        loadometerId: 0 //  表格操作单行时的id
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
        api.POST(config.deleteCategoryAPI, {ids: this.loadometerSelectedIds})
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
      addLoadometer () {
        // 参数loadometerInfoForm
      },
      updateLoadometer () {
        // loadometerInfoForm和loadometerId
        // api.POST(config.subject.update, value)
        //   .then(response => {
        //     if (response.data.errcode === '0000') {
        //       this.$notify({
        //         title: '成功',
        //         message: '修改成功',
        //         type: 'success'
        //       })
        //       let data = {
        //         pageSize: this.response.pageSize,
        //         currentPage: this.response.currentPage,
        //         contractStatus: this.searchSelectValue, // 签约状态
        //         ...this.form
        //       }
        //       this.getList(data)
        //     }
        //   })
        //   .catch(error => {
        //     this.$message.error(error)
        //   })
      },
      toStatistics (id) {
        this.$router.push({
          path: '/admin/recycle/loadometerinformation/statistics',
          query: {
            id: id
          }
        })
      },
      // 单行记录和多行记录操作生成id数组
      selectIds (value) {
        this.loadometerSelectedIds = []
        // 单行记录操作传进来的参数是数字，多行记录操作传进来的参数是数组
        if (value.length === undefined) {
          this.loadometerSelectedIds.push(value)
        } else {
          this.loadometerSelectedIds = value.map(v => {
            return v.id
          })
        }
      },
      toAddStatus () {
        this.openDialog('新增地磅点')
        // loadometerInfoForm清空
      },
      toEditStatus (id) {
        this.openDialog('详情/编辑', id)
        // 获取该id的地磅信息
      },
      openDialog (value, id) {
        this.loadometerId = id
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