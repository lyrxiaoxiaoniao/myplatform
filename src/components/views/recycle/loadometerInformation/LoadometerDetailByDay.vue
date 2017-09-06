<template>
  <div class="loadometerStatistics-container">
    <TopInfo></TopInfo>
    <div class="bottom">
      <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="upload2" style="margin-left: 10px"></el-button>
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
            <el-table-column prop="id" label="过磅编号" width="150"></el-table-column>
            <el-table-column prop="display_name" label="回收车辆" width="150"></el-table-column>
            <el-table-column prop="articleCount" label="回收车辆照片" width="200"></el-table-column>
            <el-table-column prop="display_name" label="日期时间" width="150"></el-table-column>
            <el-table-column prop="display_name" label="地磅计量（吨）"></el-table-column>
            <el-table-column prop="display_name" label="地磅数值照片"></el-table-column>
            <el-table-column prop="display_name" label="校核员"></el-table-column>
            <el-table-column label="操作" width="120px">
              <template scope="scope">
                <el-button size="small" type="primary" @click="toEditStatus(scope.row.id)">确认校核</el-button>
                <el-button size="small">已校核</el-button>
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
        </div>
      </kobe-table>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" size="tiny">
      <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="100px">
        <el-form-item label="过磅编号" prop="display_name">
          <el-input v-model="infoForm.display_name" placeholder="请输入站点名称"></el-input>
        </el-form-item>
        <el-form-item label="回收车辆" prop="sort">
          <el-input v-model="infoForm.display_name" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="description">
          <el-input v-model="infoForm.description" placeholder="请输入固定电话"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="description">
          <el-input v-model="infoForm.description" placeholder="请输入负责人姓名"></el-input>
        </el-form-item>
        <el-form-item label="地磅计量" prop="description">
          <el-input v-model="infoForm.description" placeholder="请输入负责人联系电话"></el-input>
        </el-form-item>
        <el-form-item label="地磅点" prop="description">
          <el-input v-model="infoForm.description" placeholder="请输入负责人联系电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" justify="end">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="update">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import config from 'src/config'
  // import api from 'src/api'
  import TopInfo from './TopInfo.vue'

  export default {
    name: 'sc-loadometerStatistics-table',
    data () {
      return {
        response: {
          data: null
        },
        infoForm: {},
        loadometerSelectedIds: [],
        loadometerId: 0, //  表格操作单行时的id
        dialogTitle: '',
        dialogFormVisible: false
      }
    },
    components: {
      TopInfo
    },
    computed: {},
    methods: {
      handleSizeChange (value) {
        // const data = {
        //   currentPage: this.response.currentPage,
        //   pageSize: value,
        //   ...this.form
        // }
      },
      handleCurrentChange (value) {
        // const data = {
        //   currentPage: value,
        //   pageSize: this.response.pageSize,
        //   ...this.form
        // }
      },
      toEditStatus (id) {
        this.openDialog('确认校核', id)
        // 获取该id的地磅信息
      },
      update () {
        // 发起更新和确认审核的请求
      },
      openDialog (value, id) {
        this.loadometerId = id
        this.dialogTitle = value
        this.dialogFormVisible = true
      }
    },
    mounted () {
      // 获取地磅点信息
      // 获取地磅点按天信息统计信息
    }
  }
</script>

<style lang="scss" scoped>
  .loadometerStatistics-container {
    padding: 1rem 2rem;
    .bottom {
      border: 1px solid lightgray;
      background-color: #fff;
      border-radius: 5px;
      width: 100%;
      padding-bottom: 1rem;
    }
    .bottom {
      margin-top: 1rem;
    }
    .table-head {
      padding: 0 2rem;
      width: 100%;
      display: flex;
      align-items: center;
      height: 60px;
    }
    .table-body {
      margin: 1rem 2rem;
    }
  }
</style>