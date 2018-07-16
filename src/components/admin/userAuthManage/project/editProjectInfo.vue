<template>
  <div class="editLesseInfo dialogTemplate">
    <el-form label-width="100px">
      <el-form-item label="名称:">
        <el-col :span="12">
          <el-input v-model="projectInfo.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所有者:">
        <el-col :span="12">
          <el-input v-model="projectInfo.ownerid"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onsubmit">确 定</el-button>
      <el-button @click="cancelEdit">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { editProjectInfo } from '@/api/admin/lesseeManage'
export default {
  props: ['projectInfo'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    editProjectInfo,
    onsubmit() {
      if (this.projectInfo.name === '') {
        this.$message({
          type: 'error',
          message: '项目名称不能为空'
        })
        return
      }
      if (this.projectInfo.ownerid === '') {
        this.$message({
          type: 'error',
          message: '项目所有者不能为空'
        })
        return
      }
      let options = {
        project_name: this.projectInfo.name,
        project_owner_id: this.projectInfo.ownerid,
        project_uuid: this.projectInfo.uuid,
        tenant_uuid: this.projectInfo.tenant_uuid
      }
      this.editProjectInfo(options).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$emit('editInfoResponse')
        }
      })
    },
    cancelEdit() {
      this.$emit('editInfoResponse')
    }
  },
  watch: {}
}
</script>
<style lang="less">
.editLesseInfo {
  .tipText {
    margin-bottom: 15px;
    padding: 15px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
  .unit {
    padding-left: 5px;
  }
}
</style>
