<template>
  <div class="sc-reservation-config">
    <el-row>
      <el-col>
        <el-button icon="d-arrow-left"
                   type="primary"
                   @click="back">返回列表</el-button>
        <el-button type="primary">刷新</el-button>
      </el-col>
    </el-row>
    <el-row class="main">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span style="line-height: 36px; font-size: 18px">基地属性</span>
          </div>
          <img src="http://ww1.sinaimg.cn/large/006y8mN6gw1fa7kaed2hpj30sg0l9q54.jpg"
               class="img">
          <el-row class="info">
            <el-col :span="6">基地名称：</el-col>
            <el-col :span="18">{{info.name}}</el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="6">基地电话：</el-col>
            <el-col :span="18">{{info.mobile}}</el-col>
          </el-row>
          <el-row class="info">
            <el-col :span="6">创建时间：</el-col>
            <el-col :span="18">{{info.time}}</el-col>
          </el-row>
          <el-row class="info">基地简介：</el-row>
          <el-row class="info">{{info.brief}}</el-row>
        </el-card>
      </el-col>
      <el-col :span="15"
              :offset="1">
        <el-tabs type="border-card">
          <el-tab-pane label="用户管理">
            <el-card class="box-card space">
              <el-row type="flex"
                      justify="space-between">
                <el-col style="line-height: 36px; font-size: 18px">启动线上预约功能</el-col>
                <el-col :span="2">
                  <el-switch on-text="开"
                             off-text="关"></el-switch>
                </el-col>
              </el-row>
              <el-row class="tips">注：如果此功能关闭，则不开放预约功能，所有设置均不可进行</el-row>
            </el-card>
            <el-card class="box-card space">
              <div slot="header"
                   class="clearfix">
                <span style="line-height: 36px; font-size: 18px">预约配置</span>
                <el-button style="float: right;"
                           type="primary">保存</el-button>
              </div>
              <div class="reserveSet">
                <div class="title">预约确认方式</div>
                <el-row class="radioSet">
                  <el-col :span="10"
                          :offset="1">
                    <el-radio class="radio"
                              v-model="radio"
                              label="1">系统根据空余名额自动确认</el-radio>
                  </el-col>
                  <el-col :span="10">
                    <el-radio class="radio"
                              v-model="radio"
                              label="2">后台管理人员手工确认</el-radio>
                  </el-col>
                </el-row>
              </div>
              <div class="reserveSet">
                <div class="title">取消预约设置</div>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1">启用取消预约功能</el-col>
                  <el-col :span="6">
                    <el-switch on-text="开"
                               off-text="关"></el-switch>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1"
                          class="align">预约参观前</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num1"
                                     :min="1"
                                     :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7"
                          class="align">天可取消预约</el-col>
                </el-row>
              </div>
              <div class="reserveSet">
                <div class="title">改签设置</div>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1">启用改签功能</el-col>
                  <el-col :span="6">
                    <el-switch on-text="开"
                               off-text="关"></el-switch>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1"
                          class="align">预约参观前</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num2"
                                     :min="1"
                                     :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7"
                          class="align">天可改签</el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1"
                          class="align">改签时间为上一次预约时间的</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num3"
                                     :min="1"
                                     :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7"
                          class="align">天后</el-col>
                </el-row>
              </div>
              <div class="reserveSet">
                <div class="title">黑名单设置</div>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1">启用黑名单功能</el-col>
                  <el-col :span="6">
                    <el-switch on-text="开"
                               off-text="关"></el-switch>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6"
                          :offset="1"
                          class="align">预约成功未去参观</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num4"
                                     :min="1"
                                     :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7"
                          class="align">自动拉黑</el-col>
                </el-row>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header"
                   class="clearfix">
                <span style="line-height: 36px; font-size: 18px">预约类型设置</span>
                <el-button style="float: right;"
                           type="primary">保存</el-button>
              </div>
              <div>
                <el-button size="large">删除</el-button>
                <el-button size="large"
                           type="primary"
                           @click="openDialog('addConfigVisible')">添加</el-button>
              </div>
              <div class="reserveSet">
                <el-row>
                  <el-col :span="1">
                    <el-checkbox></el-checkbox>
                  </el-col>
                  <el-col :span="22"
                          :offset="1">
                    <el-row>个人预约</el-row>
                    <el-row class="setItem">
                      <el-col :span="4">参观人数限制</el-col>
                      <el-col :span="19"
                              :offset="1">
                        <el-input-number v-model="num4"
                                         :min="1"
                                         :max="10"></el-input-number> 至
                        <el-input-number v-model="num4"
                                         :min="1"
                                         :max="10"></el-input-number>
                      </el-col>
                    </el-row>
                    <el-row class="setItem">
                      <el-col :span="4">报名填写字段</el-col>
                      <el-col :offset="1"
                              :span="19">
                        <el-tag class="tag"
                                :key="tag"
                                v-for="tag in tags"
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
                                  @blur="handleInputConfirm"></el-input>
                        <el-button v-else
                                   class="button-new-tag"
                                   size="small"
                                   @click="showInput">+ New Tag</el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="配置管理">
            <el-card class="box-card space">
              <div slot="header"
                   class="clearfix">
                <span style="line-height: 36px; font-size: 18px">预约排期</span>
              </div>
              <div>
                <el-button size="large">删除时间段</el-button>
                <el-button size="large"
                           type="primary"
                           @click="openDialog('addTimeVisible')">添加时间段</el-button>
              </div>
              <div class="reserveSet">
                <el-row>
                  <el-col :span="2">
                    <el-checkbox>时间段一</el-checkbox>
                  </el-col>
                  <el-col :span="21"
                          :offset="1">
                    <el-row>
                      <el-col :span="4">预约时间段名称：</el-col>
                      <el-col :span="19"
                              :offset="1">上午第一波</el-col>
                    </el-row>
                    <el-row class="setItem">
                      <el-col :span="4">对应时间段</el-col>
                      <el-col :span="19"
                              :offset="1">
                        08:30-09:30
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header"
                   class="clearfix">
                <span style="line-height: 36px; font-size: 14px; margin-right: 1rem;">选择月份</span>
                <el-date-picker v-model="value1"
                                type="month"
                                placeholder="选择日期"
                                :picker-options="pickerOptions0"
                                @change="changeDate">
                </el-date-picker>
                <el-button style="float: right;"
                           type="primary"
                           @click="openDialog('batchVisible')">批量设置</el-button>
              </div>
              <calendar :month="month"
                        :day="day"
                        :year="year"></calendar>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog v-model="addConfigVisible">
      <el-tabs type="border-card">
        <el-tab-pane label="选择模板">
          <div class="reserveSet">
            <el-row>
              <el-col :span="1">
                <el-checkbox></el-checkbox>
              </el-col>
              <el-col :span="22"
                      :offset="1">
                <el-row>个人预约</el-row>
                <el-row class="setItem">
                  <el-col :span="4">参观人数限制</el-col>
                  <el-col :span="19"
                          :offset="1">
                    <el-input-number v-model="num4"
                                     :min="1"
                                     :max="10"></el-input-number> 至
                    <el-input-number v-model="num4"
                                     :min="1"
                                     :max="10"></el-input-number>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="4">报名填写字段</el-col>
                  <el-col :offset="1"
                          :span="19">
                    <el-tag class="tag"
                            :key="tag"
                            v-for="tag in tags"
                            :closable="true"
                            :close-transition="false"
                            @close="handleClose(tag, 'tags')">
                      {{tag}}
                    </el-tag>
                    <el-input class="input-new-tag"
                              v-if="inputVisible"
                              v-model="inputValue"
                              ref="saveTagInput"
                              size="mini"
                              @keyup.enter.native="handleInputConfirm"
                              @blur="handleInputConfirm"></el-input>
                    <el-button v-else
                               class="button-new-tag"
                               size="small"
                               @click="showInput">+ New Tag</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义">
          <el-row class="setItem">
            <el-col :span="6"
                    :offset="1">预约方式名称</el-col>
            <el-col :span="10">
              <el-input></el-input>
            </el-col>
          </el-row>
          <el-row class="setItem">
            <el-col :span="6"
                    :offset="1"
                    class="align">参观限制人数</el-col>
            <el-col :span="17">
              <el-input-number v-model="num4"
                               :min="1"
                               :max="10"></el-input-number> 至
              <el-input-number v-model="num4"
                               :min="1"
                               :max="10"></el-input-number>
            </el-col>
          </el-row>
          <el-row class="setItem">
            <el-col :span="6"
                    :offset="1"
                    class="align">报名填写字段</el-col>
            <el-col :span="17">
              <div class="selected"
                   v-if="selectedList.length">
                <el-tag class="tag"
                        v-for="tag in selectedList"
                        :closable="true"
                        :close-transition="false"
                        @close="handleClose(tag, 'selectedList')">
                  {{tag.text}}
                </el-tag>
              </div>
              <div class="tagList">
                <el-tag class="tagListItem tag"
                        v-for="(tag, index) in tagList"
                        :class="{tagActive: tag.active}">
                  <div class="tagInner"
                       @click="chooseTag(tag)">{{tag.text}}</div>
                </el-tag>
                <el-button size="small"
                           class="btnStyle"
                           @click="toggle">+自定义</el-button>
              </div>
            </el-col>
          </el-row>
          <div class="customWrapper"
               v-if="customVisible">
            <div class="listwrapper">
              <el-checkbox>必填</el-checkbox>
              <div class="inputWrapper">
                <el-input placeholder="字段名称"
                          v-model="customForm.text"></el-input>
              </div>
              <div class="inputWrapper">
                <el-input placeholder="提示信息写在这里"></el-input>
              </div>
              <el-radio v-model="radio1"
                        label="1">单行文本</el-radio>
              <el-radio v-model="radio1"
                        label="2">多行文本</el-radio>
              <el-radio v-model="radio1"
                        label="3">下拉选项</el-radio>
            </div>
            <div class="selectedCustom"
                 v-if="selectedCustomVisible">
              <div class="text">
                选项列表
              </div>
              <div class="selectedInputWrapper">
                <div class="inputWrapper"
                     v-for="item in inputNum">
                  <el-input placeholder="选项名称"></el-input>
                </div>
                <div class="inputWrapper">
                  <el-button icon="plus"
                             type="primary"
                             @click="addInput"></el-button>
                </div>
              </div>
            </div>
            <div class="btnWrapper">
              <el-button @click="hideDialog('customVisible')">取消</el-button>
              <el-button @click="addSelected">确认</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer"
           slot="footer">
        <el-button type="danger"
                   @click="hideDialog('addConfigVisible')">取消</el-button>
        <el-button type="primary"
                   @click="advanceSearch">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="addTimeVisible">
      <el-tabs type="border-card">
        <el-tab-pane label="选择模板">
          <div class="reserveSet">
            <el-row>
              <el-col :span="2">
                <el-checkbox>时间段一</el-checkbox>
              </el-col>
              <el-col :span="21"
                      :offset="1">
                <el-row>
                  <el-col :span="4">预约时间段名称</el-col>
                  <el-col :span="19"
                          :offset="1">上午</el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="4">对应时间段</el-col>
                  <el-col :span="19"
                          :offset="1">
                    <el-time-select placeholder="起始时间"
                                    v-model="startTime"
                                    :picker-options="{
                                          start: '08:30',
                                          step: '00:15',
                                          end: '18:30'
                                        }">
                    </el-time-select>
                    <el-time-select placeholder="结束时间"
                                    v-model="endTime"
                                    :picker-options="{
                                          start: '08:30',
                                          step: '00:15',
                                          end: '18:30',
                                          minTime: startTime
                                        }">
                    </el-time-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义">
          <el-row class="lineSpace">
            <el-col :span="4"
                    :offset="1">
              预约时间段名称：
            </el-col>
            <el-col :span="10"
                    :offset="1">
              <el-input></el-input>
            </el-col>
          </el-row>
          <el-row class="lineSpace">
            <el-col :span="4"
                    :offset="1">
              预约时间范围：
            </el-col>
            <el-col :span="18"
                    :offset="1">
              <el-time-select placeholder="起始时间"
                              v-model="startTime"
                              :picker-options="{
                                          start: '08:30',
                                          step: '00:15',
                                          end: '18:30'
                                        }">
              </el-time-select>
              <el-time-select placeholder="结束时间"
                              v-model="endTime"
                              :picker-options="{
                                          start: '08:30',
                                          step: '00:15',
                                          end: '18:30',
                                          minTime: startTime
                                        }">
              </el-time-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"
                    :offset="1">排序：</el-col>
            <el-col :span="4"
                    :offset="1">
              <el-input></el-input>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer"
           slot="footer">
        <el-button type="danger"
                   @click="hideDialog('addTimeVisible')">取消</el-button>
        <el-button type="primary"
                   @click="advanceSearch">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="batchVisible"
               size="tiny"
               title="批量设置">

    </el-dialog>
  </div>
