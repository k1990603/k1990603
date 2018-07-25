<template>
  <div class="createSafeGroupTmp dialogTemplate">
    <div class="SafeGroupInfoInfo">
      <el-form :model="formData" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="名称" prop="template_name">
          <el-input type="text" placeholder="请输入安全组名称" v-model.trim="formData.template_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="template_type">
          <el-select v-model="formData.template_type" placeholder="请选择安全组类型">
            <el-option label="系统模板" value="0"></el-option>
            <el-option label="普通模板" value="1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" :rows="4" v-model.trim="formData.description" auto-complete="off" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addSecurityTmp } from '@/api/admin/securityManage'
import { formatSecurityName } from '@/filters/index'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('模板安全组名称不能为空'))
      } else if (!this.formatSecurityName(value)) {
        callback(
          new Error(
            '名称至少包含1-20位汉字、数字、字母、下划线、中横杠、小数点中一种'
          )
        )
      } else {
        callback()
      }
    }
    return {
      formData: {
        template_name: '',
        description: '',
        template_type: ''
        // userid: '01369659'
      },
      rules: {
        template_type: [
          { required: true, message: '请选择模板类型', trigger: 'change' }
        ],
        template_name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formatSecurityName,
    addSecurityTmp,
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.addSecurityTmp(this.formData).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      this.$refs['ruleForm'].resetFields()
      this.$emit('createRes')
    }
  }
}
</script>
<style lang="less">
// .createSafeGroupTmp {
//   .SafeGroupInfoInfo {
//   }
// }
</style>
