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
        <el-tabs v-model="activeTab" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="标签题目" name="accord">
            <QuestionsTable :list="response.data" :cascaderData=""></QuestionsTable>
          </el-tab-pane>
          <el-tab-pane label="其他题目" name="other">其他题目</el-tab-pane>
        </el-tabs>
      </div>
    </div>
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