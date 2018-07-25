<template>
  <div class="editNetDialog dialogTemplate" v-loading="loading" element-loading-text="提交中,请耐心等待...">
    <el-table :data="[rowInfo]">
      <el-table-column prop="instance_uuid" label="UUID" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="displayname" label="主机名" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="internet_ip" label="公网IP" :show-overflow-tooltip='true'></el-table-column>
    </el-table>
    <el-form label-width="77px" style="margin-top:15px;">
      <el-form-item label="目标带宽">
        <el-col :span="20">
          <el-slider show-input v-model='bandwidth_size' :min='rowInfo.bandwidth_size?rowInfo.bandwidth_size:0' :max='1000'>
          </el-slider>
        </el-col>
        Mbps
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { changeNetWidth } from '@/api/admin/vm'
export default {
  props: ['rowInfo'],
  data() {
    return {
      loading: false,
      bandwidth_size: 0
    }
  },
  computed: {},
  methods: {
    changeNetWidth,
    submit() {
      this.loading = true
      this.changeNetWidth({
        bandwidth_size: this.bandwidth_size,
        instance_uuid: this.rowInfo.instance_uuid
      }).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '调整网络带宽成功'
          })
          this.cancel()
        }
      })
    },
    cancel() {
      this.$emit('editNetRes')
    }
  }
}
</script>
<style lang=less>
.someVmOperateDialog {
  .tipText {
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
}
</style>

