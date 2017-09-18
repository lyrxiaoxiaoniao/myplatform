<template>
  <div>
    <div class="question-list-header">
      <div>
        <el-checkbox v-model="allChecked" @change="toggleAllChecked">全选</el-checkbox>
        <el-button type="primary" v-show="tab==='accord'" @click="moveOut">批量移除</el-button>
        <el-button type="primary" v-show="tab==='other'" @click="moveIn">批量标签</el-button>
      </div>
      <div>
        <el-cascader
          placeholder="所有题库"
          :options="cascaderData"
          v-model="cascaderSelectedOptions"
          @change="handleCascaderChange">
        </el-cascader>
         <!-- <el-select v-model="searchSelectValue" style="width:105px;" @change="searchSelect">
          <el-option
            v-for="item in searchSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-input v-model="form.keyword" placeholder="" class="sc-table-header-select" style="width:200px;margin-left:10px;">
          <el-button slot="append" class="sc-table-search-btn" @click="onSearch" icon="search"></el-button>
        </el-input>
        <el-button @click="openDialog" icon="search" type="primary" style="margin-left:10px;">高级</el-button>
      </div>
    </div>
    <div v-for="n in 5" class="question-list-item">
      <div class="main">
        <el-checkbox v-model="checkedList[n-1]" class="question-select">单选题</el-checkbox>
        <div class="question-content">
          <p>
            你觉得网游最吸引你的是什么
          </p>
          <ol type="A">
            <li>画面精美</li>
            <li>过关或升级时的成就感</li>
            <li>身边有同学或朋友在玩</li>
            <li>可以结交更多朋友</li>
          </ol>
        </div>
      </div>
      <p class="answer">
        <span class="title">【正确答案】</span>
        <span class="content">B、D、E</span>
      </p>
      <div class="footnote">
        <span class="footnote-item">
          <el-tag>生产经营</el-tag>
          <el-tag>安全管理</el-tag>
        </span>
        <span class="footnote-item">标签：</span>
        <span class="footnote-item">难度：3星</span>
        <span class="footnote-item">默认分值：2分</span>
        <span class="footnote-item">题目编号：000232</span>
      </div>
    </div>
  </div>
</template>
<script>
  // import config from 'src/config'
  // import api from 'src/api'

  export default {
    name: 'sc-questions-table',
    data () {
      return {
        response: {
          data: null
        },
        form: {
          keyword: ''
        },
        allChecked: false,
        checkedList: [false, false, true, false, false],
        cascaderSelectedOptions: [],
        idsList: [],
        selectedIds: []
      }
    },
    props: ['list', 'cascaderData', 'tab'],
    components: {
    },
    computed: {},
    methods: {
      // 切换所有项的选中状态
      toggleAllChecked () {
        console.log(this.allChecked)
        if (this.allChecked) {
          this.checkedList = [true, true, true, true, true]
        } else {
          this.checkedList = [false, false, false, false, false]
        }
      },
      getSelectedIds () {
        this.checkedList.forEach((val, index) => {
          if (val) {
            this.selectedIds.push(this.idsList[index])
          }
        })
      },
      handleCascaderChange () {
        this.$emit('getSelectedList')
      },
      onSearch () {
        this.$emit('getSelectedList')
      },
      openDialog () {
        this.$emit('openDialog')
      },
      moveOut () {
        this.$emit('moveOut')
      },
      moveIn () {
        this.$emit('moveIn')
      }
    },
    mounted () {
    },
    updated () {
      // 每次更新列表则重新获取checkedList和idsList
    }
  }
</script>
<style lang="scss" scoped>
  .question-list-header {
    display: flex;
    justify-content: space-between;
  }
  .question-list-item {
    border: 1px solid lightgray;
    margin-top: 1rem;
    padding: 1rem;
    font-size: 14px;
    color: #8391a5;
    .main {
      display: flex;
      .question-select {
        flex: none;
        color: #20a0ff;
        font-weight: 400;
        padding-right: 1rem;
      }
      .question-content {
        flex: 1;
        p {
          border-left: 1px solid #8391a5;
          padding-left: 1rem;
          font-weight: 600;
          line-height: 16px;
        }
        li {
          margin: 0.5rem 0;
        }
      }
    }
    .answer {
      .title {
        color: #f7ba2a;
      }
      .content {
        color: #20a0ff;
      }
    }
    .footnote {
      display: flex;
      flex-direction: row-reverse;
      span.footnote-item {
        padding: 0px 10px;
        border-right: 1px solid lightgray;
        height: 20px;
        &:first-child{
          border: none;
          padding: 0px;
        }
      }
    }
  }
  
</style>