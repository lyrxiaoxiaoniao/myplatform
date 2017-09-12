<template>
  <div class="sc-test-library">
    <el-row>
      <el-col :span="5">
        <el-tree :data="testList"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 :highlight-current="true"></el-tree>
      </el-col>
      <el-col :span="18"
              :offset="1">
        <div class="btnWrapper">
          <div class="leftWrapper">
            <el-button type="primary"
                       icon="plus">新 增</el-button>
            <el-dropdown trigger="click">
              <el-button type="primary">
                批 量
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>删除</el-dropdown-item>
                <el-dropdown-item>移库</el-dropdown-item>
                <el-dropdown-item>批量导入</el-dropdown-item>
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
                       type="primary">高级</el-button>
            <el-button icon="upload2"
                       type="primary"></el-button>
            <el-button icon="setting"
                       type="primary"></el-button>
          </div>
        </div>
        <el-card>
          <div slot="header"
               class="clearfix">
            <el-checkbox v-model="all">全选</el-checkbox>
          </div>
          <el-card v-for="item in currentList"
                   class="problemsItem">
            <el-row>
              <el-col :span="2">
                <el-checkbox></el-checkbox>
                <span class="blue">{{item.type}}</span>
              </el-col>
              <el-col :span="21"
                      :offset="1">
                <div class="title">{{item.title}}</div>
                <div class="answers"
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
                      :offset="1">
                {{item.answers.join('、')}}
              </el-col>
            </el-row>
            <div class="infoWrapper">
              <div class="infoItem">题目编号：{{item.no}}</div>
              <div class="infoItem">默认分值：{{item.opint}}分</div>
              <div class="infoItem">难度：{{item.easy}}星</div>
              <div class="labels">
                标签：
                <el-tag class="tagItem" v-for="innerItem in item.label">{{innerItem}}</el-tag>
              </div>
              <el-button icon="edit" size="mini" type="primary"></el-button>
              <el-button icon="delete" size="mini" type="primary"></el-button>
            </div>
          </el-card>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
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
      options: ['单选题', '多选题'],
      all: false,
      currentList: null
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
      this.currentList = data.problems
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

.blue {
  color: #20A0FF;
  font-size: 14px;
}
</style>
