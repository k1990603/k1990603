<template>
  <div class="deleteVmInstance dialogTemplate">
    <div class="oldSafeGroupInfo">
      <el-table :data="multipleSelection" style="width: 100%" stripe>
        <el-table-column prop="instance_nic_name" label="网卡名称" min-width="80">
        </el-table-column>
        <el-table-column prop="instance_nic_type" label="网卡类型" min-width="80">
          <template slot-scope="scope">
            {{scope.row.instance_nic_type == 0 ?'内网':'外网'}}
          </template>
        </el-table-column>
        <el-table-column prop="instance_name" label="VM名称" min-width="80">
        </el-table-column>
        <el-table-column prop="ip_address" label="主IP地址" min-width="100">
        </el-table-column>
      </el-table>
      <div class="tipText">
        确定执行
        <span>移除安全组</span>
        操作？
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDelete">取 消</el-button>
      <el-button type="primary" @click="confir">确 定</el-button>
    </span>
  </div>
</template>
<script>
import { deleteIntance } from '@/api/admin/securityManage'
export default {
  props: ['multipleSelection'],
  data() {
    return {}
  },
  methods: {
    deleteIntance,
    cancelDelete() {
      this.$emit('deleteRes')
    },
    confir() {
      let bind_vm = {}
      this.multipleSelection.forEach(item => {
        if (!bind_vm[item.instance_uuid]) {
          bind_vm[item.instance_uuid] = [
            [item.instance_nic_uuid, item.instance_nic_name]
          ]
        } else {
          bind_vm[item.instance_uuid].push([
            item.instance_nic_uuid,
            item.instance_nic_name
          ])
        }
      })
      this.deleteIntance({
        securitygroup_uuid: this.$route.params.uuid,
        bind_vm: JSON.stringify(bind_vm)
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: '移除成功',
            type: 'success'
          })
          this.$emit('deleteRes')
        }
      })
    }
  },
  computed: {}
}
</script>
<style lang="less">
.deleteVmInstance {
  .oldSafeGroupInfo {
    .tipText {
      margin-top: 15px;
      font-size: 16px;
      span {
        font-size: 18px;
        color: #f00;
      }
    }
    & > h3 {
      margin-bottom: 15px;
    }
    .itemInfo {
      font-size: 16px;
      padding-left: 15px;
      padding-bottom: 15px;
      & > label {
        width: 120px;
        display: inline-block;
      }
      & > span {
        color: #999;
      }
      & > .nameBox {
        display: inline-block;
      }
      &.textAreaBox {
        & > label {
          vertical-align: top;
        }
        .nameBox {
          width: 400px;
        }
      }
    }
  }
}
</style>
