<template>
  <div class="sc-test-library">
    <el-row>
      <el-col :span="5">
        <el-tree :data="testList"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 :highlight-current="true"
                 :expand-on-click-node="false"></el-tree>
      </el-col>
      <el-col :span="18"
              :offset="1">
        <div class="btnWrapper">
          <div class="leftWrapper">
            <el-button type="primary"
                       icon="plus">新 增</el-button>
            <el-dropdown trigger="click"
                         @command="handleCommand">
              <el-button type="primary">
                批 量
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete">删除</el-dropdown-item>
                <el-dropdown-item command="move">移库</el-dropdown-item>
                <el-dropdown-item command="import">批量导入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="rightWrapper">
            <el-select v-model="value"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
            <el-input placeholder="请输入关键字"
                      v-model="keyword"
                      class="input">
              <el-button slot="append"
                         icon="search"></el-button>
            </el-input>
            <el-button icon="search"
                       type="primary" @click="openDialog('advanceVisible')">高级</el-button>
            <el-button icon="upload2"
                       type="primary"></el-button>
            <el-button icon="setting"
                       type="primary"></el-button>
          </div>
        </div>
        <testList :list="currentList"></testList>
      </el-col>
    </el-row>
    <el-dialog v-model="moveVisible"
               title="移库"
               size="tiny">
      <div class="cascaderWrapper">
        移动到：
        <el-cascader :options="testList"
                     change-on-select
                     :props="props"></el-cascader>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="hideDialog('moveVisible')">取 消</el-button>
        <el-button type="primary"
                   @click="hideDialog('moveVisible')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="高级搜索"
               v-model="advanceVisible">
      <div class="searchWrapper">
        <div class="inputItem">
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
        <div class="inputItem">
          <div class="title">题目难度：</div>
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
        <div class="inputItem">
          <div class="title">题干：</div>
          <div class="inputWrapper">
            <el-input></el-input>
          </div>
        </div>
        <div class="inputItem">
          <div class="title">答案：</div>
          <div class="inputWrapper">
            <el-input></el-input>
          </div>
        </div>
        <div class="inputItem">
          <div class="title">题目编号：</div>
          <div class="inputWrapper">
            <el-input></el-input>
          </div>
        </div>
        <div class="inputItem">
          <div class="title">标签：</div>
          <div class="inputWrapper">
            <el-input></el-input>
          </div>
        </div>
        <div class="inputItem">
          <div class="title">创建时间：</div>
          <div class="inputWrapper">
            <el-date-picker v-model="value6"
                            type="daterange"
                            placeholder="选择日期范围">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="hideDialog('advanceVisible')">取 消</el-button>
        <el-button type="primary"
                   @click="hideDialog('advanceVisible')">搜 索</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import testList from './TestList.vue'

