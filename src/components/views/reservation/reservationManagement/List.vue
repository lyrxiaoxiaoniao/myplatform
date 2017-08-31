<template>
  <div class="sc-reservation-reserve-list">
    <kobe-table>
      <div class="kobe-table-header" slot="kobe-table-header">
        <el-row type="flex" justify="space-between">
          <el-col>
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
          <el-button type="primary" @click="openDialog">高级</el-button>
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
          <el-table-column label="申请人"></el-table-column>
          <el-table-column label="联系方式">
          </el-table-column>
          <el-table-column label="预约教育基地"></el-table-column>
          <el-table-column label="预约类型"></el-table-column>
          <el-table-column label="申请时间"></el-table-column>
          <el-table-column label="参观时间"></el-table-column>
          <el-table-column label="人数">
          </el-table-column>
          <el-table-column label="状态"></el-table-column>
          <el-table-column label="显示状态">
            <template scope="scope">
              <el-switch on-text="开" off-text="关"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button icon="edit" size="small"></el-button>
              <el-button icon="delete2" size="small" @click="deleteItem(scope.row.id)"></el-button>
              <el-button type="primary" size="small" @click="openDialog('dealVisible')">处理</el-button>
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
        <el-form-item label="申请人">
          <el-input v-model="advanceSearchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="预约类型">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教育基地">
          <el-input v-model="advanceSearchForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="advanceSearchForm.applyTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参观时间">
          <el-date-picker v-model="advanceSearchForm.attendTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button type="danger" @click="hideDialog">取消</el-button>
        <el-button type="primary" @click="advanceSearch">搜索</el-button>
      </div>
    </el-dialog>
    <el-dialog title="处理预约单" v-model="dealVisible" size="tiny">
      <el-form label-position="right" label-width="100px">
        <el-form-item label="处理方式">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见">
          <el-input v-model="advanceSearchForm.mobile" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
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
        address: '',
        applyTime: '',
        attendTime: ''
      },
      dealVisible: false
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
      this.$confirm('此操作将删除该安全教育基地，删除后，数据将无法恢复。是否继续删除？', '删除', {
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

</style>
