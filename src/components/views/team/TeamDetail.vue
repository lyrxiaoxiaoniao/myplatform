<template>
<div class="TM-container clearfix">
    <div class="TM-header">
        <el-button type="primary" @click="goBack">返回列表</el-button>
        <el-select v-show="selected.status !==4" v-model="selectMode" placeholder="处理方式" style="width:150px;" @change="operateStatus">
            <el-option v-show="selected.status < 2 && selected.status !== 1" label="审核" value="审核"></el-option>
            <el-option v-show="selected.status > 2 || selected.status === 1" label="认证" value="认证"></el-option> 
        </el-select>
        <el-dialog v-model="statusDialog" size="tiny" :title="statusTitle" @close="closeStatus">
            <el-form :model="statusData" label-width="80px">
                <el-form-item label="审核结果" v-show="statusTitle === '审核'">
                    <el-select v-model="statusData.status" placeholder="审核操作" style="width:100%;">
                        <el-option label="通过" value="1"></el-option>
                        <el-option label="不通过" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="认证结果" v-show="statusTitle === '认证'">
                    <el-select v-model="statusData.status" placeholder="认证操作" style="width:100%;">
                        <el-option label="通过" value="4"></el-option>
                        <el-option label="驳回" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="statusData.explain"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="statusDialog = false">取消</el-button>
                <el-button v-show="statusData.status" @click="auditStatus">确定</el-button>
            </div>
        </el-dialog>
    </div>
    <div class="TM-right">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="团队信息" name="first" class="TM-team">
                <div>
                    <h4>团队信息</h4>
                    <el-form :model="selected" label-width="80px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="团队名称:">
                                    <p v-text="selected.title"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属行业:">
                                    <p v-text="selected.industry.value ? selected.industry.value : '无'"></p>
                                </el-form-item>
                            </el-col>
                             <el-col :span="12">
                                <el-form-item label="地区:">
                                    <p v-text="selected.region ? selected.region.title : '无'"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="创建时间:">
                                    <p v-text="formatDate(selected.created_at)"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="创建理由:">
                                    <p v-text="selected.remark"></p>
                                </el-form-item>
                           </el-col>
                        </el-row> 
                    </el-form>
                </div>
                <div v-show="selected.status > 2 || selected.status === 1">
                    <h4>组织信息</h4>
                    <el-form :model="selected" label-width="80px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="组织类型:">
                                    <p v-text="selected.type.value ? selected.type.value : '无'"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="企业名称:">
                                    <p v-text="selected.team_ext.org_name ? selected.team_ext.org_name : '无'"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组织代码:">
                                    <p v-text="selected.team_ext.org_code ? selected.team_ext.org_code : '无'"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="负责人:">
                                    <p v-text="selected.team_ext.manager ? selected.team_ext.manager : '无'"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系电话:">
                                    <p v-text="selected.team_ext.mobile ? selected.team_ext.mobile : '无'"></p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-show="selected.audited_at">
                                <el-form-item label="认证时间:">
                                    <p v-text="formatDate(selected.audited_at)"></p>
                                </el-form-item>
                            </el-col>
                        </el-row> 
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="团队成员" name="second">
                <kobe-table>
                    <div slot="kobe-table-header" class="kobe-table-header">
                    <el-row type="flex" justify="end">
                        <el-col :span="8">
                        <el-input v-model="form.keyword" placeholder="请输入搜索关键字">
                            <el-button slot="append" @click="onSearch" icon="search"></el-button>
                        </el-input>
                        </el-col>
                    </el-row>
                    </div>
                    <div slot="kobe-table-content" class="kobe-table">
                    <el-table
                        class="TD-member"
                        border
                        stripe
                        :data="response.data">
                        <el-table-column type="index" label="ID" width="70"></el-table-column>
                        <el-table-column prop="user.avatar" label="微信图像" width="110px">
                            <template scope="scope">
                                <img style="width:58px; height:58px;" :src="scope.row.user.avatar" @click="bigImg(scope.row.user.avatar)" alt="">
                            </template>
                        </el-table-column>
                        <el-table-column prop="user.realname" label="姓名" width="150"></el-table-column>
                        <el-table-column prop="user.mobile" label="电话" width="200"></el-table-column>
                        <el-table-column prop="user.province" label="省份" width="100"></el-table-column>
                        <el-table-column prop="remark" label="申请理由"></el-table-column>
                        <el-table-column 
                        width="100"
                        label="操作"
                        >
                        <template scope="scope">
                            <el-button @click="detailData(scope.row)" size="small" icon="information"></el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    </div>
                    <div slot="kobe-table-footer" class="kobe-table-footer">
                    <el-row type="flex" justify="center">
                        <el-col :span="12">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="response.currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="response.pageSize"
                            :total="response.count"
                            layout="total, sizes, prev, pager, next, jumper">
                        </el-pagination>
                        </el-col>
                    </el-row>
                    </div>
                </kobe-table>
            </el-tab-pane>
        </el-tabs>
        <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-dialog v-model="dialogImgs" size="tiny">
            <el-carousel
                indicator-position="outside"
                :autoplay="false"
                height="500px"
                ref="carousel">
                <el-carousel-item v-for="(item, index) in imgsURL" :key="item">
                <img :src="item" height="500px" width="100%">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
        <el-dialog v-model="dialogDetail" title="成员信息" size="tiny">
            <el-form :model="dataDetail" label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="姓名:">
                            <p v-text="dataDetail.user.realname"></p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="电话:">
                            <p v-text="dataDetail.user.mobile"></p>
                        </el-form-item>
                    </el-col>
                        <el-col :span="24">
                        <el-form-item label="地区:">
                            <p v-text="dataDetail.user.city"></p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="创建理由:">
                            <p v-text="dataDetail.remark"></p>
                        </el-form-item>
                    </el-col>
                </el-row> 
            </el-form>
        </el-dialog>
    </div>
    <div class="TM-left">
        <div>
            <h4>团队logo</h4>
            <a href="javascript:;"><img width="100%" :src="selected.logo" alt="" @click="bigImg(selected.logo)"></a>
            <div class="TM-manager">
                <span>创建人：</span>
                <span v-text="selected.team_ext ? selected.team_ext.manager : ''"></span>
            </div>
        </div>
        <div v-show="selected.status > 2 || selected.status === 1">
            <h4>认证照片信息</h4>
            <div class="TM-picture">
                <a href="javascript:;"><img width="100%" :src="selected.team_ext ? selected.team_ext.idcard : ''" alt="" @click="getImgsURL"></a>
                <a href="javascript:;"><img width="100%" :src="selected.team_ext ? selected.team_ext.license : ''" alt="" @click="getImgsURL"></a>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import config from 'src/config'
