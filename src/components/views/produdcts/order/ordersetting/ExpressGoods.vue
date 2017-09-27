<template>
  <kobe-table>
    <div slot="kobe-table-header" style="border-bottom:none" class="kobe-table-header"> 
    </div>

    <div slot="kobe-table-content"  class="kobe-table">
      <div class="sc-express-wrap">
        <div class="sc-express-content">
          <el-card>
            <div slot="header">
                <span style="font-size:18px;">快递发货功能</span>
                <el-switch @change="statusChange" style="float:right;" v-model="switched" on-text="开" off-text="关"></el-switch>
            </div>
            <el-button :disabled="disable" @click="addShow=true" style="margin-bottom:28px" type="primary">新增运费模板</el-button>
            <div class="sc-disabled-status">
              <el-table :disabled="disable" :data="test" border stripe>
                  <el-table-column prop="id" label="ID" width="80"></el-table-column>
                  <el-table-column prop="name" label="运费模板名称"></el-table-column>
                  <el-table-column label="配送区域"></el-table-column>
                  <el-table-column label="首件（个）"></el-table-column>
                  <el-table-column label="运费（元）"></el-table-column>
                  <el-table-column label="续件（个）"></el-table-column>
                  <el-table-column label="续费（元）"></el-table-column>
                  <el-table-column label="启用">
                  <template scope="scope">
                      <el-checkbox :disabled="disable" v-model="checked2"></el-checkbox>
                  </template>
                  </el-table-column>
                  <el-table-column width="120" label="操作">
                  <template scope="scope">
                      <el-button :disabled="disable" @click="editShow=true" type="small" icon="edit"></el-button>
                      <el-button :disabled="disable" @click="rowDataDel" type="small" icon="delete2"></el-button>
                  </template>
                  </el-table-column>
              </el-table>
              <div style="margin-top:32px" class="sc-express-footer">
                <el-row type="flex" justify="center">
                  <el-col :span="12">
                    <el-pagination 
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[15, 20, 25, 30]"
                    :total="20"
                    layout="total, sizes, prev, pager, next, jumper">
                    </el-pagination>
                  </el-col>
                </el-row>
              </div>
              <div :class="{popDisabledWraps:disable}"></div>
            </div>
          </el-card>
        </div>
        <!--增加或修改运费模板-->
        <el-dialog :title="dialog.title" v-model="dialog.visible" :size="dialog.size">
          <el-form label-position="left" label-width="120px">
            <el-form-item label="模板名称">
              <el-input placeholder="请输入名称"></el-input> 
            </el-form-item>
            <el-form-item label="计费方式">
              <span>按快递件数</span> 
            </el-form-item>
            <el-form-item label="配送区域"></el-form-item>
            <el-table :data="test" border stripe>
            <el-table-column prop="id" label="配送区域">
            </el-table-column>
            <el-table-column label="首件（个）">
              <template scope="scope">
                <el-input placeholder="1"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="运费（元）">
              <template scope="scope">
                <el-input placeholder="1"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="续件（个）">
              <template scope="scope">
                <el-input placeholder="1"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="续费（元）">
              <template scope="scope">
                <el-input placeholder="1"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="small" icon="delete2"></el-button>
              </template>
            </el-table-column>
            </el-table>
            
            <el-popover
              v-model="pophide"
              ref="popover4"
              placement="bottom-start"
              width="520"
              trigger="click">
              <div style="margin:0 0 30px">
                <span>选择可配送区域</span>
              </div>
              <el-transfer :button-texts="['删除', '添加']" :titles="['可选省、市、区', '已选省、市、区']"></el-transfer>
              <div style="text-align:center;margin-top:20px">
                <el-button @click="pophide=false"  type="primary">确 定</el-button>
                <el-button @click="pophide=false">取 消</el-button>
              </div>
            </el-popover>
            <el-button style="color:#20a0ff;border:none;padding-left:20px;cursor:pointer" v-popover:popover4>指定配送范围</el-button>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" v-show="dialog.title === '新增运费模板'" @click="addSubmit">保 存</el-button>
            <el-button type="primary" v-show="dialog.title === '修改运费模板'" @click="editSubmit">保 存</el-button>
          </div>
        </el-dialog>
      </div>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">
      
    </div>
  </kobe-table>
</template>

