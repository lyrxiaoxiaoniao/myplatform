<template>
  <div class="sc-tutorial-info">
    <el-row type="flex">
      <el-button @click="back">返回列表</el-button>
    </el-row>
    <el-tabs v-model="selectedTab">
      <el-tab-pane label="课程信息" name="0">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">课程基本信息</span>
          </div>
          <div class="sc-tutorial-info-basic">
            <el-form label-width="120px">
              <el-row type="flex">
                <el-col :span="8">
                  <div class="img-upload-container">
                    <img v-if="cover" :src="cover" alt="cover">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </div>
                  <el-form-item label="课程类型">
                    <el-select></el-select>
                  </el-form-item>
                  <el-form-item label="主讲人">
                    <el-input></el-input>
                  </el-form-item>
                  <el-form-item label="课程二维码">
                    <img src="" alt="">
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="分类">
                    <el-select></el-select>
                  </el-form-item>
                  <el-form-item label="名称">
                    <el-input></el-input>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-date-picker></el-date-picker>
                    <el-date-picker></el-date-picker>
                  </el-form-item>
                  <el-form-item label="课程摘要">
                    <el-input type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="sc-tutorial-info-count">
            <el-form label-width="120px">
              <el-row type="flex">
                <el-form-item label="课程访问量">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="课程评论量">
                  <el-input></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="课程报名量">
                  <el-input></el-input>
                </el-form-item>
                <el-form-item label="课程收藏量">
                  <el-input></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="课程综合评分">
                  <el-rate></el-rate>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="报名情况" name="1">
        <el-row type="flex">
          <el-col :span="19">
            <el-button type="primary">刷新</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="signinList"
            :data="signinList.data"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="id" label="课程名称"></el-table-column>
            <el-table-column prop="id" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="mobile" label="真实姓名"></el-table-column>
            <el-table-column prop="mobile" label="支付方式"></el-table-column>
            <el-table-column prop="mobile" label="积分"></el-table-column>
            <el-table-column prop="mobile" label="现金"></el-table-column>
            <el-table-column label="报名时间">
              <template scoped="scoped">
                {{ scoped.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button size="small" icon="delete2"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-pagination
                v-if="signinList"
                @size-change="signinSizeChange"
                @current-change="signinCurrentChange"
                :current-page="signinList.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="signinList.pageSize"
                :total="signinList.count"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <el-tab-pane label="收藏情况" name="2">
        <el-row type="flex">
          <el-col :span="19">
            <el-button type="primary">刷新</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="collectList"
            :data="collectList.data"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="id" label="课程名称"></el-table-column>
            <el-table-column prop="id" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="mobile" label="真实姓名"></el-table-column>
            <el-table-column label="收藏时间">
              <template scoped="scoped">
                {{ scoped.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button size="small" icon="delete2"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-pagination
                v-if="collectList"
                @size-change="collectionSizeChange"
                @current-change="collectionCurrentChange"
                :current-page="collectList.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="collectList.pageSize"
                :total="collectList.count"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <el-tab-pane label="评论情况" name="3">
        <el-row type="flex">
          <el-col :span="19">
            <el-button type="primary">刷新</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="commentList"
            :data="commentList.data"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="id" label="课程名称"></el-table-column>
            <el-table-column prop="id" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="mobile" label="真实姓名"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column label="评论时间">
              <template scoped="scoped">
                {{ scoped.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button size="small" icon="delete2"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-pagination
                v-if="commentList"
                @size-change="commentSizeChange"
                @current-change="commentCurrentChange"
                :current-page="commentList.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="commentList.pageSize"
                :total="commentList.count"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <el-tab-pane label="课程评价" name="4">
        <el-row type="flex">
          <el-col :span="19">
            <el-button type="primary">刷新</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="奖励情况" name="5">
        <el-row type="flex">
          <el-col :span="19">
            <el-button type="primary">刷新</el-button>
            <el-button type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input>
              <el-button slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from 'src/api'
import config from 'src/config'

export default {
  name: 'sc-tutorial-info',
  data () {
    return {
      id: this.$route.query.id,
      selectedTab: '',
      cover: '',
      signinList: null,
      collectList: null,
      commentList: null
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    commentSizeChange (value) {
    },
    commentCurrentChange (value) {
    },
    collectionSizeChange (value) {
    },
    collectionCurrentChange (value) {
    },
    signinSizeChange (value) {
      const data = {
        currentPage: this.signinList.currentPage,
        pageSize: value
      }
      this.getSigninList(data)
    },
    signinCurrentChange (value) {
      const data = {
        currentPage: value,
        pageSize: this.signinList.pageSize
      }
      this.getSigninList(data)
    },
    getSigninList (data = null) {
      api.GET(config.tutorial.attendee, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.signinList = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getCollectionList (data = null) {
      api.GET(config.tutorial.favor, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.collectList = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getCommentList (data = null) {
      api.GET(config.tutorial.commentList, data)
      .then(response => {
        if (response.data.errcode === '0000') {
          this.commentList = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getSigninList()
  }
}
</script>

<style>
.sc-tutorial-info {
  margin: 2rem;
  margin-top: 1rem;
  margin-bottom: 0;
  padding-bottom: 2rem;
}
.sc-tutorial-info-basic {
  border-bottom: 1px solid lightgray;
}
.sc-tutorial-info-count {
  margin-top: 2rem;
}
</style>
