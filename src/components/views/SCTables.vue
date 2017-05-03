<template>
  <div class="sc-table">
    <div class="sc-table-header">
      <el-row type="flex" justify="space-between">
        <el-col :xs="24" :sm="18" :md="12" :lg="6">
          <el-row type="flex" justify="space-between">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disbaled="true">
              </el-option>
            </el-select>
            <el-input v-model="input" placeholder="请输入内容" class="sc-table-header-select"></el-input>
            <el-button type="primary">搜索</el-button>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="6" :md="12" :lg="4">
          <el-row type="flex" justify="space-around">
            <el-button>高级搜索</el-button>
            <el-button>导出</el-button>
            <el-button>自定义</el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="sc-table-content">
      <el-table :data="tableData">
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small">详情</el-button>
            <el-button size="small">修改</el-button>
            <el-button size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sc-table-footer"></div>
  </div>
</template>

<script>
  export default {
    name: 'sc-table',
    data () {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        input: '',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    computed: {},
    components: {},
    method: {}
  }
</script>
<style scoped>
  .sc-table {
    border-top: 1px solid lightgray;
    padding-top: 2rem;
    margin-top: 2rem;
  }
</style>
