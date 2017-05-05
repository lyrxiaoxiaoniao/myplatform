<template>
  <div v-if="response" class="sc-user-table">
    <el-form v-if="advancedForm" class="search-form" :model="searchForm">
      <el-form-item label="ID">
        <el-input :model="advancedForm.id"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input :model="advancedForm.username"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input :model="advancedForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input :model="advancedForm.address"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.startDate" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="searchForm.endDate" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
    </el-form>
    <div class="sc-table-header">
      <el-row type="flex" justify="space-around">
        <el-col :span="16">
          <el-row type="flex">
            <el-col :span="4">
              <el-select v-model="searchSelect" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disbaled="true">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input v-model="searchInput" placeholder="请输入内容" class="sc-table-header-select"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button @click="onSingleSearch" class="sc-table-search-btn" type="primary">搜索</el-button>
              <el-button @click="onAdvancedSearch" type="primary" icon="search">高级搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="plus" @click="showDialogForm"></el-button>
            <el-button type="primary" icon="upload2"></el-button>
            <el-button type="primary" icon="setting"></el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="sc-table-content">
      <el-table :data="response.data" border stripe :default-sort="{prop: 'date', order: 'descending'}">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="150" sortable></el-table-column>
        <el-table-column prop="email" label="Email" width="190"></el-table-column>
        <el-table-column prop="address" label="地址" width="200"></el-table-column>
        <el-table-column
          prop="tags"
          label="标签"
          width="180">
          <template scope="scope">
            <el-tag
              :key="tag"
              v-for="tag in scope.row.tags"
              :closable="true"
              :close-transition="false"
              @close="handleClose(tag,scope.row.tags)">
              {{tag}}

            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="handleInputConfirm(scope.row.id)"
              @blur="handleInputConfirm(scope.row.id)">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row.id)">添加标签
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" icon="document"></el-button>
            <el-button size="small" icon="edit"></el-button>
            <el-button @click="onDeleteUser(scope.row.id)" size="small" type="danger" icon="delete2"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-table-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination
            :current-page="response.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            :total="response.count"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <div class="dialog">
      <el-dialog title="新增用户" v-model="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="'120px'">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="'120px'">
            <el-input :label-width="'120px'"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身份证正面照" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="身份证反面照" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户个人头像" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户电话" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="联系地址" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人信息" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="用户类型" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="备注" :label-width="'120px'">
            <el-input></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'sc-user-table',
  data () {
    return {
      searchSelect: '',
      searchInput: '',
      advancedForm: false,
      searchForm: {
        id: '',
        username: '',
        phone: '',
        startDate: '',
        endDate: '',
        address: '',
        createdAt: ''
      },
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      userListURL: 'http://192.168.1.2:8080/admin/user/index',
      removeUserURL: 'http://192.168.1.2:8080/admin/user/delete',
      response: null,
      options: [],
      error: null
    }
  },
  computed: {
  },
  components: {},
  methods: {
    handleClose (tag, tagList) {
      //  todo
      tagList.splice(tagList.indexOf(tag), 1)
    },
    showInput (id) {
      this.tableData[parseInt(id) - 1].inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm (id) {
      let inputValue = this.tableData[parseInt(id) - 1].inputValue
      if (inputValue) {
        this.tableData[parseInt(id) - 1].tags.push(inputValue)
      }
    },
    onSingleSearch () {
      if (this.searchSelect === '') {
        return
      } else if (this.searchInput === '') {
        return
      }

      // TODO search user
    },
    onAdvancedSearch () {
      console.log('111')
      this.advancedForm = !this.advancedForm
    },
    onDeleteUser (id) {
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // delete user
        axios.post(this.removeUserURL, {
          id: id
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getUserLists () {
      axios.get(this.userListURL)
      .then(response => {
        console.log(response)

        if (response.status !== 200) {
          this.error = response.statusText
          return
        }
        if (response.data.errcode === '0000') {
          this.response = response.data.data
          for (let value in this.response.data[0]) {
            let object = {}
            object.value = value
            this.options.push(object)
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    showDialogForm () {
      this.dialogFormVisible = true
      console.log(1, this.dialogFormVisible)
    }
  },
  mounted () {
    console.log('222')
    this.getUserLists()
  }
}
</script>
<style scoped>
  .sc-user-table {
    border-top: 1px solid lightgray;
    padding-top: 2rem;
    margin-left: 2rem;
    margin-top: 2rem;
    margin-right: 2rem;
  }

  .sc-table-header {
    margin-bottom: 20px;
  }

  .sc-table-content {
    margin-bottom: 10px;
  }

  .sc-table-search-btn {
    margin-left: 20px;
  }
</style>
