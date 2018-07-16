<template>
  <div class="ipDialog dialogTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="子网">
        <el-col :span='16'>
          <el-input type="text" v-model="subNetSegement" disabled=""></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="当前IP段">
        <el-col :span='16'>
          <el-input type="text" v-model="initSegement" disabled=""></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="所属租户" prop="tenant_uuid" required>
        <el-col :span='16'>
          <el-select v-model="tenant_uuid" @change='changeTenant' placeholder="请选择租户">
            <el-option v-for="(item,index) in tenantList" :key="item.value" :label="item" :value="index">
            </el-option>
          </el-select>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所属项目" prop="project_uuid" required>
        <el-col :span='16'>
          <el-select v-model="project_uuid" @change='changeProject' placeholder="请选择项目">
            <el-option v-for="(item,index) in peojectList" :key="item.value" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item> -->
      <el-form-item label="物理机群ID" prop="hostpoolId">
        <el-col :span='16'>
          <el-input type="text" v-model="ruleForm.hostpoolId">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="系统编码" prop="sysCode">
        <el-col :span='16'>
          <el-input type="text" v-model="ruleForm.sysCode">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { checkIp } from '@/filters/index.js'
import { vipApply } from '@/api/admin/netWork'
export default {
  props: ['initSegement'],
  data() {
    // var checkIp = (rule, value, callback) => {
    //   if (value == '') {
    //     callback(new Error('请输入IP最后一位数'))
    //   } else if (!Number.isInteger(value)) {
    //     callback(new Error('请输入1-255的数值'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      subNetSegement: '',
      ruleForm: {
        // tenant_uuid: '',
        // project_uuid: '',
        hostpoolId: '',
        sysCode: ''
      },
      rules: {
        // tenant_uuid: [{ validator: checkIp, trigger: 'blur' }],
        // project_uuid: [{ validator: checkIp, trigger: 'blur' }],
        hostpoolId: [
          { required: true, message: '请输入物理机群id', trigger: 'change' }
        ],
        sysCode: [
          { required: true, message: '请输入系统编码', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.subNetSegement = JSON.parse(
      this.$route.query.subNetInfo
    ).subnetwork_name
  },
  methods: {
    vipApply,
    checkIp,
    cancel() {
      this.$refs.ruleForm.resetFields()
      this.$emit('vipapplyRes')
    },
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.vipApply({
            subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
              .sub_network_uuid,
            app_cluster_id: this.ruleForm.hostpoolId,
            sys_code: this.ruleForm.sysCode
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '申请成功'
              })
              this.cancel()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang=less>
.ipDialog {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>

