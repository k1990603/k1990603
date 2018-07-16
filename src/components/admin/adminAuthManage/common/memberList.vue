<template>
  <div class="projectMemberList dialogTemplate">
    <el-table :data="memberList" height="250" width="100%">
      <el-table-column prop="userid" label="工号"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type='text' v-if="rowInfo.owner_name!=scope.row.username" @click="submit(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('memberRes')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { deleteGroupMember } from '@/api/admin/adminGroupManage'
export default {
  props: ['memberList', 'rowInfo'],
  data() {
    return {}
  },
  methods: {
    deleteGroupMember,
    submit(row) {
      this.$confirm(
        `此操作将移除成员${row.userid} ${
          row.username != null ? row.username : ''
        }, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.deleteGroupMember({
            group_uuid: this.rowInfo.uuid,
            user_id: row.userid
          }).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.$emit('deletememberRes')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>