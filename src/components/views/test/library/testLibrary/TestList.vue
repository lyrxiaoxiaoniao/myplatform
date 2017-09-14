<template>
  <div class="sc-test-list">
    <el-card>
      <div slot="header"
           class="clearfix">
        <el-checkbox v-model="all">全选</el-checkbox>
      </div>
      <el-card v-for="item in list"
               class="problemsItem">
        <el-row class="problemWrapper">
          <el-col :span="2">
            <el-checkbox>{{item.type}}</el-checkbox>
          </el-col>
          <el-col :span="21"
                  :offset="1">
            <div class="title">{{item.id}}、{{item.title}}</div>
            <div class="answersList"
                 v-for="innerItem in item.options">
              {{innerItem.title}} 、 {{innerItem.text}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <span class="orange">【正确答案】</span>
          </el-col>
          <el-col :span="1"
                  :offset="1"
                  class="answers">
            {{item.answers.join('、')}}
          </el-col>
        </el-row>
        <div class="infoWrapper">
          <div class="infoItem">题目编号：{{item.no}}</div>
          <div class="infoItem">默认分值：{{item.opint}}分</div>
          <div class="infoItem">难度：{{item.easy}}星</div>
          <div class="labels">
            标签：
            <el-tag class="tagItem"
                    v-for="innerItem in item.label">{{innerItem}}</el-tag>
          </div>
          <el-button icon="edit"
                     size="mini"
                     type="primary"></el-button>
          <el-button icon="delete"
                     size="mini"
                     type="primary"
                     @click="deleteItem(item)"></el-button>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    deleteItem(item) {
      this.$confirm('此操作将从题库中删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.blue {
  color: #20A0FF;
  font-size: 14px;
}

.infoWrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;

  color: #777;
}

.infoItem {
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px solid #777;
}

.labels {
  margin-right: 10px;
}

.tagItem {
  margin-right: 10px;
}

.orange {
  color: #F7BA2A;
}

.answers {
  color: #20A0FF;
}

.answersList {
  margin-left: 10px;
  color: #777;
}

.title {
  margin-bottom: 10px;
}

.problemWrapper {
  margin-bottom: 20px;
  font-size: 14px;
}

.problemsItem {
  margin-bottom: 20px;
}
</style>
