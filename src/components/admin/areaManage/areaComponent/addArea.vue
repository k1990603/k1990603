<template>
  <div class="areaAdd dialogTemplate">
    <el-dialog width="650px" title="增加子区域" :visible.sync="dialogShow" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="区域" prop="parentArea">
          <el-input type="text" v-model="rowInfo.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="子区域" prop="childArea" required>
          <el-input type="text" v-model="ruleForm.childArea"></el-input>
        </el-form-item>
        <el-form-item label="管理员" prop="admin" required>
          <el-input type="text" v-model="ruleForm.admin"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="creatArea()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { creatAreaInf } from '@/api/admin/areaManage'
export default {
  props: ['areaAddVisible', 'rowInfo'],
  mounted() {},
  data() {
    return {
      dialogShow: this.areaAddVisible,
      ruleForm: {
        parentArea: '',
        childArea: '',
        admin: ''
      },
      rules: {
        childArea: [
          { required: true, message: '请填写子区域', trigger: 'blur' }
        ],
        admin: [{ required: true, message: '请填写管理员', trigger: 'blur' }]
      }
    }
  },
  watch: {
    areaAddVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:areaAddVisible', this.dialogShow) // 触发父组件修改
    }
  },
  methods: {
    creatAreaInf,
    creatArea() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            parent_uuid: this.rowInfo.uuid,
            area_name: this.ruleForm.childArea,
            manager: this.ruleForm.admin
          }
          this.creatAreaInf(params).then(res => {
            let data = res.data
            if (data.code === 0) {
              this.$emit('infRefresh')
              this.dialogShow = false
              this.selectList = []
              this.$refs.ruleForm.resetFields()
            } else {
              this.$message.error(data.msg)
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

