<template>
  <div class="kobe-tutorial-publish-basic">
    <el-form
      :label-position="'left'"
      v-model="form"
      label-width="120px"
      >
      <template v-for="item, index in properties">
        <kobe-tutorial-upload
          v-if="item.type === 'upload'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-upload>
        <kobe-tutorial-type
          v-if="item.type === 'select'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-type>
        <kobe-active-input
          v-if="item.type === 'input'"
          :data="item"
          :index="index"
          @input="onChange"
          >
        </kobe-active-input>
        <kobe-tutorial-check
          v-if="item.type === 'checkbox-original'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-check>
        <kobe-tutorial-check
          v-if="item.type === 'checkbox-recommend'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-check>
        <kobe-tutorial-check
          v-if="item.type === 'checkbox-uppermost'"
          :data="item"
          :index="index"
          >
        </kobe-tutorial-check>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'kobe-tutorial-publish-basic',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    properties () {
      const array = this.data.properties
      return array
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
  methods: {
    onChange (value) {
      this.form.properties[value.index] = value.data
      this.onFormChange()
    }
  },
  mounted () {
    console.log(this.data)
  }
}
</script>

<style>
</style>
