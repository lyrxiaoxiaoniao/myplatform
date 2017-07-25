<template>
  <div class="kobe-tutorial-signin">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">报名资格</span>
      </div>
      <div>系统默认报名时免费进行的,并且面向所有会员。</div>
      <template v-for="item, index in options">
        <div
          v-if="item.type === 'radio'"
          :class="(item.type_key === 'activity_property_tutorial_pay' || item.type_key === 'activity_property_tutorial_senior_member') ? '': 'padding-left-5'"
          >
          <el-radio-group
            v-if="item.type === 'radio' && item.type_key === 'activity_property_tutorial_pay'"
            @change="onPayRadioChange(index)"
            v-model="needPay"
            >
            <el-radio
              label="1"
              >
              {{ item.title }}
            </el-radio>
          </el-radio-group>
          <el-radio-group
            v-if="item.type === 'radio' && item.type_key === 'activity_property_tutorial_pay_credit'"
            v-model="needCredit"
            @change="onCreditChange(index)"
            >
            <el-radio
              label="1"
              >
              {{ item.title }}
            </el-radio>
          </el-radio-group>
          <el-radio-group
            v-if="item.type === 'radio' && item.type_key === 'activity_property_tutorial_senior_member'"
            v-model="seniorMember"
            @change="onMemberRadioChange(index)"
            >
            <el-radio
              label="1"
              >
              {{ item.title }}
            </el-radio>
          </el-radio-group>
        </div>

        <el-input-number
          class="padding-left-5"
          v-if="item.type === 'number'"
          v-model="number"
          >
        </el-input-number>
        
        <el-input
          v-if="item.type === 'input'"
          class="padding-left-5 signin-payment"
          >
        </el-input>
      </template>
      <div>如果已经勾选了高级会员的选项，则要求用户必须要绑定手机号码，登记真实姓名才允许进行报名</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-signin',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      needPay: false,
      seniorMember: false,
      needCredit: false,
      number: 0,
      form: []
    }
  },
  computed: {
    options () {
      let arr = []
      this.data.data.forEach(item => {
        item.value = ''
        arr.push(item)
      })
      return arr
    }
  },
  watch: {
    number (newVal, oldVal) {
      let data, num
      this.data.data.forEach((item, index) => {
        if (item.type_key === 'activity_property_tutorial_credit_num') {
          data = item
          num = index
        }
      })
      let item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: newVal
          }]
        }
      }
      this.form[num] = item
      this.$emit('signin', this.form)
    }
  },
  methods: {
    onPayRadioChange (index) {
      const data = this.data.data[index]
      const item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.needPay ? 1 : 0
          }]
        }
      }
      this.form[index] = item
      this.$emit('signin', this.form)
    },
    onCreditChange (index) {
      const data = this.data.data[index]
      const item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.needCredit ? 1 : 0
          }]
        }
      }
      this.form[index] = item
      this.$emit('signin', this.form)
    },
    onMemberRadioChange (index) {
      const data = this.data.data[index]
      const item = {
        index: data.index,
        data: {
          id: data.id,
          type_key: data.type_key,
          options: [{
            title: this.seniorMember ? 1 : 0
          }]
        }
      }
      this.form[index] = item
      this.$emit('signin', this.form)
    }
  },
  mounted () {
  }
}
</script>

<style>
.kobe-tutorial-signin .el-radio {
  font-weight: 400;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.kobe-tutorial-signin .signin-payment {
  padding-bottom: 1rem;
  border-bottom: 1px solid gray;
}
.kobe-tutorial-signin .signin-payment .el-input {
  max-width: 10rem;
}
.kobe-tutorial-signin .el-radio__label {
  font-size: 12px;
}
.kobe-tutorial-signin .padding-left-5 {
  padding-left: 5rem;
}
</style>
