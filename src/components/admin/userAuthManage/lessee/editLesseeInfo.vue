<template>
  <div class="editLesseInfo dialogTemplate">
    <el-form label-width="100px">
      <el-form-item label="名称:">
        <el-col :span="12">
          <el-input v-model="lesseeInfo.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="电话:">
        <el-col :span="12">
          <el-input v-model="lesseeInfo.telephone"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-col :span="12">
          <el-input v-model="lesseeInfo.email"></el-input>
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
import { editLesseeInfo } from '@/api/admin/lesseeManage'
export default {
  props: ['lesseeInfo'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    editLesseeInfo,
    onsubmit() {
      let options = {
        name: this.lesseeInfo.name,
        telephone: this.lesseeInfo.telephone,
        email: this.lesseeInfo.email,
        tenant_uuid: this.lesseeInfo.uuid
      }
      this.editLesseeInfo(options).then(res => {
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
          this.$emit('editResponse')
        }
      })
    },
    cancelEdit() {
      this.$emit('editResponse')
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
