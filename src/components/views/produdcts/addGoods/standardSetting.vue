<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品规格">
            <template>
                <el-select v-model="list.value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </template>
            <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
                type="primary"
                style="margin:0 5px"
            >
            {{tag}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">新增</el-button>
            <div style="margin-top:10px;"><el-button @click="addSetting" class="button-new-tag">添加规格项目</el-button></div>
        </el-form-item>
        <el-form-item label="商品规格">
            <el-table
                :data="form.tableData"
                border
                style="width: 100%"
                @cell-dblclick="test">
                <el-table-column
                  label="姓名"
                  width="180">
                  <template scope="scope">
                    <P>{{scope.row.name}}</P>
                    <el-input v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item label="总库存">
            <template>
                <el-input-number v-model="form.num1" :min="1"></el-input-number>
            </template>
        </el-form-item>
        <el-form-item label="商家编码">
            <el-input v-model="form.num"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
  data () {
    return {
      options: [{
        value: '颜色',
        label: '颜色'
      }, {
        value: '内存',
        label: '内存'
      }, {
        value: '大小',
        label: '大小'
      }, {
        value: '尺码',
        label: '尺码'
      }, {
        value: '种类',
        label: '种类'
      }],
      form: {
        num1: '',
        value: '',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      },
      list: {
        value: ''
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      obj: []
    }
  },
  methods: {
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    addSetting () {
      this.obj.push(this.list.value)
      console.log(this.obj)
    },
    test (r, c, l) {
      console.log(r, c, l)
    }
  }
}
</script>

