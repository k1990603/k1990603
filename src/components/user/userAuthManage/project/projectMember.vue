<template>
  <div class="projectMemberList dialogTemplate">
    <el-table :data="memberList" height="250" width="100%">
      <el-table-column prop="userid" label="工号"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type='text' @click="deleteUser(scope.row)" v-if="projectInfo.ownerid != scope.row.userid">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('memberResponse')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { getProjectMember, deleteMember } from '@/api/admin/lesseeManage'
export default {
  props: ['memberList', 'projectInfo'],
  data() {
    return {}
  },
  mounted() {},
  methods: {
    getProjectMember,
    deleteMember,
    deleteUser(row) {
      let options = {
        user_id: row.userid,
        project_id: this.$props.projectInfo.project_uuid
      }
      this.$confirm(
        `此操作将移除成员${row.userid}(${row.username}), 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.deleteMember(options).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$emit('deleteMember', { info: this.$props.projectInfo })
              this.$message({
                type: 'success',
                message: '删除成功'
              })
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