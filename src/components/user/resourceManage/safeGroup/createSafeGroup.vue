<template>
  <div class="createSafeGroup dialogTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="模板" prop="groupTemplate">
        <el-select clearable v-model="ruleForm.groupTemplate" placeholder="请选择模板(非必选项)">
          <el-option v-for="item in templateList" :key="item.uuid" :label="item.name" :value="item.uuid">
          </el-option>
        </el-select>
        <el-tooltip class="item" effect="light" content="注意：不选择模板,默认是拒绝所有端口的访问" placement="right-end">
          <i class="el-icon-question" style="color:#909399;;font-size:18px;"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="名称" prop="name" required>
        <el-col :span="10">
          <el-input type="text" v-model.trim="ruleForm.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所属项目" prop="project" required>
        <el-select v-model="ruleForm.project" placeholder="请选择项目">
          <el-option v-for="item in projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-col :span="18">
          <el-input type="textarea" :rows="4" placeholder="暴露全部端口到公网和内网，有一定安全风险" v-model.trim="ruleForm.description"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { createSecurity } from '@/api/admin/securityManage'
import { formatSecurityName } from '@/filters/index'
export default {
  props: ['projectList', 'templateList'],
  data() {
    var checkName = (rule, value, callback) => {
      if (value == '') {
        return callback(new Error('安全组名称不能为空'))
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
      ruleForm: {
        groupTemplate: '',
        name: '',
        description: '',
        project: ''
      },
      rules: {
        name: [{ required: true, validator: checkName, trigger: 'blur' }],
        project: [
          { required: true, message: '请选择安全组所属项目', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    formatSecurityName,
    createSecurity,
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.createSecurity({
            name: this.ruleForm.name,
            projectuuid: this.ruleForm.project,
            description: this.ruleForm.description
              ? this.ruleForm.description
              : '',
            templateuuid: this.ruleForm.groupTemplate,
            user_role: '1',
            use_type: '1'
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.$refs.ruleForm.resetFields()
              this.$emit('createRes')
            }
          })
        }
      })
    },
    cancel() {
      this.$refs.ruleForm.resetFields()
      this.$emit('createRes')
    }
  }
}
</script>
<style lang=less>
</style>