export default {
  components: { testList },
  data() {
    return {
      testList: [{
        label: '根级',
        children: [
          {
            label: '1级1',
            problems: [
              {
                type: '单选',
                title: '在安全生产工作中，必须坚持213（）的方针',
                no: '000232',
                opint: '2',
                easy: '3',
                label: ['生产经营', '安全管理'],
                answers: ['a', 'b'],
                options: [
                  {
                    title: 'A',
                    text: '安全生产重于泰山',
                    correct: false
                  },
                  {
                    title: 'B',
                    text: '以人为本，安全第一',
                    correct: false
                  },
                  {
                    title: 'C',
                    text: '管生产必须管安全',
                    correct: false
                  },
                  {
                    title: 'D',
                    text: '安全第一，预防为主，综合治理',
                    correct: true
                  }
                ]
              },
              {
                type: '单选',
                title: '在安全生产工作中，必须坚持（）的方针',
                no: '000232',
                opint: '2',
                easy: '3',
                label: ['生产经营', '安全管理'],
                answers: ['a', 'b'],
                options: [
                  {
                    title: 'A',
                    text: '安全生产重于泰山',
                    correct: false
                  },
                  {
                    title: 'B',
                    text: '以人为本，安全第一',
                    correct: false
                  },
                  {
                    title: 'C',
                    text: '管生产必须管安全',
                    correct: false
                  },
                  {
                    title: 'D',
                    text: '安全第一，预防为主，综合治理',
                    correct: true
                  }
                ]
              },
              {
                type: '单选',
                title: '在安全生产工作中，必须坚持（）的方针',
                no: '000232',
                opint: '2',
                easy: '3',
                label: ['生产经营', '安全管理'],
                answers: ['a', 'b'],
                options: [
                  {
                    title: 'A',
                    text: '安全生产重于泰山',
                    correct: false
                  },
                  {
                    title: 'B',
                    text: '以人为本，安全第一',
                    correct: false
                  },
                  {
                    title: 'C',
                    text: '管生产必须管安全',
                    correct: false
                  },
                  {
                    title: 'D',
                    text: '安全第一，预防为主，综合治理',
                    correct: true
                  }
                ]
              }
            ],
            children: [
              {
                label: '2级1',
                problems: [
                  {
                    type: '单选',
                    title: '在安全生产工作中，必须坚持（）的方针',
                    no: '000232',
                    opint: '2',
                    easy: '3',
                    label: ['生产经营', '安全管理'],
                    answers: ['a', 'b'],
                    options: [
                      {
                        title: 'A',
                        text: '安全生产重于泰山',
                        correct: false
                      },
                      {
                        title: 'B',
                        text: '以人为本，安全第一',
                        correct: false
                      },
                      {
                        title: 'C',
                        text: '管生产必须管安全',
                        correct: false
                      },
                      {
                        title: 'D',
                        text: '安全第一，预防为主，综合治理',
                        correct: true
                      }
                    ]
                  },
                  {
                    type: '单选',
                    title: '在安全生产工作中，必须坚持（）的方针',
                    no: '000232',
                    opint: '2',
                    easy: '3',
                    label: ['生产经营', '安全管理'],
                    answers: ['a', 'b'],
                    options: [
                      {
                        title: 'A',
                        text: '安全生产重于泰山',
                        correct: false
                      },
                      {
                        title: 'B',
                        text: '以人为本，安全第一',
                        correct: false
                      },
                      {
                        title: 'C',
                        text: '管生产必须管安全',
                        correct: false
                      },
                      {
                        title: 'D',
                        text: '安全第一，预防为主，综合治理',
                        correct: true
                      }
                    ]
                  },
                  {
                    type: '单选',
                    title: '在安全生产工作中，必须坚持（）的方针',
                    no: '000232',
                    opint: '2',
                    easy: '3',
                    label: ['生产经营', '安全管理'],
                    answers: ['a', 'b'],
                    options: [
                      {
                        title: 'A',
                        text: '安全生产重于泰山',
                        correct: false
                      },
                      {
                        title: 'B',
                        text: '以人为本，安全第一',
                        correct: false
                      },
                      {
                        title: 'C',
                        text: '管生产必须管安全',
                        correct: false
                      },
                      {
                        title: 'D',
                        text: '安全第一，预防为主，综合治理',
                        correct: true
                      }
                    ]
                  }
                ],
                children: []
              }
            ]
          },
          {
            label: '1级2',
            problems: [
              {
                type: '单选',
                title: '在安全生产工作中，必须坚持（）的方针',
                no: '000232',
                opint: '2',
                easy: '3',
                label: ['生产经营', '安全管理'],
                answers: ['a', 'b'],
                options: [
                  {
                    title: 'A',
                    text: '安全生产重于泰山',
                    correct: false
                  },
                  {
                    title: 'B',
                    text: '以人为本，安全第一',
                    correct: false
                  },
                  {
                    title: 'C',
                    text: '管生产必须管安全',
                    correct: false
                  },
                  {
                    title: 'D',
                    text: '安全第一，预防为主，综合治理',
                    correct: true
                  }
                ]
              },
              {
                type: '单选',
                title: '在安全生产工作中，必须坚持（）的方针',
                no: '000232',
                opint: '2',
                easy: '3',
                label: ['生产经营', '安全管理'],
                answers: ['a', 'b'],
                options: [
                  {
                    title: 'A',
                    text: '安全生产重于泰山',
                    correct: false
                  },
                  {
                    title: 'B',
                    text: '以人为本，安全第一',
                    correct: false
                  },
                  {
                    title: 'C',
                    text: '管生产必须管安全',
                    correct: false
                  },
                  {
                    title: 'D',
                    text: '安全第一，预防为主，综合治理',
                    correct: true
                  }
                ]
              },
              {
                type: '单选',
                title: '在安全生产工作中，必须坚持（）的方针',
                no: '000232',
                opint: '2',
                easy: '3',
                label: ['生产经营', '安全管理'],
                answers: ['a', 'b'],
                options: [
                  {
                    title: 'A',
                    text: '安全生产重于泰山',
                    correct: false
                  },
                  {
                    title: 'B',
                    text: '以人为本，安全第一',
                    correct: false
                  },
                  {
                    title: 'C',
                    text: '管生产必须管安全',
                    correct: false
                  },
                  {
                    title: 'D',
                    text: '安全第一，预防为主，综合治理',
                    correct: true
                  }
                ]
              }
            ],
            children: [
              {
                label: '2级1',
                problems: [
                  {
                    type: '单选',
                    title: '在安全生产工作中，必须坚持（）的方针',
                    no: '000232',
                    opint: '2',
                    easy: '3',
                    label: ['生产经营', '安全管理'],
                    answers: ['a', 'b'],
                    options: [
                      {
                        title: 'A',
                        text: '安全生产重于泰山',
                        correct: false
                      },
                      {
                        title: 'B',
                        text: '以人为本，安全第一',
                        correct: false
                      },
                      {
                        title: 'C',
                        text: '管生产必须管安全',
                        correct: false
                      },
                      {
                        title: 'D',
                        text: '安全第一，预防为主，综合治理',
                        correct: true
                      }
                    ]
                  },
                  {
                    type: '单选',
                    title: '在安全生产工作中，必须坚持（）的方针',
                    no: '000232',
                    opint: '2',
                    easy: '3',
                    label: ['生产经营', '安全管理'],
                    answers: ['a', 'b'],
                    options: [
                      {
                        title: 'A',
                        text: '安全生产重于泰山',
                        correct: false
                      },
                      {
                        title: 'B',
                        text: '以人为本，安全第一',
                        correct: false
                      },
                      {
                        title: 'C',
                        text: '管生产必须管安全',
                        correct: false
                      },
                      {
                        title: 'D',
                        text: '安全第一，预防为主，综合治理',
                        correct: true
                      }
                    ]
                  },
                  {
                    type: '单选',
                    title: '在安全生产工作中，必须坚持（）的方针',
                    no: '000232',
                    opint: '2',
                    easy: '3',
                    label: ['生产经营', '安全管理'],
                    answers: ['a', 'b'],
                    options: [
                      {
                        title: 'A',
                        text: '安全生产重于泰山',
                        correct: false
                      },
                      {
                        title: 'B',
                        text: '以人为本，安全第一',
                        correct: false
                      },
                      {
                        title: 'C',
                        text: '管生产必须管安全',
                        correct: false
                      },
                      {
                        title: 'D',
                        text: '安全第一，预防为主，综合治理',
                        correct: true
                      }
                    ]
                  }
                ],
                children: []
              }
            ]
          }
        ],
        problems: [
          {
            type: '单选',
            title: '在安全生产工作中，必须坚持（）的方针',
            no: '000232',
            opint: '2',
            easy: '3',
            label: ['生产经营', '安全管理'],
            answers: ['a', 'b'],
            options: [
              {
                title: 'A',
                text: '安全生产重于泰山',
                correct: false
              },
              {
                title: 'B',
                text: '以人为本，安全第一',
                correct: false
              },
              {
                title: 'C',
                text: '管生产必须管安全',
                correct: false
              },
              {
                title: 'D',
                text: '安全第一，预防为主，综合治理',
                correct: true
              }
            ]
          },
          {
            type: '单选',
            title: '在安全生产工作中，必须坚持（）的方针',
            no: '000232',
            opint: '2',
            easy: '3',
            label: ['生产经营', '安全管理'],
            answers: ['a', 'b'],
            options: [
              {
                title: 'A',
                text: '安全生产重于泰山',
                correct: false
              },
              {
                title: 'B',
                text: '以人为本，安全第一',
                correct: false
              },
              {
                title: 'C',
                text: '管生产必须管安全',
                correct: false
              },
              {
                title: 'D',
                text: '安全第一，预防为主，综合治理',
                correct: true
              }
            ]
          },
          {
            type: '单选',
            title: '在安全生产工作中，必须坚持（）的方针',
            no: '000232',
            opint: '2',
            easy: '3',
            label: ['生产经营', '安全管理'],
            answers: ['a', 'b'],
            options: [
              {
                title: 'A',
                text: '安全生产重于泰山',
                correct: false
              },
              {
                title: 'B',
                text: '以人为本，安全第一',
                correct: false
              },
              {
                title: 'C',
                text: '管生产必须管安全',
                correct: false
              },
              {
                title: 'D',
                text: '安全第一，预防为主，综合治理',
                correct: true
              }
            ]
          }
        ]
      }],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      props: {
        value: 'label',
        children: 'children'
      },
      options: ['单选题', '多选题'],
      all: false,
      currentList: null,
      moveVisible: false,
      advanceVisible: false,
      value6: ''
    }
  },
  methods: {
    openDialog(e) {
      this[e] = true
    },
    hideDialog(e) {
      this[e] = false
    },
    handleNodeClick(data) {
      console.log(data)
      this.currentList = data.problems
    },
    handleCommand(command) {
      if (command === 'delete') {
        this.deleteTest()
      } else if (command === 'move') {
        this.moveLibrary()
      } else if (command === 'import') {
        this.importLibrary()
      }
    },
    deleteTest() {
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
    },
    moveLibrary() {
      this.openDialog('moveVisible')
    }
  }
}
</script>

<style scoped>
.sc-test-library {
  margin: 1rem 2rem;
}

.btnWrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.rightWrapper {
  display: flex;
}

.input {
  max-width: 200px;
  margin: 0 10px;
}

.cascaderWrapper {
  margin-left: 30px;
}

.searchWrapper {
  display: flex;
  flex-wrap: wrap;
}
.inputItem {
  flex: auto;
  width: 50%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.inputItem .title {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.inputItem .inputWrapper {
  width: 60%;
}
</style>
