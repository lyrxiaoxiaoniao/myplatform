<template>
  <div class="test-label-edit-container">
    <div class="top">
      <div class="head">
        <div>基本信息</div>
        <div>
          <el-button type="primary">保存</el-button>
        </div>
      </div>
      <div class="body">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="标签名称：">
                <el-input v-model="form.name" class="name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="包含题目数量：">
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <div class="body">
        <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="标签题目" name="accord">
            <QuestionsTable :list="response.data" :cascaderData="response.data" tab="accord" @getSelectedList="getSelectedList" @openDialog="openDialog" @moveOut="moveOut"></QuestionsTable>
          </el-tab-pane>
          <el-tab-pane label="其他题目" name="other">
            <QuestionsTable :list="response.data" :cascaderData="response.data" tab="other" @getSelectedList="getSelectedList" @openDialog="openDialog" @moveIn="moveIn"></QuestionsTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
      <el-form :model="advancedSearchForm" :rules="rules" ref="advancedSearchForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="题目类型：" prop="name">
              <el-input v-model="advancedSearchForm.name" placeholder="请选择题目类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="题目难度：" prop="detailAddress">
              <el-input v-model="advancedSearchForm.detailAddress" placeholder="请选择题目难度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="题干：" prop="mobile">
              <el-input v-model="advancedSearchForm.mobile" placeholder="请输入题干关键字"></el-input>
            </el-form-item>   
          </el-col>
          <el-col :span="12">
            <el-form-item label="答案：" prop="orgCode">
              <el-input v-model="advancedSearchForm.orgCode" placeholder="请输入答案关键字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="题目编号：" prop="dutyName">
              <el-input v-model="advancedSearchForm.dutyName" class="name" placeholder="请输入题目编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签：" prop="dutyName">
              <el-input v-model="advancedSearchForm.dutyName" class="name" placeholder="请输入标签内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="创建时间：" prop="dutyName">
          <el-date-picker v-model="value1" type="datetime"  placeholder="选择开始时间"></el-date-picker>
          <el-date-picker v-model="value1" type="datetime"  placeholder="选择结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="题目状态：" prop="signState">
          <el-radio class="radio" v-model="advancedSearchForm.signState" :label="0">可用</el-radio>
          <el-radio class="radio" v-model="advancedSearchForm.signState" :label="1">已删除</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row type="flex" justify="end">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="onAdvancedSearch">搜索</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'
  import QuestionsTable from './QuestionsTable.vue'

  export default {
    name: 'sc-test-label-edit-table',
    data() {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        activeTab: 'accord',
        advancedSearchForm: {
          signState: 0
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
        selectedIds: [],
        editingId: 0
      }
    },
    computed: {},
    methods: {
      getAccordList (data = {}) {
        api.GET(config.restaurants.index, data)
          .then(response => {
            this.response = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      getOtherList (data = {}) {
        api.GET(config.restaurants.index, data)
          .then(response => {
            this.response = this.transformData(response.data.data)
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      async moveOut () {
        // next表示是否进行下一步
        var next = true
        if (!this.loadometerSelectedIds.length) {
          next = await this.warnSelection(next)
        }
        if (next) {
          next = await this.confirmOperation(next, '此操作将选中的题目移除到标签“生产经营”外，移除后，选中的题目不再带有“生产经营”标签。是否继续移除？')
        }
        if (next) {
          console.log('发起请求')
          this.loadometerSelectedIds = []
          // api.POST(config.loadometer.delete, {ids: this.loadometerSelectedIds})
          // .then(response => {
          //   if (response.status !== 200) {
          //     this.error = response.statusText
          //     return
          //   }
          //   if (response.data.errcode === '0000') {
          //     this.onSuccess('删除成功')
          //     this.getList()
          //   }
          // })
          // .catch(error => {
          //   this.$message.error(error)
          // })
        }
      },
      async moveIn () {
        // next表示是否进行下一步
        var next = true
        if (!this.loadometerSelectedIds.length) {
          next = await this.warnSelection(next)
        }
        if (next) {
          next = await this.confirmOperation(next, '是否确认将选中的题目都打上“生产经营”标签？')
        }
        if (next) {
          console.log('发起请求')
          this.loadometerSelectedIds = []
          // api.POST(config.loadometer.delete, {ids: this.loadometerSelectedIds})
          // .then(response => {
          //   if (response.status !== 200) {
          //     this.error = response.statusText
          //     return
          //   }
          //   if (response.data.errcode === '0000') {
          //     this.onSuccess('删除成功')
          //     this.getList()
          //   }
          // })
          // .catch(error => {
          //   this.$message.error(error)
          // })
        }
      },
      getSelectedList (data) {
        switch (this.activeTab) {
          case 'accord':
            this.getAccordList()
            break
          case 'other':
            this.getOtherList()
            break
        }
      },
      handleTabClick () {
        switch (this.activeTab) {
          case 'accord':
            this.getAccordList()
            break
          case 'other':
            this.getOtherList()
            break
        }
      },
      onAdvancedSearch () {
        switch (this.activeTab) {
          case 'accord':
            this.getAccordList()
            break
          case 'other':
            this.getOtherList()
            break
        }
      },
      openDialog () {
        this.dialogTitle = '高级搜索'
        this.dialogFormVisible = true
      },
      closeDialog () {
        this.dialogFormVisible = false
        this.dialogTitle = ''
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
      // 确认是否执行操作
      confirmOperation (next, str) {
        return this.$confirm(str, '提示', {
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
      }
    },
    components: {
      QuestionsTable
    },
    mounted() {
      this.getAccordList()
    }
  }
</script>

<style lang="scss" scoped>
  .test-label-edit-container {
    padding: 1rem 2rem;
    .top, .bottom {
      background-color: #fff;
      border: 1px solid lightgray;
    }
    .bottom {
      margin-top: 1rem;
    }
    .head {
      padding: 0 2rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      border-bottom: 1px solid lightgray;
      div:nth-of-type(1){
        font-size: 16px;
      }
    }
    .body {
      margin: 1rem 2rem;
    }
    .body {
      .name {
        width: 50%;
      }
    }
  }
</style>