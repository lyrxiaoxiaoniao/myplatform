<template>
  <el-dialog
    :title="title"
    v-model="show"
    @close="onClose"
    >
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <el-input
          v-model="address"
          placeholder="搜索地址"
          >
          <el-button @click="onSearch" slot="append" icon="search"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <div id="bmap"></div>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button @click="onConfirm">确定</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'kobe-map-dialog',
  props: {
    title: {
      type: String,
      default: '地图'
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show () {
      return !!this.isShow
    }
  },
  data () {
    return {
      mapData: {
        zoom: 14,
        center: {
          lng: '116.404',
          lat: '39.915'
        }
      },
      address: ''
    }
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal === true) {
        this.$nextTick(_ => {
          console.log('111')
          this.init()
        })
      }
    }
  },
  methods: {
    onSearch () {
    },
    onConfirm () {
      this.$emit('confirm')
    },
    onClose () {
      this.$emit('close')
    },
    init () {
      /* eslint-disable */
      const map = new BMap.Map('bmap')
      const point = new BMap.Point(this.mapData.center.lng, this.mapData.center.lat)
      map.centerAndZoom(point, 15)
      const marker = new BMap.Marker(point)
      map.addOverlay(marker)
      /* eslint-enable */
    }
  },
  mounted () {
  }
}
</script>

<style>
#bmap {
  width: 95%;
  min-height: 500px;
  margin: 0 auto;
  margin-top: 10px;
}
</style>
