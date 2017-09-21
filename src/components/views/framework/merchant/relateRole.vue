<template>
  <div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-col :span="16">
                <el-button @click="onFresh" type="primary">刷新</el-button>
            </el-col>
            <el-col :span="8">
                <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                    <el-button slot="append" @click="onSearch" icon="search"></el-button>
                </el-input>
            </el-col>
            <el-button icon="upload2" type="primary" style="margin-left: 10px;"></el-button>
            <el-button icon="setting" type="primary"></el-button>
          </el-row>
        </div>
        <div slot="kobe-table-content" class="kobe-table">
            <el-table
                ref="multipleTable"
                border
                stripe
                :data="response.data"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="60"></el-table-column>
                <el-table-column prop="name" label="商户名称"></el-table-column>
                <el-table-column prop="principal" label="负责人"></el-table-column>
                <el-table-column prop="level" label="商户级别" width="120"></el-table-column>
                <el-table-column prop="brief" label="商户简介"></el-table-column>
                <el-table-column label="创建时间">
                  <template scope="scope">{{scope.row.created_at | toDateTime}}</template>
                </el-table-column>
                <el-table-column prop="status" label="操作" width="120">
                  <template scope="scope"> 
                      <el-button @click="relaType(scope.row)" title="关联权限" size="small" class="fa fa-th-large"></el-button>
                      <el-button @click="relaMenuType(scope.row)" title="关联菜单" size="small" class="fa fa-link"></el-button>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <div slot="kobe-table-footer" class="kobe-table-footer">
            <el-row type="flex" justify="center">
                <el-col :span="8">
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
    </kobe-table>
    <!-- 关联弹窗 -->
    <el-dialog title="商户关联权限" v-model="relaShowDialog" top="5%">
        <el-form :model="relaForm" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="商户名称">
                    <el-input v-model="relaForm.name" disabled placeholder="商户名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人">
                    <el-input v-model="relaForm.principal" disabled placeholder="商户负责人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商户简介">
                    <el-input v-model="relaForm.brief" disabled placeholder="商户简介"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
              <el-tab-pane label="已关联权限" name="first">
                <related-role-table v-if="isFirst" :userid="usersid"></related-role-table>
              </el-tab-pane>
              <el-tab-pane label="待关联权限" name="second">
                <relate-role-table v-if="isSecond" :userid="usersid"></relate-role-table>
              </el-tab-pane>
              <el-tab-pane label="关联菜单" name="third">
                <menu-role-table v-if="isThird" :userid="usersid"></menu-role-table>
                <!-- <relate-role-table v-if="isThird" :userid="usersid"></relate-role-table> -->
              </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top:-20px;">
            <el-button @click="relaCloseDialog" >取消</el-button>
            <el-button type="primary" @click="saveRela">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 商户关联菜单 -->
    <!-- <el-dialog title="商户关联菜单" v-model="dialogVisible" top="5%">
        <el-form :model="relaForm" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="商户名称">
                    <el-input v-model="relaForm.name" disabled placeholder="商户名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人">
                    <el-input v-model="relaForm.principal" disabled placeholder="商户负责人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商户简介">
                    <el-input v-model="relaForm.brief" disabled placeholder="商户简介"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <menu-role-table v-if="dialogVisible" :userid="usersid"></menu-role-table>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top:-20px;">
            <el-button @click="saveRelaMenu" >取消</el-button>
            <el-button type="primary" @click="saveRelaMenu">关闭</el-button>
        </div>
    </el-dialog> -->
  </div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
import relatedRoleTable from './roletable/alreadyRela.vue'
import relateRoleTable from './roletable/noRela.vue'
import menuRoleTable from './menuRole/menuTable.vue'
export default {
  data () {
    return {
      relaShowDialog: false,
      dialogVisible: false,
      relaForm: {
        realname: null,
        phone: null,
        username: null
      },
      usersid: null,
      activeName: 'first',
      isFirst: true,
      isSecond: false,
      isThird: false,
      multipleSelection: [],
      response: {
        data: null
      },
      ids: [],
      form: {
        keyword: ''
      }
    }
  },
  components: {
    relatedRoleTable,
    relateRoleTable,
    menuRoleTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.isFirst = true
        this.isSecond = false
        this.isThird = false
      } else if (tab.name === 'second') {
        this.isFirst = false
        this.isSecond = true
        this.isThird = false
      } else if (tab.name === 'third') {
        this.isFirst = false
        this.isSecond = false
        this.isThird = true
      }
    },
    relaType (data) {
      this.usersid = data.id
      this.relaShowDialog = true
      this.relaForm = {
        ...this.relaForm,
        ...data
      }
    },
    // relaMenuType (data) {
    //   this.usersid = data.id
    //   this.dialogVisible = true
    //   this.relaForm = {
    //     ...this.relaForm,
    //     ...data
    //   }
    // },
    relaCloseDialog () {
      this.relaShowDialog = false
    },
    saveRela () {
      this.relaShowDialog = false
    },
    saveRelaMenu () {
      this.dialogVisible = false
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      this.multipleSelection.forEach(v => {
        this.ids.push(v.id)
      })
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.getList(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }

      this.getList(data)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getList(data)
    },
    transformDate (res) {
      res.data.forEach(v => {
        if (v.active === 1) {
          v.active = true
        }
        if (v.active === 0) {
          v.active = false
        }
        if (v.level === 1) {
          v.level = '普通用户'
        } else if (v.level === 2) {
          v.level = '高级用户'
        } else if (v.level === 3) {
          v.level = 'VIP用户'
        }
      })
      return res
    },
    getList (data = {}) {
      api.GET(config.merchant.index, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.response = this.transformDate(response.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
    },
    onFresh () {
      this.getList()
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style scoped>
.line{
    text-align: center;
}
</style>