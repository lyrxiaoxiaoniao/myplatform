<template>
  <div class="kobe-toggle-card">
    <el-form-item>
      <el-card class="">
        <div slot="header">
          <span>{{ data.title }}</span>
        </div>
        <div class="" slot="toggle-button">
          <el-switch
            v-model="isShow"
            on-text="开"
            of-text="关"
            on-color="#13ce66"
            off-color="#ff4949"
            @change="onToggle"
            >
          </el-switch>
        </div>
        <div v-if="isShow" slot="content">
        </div>
      </el-card>
    </el-form-item>
  </div>
</template>

<script>
export default {
  // used for activity active form
  name: 'kobe-toggle-card',
  props: {
    data: {
      type: Object,
      default: {
      }
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      isShow: true
    }
  },
  methods: {
    onToggle () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style>
.kobe-toggle-card {
  width: 480px;
}
</style>
