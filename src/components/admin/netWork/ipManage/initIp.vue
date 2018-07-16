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
      <el-form-item label="起始IP" prop="startIp" required>
        <el-col :span='16'>
          <el-input type="text" v-model="ruleForm.startIp">
            <template slot="prepend">{{ipTmp}}</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="结束IP" prop="endIp" required>
        <el-col :span='16'>
          <el-input type="text" v-model="ruleForm.endIp">
            <template slot="prepend">{{ipTmp}}</template>
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
import { checkQuatoVal } from '@/filters/index.js'
import {
  ipInit,
  ipCancelInit,
  ipRetain,
  ipCancelRetain,
  ipDistribution,
  ipCancelDistribution
} from '@/api/admin/netWork'
export default {
  props: ['initSegement', 'dialogTitle'],
  data() {
    var checkStartIp = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入IP最后一位数'))
      } else if (
        value != 0 &&
        (!checkQuatoVal(value) || parseInt(value)) > 255
      ) {
        callback(new Error('请输入0-255的数值'))
      } else {
        if (
          this.ruleForm.endIp != '' &&
          parseInt(value) > parseInt(this.ruleForm.endIp)
        ) {
          callback(new Error('开始IP不能大于结束IP'))
        } else {
          callback()
        }
      }
    }
    var checkEndIp = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入IP最后一位数'))
      } else if (
        value != 0 &&
        (!checkQuatoVal(value) || parseInt(value)) > 255
      ) {
        callback(new Error('请输入0-255的数值'))
      } else {
        if (parseInt(value) < parseInt(this.ruleForm.startIp)) {
          callback(new Error('结束IP不能小于开始IP'))
        } else {
          callback()
        }
      }
    }
    return {
      ipTmp: '',
      subNetSegement: '',
      // ipSegmengt: '',
      ruleForm: {
        startIp: '',
        endIp: ''
      },
      rules: {
        startIp: [{ validator: checkStartIp, trigger: 'blur' }],
        endIp: [{ validator: checkEndIp, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.ipTmp = this.initSegement.split('.')
    this.ipTmp.pop()
    this.ipTmp = this.ipTmp.join('.') + '.'
    this.subNetSegement = JSON.parse(
      this.$route.query.subNetInfo
    ).subnetwork_name
  },
  methods: {
    ipInit,
    ipCancelInit,
    ipRetain,
    ipCancelRetain,
    ipDistribution,
    ipCancelDistribution,
    checkQuatoVal,
    ipInitSubmit() {
      this.ipInit({
        ip_address: JSON.stringify({
          start_ip: this.ipTmp + this.ruleForm.startIp,
          end_ip: this.ipTmp + this.ruleForm.endIp
        }),
        subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
          .sub_network_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '初始化IP成功'
          })
          this.cancel()
        }
      })
    },
    ipCancelInitSubmit() {
      this.ipCancelInit({
        ip_address: JSON.stringify({
          start_ip: this.ipTmp + this.ruleForm.startIp,
          end_ip: this.ipTmp + this.ruleForm.endIp
        }),
        subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
          .sub_network_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '取消初始化IP成功'
          })
          this.cancel()
        }
      })
    },
    ipRetainSubmit() {
      this.ipRetain({
        ip_address: JSON.stringify({
          start_ip: this.ipTmp + this.ruleForm.startIp,
          end_ip: this.ipTmp + this.ruleForm.endIp
        }),
        subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
          .sub_network_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '保留IP成功'
          })
          this.cancel()
        }
      })
    },
    ipCancelRetainSubmit() {
      this.ipCancelRetain({
        ip_address: JSON.stringify({
          start_ip: this.ipTmp + this.ruleForm.startIp,
          end_ip: this.ipTmp + this.ruleForm.endIp
        }),
        subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
          .sub_network_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '取消保留IP成功'
          })
          this.cancel()
        }
      })
    },
    ipDistributionSubmit() {
      this.ipDistribution({
        ip_address: JSON.stringify({
          start_ip: this.ipTmp + this.ruleForm.startIp,
          end_ip: this.ipTmp + this.ruleForm.endIp
        }),
        subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
          .sub_network_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '预分配IP成功'
          })
          this.cancel()
        }
      })
    },
    ipCancelDistributionSubmit() {
      this.ipCancelDistribution({
        ip_address: JSON.stringify({
          start_ip: this.ipTmp + this.ruleForm.startIp,
          end_ip: this.ipTmp + this.ruleForm.endIp
        }),
        subnetwork_uuid: JSON.parse(this.$route.query.subNetInfo)
          .sub_network_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '取消预分配IP成功'
          })
          this.cancel()
        }
      })
    },
    cancel() {
      this.$refs.ruleForm.resetFields()
      this.$emit('operaRes')
    },
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          switch (this.dialogTitle) {
            case '初始化IP':
              this.ipInitSubmit()
              break
            case '取消初始化IP':
              this.ipCancelInitSubmit()
              break
            case '保留IP':
              this.ipRetainSubmit()
              break
            case '取消保留IP':
              this.ipCancelRetainSubmit()
              break
            case '预分配IP':
              this.ipDistributionSubmit()
              break
            case '取消预分配IP':
              this.ipCancelDistributionSubmit()
              break
          }
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

