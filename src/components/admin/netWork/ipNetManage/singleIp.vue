<template>
  <div class="ipDialog dialogTemplate">
    <el-form label-width="80px">
      <el-form-item label="IP">
        <el-input type="text" v-model="ipInfo.ip_address" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input type="text" :value='ipInfo.status?formmaterType(ipInfo.status):"未初始化"' :disabled="true"></el-input>
      </el-form-item>
      <div v-if="ipInfo.status=='1'">
        <el-form-item label="所属VM">
          <el-input type="text" v-model="ipInfo.instance_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-input type="text" v-model="ipInfo.project_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属租户">
          <el-input type="text" v-model="ipInfo.tenant_name" :disabled="true"></el-input>
        </el-form-item>
      </div>
      <el-form-item v-if="!ipInfo.status">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipInitSubmit">确定初始化</el-button>
      </el-form-item>
      <el-form-item v-if="ipInfo.status=='0'">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipCancelInitSubmit">取消初始化</el-button>
        <el-button type="warning" @click="ipRetainSubmit">保留</el-button>
      </el-form-item>
      <el-form-item v-if="ipInfo.status=='2'">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipCancelRetainSubmit">取消保留</el-button>
      </el-form-item>
      <el-form-item v-if="ipInfo.status=='3'" style="text-align:center;">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ipCancelDistributionSubmit">取消分配</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  ipNetInit,
  ipNetCancelInit,
  ipNetRetain,
  ipNetCancelRetain
} from '@/api/admin/netWork'
export default {
  props: ['ipInfo'],
  data() {
    return {}
  },
  methods: {
    ipNetInit,
    ipNetCancelInit,
    ipNetRetain,
    ipNetCancelRetain,
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
      }
      return str
    },
    ipInitSubmit() {
      this.ipNetInit({
        ip_address: JSON.stringify({
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
        }),
        internet_network_segment_uuid: JSON.parse(this.$route.query.ipNetInfo)
          .uuid
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
      this.ipNetCancelInit({
        ip_address: JSON.stringify({
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
        }),
        internet_network_segment_uuid: JSON.parse(this.$route.query.ipNetInfo)
          .uuid
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
      this.ipNetRetain({
        ip_address: JSON.stringify({
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
        }),
        internet_network_segment_uuid: JSON.parse(this.$route.query.ipNetInfo)
          .uuid
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
      this.ipNetCancelRetain({
        ip_address: JSON.stringify({
          start_ip: this.$props.ipInfo.ip_address,
          end_ip: ''
        }),
        internet_network_segment_uuid: JSON.parse(this.$route.query.ipNetInfo)
          .uuid
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
    cancel() {
      this.$emit('singelRes')
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