import api from 'src/api'
export default {
  data () {
    return {
      id: this.$route.query.id,
      statusTitle: '',
      statusDialog: false,
      statusData: {
        status: null,
        explain: ''
      },
      dialogImgs: false,
      imgsURL: [],
      dialogVisible: false,
      dialogImageUrl: '',
      dialogDetail: false,
      dataDetail: {
        user: {}
      },
      selectMode: '',
      activeName: 'first',
      response: {
        data: null
      },
      form: {
        keyword: ''
      },
      selected: {
        team_ext: {},
        region: {
          title: ''
        },
        industry: {
          value: ''
        },
        type: {
          value: ''
        }
      }
    }
  },
  methods: {
    // 切换状态 审核 认证
    operateStatus () {
    //   console.log(this.selectMode)
      if (this.selectMode) {
        this.statusDialog = true
        this.statusData.status = null
        this.statusData.explain = ''
        this.statusTitle = this.selectMode
      }
    },
    auditStatus () {
    //   auditTeamAPI
      let data = {
        id: this.id,
        ...this.statusData
      }
      api.POST(config.auditTeamAPI, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.onSuccess('操作成功')
          this.statusDialog = false
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    closeStatus () {
      this.selectMode = null
    },
    onSuccess (string) {
      this.$notify({
        title: '成功',
        message: string,
        type: 'success'
      })
      this.getList({id: this.id})
    },
    // 时间转换 毫秒转换成 yyyy-mm-dd hh:mm:ss
    formatDate (value) {
      if (value) {
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
      }
      return value
    },
    getImgsURL () {
      this.dialogImgs = true
      if (this.selected.team_ext) {
        this.imgsURL = []
        if (this.selected.team_ext.license) {
          this.imgsURL.push(this.selected.team_ext.license)
        }
        if (this.selected.team_ext.idcard) {
          this.imgsURL.push(this.selected.team_ext.idcard)
        }
      }
    },
    bigImg (url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    detailData (data) {
      this.dialogDetail = true
      this.dataDetail = data
    },
    handleClick (tab, event) {
    //   console.log(tab, event)
      if (tab.name === 'second') {
        this.getMember({team_id: this.id})
      }
    },
    handleSizeChange (value) {
      const data = {
        currentPage: this.response.currentPage,
        pageSize: value,
        ...this.form
      }
      this.getMember(data)
    },
    handleCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getMember(data)
    },
    onSearch () {
      const data = {
        currentPage: 1,
        pageSize: this.response.pageSize,
        ...this.form
      }
      this.getMember(data)
    },
    getList (data = {}) {
      api.GET(config.detailTeamAPI, data)
      .then(response => {
        this.selected = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getMember (data = {}) {
    //   memberTeamAPI
      api.GET(config.memberTeamAPI, data)
      .then(response => {
        this.response = response.data.data
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    goBack () {
      this.$router.push({
        path: '/admin/team/index'
      })
    }
  },
  mounted () {
    this.getList({id: this.id})
  }
}
</script>

<style scoped>
.TM-container{
    padding: 1rem 2rem;
    position: relative;
}
.TM-header{
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;
}
.TM-left{
    float: left;
    width: 25%; 
}
.TM-left>div {
    margin-top: 10px;
    border: 1px solid lightgray;
    background-color: #fff;
}
.TM-left>div h4{
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    border-bottom: 1px solid lightgray;
}
.TM-left>div:nth-of-type(1) a{
    display: block;
    text-align: center;
    padding: 10px 0;
}
.TM-left>div:nth-of-type(1) a img{
    width: 80%;
    height: 200px;
}
.TM-manager{
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
}
.TM-picture{
    display: flex;
    justify-content: space-around;
}
.TM-picture a{
    width: 50%;
    padding: 5px 5px 10px;
}
.TM-picture a img{
    width: 100%;
    height: 150px;
}
.TM-right{
    float: right;
    width: 75%;
    padding: 0 10px;
}
.TM-team>div{
    width: 100%;
    display: inline-block;
    background-color: #fff;
    padding: 10px;
    margin-top: 10px;
}
.TM-team>div h4{
    height: 36px;
    line-height: 36px;
    padding-left: 10px;
    border-bottom: 1px solid lightgray;
}
.TM-team .el-form-item{
    border-bottom: 1px solid lightgray;
    margin-bottom: 0;
}
.clearfix { 
    *zoom: 1; 
} 
.clearfix:before, 
.clearfix:after { 
    display: table; 
    line-height: 0; 
    content: ""; 
} 
.clearfix:after { 
    clear: both; 
} 
.TD-member .el-table .cell {
    white-space: nowrap;
    word-break: normal;
    line-height: 24px;
}
</style>
