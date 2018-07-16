<template>
  <div class="editAminInfo dialogTemplate">
    <el-form label-width="100px">
      <el-form-item label="组名称">
        <el-col :span="12">
          <span>{{rowInfo.name}}</span>
        </el-col>
      </el-form-item>
      <el-form-item label="所有者">
        <el-col :span="12">
          <el-select v-model="rowInfo.ownerid" filterable placeholder="请选择所有者">
            <el-option v-for="item in memberList" :key="item.user_id" :label="item.userid" :value="item.userid">
              <span style="float: left">{{ item.userid }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('editOwner')">取 消</el-button>
    </span>

  </div>
</template>
<script>
import { editowner } from '@/api/admin/adminGroupManage'
export default {
  props: ['rowInfo', 'memberList'],
  data() {
    return {}
  },
  methods: {
    editowner,
    submit() {
      this.editowner({
        group_uuid: this.rowInfo.uuid,
        update_ownerid: this.rowInfo.ownerid
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '修改所有者成功'
          })
          this.$emit('editOwner')
        }
      })
    }
  }
}
</script>
<style lang="less">
.editAminInfo {
  .unit {
    padding-left: 5px;
  }
}
</style>
