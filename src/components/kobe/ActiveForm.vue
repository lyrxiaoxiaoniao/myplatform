<template>
  <div class="kobe-active-form">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in properties">
        <kobe-active-input
          v-if="item.type === 'input'"
          :data="item"
          :index="index"
          @input="onChange"
          >
        </kobe-active-input>
        <kobe-number-input
          v-if="item.type === 'number'"
          :data="item"
          :index="index"
          @number="onChange"
          >
        </kobe-number-input>
        <kobe-date-input
          v-if="item.type === 'datetime'"
          :index="index"
          :data="item"
          @date="onChange"
          >
        </kobe-date-input>
        <kobe-active-switch
          v-if="item.type === 'switch'"
          :index="index"
          :data="item"
          @switch="onChange"
          >
        </kobe-active-switch>
        <kobe-active-radio
          v-if="item.type === 'radio'"
          :index="index"
          :data="item"
          @radio="onChange"
          >
        </kobe-active-radio>
        <kobe-active-textarea
          v-if="item.type === 'textarea'"
          :index="index"
          :data="item"
          @text="onChange"
          >
        </kobe-active-textarea>
        <kobe-active-checkbox
          v-if="item.type === 'checkbox'"
          :index="index"
          :data="item"
          @checklist="onChange"
          >
        </kobe-active-checkbox>
        <kobe-active-select
          v-if="item.type === 'select'"
          :index="index"
          :data="item"
          @select="onChange"
          >
        </kobe-active-select>
        <kobe-active-rank
          v-if="item.type === 'rank'"
          :index="index"
          :data="item"
          @rank="onRankChange"
          >
        </kobe-active-rank>
        <kobe-active-cert
          v-if="item.type === 'cert'"
          :index="index"
          :data="item"
          @cert="onCertChange"
          >
        </kobe-active-cert>
        <kobe-active-sign
          v-if="item.type === 'sign'"
          :index="index"
          :data="item"
          @sign="onSigninChange"
          >
        </kobe-active-sign>
        <kobe-active-attendee
          v-if="item.type === 'attendee'"
          :index="index"
          :data="item"
          @attendee="onAttendeeChange"
          >
        </kobe-active-attendee>
        <kobe-active-attendence
          v-if="item.type === 'attendence'"
          :index="index"
          :data="item"
          @attendence="onAttendenceChange"
          >
        </kobe-active-attendence>
        <kobe-active-attendence-mode
          v-if="item.type === 'attendencemode'"
          :index="index"
          :data="item"
          @mode="onAttendenceModeChange"
          >
        </kobe-active-attendence-mode>
      </template>
    </el-form>
    <!-- <el-row type="flex" justify="center"> -->
    <!--   <el-button @click="onSubmit">确定</el-button> -->
    <!-- </el-row> -->
  </div>
</template>

<script>
export default {
  name: 'kobe-active-form',
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
      form: {
        properties: [
        ]
      }
    }
  },
  computed: {
    // hacks for switch toggle component
    properties () {
      let rankData = {
        data: [],
        type: 'rank'
      }
      let certData = {
        data: [],
        type: 'cert'
      }
      let signData = {
        data: [],
        type: 'sign'
      }
      let attendeeData = {
        data: [],
        type: 'attendee'
      }
      let attendenceData = {
        data: [],
        type: 'attendence'
      }
      let attendenceModeData = {
        data: [],
        type: 'attendencemode'
      }
      const datas = [
        rankData,
        certData,
        signData,
        attendeeData,
        attendenceModeData,
        attendenceData
      ]

      let arr = []
      this.data.properties.forEach((item, index) => {
        if (item.type.startsWith('rank-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          rankData.data.push(item)
        } else if (item.type.startsWith('cert-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          certData.data.push(item)
        } else if (item.type.startsWith('sign-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          signData.data.push(item)
        } else if (item.type.startsWith('attendee-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          attendeeData.data.push(item)
        } else if (item.type.startsWith('attendence-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          attendenceData.data.push(item)
        } else if (item.type.startsWith('attendencemode-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          attendenceModeData.data.push(item)
        } else {
          arr.push(item)
        }
      })

      datas.forEach(item => {
        if (item.data.length) {
          arr.push(item)
        }
      })

      return arr
    }
  },
  methods: {
    onSigninChange (value) {
    },
    onAttendeeChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item
        }
      })
      this.onFormChange()
    },
    onAttendenceModeChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item
        }
      })
      this.onFormChange()
    },
    onAttendenceChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item
        }
      })
      this.onFormChange()
    },
    onCertChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item
        }
      })
      this.onFormChange()
    },
    onRankChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item
        }
      })
      this.onFormChange()
    },
    onChange (value) {
      this.form.properties[value.index] = value.data
      this.onFormChange()
    },
    onSubmit () {
      this.$emit('submit', this.form)
    },
    onFormChange () {
      const data = {
        id: this.data.id,
        index: this.index,
        type_key: this.data.type_key,
        ...this.form
      }
      this.$emit('form-change', data)
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
