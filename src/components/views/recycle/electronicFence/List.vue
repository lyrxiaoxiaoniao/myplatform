<template>
  <div class="sc-fence-list">
<kobe-table>
      <div class="kobe-table-header"
           slot="kobe-table-header">
        <el-row type="flex"
                justify="space-between">
          <el-col>
            <el-button type="primary"
                       icon="plus"
                       @click="openDialog('infoVisible')">新增</el-button>
          </el-col>
          <el-select v-model="value"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-col :span="7">
            <el-input placeholder="请输入关键字"
                      class="sc-table-header-select">
              <el-button slot="append"
                         class="sc-table-search-btn"
                         icon="search"></el-button>
            </el-input>
          </el-col>
          <el-button type="primary"
                     @click="openDialog('advanceVisible')"
                     icon="search">高级</el-button>
          <el-button type="primary"
                     icon="upload2"></el-button>
          <el-button type="primary"
                     icon="setting"></el-button>
        </el-row>
      </div>
      <div slot="kobe-table-content"
           class="kobe-table">
        <el-table :data="listData"
                  border>
          <el-table-column label="ID"
                           prop="id"></el-table-column>
          <el-table-column label="基地名称"></el-table-column>
          <el-table-column label="基地电话"></el-table-column>
          <el-table-column label="基地照片">
            <template scope="scope">
              <img style="width:58px; height:58px;"
                   :src="scope.row.logo"
                   alt="">
            </template>
          </el-table-column>
          <el-table-column label="基地地址"></el-table-column>
          <el-table-column label="所属地区"></el-table-column>
          <el-table-column label="基地负责人"></el-table-column>
          <el-table-column label="负责人电话"></el-table-column>
          <el-table-column label="是否推荐">
            <template scope="scope">
              <el-switch on-text="开"
                         off-text="关"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否允许预约"></el-table-column>
          <el-table-column label="显示状态">
            <template scope="scope">
              <el-switch on-text="开"
                         off-text="关"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="200">
            <template scope="scope">
              <el-button icon="edit"
                         size="small"></el-button>
              <el-button icon="setting"
                         size="small"
                         @click="configItem(scope.row.id)"></el-button>
              <el-button icon="delete2"
                         type="danger"
                         @click="deleteItem(scope.row.id)"
                         size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="kobe-table-footer"
           class="kobe-table-footer">
        <el-row type="flex"
                justify="center">
          <el-col :span="12">
            <el-pagination @size-change="handleSizeChange"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          text: '按多边形划分'
        },
        {
          text: '行政区域划分'
        }
      ]
    }
  },
  methods: {
    openDialog(e) {
      this[e] = true
    }
  }
}
</script>

<style>

</style>
