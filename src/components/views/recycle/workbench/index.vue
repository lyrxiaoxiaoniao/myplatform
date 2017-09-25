<template>
<div>
    <div class="lh-bottom">
      <el-tabs v-model="activeName"  @tab-click="handleClick" style="margin:0 2em">
        <el-tab-pane label="待办工作" name="first">
          <do-tab v-if="firstId"></do-tab>
        </el-tab-pane>
        <el-tab-pane label="已办工作" name="second">
          <done-tab v-if="secondId"></done-tab>
        </el-tab-pane>
        <el-tab-pane label="待阅工作" name="third">
          <readed-tab v-if="thirdId"></readed-tab>
        </el-tab-pane>
        <el-tab-pane label="已阅工作" name="fourth">
          <read-tab v-if="fourthId"></read-tab>
        </el-tab-pane>    
      </el-tabs>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
// import config from 'src/config'
// import api from 'src/api'
import doneTab from './relTable/done'
import doTab from './relTable/do'
import readedTab from './relTable/readed'
import readTab from './relTable/read'
export default {
  data () {
    return {
      firstId: true,
      secondId: false,
      thirdId: false,
      fourthId: false,
      data: [],
      activeName: 'first',
      form: {
        keyword: '',
        value: ''
      }
    }
  },
  components: {
    doTab,
    doneTab,
    readTab,
    readedTab
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.firstId = true
        this.secondId = false
        this.thirdId = false
        this.fourthId = false
      }
      if (tab.name === 'second') {
        this.firstId = false
        this.secondId = true
        this.thirdId = false
        this.fourthId = false
      }
      if (tab.name === 'third') {
        this.firstId = false
        this.secondId = false
        this.thirdId = true
        this.fourthId = false
      }
      if (tab.name === 'fourth') {
        this.firstId = false
        this.secondId = false
        this.thirdId = false
        this.fourthId = true
      }
    }
  }
  // mounted () {
  //   this.getForm()
  // }
}

</script>
<style lang="scss" scoped>
.lh-container {
    padding: 1rem 2rem;
    .lh-top {
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 100%;
      background-color: #fff;
      padding-bottom: 1rem;
      .lh-header {
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
      .lh-form {
        margin: 1rem 2rem;
      }
    }
    .lh-bottom {
      margin-top: 1rem;
      border-radius: 5px;
      border: 1px solid lightgray;
      width: 100%;
      background-color: #fff;
      padding-bottom: 1rem;
      .lh-header {
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
    }
}
</style>