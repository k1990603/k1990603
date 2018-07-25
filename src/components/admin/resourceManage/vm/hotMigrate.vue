<template>
  <div class="hotMigrateDialog dialogTemplate" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
    <el-table :data="[hostMigrateInfo]" border>
      <el-table-column prop="instance_name" :show-overflow-tooltip='true' label="主机名" width="200">
      </el-table-column>
      <el-table-column prop="instance_ip" :show-overflow-tooltip='true' label="IP地址">
      </el-table-column>
      <el-table-column prop="instance_cpu" :show-overflow-tooltip='true' label="CPU(核)">
      </el-table-column>
      <el-table-column prop="instance_mem" :show-overflow-tooltip='true' label="内存(G)">
      </el-table-column>
      <el-table-column prop="instance_disk" :show-overflow-tooltip='true' label="磁盘(G)">
      </el-table-column>
    </el-table>
    <div class="tipsText">
      请选择迁移的目标物理机
    </div>
    <el-table :data="hostMigrateInfo.host_list" height="160" border style="width: 100%">
      <el-table-column width="50px">
        <template slot-scope="scope">
          <el-radio v-model="selectedProject" :label="scope.$index" class="configClass"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="host_name" label="HOST名称" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="host_ip" label="HOST IP" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="current_cpu_used" label="CPU(使用率,%)" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="current_mem_used" label="MEM(使用率,%)" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="free_disk_space" label="磁盘(剩余,gb)" :show-overflow-tooltip='true'>
      </el-table-column>
    </el-table>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="transfer">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { hotMigrate } from '@/api/admin/vm'
export default {
  props: ['rowInfo', 'instanceUuid', 'hostMigrateInfo'],
  data() {
    return {
      loading: false,
      selectedProject: 0
    }
  },
  watch: {
    instanceUuid(val) {
      if (val != '') {
        this.loading = false
        this.selectedProject = 0
      }
    }
  },
  computed: {},
  methods: {
    hotMigrate,
    transfer() {
      this.loading = true
      let params = {
        instance_uuid: this.rowInfo.instance_uuid,
        host_uuid: this.hostMigrateInfo.host_list[this.selectedProject]
          .host_uuid,
        speed_limit: 10
      }
      this.hotMigrate(params).then(res => {
        this.loading = false
        let data = res.data
        if (data.code == 0) {
          this.$message({
            message: '您已经热迁移成功！',
            type: 'success'
          })
          this.cancel()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    cancel() {
      this.$emit('hotMigrateRes')
    }
  }
}
</script>
<style lang=less>
.hotMigrateDialog {
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
  .el-radio__label {
    display: none;
  }
}
</style>

