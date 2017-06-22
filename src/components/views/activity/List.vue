<template>
  <kobe-table>
    <div slot="kobe-table-header" class="kobe-table-header">
      <el-row type="flex" justify="end">
        <el-col :span="7">
          <el-input placeholder="请输入搜索关键字">
            <el-button slot="append" icon="search"></el-button>
          </el-input> 
        </el-col>
          <el-button type="primary" icon="plus" @click="addInfoDialog= true"></el-button>
          <el-button type="primary" icon="upload2"></el-button>
          <el-button type="primary" icon="setting"></el-button>
      </el-row>
    </div>

    <div slot="kobe-table-content" class="kobe-table">
      <el-table :data="testData" border stripe>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column prop="address" label="活动地点"></el-table-column>
        <el-table-column prop="numbers" label="活动人数"></el-table-column>
        <el-table-column prop="time" label="活动时长"></el-table-column>
        <el-table-column prop="description" label="描述/备注"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" icon="edit" @click="editListInfo(scope.row)"></el-button>
            <el-button size="small" icon="information" @click="checkInfo(scope.row)"></el-button>
            <el-button size="small" icon="delete2" @click="infoDelete(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--添加活动信息-->
      <div class="sc-activity-list-add">
        <el-dialog title="添加活动信息" v-model="addInfoDialog">
          <el-form label-width="100px" :model="addForm">
            <el-row type="flex" justify="space-between">
              <el-col :span="12">
                <el-form-item :required="true" label="活动名称">
                  <el-input v-model="addForm.name" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="活动地址">
                  <el-input v-model="addForm.address"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="12">
                <el-form-item :required="true" label="活动人数">
                  <el-input v-model="addForm.numbers"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="活动时间">
                  <el-input v-model="addForm.time"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="描述/备注">
              <el-input type="textarea" v-model="addForm.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addInfoDialog = false">取 消</el-button>
            <el-button type="primary" @click="addListInfo">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!--修改活动信息-->
      <div class="sc-activity-list-edit">
        <el-dialog title="修改活动信息" v-model="editInfoDialog">
          <el-form label-width="100px" :model="userInfo">
            <el-row type="flex" justify="space-between">
              <el-col :span="12">
                <el-form-item label="ID">
                  <el-input v-model="userInfo.id" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动名称">
                  <el-input v-model="userInfo.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="12">
                <el-form-item label="活动地址">
                  <el-input v-model="userInfo.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动人数">
                  <el-input v-model="userInfo.numbers"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="描述/备注">
              <el-input type="textarea" v-model="userInfo.description"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editInfoDialog = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!--查看活动详情-->
      <div class="sc-activity-list-check">
        <el-dialog title="查看活动详情" v-model="checkDialog">
          <el-row type="flex">
            <el-col>
              <el-card>
                <div slot="header">
                  <span>活动详情信息</span>
                </div>
                <div>
                  <div>ID:<span style="padding-left:10px;">{{ userInfo.id }}</span></div>
                  <div>活动名称:<span style="padding-left:10px;">{{ userInfo.name }}</span></div>
                  <div>活动地点:<span style="padding-left:10px;">{{ userInfo.address }}</span></div>
                  <div>活动人数:<span style="padding-left:10px;">{{ userInfo.numbers }}</span></div>
                  <div>活动时长:<span style="padding-left:10px;">{{ userInfo.time }}</span></div>
                  <div>活动开始时间:<span style="padding-left:10px;">{{userInfo.description}}</span></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-dialog>
      </div>
    </div>

    <div slot="kobe-table-footer" class="kobe-table-footer">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 20, 25, 30]"
            :total="20"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </el-col>
      </el-row>
    </div>
  </kobe-table>
</template>

<script>
export default {
  name: 'sc-activity-list',
  data () {
    return {
      testData: [{
        id: 1,
        name: '跑步',
        address: '罗湖',
        numbers: 20,
        time: '1',
        description: 'xx'
      }],
      addForm: {
        name: '',
        address: '',
        numbers: '',
        time: '',
        description: ''
      },
      addInfoDialog: false,
      editInfoDialog: false,
      checkDialog: false,
      userInfo: [],
      response: null,
      error: null
    }
  },
  methods: {
    editSubmit () {
      this.editInfoDialog = false
      console.log(this.userInfo)
    },
    onSearch () {
    },
    addListInfo () {
      if (this.addForm.name === '' || this.addForm.address === '' || this.addForm.time === '') {
        this.$message({
          message: '请输入信息',
          type: 'info'
        })
        return
      }
      this.addInfoDialog = false
      // console.log(this.addForm)
      Object.keys(this.addForm).forEach(index => {
        this.addForm[index] = ''
      })
    },
    editListInfo (user) {
      this.editInfoDialog = true
      this.userInfo = user
    },
    checkInfo (user) {
      this.checkDialog = true
      this.userInfo = user
      console.log(this.userInfo)
    },
    infoDelete () {
      this.$confirm('是否确定删除该条数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('Yes')
      })
    },
    handleSizeChange (value) {
      console.log(value)
    },
    handleCurrentChange (value) {
      console.log(value)
    },
    getActivityList (data = null) {
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
