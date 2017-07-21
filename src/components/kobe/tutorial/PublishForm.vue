<template>
  <div :class="['kobe-tutorial-publish', ...typeClass]">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in properties">
        <kobe-tutorial-category
          v-if="item.type === 'select'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-category>
        <kobe-active-input
          v-if="item.type === 'input'"
          :data="item"
          :index="index"
          @input="onChange"
          >
        </kobe-active-input>
        <kobe-tutorial-time
          v-if="item.type === 'startendtime'"
          :data="item"
          :index="index"
          @time="onChange"
          >
        </kobe-tutorial-time>
        <kobe-active-textarea
          v-if="item.type === 'textarea'"
          :data="item"
          :index="index"
          @text="onChange"
          >
        </kobe-active-textarea>
        <kobe-tutorial-html
          v-if="item.type === 'html'"
          :data="item"
          :index="index"
          @change="onChange"
          >
        </kobe-tutorial-html>
        <kobe-tutorial-material
          v-if="item.type === 'material'"
          :data="item"
          :index="index"
          @material="onMaterialChange"
          >
        </kobe-tutorial-material>
        <kobe-tutorial-signin
          v-if="item.type === 'signin'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-signin>
        <kobe-tutorial-award
          v-if="item.type === 'award'"
          :data="item"
          :index="index"
          @award="onAwardChange"
          >
        </kobe-tutorial-award>
        <kobe-tutorial-test
          v-if="item.type === 'test'"
          :data="item"
          :index="index"
          @test="onTestChange"
          >
        </kobe-tutorial-test>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-publish',
  props: {
    typeClass: {
      type: Array
    },
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
      },
      materials: {
        data: [],
        type: 'material'
      },
      signinData: {
        data: [],
        type: 'signin'
      },
      awards: {
        data: [],
        type: 'award'
      },
      testSetting: {
        data: [],
        type: 'test'
      }
    }
  },
  computed: {
    properties () {
      let arr = []
      this.data.properties.forEach((item, index) => {
        if (item.type && item.type.startsWith('material-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          this.materials.data.push(item)
        } else if (item.type && item.type.startsWith('signin-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          this.signinData.data.push(item)
        } else if (item.type && item.type.startsWith('award-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          this.awards.data.push(item)
        } else if (item.type && item.type.startsWith('test-')) {
          item.type = item.type.split('-')[1]
          item.index = index
          this.testSetting.data.push(item)
        } else {
          arr.push(item)
        }
      })
      const datas = [
        this.materials,
        this.signinData,
        this.awards,
        this.testSetting
      ]

      datas.forEach(item => {
        if (item.data.length) {
          arr.push(item)
        }
      })
      return arr
    }
  },
  methods: {
    onChange (value) {
      this.form.properties[value.index] = value.data
      this.onFormChange()
    },
    onAwardChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item.data
        }
      })
      this.onFormChange()
    },
    onMaterialChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item.data
        }
      })
      this.onFormChange()
    },
    onTestChange (value) {
      value.forEach(item => {
        if (item) {
          this.form.properties[item.index] = item.data
        }
      })
      this.onFormChange()
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
