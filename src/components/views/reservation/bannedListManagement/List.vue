<template>
  <div class="sc-reservation-banned-list">
    <kobe-table>
      <div class="kobe-table-header" slot="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-button type="primary" icon="plus" @click="openDialog('新增用户')">新增</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-col :span="7">
            <el-input placeholder="请输入关键字" class="sc-table-header-select">
              <el-button slot="append" class="sc-table-search-btn" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button type="primary" @click="openDialog('高级搜索')">高级</el-button>
          <el-button type="primary" icon="upload2"></el-button>
          <el-button type="primary" icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table :data="listData">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="ID"></el-table-column>
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="手机号"></el-table-column>
          <el-table-column label="入库时间"></el-table-column>
          <el-table-column label="移除时间"></el-table-column>
          <el-table-column label="操作员ID"></el-table-column>
          <el-table-column label="黑名单原因"></el-table-column>
          <el-table-column label="状态"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button icon="edit" @click="openDialog('详情/编辑')"></el-button>
              <el-button icon="delete2"></el-button>
              <el-button icon="minus"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer" class="kobe-table-footer">
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="response.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="response.pageSize" :total="response.count" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </kobe-table>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" size="tiny">
      <div class="advanceSearch-dialog" v-show="dialogTitle==='高级搜索'">
        <el-form :model="advanceSearchForm" label-position="right" label-width="100px">
          <el-form-item label="关键字">
            <el-input v-model="advanceSearchForm.keyword"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="advanceSearchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="advanceSearchForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="advanceSearchForm.time"
              type="datetime"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="黑名单原因">
            <el-input type="textarea" :rows="4" v-model="advanceSearchForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-row type="flex" justify="end">
            <el-button type="danger" @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="advanceSearch">搜索</el-button>
          </el-row>
        </div>
      </div>
      <div class="add-dialog" v-show="dialogTitle==='新增用户'">
        <el-form :model="addForm" label-position="right" label-width="100px">
          <el-form-item label="姓名">
            <el-input v-model="addForm.keyword"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="黑名单原因">
            <el-input type="textarea" :rows="4" v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="黑名单说明">
            <el-input type="textarea" :rows="5" v-model="addForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-row type="flex" justify="end">
            <el-button type="danger" @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="advanceSearch">保存</el-button>
          </el-row>
        </div>
      </div>
      <div class="edit-dialog" v-show="dialogTitle==='详情/编辑'">
        <el-form :model="editForm" label-position="right" label-width="100px">
          <el-form-item label="姓名">
            <el-input v-model="editForm.keyword"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="黑名单原因">
            <el-input type="textarea" :rows="4" v-model="editForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="黑名单说明">
            <el-input type="textarea" :rows="5" v-model="editForm.address"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-row type="flex" justify="end">
            <el-button type="danger" @click="hideDialog">取消</el-button>
            <el-button type="primary" @click="advanceSearch">保存</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: null,
      response: {},
      selectValue: '',
      options: [{
        value: '1',
        label: '罗湖区'
      },
      {
        value: '2',
        label: '福田区'
      }],
      dialogVisible: false,
      dialogTitle: '',
      advanceSearchForm: {
        keyword: '',
        name: '',
        mobile: '',
        person: '',
        address: ''
      },
      addForm: {},
      editForm: {}
    }
  },
  methods: {
    openDialog(titleName) {
      this.dialogTitle = titleName
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    advanceSearch() {
      this.hideDialog()
    }
  }
}
</script>

<style>

</style>
