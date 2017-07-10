<template>
  <div class="sc-training-category">
    <el-row type="flex">
      <el-col :span="4">
        <kobe-category-tree
          :title="title"
          >
        </kobe-category-tree>
      </el-col>

      <el-col :span="20">
        <kobe-table
          v-if="response"
          >
          <div slot="kobe-table-header" class="kobe-table-header">
            <el-row type="flex">
              <el-button>添加子分类</el-button>
              <el-button>修改属性</el-button>
              <el-button>更多操作</el-button>
              <el-button>刷新</el-button>
            </el-row>
          </div>
          <div slot="kobe-table-content" class="kobe-table">
            <el-table
              :data="response.data"
              border
              stripe
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column prop="title" label="分类名称" width="120"></el-table-column>
              <el-table-column label="图片">
                <template scope="scope">
                  <img :src="scope.row.img" alt="image">
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="150">
                <template scope="scope">
                  {{ scope.row.created_at || toDateTime }}
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="顺序" width="80"></el-table-column>
              <el-table-column label="顺序">
                <template scope="scope">
                  <el-switch></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template scope="scope">
                  <el-button size="small" icon="delete2"></el-button>
                  <el-button size="small" icon="edit"></el-button>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'sc-training-category',
  data () {
    return {
      title: '培训分类管理',
      response: null
    }
  },
  methods: {
    handleSizeChange (value) {
    },
    handleCurrentChange (value) {
    },
    getCategories () {
    },
    getTrainingList () {
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
