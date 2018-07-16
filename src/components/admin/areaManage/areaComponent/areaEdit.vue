<template>
  <div class="areaEditDiag dialogTemplate">
    <el-dialog width="650px" title="区域信息编辑" :visible.sync="dialogShow" center>
      <el-form :model="rowInfo" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="区域名称" prop="name">
          <el-input type="text" v-model="rowInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="管理员" prop="owner">
          <el-input type="text" v-model="rowInfo.owner"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="editAreaMessage('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { editAreaData } from '@/api/admin/areaManage'
export default {
  props: ['areaEditVisible', 'rowInfo'],
  data() {
    return {
      dialogShow: this.areaEditVisible,
      rules: {
        name: [{ required: true, message: '请填写区域名称', trigger: 'blur' }],
        owner: [{ required: true, message: '请填写管理员', trigger: 'blur' }]
      }
    }
  },
  watch: {
    areaEditVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:areaEditVisible', this.dialogShow) // 触发父组件修改
    }
  },
  methods: {
    editAreaData,
    getSelVal(val) {
      console.log(val)
    },
    cancel() {
      this.dialogShow = false
      this.$refs['ruleForm'].resetFields()
      this.$emit('edit')
    },
    editAreaMessage(formName) {
      let data = {}
      data.name = this.rowInfo.name
      data.owner = this.rowInfo.owner
      data.uuid = this.rowInfo.uuid
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editAreaData(data).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.cancel()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang=less>
</style>

