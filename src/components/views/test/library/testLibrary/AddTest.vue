<template>
  <div class="sc-add-test">
    <el-card class="box-card">
      <div class="clearfix"
           slot="header">
        <el-button @click="back"
                   type="primary"
                   icon="d-arrow-left">
          返回
        </el-button>
        <el-button style="float: right;"
                   type="primary">保存</el-button>
      </div>
      <div class="formWrapper">
        <div class="formItem half">
          <div class="title">题目类型：</div>
          <div class="inputWrapper">
            <el-select v-model="value"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="formItem half">
          <div class="title">默认分值：</div>
          <div class="inputWrapper">
            <el-input-number v-model="num1"
                             :min="1"
                             :max="10"></el-input-number>
          </div>
        </div>
        <div class="formItem half">
          <div class="title">题目难度：</div>
          <div class="inputWrapper">
            <el-rate v-model="value1"></el-rate>
          </div>
        </div>
        <div class="formItem half">
          <div class="title">标签：</div>
          <div class="inputWrapper">
            <el-tag :key="tag"
                    v-for="tag in dynamicTags"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input class="input-new-tag"
                      v-if="inputVisible"
                      v-model="inputValue"
                      ref="saveTagInput"
                      size="mini"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm">
            </el-input>
            <el-button v-else
                       class="button-new-tag"
                       size="small"
                       @click="showInput"
                       type="primary">+ 添加标签</el-button>
          </div>
        </div>
        <div class="formItem">
          <div class="title">题目：</div>
          <div class="inputWrapper">
            <vue-html5-editor></vue-html5-editor>
          </div>
        </div>
        <div class="formItem">
          <div class="title">答案：</div>
          <div class="inputWrapper">
            <div class="singleChoiceWrapper"
                 v-if="value === '单选题'">
              <div class="radioWrapper">
                <el-radio class="radio"
                          v-model="radio"
                          label="1">使用文本答案</el-radio>
                <el-radio class="radio"
                          v-model="radio"
                          label="2">使用图片答案</el-radio>
              </div>
              <div class="optionsWrapper">
                <div class="optionItem"
                     v-for="item in singleLength">
                  <el-radio v-model="singleRadio"
                            :label="item">{{abc[item-1]}}、</el-radio>
                  <el-input class="optionInput"></el-input>
                  <el-button size="mini"
                             icon="circle-close"></el-button>
                  <div class="text"
                       v-if="singleRadio === item">【正确答案】</div>
                </div>
              </div>
            </div>
            <div class="multiChoiceWrapper"
                 v-if="value === '多选题'">
              <div class="optionItem"
                   v-for="item in multiLength">
                <el-checkbox v-model="multiCheck"
                             :label="item">{{abc[item-1]}}、</el-checkbox>
                <el-input class="optionInput"></el-input>
                <el-button size="mini"
                           icon="circle-close"></el-button>
                <div class="text"
                     v-if="multiCheck.indexOf(item) !== -1">【正确答案】</div>
              </div>
            </div>
            <div class="inputChoiceWrapper"
                 v-if="value === '填空题'">
              <div class="optionItem">
                填空数量：
                <el-input-number v-model="num2"
                                 :min="1"
                                 :max="10"></el-input-number>
              </div>
              <div class="inputChoiceList">
                <el-input v-for="item in num2"
                          class="smallInput">
                  <template slot="prepend">{{item}}</template>
                </el-input>
              </div>
            </div>
            <div class="judgeMentWrapper"
                 v-if="value === '判断题'">
              <div class="optionItem">
                <el-radio v-model="judgeRadio"
                          label="1">选项正确</el-radio>
                <el-input class="optionInput"></el-input>
                <el-button size="mini"
                           icon="circle-close"></el-button>
                <div class="text"
                     v-if="judgeRadio === '1'">【正确答案】</div>
              </div>
              <div class="optionItem">
                <el-radio v-model="judgeRadio"
                          label="2">选项错误</el-radio>
                <el-input class="optionInput"></el-input>
                <el-button size="mini"
                           icon="circle-close"></el-button>
                <div class="text"
                     v-if="judgeRadio === '2'">【正确答案】</div>
              </div>
            </div>
            <vue-html5-editor v-if="value === '简答题'"></vue-html5-editor>
          </div>
        </div>
        <div class="formItem">
          <div class="title">解析：</div>
          <div class="inputWrapper">
            <vue-html5-editor></vue-html5-editor>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: ['单选题', '多选题', '判断题', '填空题', '简答题'],
      value: '单选题',
      num1: '',
      value1: '',
      inputVisible: false,
      inputValue: '',
      dynamicTags: [],
      radio: '',
      singleLength: 4,
      multiLength: 4,
      abc: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      singleRadio: '',
      multiCheck: [],
      num2: '',
      judgeRadio: ''
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
.sc-add-test {
  margin: 1rem 2rem;
  font-size: 14px;
}

.formWrapper {
  display: flex;
  flex-wrap: wrap;
}

.formItem {
  flex: 1 0 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
}

.formItem>.title {
  width: 7rem;
}

.formItem>.inputWrapper {
  flex: auto;
  margin-left: 2rem;
}

.half {
  flex: 1 0 50%;
  align-items: center;
}

.input-new-tag {
  width: 76px;
  height: 28px;
}

.optionItem {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.optionInput {
  width: 80%;
  margin-right: 20px;
  margin-left: 10px;
}

.inputChoiceList {
  display: flex;
  flex-wrap: wrap;
}

.smallInput {
  width: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
