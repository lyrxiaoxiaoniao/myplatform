<template>
  <div class="sc-reservation-comment-list">
    <kobe-table>
      <div class="kobe-table-header" slot="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-button type="primary">刷新</el-button>
            <el-button type="primary">批量删除</el-button>
          </el-col>
          <el-select v-model="value1" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-col :span="7">
            <el-input placeholder="请输入关键字" class="sc-table-header-select">
              <el-button slot="append" class="sc-table-search-btn" icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button type="primary" @click="openDialog('dialogVisible')" icon="search">高级</el-button>
          <el-button type="primary" icon="upload2"></el-button>
          <el-button type="primary" icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content" class="kobe-table">
        <el-table :data="listData">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="预约单号"></el-table-column>
          <el-table-column label="安全教育基地"></el-table-column>
          <el-table-column label="评分">
          </el-table-column>
          <el-table-column label="评论内容"></el-table-column>
          <el-table-column label="用户/IP地址"></el-table-column>
          <el-table-column label="评价时间"></el-table-column>
          <el-table-column label="审核通过">
            <template scope="scope">
              <el-switch on-text="开" off-text="关"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button icon="edit" size="small" @click="openDialog('dealVisible')"></el-button>
              <el-button icon="delete2" size="small" type="danger" @click="deleteItem(scope.row.id)"></el-button>
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
    <el-dialog title="高级搜索" v-model="dialogVisible" size="tiny">
      <el-form :model="advanceSearchForm" label-position="right" label-width="100px">
        <el-form-item label="关键字">
          <el-input v-model="advanceSearchForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="安全教育基地">
          <el-input v-model="advanceSearchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="advanceSearchForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="advanceSearchForm.person"></el-input>
        </el-form-item>
        <el-form-item label="评价时间">
          <el-date-picker v-model="advanceSearchForm.attendTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="danger" @click="hideDialog('dialogVisible')">取消</el-button>
        <el-button type="primary" @click="advanceSearch">搜索</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看/回复评价" v-model="dealVisible" size="tiny">
      <el-row class="item">
        <el-col :span="4" :offset="1">教育基地：</el-col>
        <el-col :span="8">测试</el-col>
        <el-col :span="4">用户：</el-col>
        <el-col :span="7">测试</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="4" :offset="1">时间：</el-col>
        <el-col :span="8">测试</el-col>
        <el-col :span="4">来源：</el-col>
        <el-col :span="7">测试</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="4" :offset="1">评分：</el-col>
        <el-col :span="19">
          <el-rate v-model="value" disabled show-text text-color="#ff9900" text-template="{value}">
          </el-rate>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="4" :offset="1">评价内容：</el-col>
        <el-col :span="19">测试</el-col>
      </el-row>
      <el-row class="item">
        <el-col :span="4" :offset="1">回复：</el-col>
        <el-col :span="19">
          <el-input type="textarea" :rows="6"></el-input>
        </el-col>
      </el-row>
      <div class="dialog-footer" slot="footer">
        <el-button type="danger" @click="hideDialog('dealVisible')">取消</el-button>
        <el-button type="primary" @click="advanceSearch">搜索</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [{ id: 1 }],
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
      advanceSearchForm: {
        keyword: '',
        name: '',
        mobile: '',
        person: '',
        address: ''
      },
      dealVisible: false,
      value: 3.6
    }
  },
  methods: {
    openDialog(e) {
      this[e] = true
    },
    hideDialog(e) {
      this[e] = false
    },
    deleteItem(id) {
      this.$confirm('此操作将删除选定的评论信息，删除后，数据将无法恢复。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>

<style>
.item {
  margin: .5rem 0;
  padding: .5rem 0;
  border-bottom: 1px solid lightgray;
}
.item:last-child {
  border: none;
}
</style>
