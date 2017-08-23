<template>
  <div class="sc-tutorial-info">
    <el-row type="flex">
      <el-button type="primary" @click="back">返回列表</el-button>
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
                    <img v-if="info.cover" :src="info.cover" alt="cover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </div>
                  <el-form-item label="课程类型">
                    <el-input v-model="info.type"></el-input>
                  </el-form-item>
                  <el-form-item label="主讲人">
                    <el-input v-model="info.speaker"></el-input>
                  </el-form-item>
                  <el-form-item label="课程二维码">
                    <img src="" alt="">
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="分类">
                    <el-cascader
                      style="width:100%;"
                      v-if="categories"
                      clearable
                      change-on-select
                      expand-trigger="hover"
                      :options="categories"
                      v-model="selectedCategory"
                      >
                    </el-cascader>
                  </el-form-item>
                  <el-form-item label="名称">
                    <el-input v-model="info.title"></el-input>
                  </el-form-item>
                  <el-form-item label="时间">
                    <el-date-picker v-model="info.start"></el-date-picker>
                    <el-date-picker v-model="info.end"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="课程摘要">
                    <el-input autosize type="textarea" v-model="info.digest"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="sc-tutorial-info-count">
            <el-form label-width="120px">
              <el-row type="flex">
                <el-form-item label="课程访问量">
                  <el-input v-model="clickCount"></el-input>
                </el-form-item>
                <el-form-item label="课程评论量">
                  <el-input v-model="commentCount"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="课程报名量">
                  <el-input v-model="signCount"></el-input>
                </el-form-item>
                <el-form-item label="课程收藏量">
                  <el-input v-model="favorCount"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex">
                <el-form-item label="课程综合评分">
                  <el-rate disabled show-text v-model="rank"></el-rate>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="报名情况" name="1">
        <el-row type="flex">
          <el-col :span="19">
            <el-button @click="onSignRefresh" type="primary">刷新</el-button>
            <el-button @click="onSignDel(signSelection)" type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input v-model="signinKeyword" placeholder="请输入用户/手机/真实姓名">
               <el-button @click="onSigninSearch" slot="append" icon="search"></el-button> 
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="signinList"
            :data="signinList.data"
            @selection-change="handleSigninSelection"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="nickname" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="name" label="真实姓名"></el-table-column>
            <el-table-column prop="pay.pay_way" label="支付方式"></el-table-column>
            <el-table-column prop="pay.credit_price" label="积分"></el-table-column>
            <el-table-column prop="pay.price" label="现金"></el-table-column>
            <el-table-column label="报名时间">
              <template scope="scope">
                {{ scope.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="onSignDel(scope.row.id)" size="small" icon="delete2"></el-button>
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
            <el-button @click="onCollectionRefresh" type="primary">刷新</el-button>
            <el-button @click="onCollectionDel(collectionSelection)" type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input v-model="collectionKeyword" placeholder="请输入用户">
              <el-button @click="onCollectionSearch" slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="collectList"
            :data="collectList.data"
            @selection-change="handleCollectionSelection"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="nickname" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="realname" label="真实姓名"></el-table-column>
            <el-table-column label="收藏时间">
              <template scope="scope">
                {{ scope.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="onCollectionDel(scope.row.id)" size="small" icon="delete2"></el-button>
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
            <el-button @click="onCommentRefresh" type="primary">刷新</el-button>
            <el-button @click="onCommentDel(commentSelection)" type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input v-model="commentKeyword" placeholder="请输入评论内容">
              <el-button @click="onCommentSearch" slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="commentList"
            :data="commentList.data"
            @selection-change="handleCommentSelection"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="nickname" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="realname" label="真实姓名"></el-table-column>
            <el-table-column prop="content" label="评论内容"></el-table-column>
            <el-table-column label="评论时间">
              <template scope="scope">
                {{ scope.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="onCommentDel(scope.row.id)" size="small" icon="delete2"></el-button>
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
            <el-button @click="onRankRefresh" type="primary">刷新</el-button>
            <el-button @click="onRankDel(rankSelection)" type="primary">删除</el-button>
          </el-col>
          <el-col :span="5">
            <el-input v-model="rankKeyword"  placeholder="请输入评论内容">
              <el-button @click="onRankSearch" slot="append" icon="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <div>
          <el-table
            border
            stripe
            v-if="rankList"
            :data="rankList.data"
            @selection-change="handleRankSelection"
            >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="nickname" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="realname" label="真实姓名"></el-table-column>
            <el-table-column prop="advice" label="评论内容"></el-table-column>
            <el-table-column label="评分">
              <template scope="scope">
                <el-rate
                  v-model="scope.row.score"
                  disabled
                  text-template="{scope.row.score}"
                  >
                </el-rate>
              </template>
            </el-table-column>
            <el-table-column label="评论时间">
              <template scope="scope">
                {{ scope.row.created_at | toDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              label="操作"
              >
              <template scope="scope">
                <el-button @click="onRankDel(scope.row.id)" size="small" icon="delete2"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-pagination
                v-if="rankList"
                @size-change="rankListSizeChange"
                @current-change="rankCurrentChange"
                :current-page="rankList.currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="rankList.pageSize"
                :total="rankList.count"
                layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

       <!-- <el-tab-pane label="奖励情况" name="5">
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
      </el-tab-pane>  -->
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
      info: {},
      signinKeyword: '',
      collectionKeyword: '',
      commentKeyword: '',
      rankKeyword: '',
      selectedTab: '',
      cover: '',
      signinList: null,
      collectList: null,
      commentList: null,
      rankList: null,
      categories: null,
      selectedCategory: [],
      signSelection: [],
      collectionSelection: [],
      commentSelection: [],
      rankSelection: [],
      clickCount: '',
      commentCount: '',
      signCount: '',
      favorCount: '',
      rank: 0
    }
  },
  methods: {
    back () {
      this.$router.push({
        path: '/admin/tutorial/index'
      })
    },
    signinSizeChange (value) {
      const data = {
        currentPage: this.signinList.currentPage,
        keyword: this.signinKeyword,
        pageSize: value
      }
      this.getSigninList(data)
    },
    signinCurrentChange (value) {
      const data = {
        keyword: this.signinKeyword,
        currentPage: value,
        pageSize: this.signinList.pageSize
      }
      this.getSigninList(data)
    },
    collectionSizeChange (value) {
      const data = {
        keyword: this.collectionKeyword,
        currentPage: this.collectList.currentPage,
        pageSize: value
      }
      this.getCollectionList(data)
    },
    collectionCurrentChange (value) {
      const data = {
        keyword: this.collectionKeyword,
        currentPage: value,
        pageSize: this.collectList.pageSize
      }
      this.getCollectionList(data)
    },
    commentSizeChange (value) {
      const data = {
        keyword: this.commentKeyword,
        currentPage: this.commentList.currentPage,
        pageSize: value
      }
      this.getCommentList(data)
    },
    commentCurrentChange (value) {
      const data = {
        keyword: this.commentKeyword,
        currentPage: value,
        pageSize: this.commentList.pageSize
      }
      this.getCommentList(data)
    },
    rankListSizeChange (value) {
    },
    rankCurrentChange (value) {
    },
    onSignRefresh () {
      this.getSigninList()
    },
    onCollectionRefresh () {
      this.getCollectionList()
    },
    onCommentRefresh () {
      this.getCommentList()
    },
    onRankRefresh () {
      this.getRankList()
    },
    onSigninSearch () {
      const data = {
        keyword: this.signinKeyword,
        pageSize: this.signinList.pageSize,
        currentPage: this.signinList.currentPage
      }
      this.getSigninList(data)
    },
    onCollectionSearch () {
      const data = {
        keyword: this.collectionKeyword,
        pageSize: this.collectList.pageSize,
        currentPage: this.collectList.currentPage
      }
      this.getCollectionList(data)
    },
    onCommentSearch () {
      const data = {
        keyword: this.commentKeyword,
        pageSize: this.commentList.pageSize,
        currentPage: this.commentList.currentPage
      }
      this.getCommentList(data)
    },
    onRankSearch () {
      const data = {
        keyword: this.rankKeyword,
        pageSize: this.rankList.pageSize,
        currentPage: this.rankList.currentPage
      }
      this.getRankList(data)
    },
    handleSigninSelection (val) {
      this.signSelection = val
    },
    handleCollectionSelection (val) {
      this.collectionSelection = val
    },
    handleCommentSelection (val) {
      this.commentSelection = val
    },
    handleRankSelection (val) {
      this.rankSelection = val
    },
    onRankDel (value) {
      let arr = []
      if (Array.isArray(value) && value.length === 0) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      if (!Array.isArray(value)) {
        arr = [value]
      } else {
        value.forEach(item => {
          arr.push(item.id)
        })
      }
      this.$confirm('是否要确认删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.commentDel, {
          ids: arr
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const data = {
              keyword: this.rankKeyword,
              pageSize: this.rankList.pageSize,
              currentPage: this.rankList.currentPage
            }
            // const obj = {
            //   keyword: this.commentKeyword,
            //   pageSize: this.commentList.pageSize,
            //   currentPage: this.commentList.currentPage
            // }
            this.getRankList(data)
            // this.getCommentList(obj)
          }
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    onCommentDel (value) {
      let arr = []
      if (Array.isArray(value) && value.length === 0) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      if (!Array.isArray(value)) {
        arr = [value]
      } else {
        value.forEach(item => {
          arr.push(item.id)
        })
      }
      this.$confirm('是否要确认删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.RankDel, {
          ids: arr
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const obj = {
              keyword: this.commentKeyword,
              pageSize: this.commentList.pageSize,
              currentPage: this.commentList.currentPage
            }
            // const data = {
            //   keyword: this.rankKeyword,
            //   pageSize: this.rankList.pageSize,
            //   currentPage: this.rankList.currentPage
            // }
            this.getCommentList(obj)
            // this.getRankList(data)
          }
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    onCollectionDel (value) {
      let arr = []
      if (Array.isArray(value) && value.length === 0) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      if (!Array.isArray(value)) {
        arr = [value]
      } else {
        value.forEach(item => {
          arr.push(item.id)
        })
      }
      this.$confirm('是否要确认删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.favorDel, {
          ids: arr
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const data = {
              keyword: this.collectionKeyword,
              pageSize: this.collectList.pageSize,
              currentPage: this.collectList.currentPage
            }
            this.getCollectionList(data)
          }
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    onSignDel (value) {
      let arr = []
      if (Array.isArray(value) && value.length === 0) {
        this.$message.info('请选择需要操作的数据')
        return
      }
      if (!Array.isArray(value)) {
        arr = [value]
      } else {
        value.forEach(item => {
          arr.push(item.id)
        })
      }
      this.$confirm('是否要确认删除', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.POST(config.tutorial.attendeeDel, {
          ids: arr
        })
        .then(response => {
          if (response.data.errcode === '0000') {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const data = {
              keyword: this.signinKeyword,
              pageSize: this.signinList.pageSize,
              currentPage: this.signinList.currentPage
            }
            this.getSigninList(data)
          }
        })
      })
      .catch(_ => {
        this.$message.error('取消')
      })
    },
    getSigninList (data = null) {
      api.GET(config.tutorial.attendee, {
        id: this.id,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          let data = response.data.data
          data.data.forEach(item => {
            if (item.pay) {
              switch (item.pay.pay_way) {
                case '1':
                  item.pay.pay_way = '免费'
                  break
                case '2':
                  item.pay.pay_way = '积分支付'
                  break
                case '3':
                  item.pay.pay_way = '现金支付'
                  break
              }
            }
          })
          this.signinList = response.data.data
          console.log(this.signinList)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getCollectionList (data = null) {
      api.GET(config.tutorial.favor, {
        id: this.id,
        ...data
      })
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
      api.GET(config.tutorial.RankList, {
        id: this.id,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.commentList = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getRankList (data = null) {
      api.GET(config.tutorial.commentList, {
        id: this.id,
        ...data
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.rankList = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    counterDetail (id) {
      api.GET(config.tutorial.counter, {
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          let arr = response.data.data
          arr.forEach(item => {
            switch (item.counter) {
              case 'click':
                this.clickCount = item.count
                break
              case 'comment':
                this.commentCount = item.count
                break
              case 'favor':
                this.favorCount = item.count
                break
              case 'attendee':
                this.signCount = item.count
                break
            }
          })
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getClassDetail (id) {
      api.GET(config.tutorial.detail, {
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.getCategoryList()
          let data = response.data.data
          data.category.stages.forEach(item => {
            if (item.attributes.length) {
              item.attributes.forEach(attr => {
                switch (attr.attr_key) {
                  case 'activity_property_tutorial_speaker':
                    this.info.speaker = attr.attr_value
                    break
                  case 'activity_property_tutorial_figure':
                    this.info.cover = attr.attr_value
                    break
                  case 'activity_property_tutorial_title':
                    this.info.title = attr.attr_value
                    break
                  case 'activity_property_tutorial_digest':
                    this.info.digest = attr.attr_value
                    break
                  case 'activity_property_tutorial_category':
                    this.info.category = JSON.parse(attr.attr_value)
                    this.selectedCategory = JSON.parse(attr.attr_value)
                    break
                  case 'activity_property_tutorial_type':
                    this.info.type = attr.attr_value
                    break
                  case 'activity_property_image_upload':
                    this.info.cover = attr.attr_value
                    break
                  case 'activity_property_tutorial_start_time':
                    this.info.start = JSON.parse(attr.attr_value)
                    break
                  case 'activity_property_tutorial_end_time':
                    this.info.end = JSON.parse(attr.attr_value)
                    break
                }
              })
            }
          })
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    getAvgRank (id) {
      api.GET(config.tutorial.rankAvg, {
        id: id
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.rank = response.data.data
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    },
    transformTreeData (data) {
      let object = []
      data.forEach(item => {
        let category = {}
        category.value = item.id.toString()
        category.label = item.name
        if (item.children && item.children.length !== 0) {
          const children = this.transformTreeData(item.children)
          category.children = children
        } else {
          category.children = null
        }
        object.push(category)
      })

      return object
    },
    getCategoryList () {
      api.GET(config.tutorial.category, {
        p_id: 0,
        catgr_id: 14
      })
      .then(response => {
        if (response.data.errcode === '0000') {
          this.categories = this.transformTreeData(response.data.data.data)
        }
      })
      .catch(error => {
        this.$message.error(error)
      })
    }
  },
  mounted () {
    this.getSigninList()
    this.getCommentList()
    this.getCollectionList()
    this.getRankList()
    this.getClassDetail(this.id)
    this.counterDetail(this.id)
    this.getAvgRank(this.id)
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
.sc-tutorial-info .el-table {
  margin-top: 1rem;
}
.sc-tutorial-info-basic {
  border-bottom: 1px solid lightgray;
}
.sc-tutorial-info-count {
  margin-top: 2rem;
}
</style>
