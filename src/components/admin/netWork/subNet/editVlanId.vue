<template>
  <div class="editVlanDiag dialogTemplate">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="VLANID" required>
        <el-input type="text" v-model="editInfo.vlan" disabled></el-input>
      </el-form-item>
      <el-form-item label="新的VLANID" prop="newName">
        <el-input type="text" v-model="ruleForm.newName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('vlan')">取 消</el-button>
      <el-button type="primary" @click="editVlanIdSubmit">确 定</el-button>
    </span>
  </div>
</template>
<script>
import { editSubnetVlan } from '@/api/admin/netWork'
export default {
  props: ['editInfo'],
  data() {
    return {
      uuid:'',
      ruleForm: {
        // oldName: '1',
        newName: ''
      },
      rules: {
        newName: [
          { required: true, message: '请填写新的VLANID', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    editSubnetVlan,
    editVlanIdSubmit() {
      console.log('111');
      
      let options = {
        uuid: this.editInfo.uuid,
        vlan: this.ruleForm.newName
      }
      this.editSubnetVlan(options).then(res => {
       if(res.data.code === 0){
         this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$emit('vlan')
       }
      })
    }
  }
}
</script>
<style lang=less>
  .el-form{
    .el-form-item{
      .el-form-item__label{
        text-align: left;
      }
    }
  }
</style>

