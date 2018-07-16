<template>
  <div class="editConfigDialog dialogTemplate">
    <el-table :data="[rowInfo]">
      <el-table-column prop="instance_uuid" label="UUID" :show-overflow-tooltip='true' min-width="150"></el-table-column>
      <el-table-column prop="displayname" label="主机名" :show-overflow-tooltip='true' width="200"></el-table-column>
      <el-table-column label="配额" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{scope.row.cpu}}核{{scope.row.mem}}G
        </template>
      </el-table-column>
    </el-table>
    <div class="tipsText">
      请按照
    </div>
    <el-table :data="configList" style="width: 500px">
      <el-table-column width="50px">
        <template slot-scope="scope">
          <el-radio v-model="checkedConfig" :label="scope.$index" class="configClass"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="flavor_name" label="配置名称">
      </el-table-column>
      <el-table-column prop="flavor_cpu" label="CPU(核)">
      </el-table-column>
      <el-table-column prop="flavor_mem" label="MEM(GB)">
      </el-table-column>
    </el-table>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click='submit'>确 定</el-button>
      <el-button @click='cancel'>取 消</el-button>
    </span>
  </div>
</template>
<script>
import { resetFlovr } from '@/api/admin/vm'
export default {
  props: ['configList', 'rowInfo'],
  data() {
    return {
      checkedConfig: 0
    }
  },
  computed: {},
  methods: {
    resetFlovr,
    submit() {
      console.log(this.rowInfo.instance_uuid)
      this.resetFlovr({
        instance_uuid: this.rowInfo.instance_uuid,
        flavor_id: this.configList[this.checkedConfig].flavor_id
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '调整成功'
          })
          this.cancel()
        }
      })
    },
    cancel() {
      this.checkedConfig = 0
      this.$emit('configRes')
    }
  }
}
</script>
<style lang=less>
.editConfigDialog {
  .configClass {
    .el-radio__label {
      display: none;
    }
  }
  .tipsText {
    font-size: 12px;
    line-height: 22px;
    margin: 15px 0px;
    padding: 5px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    position: relative;
  }
}
</style>

