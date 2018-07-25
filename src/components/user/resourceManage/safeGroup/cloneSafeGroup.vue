<template>
  <div class="cloneSafeGroup dialogTemplate">
    <div class="oldSafeGroupInfo">
      <h3>选择克隆的安全组信息</h3>
    </div>
    <el-form label-width="120px">
      <el-form-item label='名称' prop="name">
        <el-col :span="10">
          <el-input type="text" :disabled="true" v-model="rowInfo.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='备注' prop="name">
        <el-col :span="10">
          <el-input type="text" :disabled="true" v-model="rowInfo.description"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label='所属租户' prop="name">
        <el-col :span="10">
          <el-input type="text" :disabled="true" v-model="rowInfo.tenant_name"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <el-form :model="newSecurityForm" ref="newSecurityForm" :rules="newSecurityRule" label-width="120px">
      <el-form-item label='新安全组名称' prop="name">
        <el-col :span="10">
          <el-input type="text" v-model.trim="newSecurityForm.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="所属项目" prop="project">
        <el-select v-model="newSecurityForm.project" placeholder="请选择项目">
          <el-option v-for="item in projectList" :key="item.project_uuid" :label="item.project_name" :value="item.project_uuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-col :span="18">
          <el-input type="textarea" :rows="4" placeholder="暴露全部端口到公网和内网，有一定安全风险" v-model.trim="newSecurityForm.description"></el-input>
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
import { cloneSecurity } from '@/api/admin/securityManage'
import { formatSecurityName } from '@/filters/index'
export default {
  props: ['rowInfo', 'projectList'],
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
      newSecurityForm: {
        name: '',
        project: '',
        description: ''
      },
      newSecurityRule: {
        name: [{ required: true, validator: checkName, trigger: 'blur' }],
        project: [
          { required: true, message: '请选择安全组所属项目', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    formatSecurityName,
    cloneSecurity,
    submit() {
      this.$refs.newSecurityForm.validate(valid => {
        if (valid) {
          this.cloneSecurity({
            new_name: this.newSecurityForm.name,
            security_uuid: this.rowInfo.uuid,
            project_uuid: this.newSecurityForm.project,
            description: this.newSecurityForm.description
          }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '克隆成功'
              })
              this.cancel()
            }
          })
        }
      })
    },
    cancel() {
      this.$refs.newSecurityForm.resetFields()
      this.$emit('cloneRes')
    }
  }
}
</script>
<style lang="less">
.cloneSafeGroup {
  .oldSafeGroupInfo {
    & > h3 {
      margin-bottom: 15px;
    }
  }
}
</style>
