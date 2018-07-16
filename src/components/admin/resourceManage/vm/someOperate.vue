<template>
  <div class="someVmOperateDialog dialogTemplate" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
    <el-table :data="someOperateInfo.info">
      <el-table-column prop="instance_uuid" label="UUID" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="displayname" label="主机名" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="ip_address" label="IP地址" :show-overflow-tooltip='true'></el-table-column>
    </el-table>
    <el-dialog width="700px" class='dialogTemplate' :title="title+'操作失败信息'" :visible.sync="innerVisible" append-to-body>
      <el-table :data="errorData" height='300' ref='errorTable' stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table width="600px" border v-if="typeof props.row.message == 'object'" :data="props.row.message" height='200' ref='errorTable'>
              <el-table-column prop="instance_nic_name" label="网卡名称" :show-overflow-tooltip='true'></el-table-column>
              <el-table-column prop="error_message" label="错误信息" :show-overflow-tooltip='true'></el-table-column>
            </el-table>
            <el-form v-if="typeof props.row.message == 'string'" label-position="left" inline class="demo-table-expand">
              <el-form-item label="错误原因:">
                <span>{{ props.row.message }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="instance_uuid" label="UUID" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="instance_name" label="主机名" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="ip_address" label="IP地址" :show-overflow-tooltip='true'></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible=false">取 消</el-button>
      </span>
    </el-dialog>
    <div class="tipText">
      确定执行
      <span>{{title}}</span>
      操作？
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import {
  cloneBackUp,
  startUpVm,
  shutDownVm,
  restartVm,
  deleteVm,
  retryVm
} from '@/api/admin/vm'
export default {
  props: ['title', 'instanceUuid', 'someOperateInfo'],
  data() {
    return {
      errorData: [],
      innerVisible: false,
      loading: false
    }
  },
  watch: {
    instanceUuid(val) {
      if (val != '') {
        this.loading = false
      }
    }
  },
  methods: {
    cloneBackUp,
    startUpVm,
    shutDownVm,
    restartVm,
    deleteVm,
    retryVm,
    cancel() {
      this.$emit('operateRes')
    },
    submit() {
      this.loading = true
      let instance_uuids = []
      this.$props.someOperateInfo.info.forEach(item => {
        instance_uuids.push(item.instance_uuid)
      })
      switch (this.$props.someOperateInfo.type) {
        case 'startUp':
          this.startUpVm({
            instance_uuids: JSON.stringify(instance_uuids)
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '开机成功'
              })
              this.cancel()
            }
          })
          break
        case 'shutDown':
          this.shutDownVm({
            instance_uuids: JSON.stringify(instance_uuids),
            flag: 1
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '关机成功'
              })
              this.cancel()
            }
          })
          break
        case 'powerOff':
          this.shutDownVm({
            instance_uuids: JSON.stringify(instance_uuids),
            flag: 2
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '强制关机成功'
              })
              this.cancel()
            }
          })
          break
        case 'reBoot':
          this.restartVm({
            instance_uuids: JSON.stringify(instance_uuids),
            flag: '1'
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '重启成功'
              })
              this.cancel()
            }
          })
          break
        case 'powerReBoot':
          this.restartVm({
            instance_uuids: JSON.stringify(instance_uuids),
            flag: '2'
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '强制重启成功'
              })
              this.cancel()
            }
          })
          break
        case 'reTry':
          let request_ids = []
          this.$props.someOperateInfo.info.forEach(item => {
            request_ids.push(item.request_id)
          })
          this.retryVm({
            request_ids: request_ids.join(',')
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '重试成功'
              })
              this.cancel()
            }
          })
          break
        case 'delete':
          this.deleteVm({
            instance_uuids: instance_uuids.join(',')
          }).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.cancel()
            } else if (res.data.code == 1) {
              this.errorData = res.data.data
              this.innerVisible = true
            }
          })
          break
        case 'cloneBackups':
          this.cloneBackUp(
            JSON.stringify({
              apiOrigin: 'sfkvm',
              instance_uuid: this.$props.someOperateInfo.info[0].instance_uuid
            })
          ).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '备份成功'
              })
              this.cancel()
            }
          })
          break
        case 'unbindNet':
          break
      }
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

