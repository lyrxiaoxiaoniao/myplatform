<template>
  <div class="sc-reservation-config">
    <el-row>
      <el-col>
        <el-button icon="d-arrow-left" type="primary" @click="back">返回列表</el-button>
        <el-button type="primary">刷新</el-button>
      </el-col>
    </el-row>
    <el-row class="main">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="line-height: 36px; font-size: 18px">基地属性</span>
          </div>
          <img src="http://ww1.sinaimg.cn/large/006y8mN6gw1fa7kaed2hpj30sg0l9q54.jpg" class="img">
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
      <el-col :span="15" :offset="1">
        <el-tabs type="border-card">
          <el-tab-pane label="用户管理">
            <el-card class="box-card space">
              <el-row type="flex" justify="space-between">
                <el-col style="line-height: 36px; font-size: 18px">启动线上预约功能</el-col>
                <el-col :span="2">
                  <el-switch on-text="开" off-text="关"></el-switch>
                </el-col>
              </el-row>
              <el-row class="tips">注：如果此功能关闭，则不开放预约功能，所有设置均不可进行</el-row>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px; font-size: 18px">预约配置</span>
                <el-button style="float: right;" type="primary">保存</el-button>
              </div>
              <div class="reserveSet">
                <div class="title">预约确认方式</div>
                <el-row class="radioSet">
                  <el-col :span="10" :offset="1">
                    <el-radio class="radio" v-model="radio" label="1">系统根据空余名额自动确认</el-radio>
                  </el-col>
                  <el-col :span="10">
                    <el-radio class="radio" v-model="radio" label="2">后台管理人员手工确认</el-radio>
                  </el-col>
                </el-row>
              </div>
              <div class="reserveSet">
                <div class="title">取消预约设置</div>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1">启用取消预约功能</el-col>
                  <el-col :span="6">
                    <el-switch on-text="开" off-text="关"></el-switch>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1" class="align">预约参观前</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num1" :min="1" :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7" class="align">天可取消预约</el-col>
                </el-row>
              </div>
              <div class="reserveSet">
                <div class="title">改签设置</div>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1">启用改签功能</el-col>
                  <el-col :span="6">
                    <el-switch on-text="开" off-text="关"></el-switch>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1" class="align">预约参观前</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num2" :min="1" :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7" class="align">天可改签</el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1" class="align">改签时间为上一次预约时间的</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num3" :min="1" :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7" class="align">天后</el-col>
                </el-row>
              </div>
              <div class="reserveSet">
                <div class="title">黑名单设置</div>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1">启用黑名单功能</el-col>
                  <el-col :span="6">
                    <el-switch on-text="开" off-text="关"></el-switch>
                  </el-col>
                </el-row>
                <el-row class="setItem">
                  <el-col :span="6" :offset="1" class="align">预约成功未去参观</el-col>
                  <el-col :span="8">
                    <el-input-number v-model="num4" :min="1" :max="10"></el-input-number>
                  </el-col>
                  <el-col :span="7" class="align">自动拉黑</el-col>
                </el-row>
              </div>
              <div class="reserveSet"></div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        name: '测试',
        mobile: '1234567878',
        time: '2017-08-08 19:00',
        brief: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      },
      radio: '1',
      num1: 1,
      num2: 1,
      num3: 1,
      num4: 1
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
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
</style>
