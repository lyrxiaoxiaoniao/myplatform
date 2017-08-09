<template>
    <div class="jc-container">
        <div class="jc-header">
            <el-button type="primary">刷新权限</el-button>
            <el-button type="primary">保存权限</el-button>
        </div>
        <div class="jc-left">
            <h4>用户列表</h4>
            <el-tree 
                :data="data"
                show-checkbox node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps">
            </el-tree>
        </div>
        <div class="jc-right">
            <el-tree
                :data="data1"
                :props="defaultProps1"
                show-checkbox node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :render-content="renderContent">
            </el-tree>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      a: false,
      b: false,
      c: false,
      d: false,
      e: false,
      data: [{
        id: 1,
        label: 'label1',
        checked: [true, true, true, true, true],
        children: []
      }, {
        id: 2,
        label: 'label2',
        children: [{
          id: 3,
          label: 'label3',
          children: []
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      data1: null,
      defaultProps1: {
        children: 'children',
        label: 'label'
      },
      checked: true,
      checkboxValue: false
    }
  },
  methods: {
    // handleCheckAllChange(event) {
    //   this.checkedCities = event.target.checked ? cityOptions : []
    //   this.isIndeterminate = false
    // },
    getData () {
      return [{
        id: 1,
        label: '111',
        checked: [true, true, true, true, true],
        children: []
      }, {
        id: 2,
        label: '222',
        checked: [false, false, false, false, false],
        children: []
      }, {
        id: 3,
        label: '333',
        checked: [true, true, true, true, true],
        children: []
      }]
    },
    checkedbox(e, s, d) {
      console.log(e)
      console.log(s)
      console.log(d)
    },
    append(store, data) {
      console.log(store)
    //   store.append({ id: id++, label: 'testtest', children: [] }, data)
    },
    check (data, index, checked) {
      data.data.checked[index] = checked
      console.log(data)
    },
    checkAll (data, checked) {
      this.data1 = null
      this.data1 = this.update()
    },
    update () {
      return [{
        id: 1,
        label: '111',
        checked: [true, true, true, true, true],
        children: []
      }, {
        id: 2,
        label: '222',
        checked: [true, true, true, true, true],
        children: []
      }, {
        id: 3,
        label: '333',
        checked: [true, true, true, true, true],
        children: []
      }]
    }
    // renderContent(h, { node, data, store }) {
    //   if (!this.data1) return (<span></span>)
    //   let num
    //   this.data1.forEach((item, index) => {
    //     if (item.id === node.data.id) {
    //       num = index
    //     }
    //   })
    //   let isAll = this.data1[num].checked[0]
    //   let isAdd = this.data1[num].checked[1]
    //   let isEdit = this.data1[num].checked[2]
    //   let isDel = this.data1[num].checked[3]
    //   let isDone = this.data1[num].checked[4]

    //   let el = (
    //     <span class="aaa">
    //       <span>
    //         <span>{node.label}</span>
    //       </span>
    //       <span style="float: right; margin-right: 20px;">
    //         <el-checkbox checked={isAll} style="height= 35px; margin:0 5px 0;" on-change={(e) => {
    //           this.$set(this.data1, '1', {
    //             id: 2,
    //             label: '222',
    //             checked: [true, true, true, true, true],
    //             children: []
    //           })
    //           isAll = true
    //           isDone = true
    //           console.log(this.data1)
    //           // this.checkAll(node, e.target.checked)
    //         }}>全部权限</el-checkbox>
    //         <el-checkbox checked={isAdd} style=" height= 35px; margin:0 5px 0;" on-change={(e) => this.checkedbox(e, store, data)}>增加</el-checkbox>
    //         <el-checkbox checked={isEdit} style=" height= 35px; margin:0 5px 0;" on-change={(e) => this.checkedbox(e, store, data)}>修改</el-checkbox>
    //         <el-checkbox checked={isDel} style=" height= 35px; margin:0 5px 0;" on-change={(e) => this.checkedbox(e, store, data)}>删除</el-checkbox>
    //         <el-checkbox checked={isDone} style=" height= 35px; margin:0 5px 0;" on-change={(e) => {
    //           node.data.checked[4] = e.target.checked
    //           console.log(node)
    //         }}>审批</el-checkbox>
    //       </span>
    //     </span>
    //   )
    //   console.log(el)
    //   return el
    // }
  },
  mounted () {
    this.data1 = this.getData()
  }
}
</script>
<style lang="scss" scoped>
.jc-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 1rem;
  .jc-header {
    width: 100%;
    margin-bottom: 10px;
  }
  .jc-left {
    width: 15%;
    border: 1px solid lightgray;
  }
  .jc-right {
    width: 85%;
    padding-left: 1rem;
  }
}
</style>
