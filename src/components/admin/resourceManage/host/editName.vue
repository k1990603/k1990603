<template>
  <div class="hostEditDiag dialogTemplate" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
    <el-form :model="hostDeltails" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="名称" prop="name" required>
        <el-input type="text" v-model="hostDeltails.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="IP" prop="host_ip" required>
        <el-input type="text" v-model="hostDeltails.host_ip"></el-input>
      </el-form-item> -->
      <el-form-item label="保留内存" prop="hold_mem_gb" required>
        <el-input-number v-model="hostDeltails.hold_mem_gb" :min="0" :max="512" label="保留内存"></el-input-number> G
      </el-form-item>
      <el-form-item label="管理IP" prop="remote_manage_ip" required>
        <el-input type="text" v-model="hostDeltails.remote_manage_ip"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </div>
</template>
<script>
import { editHostInfo } from '@/api/admin/hostManage'
import { checkIp } from '@/filters/index'
export default {
  props: ['hostDeltails', 'id'],
  watch: {
    id(val) {
      this.loading = false
    }
  },
  data() {
    var checkIp = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理IP'))
      } else if (!this.checkIp(value)) {
        console.log(this.checkIp(value))
        callback(new Error('IP格式不正确'))
      } else {
        callback()
      }
    }
    var checkHoldMem = (rule, value, callback) => {}
    return {
      loading: false,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请填写HOST名称', trigger: 'blur' }],
        hold_mem_gb: [{ validator: checkHoldMem, trigger: 'blur' }],
        remote_manage_ip: [{ validator: checkIp, trigger: 'blur' }]
      }
    }
  },
  computed: {},
  methods: {
    checkIp,
    editHostInfo,
    cancel() {
      this.$refs.ruleForm.resetFields()
      this.$emit('editRes')
    },
    submit() {
      this.editHostInfo({
        name: this.hostDeltails.name,
        hold_mem_gb: this.hostDeltails.hold_mem_gb,
        remote_manage_ip: this.hostDeltails.remote_manage_ip,
        host_uuid: this.hostDeltails.host_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message.success('修改成功')
          this.cancel()
        }
      })
    },
    getSelVal(val) {
      console.log(val)
    }
  }
}
</script>
<style lang=less>
.privateEditDiag {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>