<script>
  import config from 'src/config'
  import api from 'src/api'

  export default {
    name: 'sc-ordersetting-expressgoods',
    data () {
      return {
        response: {
          data: null
        },
        getListParamsObj: {
          currentPage: 1,
          pageSize: 10
        },
        switched: true,
        activeName2: 'first',
        value3: '',
        value4: '',
        disable: false,
        imageUrl: '',
        dialog: {
          visible: false,
          title: '',
          size: 'small'
        },
        expressInfo: {},
        isBatchOperation: false, // 是否是批量操作
        needInput: false, // 是否需要打开输入对话框
        needWarning: false, // 是否需要打开警告对话框
        next: true, // 是否进行下一步
        selectedIds: [],
        selectedId: 0,
        pophide: false
      }
    },
    methods: {
      /* http请求函数开始 */
      getList (data = {}) {
        api.GET(config.integralMall.order.indexPickup, data)
        .then(response => {
          this.response = this.transformData(response.data.data)
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      deletePost () {
        api.POST(config.integralMall.order.deletePickup, {ids: this.selectedIds})
        .then(response => {
          if (response.status !== 200) {
            this.error = response.statusText
            return
          }
          if (response.data.errcode === '0000') {
            this.onSuccess('删除成功')
            this.selectedIds.length = 0
            this.getList()
          }
        })
        .catch(error => {
          this.$message.error(error)
        })
      },
      addPost () {
        console.log('发起新增http请求')
      },
      updatePost () {
        console.log('发起修改http请求')
      },
      /* http请求函数结束 */
      /* 用户行为触发改、删、增操作的函数开始 */
      singleAdd () {
        this.isBatchOperation = false
        this.needInput = true
        this.needWarning = false
        this.operate('新增自提点', '')
      },
      singleEdit () {
        this.isBatchOperation = false
        this.needInput = true
        this.needWarning = false
        this.operate('修改自提点', '')
      },
      singleDelete (id) {
        this.selectedIds.length = 0
        this.selectedIds.push(id)
        this.isBatchOperation = false
        this.needInput = false
        this.needWarning = true
        this.operate('删除', '此操作将删除选定的记录。是否继续删除？')
      },
      addSubmit () {
        // 获取表格数据
        this.addPost()
      },
      editSubmit () {
        // 获取表格数据
        this.updatePost()
      },
      enableSubmit () {
        // 调用启用的http请求
      },
      /* 用户行为触发改、删、增操作的函数结束 */
      /* 用户行为触发查操作的函数开始 */
      handleSizeChange (value) {
        this.getListParamsObj.pageSize = value
        this.getListByParams()
      },
      handleCurrentChange (value) {
        this.getListParamsObj.currentPage = value
        this.getListByParams()
      },
      // 以getListParamsObj为基础，构造getList的参数
      getListByParams () {
        let obj = JSON.parse(JSON.stringify(this.getListParamsObj))
        for (var keyName in obj) {
          if (obj[keyName] === '') {
            delete obj[keyName]
          }
        }

        this.getList(obj)
      },
      /* 用户行为触发查操作的函数结束 */
      /* 用户行为触发改或删操作的流程开始 */
      async operate (operationName, warnContent, dialogSize) {
        this.next = true
        // 如果是批量操作，是否有选中的记录
        if (this.isBatchOperation) {
          if (!this.selectedIds.length) {
            this.next = await this.warnSelection(this.next, warnContent)
          }
        }
        // 弹出输入对话框或警告对话框
        if (this.next) {
          if (this.needInput) {
            this.next = false
            this.openDialog(operationName, dialogSize)
          }
          if (this.needWarning) {
            // 弹出警告对话框
            this.next = await this.confirmOperation(this.next, warnContent)
          }
        }
        // 警告对话框点击确定后的执行函数
        if (this.next) {
          switch (operationName) {
            case '删除':
              this.deletePost()
              // console.log('警告对话框点击确定后发起彻底删除http请求')
              break
          }
        }
      },
      // 确认是否已选择要操作的数据
      warnSelection (next) {
        return this.$confirm('请进行正确操作，请优先勾选表单', '错误', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          next = false
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      // 确认是否执行操作
      confirmOperation (next, str) {
        return this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next = true
          return next
        }).catch(() => {
          next = false
          return next
        })
      },
      /* 用户行为触发改或删操作的流程结束 */
      transformData (res) {
        let obj = res
        if (obj.currentPage !== undefined) {
          obj.data.forEach(v => {
            if (v.created_at) {
              v.created_at = this.formatDate(v.created_at)
            }
            this.changeState(v)
          })
        } else {
          if (obj.created_at) {
            obj.created_at = this.formatDate(obj.created_at)
          }
          this.changeState(obj)
        }
        return obj
      },
      // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
      formatDate (value) {
        let date = new Date(value)
        let M = date.getMonth() + 1
        M = M < 10 ? ('0' + M) : M
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        // let h = date.getHours()
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        value = `${date.getFullYear()}-${M}-${d} ${date.getHours()}:${m}:${s}`
        return value
      },
      changeState (obj) {
        switch (obj.active) {
          case 0:
            obj.active = false
            break
          case 1:
            obj.active = true
            break
        }
      },
      statusChange () {
        if (this.switched) {
          this.disable = false
        } else {
          this.disable = true
        }
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = file.url
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 勾选多行生成selectedIds数组
      selectIds (value) {
        let arr = value.map(v => {
          return v.id
        })
        this.selectedIds = JSON.parse(JSON.stringify(arr))
      },
      // 点击单行按钮生成selectedId值
      selectId (value) {
        this.selectedId = value
      },
      openDialog (value, size) {
        this.dialog.title = value
        this.dialog.visible = true
        this.dialog.size = size
      },
      closeDialog () {
        this.dialog.visible = false
        this.dialog.title = ''
      },
      onSuccess (string) {
        this.$notify({
          title: '成功',
          message: string,
          type: 'success'
        })
      }
    }
  }
</script>

<style scoped>
  .sc-disabled-status{
    position: relative;
  }
  .popDisabledWraps{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #eef1f6;
    opacity: 0.2;
    cursor: not-allowed;
  }
</style>
