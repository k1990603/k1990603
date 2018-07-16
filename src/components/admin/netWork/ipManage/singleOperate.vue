<template>
  <div class="ipDialog dialogTemplate">
    <el-form label-width="100px">
      <el-form-item label="IP">
        <el-input type="text" v-model="ipInfo.ip_address" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input type="text" :value='ipInfo.iptype?formmaterType(ipInfo.iptype):"未初始化"' :disabled="true"></el-input>
      </el-form-item>
      <div v-if="ipInfo.iptype=='1'">
        <el-form-item label="所属VM">
          <el-input type="text" v-model="ipInfo.instance_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="关联安全组">
          <el-input type="text" v-model="ipInfo.securitygroup_name" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属租户">
          <el-input type="text" v-model="ipInfo.tenant_name" :disabled="true"></el-input>
        </el-form-item> -->
      </div>
      <el-form-item v-if="!ipInfo.iptype">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipInitSubmit">确定初始化</el-button>
      </el-form-item>
      <el-form-item v-if="ipInfo.iptype=='0'">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipCancelInitSubmit">取消初始化</el-button>
        <el-button type="warning" @click="ipRetainSubmit">保留</el-button>
        <el-button type="success" @click="ipDistributionSubmit">预分配</el-button>
      </el-form-item>
      <el-form-item v-if="ipInfo.iptype=='2'">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipCancelRetainSubmit">取消保留</el-button>
      </el-form-item>
      <el-form-item v-if="ipInfo.iptype=='3'" style="text-align:center;">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipCancelDistributionSubmit">取消分配</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  ipInit,
  ipCancelInit,
  ipRetain,
  ipCancelRetain,
  ipDistribution,
  ipCancelDistribution
} from '@/api/admin/netWork'
export default {
  props: ['ipInfo'],
  data() {
    return {
      statu: '',
      ruleForm: {
        startIp: '',
        endIp: ''
      },
      rules: {
        startIp: [{ required: true, message: '请填写起始IP', trigger: 'blur' }],
        endIp: [{ required: true, message: '请填写结束IP', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ipInit,
    ipCancelInit,
    ipRetain,
    ipCancelRetain,
    ipDistribution,
    ipCancelDistribution,
    formmaterType(type) {
      let str = ''
      switch (type) {
        case '0':
          str = '已初始化'
          // 已初始化
          break
        case '1':
          str = '已使用'
          // 已使用
          break
        case '2':
          str = '已保留'
          // 已保留
          break
        case '3':
          str = '预分配'
          // 预分配
          break
      }
      return str
    },
    ipInitSubmit() {
      this.ipInit({
        ip_address: JSON.stringify({
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
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
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
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
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
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
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
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
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
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
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
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
      this.$emit('singelRes')
    },
    getSelVal(val) {
      console.log(val)
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