</template>

<script>
import calendar from './Calendar.vue'

export default {
  data() {
    return {
      info: {
        name: '测试',
        mobile: '1234567878',
        time: '2017-08-08 19:00',
        brief: 'aaa'
      },
      radio: '1',
      radio1: '1',
      num1: 1,
      num2: 1,
      num3: 1,
      num4: 1,
      tags: ['标签1', '标签2', '标签3'],
      inputVisible: false,
      inputValue: '',
      addConfigVisible: false,
      tagList: [
        {
          text: '参观人数',
          active: false
        },
        {
          text: '团队类型',
          active: false
        },
        {
          text: '所属行业',
          active: false
        },
        {
          text: '预约说明',
          active: false
        }
      ],
      selectedList: [],
      customVisible: false,
      selectedCustomVisible: false,
      inputNum: 5,
      customForm: {
        text: ''
      },
      addTimeVisible: false,
      startTime: '',
      endTime: '',
      value1: '',
      batchVisible: false,
      month: 0,
      day: 0,
      year: 2017
    }
  },
  components: { calendar },
  watch: {
    radio1(val) {
      if (val === '3') {
        this.selectedCustomVisible = true
      } else {
        this.selectedCustomVisible = false
        this.inputNum = 5
      }
    },
    value1(val) {
      if (val) {
        this.month = val.getMonth()
        this.day = val.getDay()
        this.year = val.getFullYear()
      }
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    openDialog(e) {
      this[e] = true
    },
    hideDialog(e) {
      this[e] = false
    },
    advanceSearch() {
    },
    toggle() {
      this.customVisible = !this.customVisible
    },
    addInput() {
      this.inputNum += 1
    },
    changeDate(e) {
      console.log(e)
    },
    handleClose(tag, list) {
      this[list].splice(this[list].indexOf(tag), 1)
      if (list === 'selectedList') {
        this.tagList.forEach(e => {
          if (tag.text === e.text) {
            e.active = false
          }
        })
      }
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
        this.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    chooseTag(tag) {
      if (tag.active) {
        this.selectedList.forEach((e, i) => {
          if (e.text === tag.text) {
            this.selectedList.splice(i, 1)
          }
        })
      } else {
        this.selectedList.push(JSON.parse(JSON.stringify(tag)))
      }
      tag.active = !tag.active
    },
    addSelected() {
      const obj = {}
      obj.text = this.customForm.text
      obj.active = false
      this.selectedList.push(obj)
      this.customVisible = false
    }
  }
}
</script>

<style scoped>
.sc-reservation-config {
  margin: 1rem 2rem;
}

.main {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid lightgray;

  font-size: 14px;
}

.img {
  width: 100%;
  display: block;
  margin-bottom: 3rem;
}

.space {
  margin-bottom: 2rem;
}

.lineSpace {
  margin-bottom: 1rem;
}

.info {
  font-size: 14px;
  margin: 1rem;
}

.tips {
  text-align: right;
  color: #FF4949;
}

.title {
  font-size: 18px;
}

.reserveSet {
  margin: 1rem 0;
  padding: 1rem;
  border-bottom: 1px solid lightgray;
}

.setItem {
  margin: 1rem 0;
  display: flex;
  align-items: center;
}

.align {
  display: flex;
  align-items: center;
}

.input-new-tag {
  width: 60px;
  height: 24px;
}

.selected {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
}

.tag {
  margin-right: 5px;
}

.tagActive {
  background-color: #20A0FF
}

.customWrapper {
  border: 1px solid lightgray;
}

.customWrapper>.listwrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4%;
}

.customWrapper>.btnWrapper {
  display: flex;
  justify-content: flex-end;

  margin: 0 20px 20px 0;
}

.selectedCustom>.text {
  margin-left: 4%;
}

.selectedCustom>.selectedInputWrapper {
  overflow: hidden;
  padding: 1% 4%;
}

.selectedCustom>.selectedInputWrapper>.inputWrapper {
  float: left;
  width: 15%;
  margin-right: 10px;
  margin-top: 10px;
}
</style>
