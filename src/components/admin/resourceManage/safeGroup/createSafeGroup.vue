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
      <el-form-item label="类型" prop="use_type">
        <el-select v-model="ruleForm.use_type" placeholder="请选择安全组类型">
          <el-option label="公用" value="0"></el-option>
          <el-option label="项目专用" value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="ruleForm.use_type=='1'">
        <el-form-item label="所属租户" prop="lessee">
          <el-select v-model="ruleForm.lessee" placeholder="请选择租户" @change="changeTenant">
            <el-option v-for="(item,index) in tenantList" :key="item.tenant_uuid" :label="item.tenant_name" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="project" required>
          <el-select v-model="ruleForm.project" placeholder="请选择项目">
            <el-option v-for="item in projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
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
  props: ['tenantList', 'templateList'],
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
      projectList: '',
      ruleForm: {
        use_type: '1',
        groupTemplate: '',
        name: '',
        lessee: '',
        description: '',
        project: ''
      },
      rules: {
        use_type: [
          { required: true, message: '请选择安全组类型', trigger: 'blur' }
        ],
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
    changeTenant() {
      this.ruleForm.project = ''
      this.projectList = this.tenantList[this.ruleForm.lessee].project_info
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let options = {
            name: this.ruleForm.name,
            user_role: '0',
            use_type: this.ruleForm.use_type,
            description: this.ruleForm.description,
            templateuuid: this.ruleForm.groupTemplate
          }
          this.ruleForm.use_type == '1' &&
            (options.projectuuid = this.ruleForm.project)
          this.createSecurity(options).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
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

