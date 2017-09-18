<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="15">
          <el-button type="primary" @click="toAddStatus">新增</el-button>
          <el-button type="primary" @click="deleteData()">批量删除</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
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
        :data="tableData"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column  prop="date" label="ID"></el-table-column>
        <el-table-column  prop="date" label="试卷名称"></el-table-column>
        <el-table-column  prop="date" label="题目生成"></el-table-column>
        <el-table-column  prop="date" label="题目数量"></el-table-column>
        <el-table-column  prop="date" label="答题时间"></el-table-column>
        <el-table-column  prop="date" label="阅卷方式"></el-table-column>
        <el-table-column  prop="date" label="关联活动"></el-table-column>
        <el-table-column  prop="date" label="答卷数量"></el-table-column>
        <el-table-column  prop="date" label="创建时间"></el-table-column>
        <el-table-column  prop="date" label="有效状态">
          <template scope="scope">
            <el-switch v-model="value1" on-text="是" off-text="否"></el-switch>
          </template>
        </el-table-column>
        <el-table-column  prop="date" label="操作">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="toEditStatus(scope.row.id)" title="修改"></el-button>
            <el-button size="small" icon="delete2" @click="deleteData(scope.row.id)" title="删除"></el-button>
            <el-button size="small" icon="setting"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
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
        <div class="dialog-advancedSearch">
          <el-form :model="advancedSearchForm" :rules="rules" ref="advancedSearchForm" label-width="100px">
            <el-form-item label="关键字" prop="name">
              <el-input v-model="advancedSearchForm.name" placeholder="例：京鹏"></el-input>
            </el-form-item>
            <el-form-item label="试卷名称" prop="detailAddress">
              <el-input v-model="advancedSearchForm.detailAddress" placeholder="例：深圳市罗湖区"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="题目生成" prop="mobile">
                  <el-input v-model="advancedSearchForm.mobile" placeholder="例：13132541515"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="阅卷方式" prop="orgCode">
                  <el-input v-model="advancedSearchForm.orgCode" placeholder="例：HJDHHJD5656d"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="是否启用" prop="dutyName">
              <el-switch v-model="value1" on-text="" off-text=""></el-switch>
            </el-form-item>
            <el-form-item label="创建时间" prop="signState">
              <el-date-picker v-model="value1" type="datetime" placeholder="选择开始时间"></el-date-picker>
              <el-date-picker v-model="value1" type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
            </el-row>
          </div>
        </div>
        <!-- <div class="dialog-contract" v-show="dialogTitle==='签约'">
          <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="100px">
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
                  :label="item.id"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="合同期限" prop="description">
              <el-date-picker v-model="contractForm.begin_time" type="datetime" placeholder="选择开始时间"></el-date-picker>
              <el-date-picker v-model="contractForm.end_time" type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-row type="flex" justify="end">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button type="primary" @click="updateContract">保存</el-button>
            </el-row>
          </div>
        </div> -->
      </el-dialog>
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-test-paper-table',
    data () {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        advancedSearchForm: {},
        dialogTitle: '',
        dialogFormVisible: true,
        restaurantsSelectedIds: [],
        editingId: 0
      }
    },
    computed: {},
    methods: {
      getList (data = {}) {
        api.GET(config.restaurants.index, data)
          .then(response => {
            this.response = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
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
      openDialog (value, id) {
        this.editingId = id
        this.dialogTitle = value
        this.dialogFormVisible = true
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

<style lang="scss" scoped>
</style>