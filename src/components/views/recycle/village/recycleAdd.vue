<template>
<div>
    <kobe-table>
        <div slot="kobe-table-header" class="kobe-table-header">
           <el-row>
               <el-col :span="16" class="text-v-center">基本信息</el-col>
               <el-col :span="8">
                   <el-button @click="back">返回</el-button>  
                   <el-button type="primary" @click="add" style="margin-left: 10px;">保存</el-button>  
               </el-col>
           </el-row>  
        </div>
        <div slot="kobe-table-content" class="kobe-table">
          <el-form :label-position="left" label-width="80px" :model="formLabelAlign">
              <el-row>
                <el-col :span="12"> 
                    <el-form-item label="名称">
                      <el-input v-model="formLabelAlign.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    
                
                  <el-form-item label="活动区域">
                    <el-input v-model="formLabelAlign.region"></el-input>
                  </el-form-item> 
                 </el-col>
              </el-row>
    			  
    			  <el-form-item label="活动形式">
    			    <el-input v-model="formLabelAlign.type"></el-input>
    			  </el-form-item>
		      </el-form>
        </div>
       
    </kobe-table>

</div>
</template>
<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region111: '',
        type: '',
        modify: ''
      }
    }
  }
}
</script>
<style scoped>
</style>