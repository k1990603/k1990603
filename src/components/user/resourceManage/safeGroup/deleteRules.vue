<template>
  <div v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" class="deleteVmInstance dialogTemplate">
    <div class="oldSafeGroupInfo">
      <el-table :data="multipleSelection" style="width: 100%" stripe>
        <el-table-column prop="protocol" label="协议名">
          <template slot-scope='scope'>
            {{formatProtocol(scope.row.protocol)}}
          </template>
        </el-table-column>
        <el-table-column prop="cidr" label="CIDR">
        </el-table-column>
        <el-table-column prop="start_port" label="开始端口">
        </el-table-column>
        <el-table-column prop="end_port" label="结束端口">
        </el-table-column>
        <el-table-column prop="description" label="备注">
        </el-table-column>
      </el-table>
      <div class="tipText">
        确定执行
        <span>删除以上规则</span>
        操作？
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confir">确 定</el-button>
      <el-button @click="cancelDelete">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { deleteRule } from '@/api/admin/securityManage'
import { formatProtocol } from '@/filters/index'
export default {
  props: ['multipleSelection', 'ruleType', 'showId'],
  data() {
    return {
      loading: false
    }
  },
  watch: {
    showId(val) {
      this.loading = false
    }
  },
  methods: {
    formatProtocol,
    deleteRule,
    cancelDelete() {
      this.$emit('deleteRes')
    },
    confir() {
      let bind_vm = {}
      if (this.$route.query.isTmp) {
        bind_vm = JSON.stringify({})
      } else {
        let query_info = JSON.parse(this.$route.query.nic_info)
        query_info.forEach(item => {
          for (var i in item) {
            if (!bind_vm[i]) {
              bind_vm[i] = [item[i]]
            } else {
              bind_vm[i].push(item[i])
            }
          }
        })
        query_info.length > 0 ? (bind_vm = JSON.stringify(bind_vm)) : ''
      }
      let id_pri_lst = {}
      this.$props.multipleSelection.forEach(item => {
        id_pri_lst[item.id] = item.priority
      })
      this.loading = true
      this.deleteRule({
        owner_uuid: this.$route.params.uuid,
        bind_vm: bind_vm,
        rule_type: this.$props.ruleType,
        id_pri_lst: JSON.stringify(id_pri_lst)
      }).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.$message({
            message: '删除成功',
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
  }
}
</style>
