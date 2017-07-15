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
        <!--新增运费模板-->
        <div class="sc-express-addform">
          <el-dialog title="新增运费模板" v-model="addShow">
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
              <el-button @click="addShow = false">取 消</el-button> 
              <el-button type="primary" @click="addSubmit">保 存</el-button>
            </div>
          </el-dialog>
        </div>
        <!--修改运费模板-->
        <div class="sc-express-editform">
          <el-dialog title="修改运费模板" v-model="editShow">
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
              <el-button @click="editShow = false">取 消</el-button> 
              <el-button type="primary" @click="editSubmit">保 存</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">
      
    </div>
  </kobe-table>
</template>

<script>
export default {
  name: 'sc-ordersetting-expressgoods',
  data () {
    return {
      test: [{
        id: 1,
        name: 'test'
      }],
      switched: true,
      addShow: false,
      editShow: false,
      pophide: false,
      disable: false
    }
  },
  methods: {
    addSubmit () {
      this.addShow = false
    },
    editSubmit () {
      this.editShow = false
    },
    rowDataDel (id) {
      this.$confirm('此操作将删除选定的记录。是否继续删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {})
    },
    statusChange () {
      if (this.switched) {
        this.disable = true
      } else {
        this.disable = false
      }
    },
    handleSizeChange (value) {
      console.log(value)
    },
    handleCurrentChange (value) {
      console.log(value)
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
