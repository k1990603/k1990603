<template>
  <div class="datacenterEditDiag dialogTemplate">
    <el-dialog width="650px" title="机房信息编辑" :visible.sync="dialogShow" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="机房名" prop="name" required>
          <el-input type="text" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属省份" prop="provice" required>
          <el-select v-model="ruleForm.provice" filterable placeholder="请选择所属省份">
            <el-option :label="item.name" :value="item.name" v-for='(item,index) in provinces' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机房地址" prop="address" required>
          <el-input type="text" v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" required>
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="edithostRoomInfo('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from './../../../../state'
import { editDatacenterData, getProvinceCity } from '@/api/admin/areaManage'
export default {
  props: ['datacenterEditVisible', 'roomInfo'],
  data() {
    return {
      provinces: [],
      store,
      dialogShow: this.datacenterEditVisible,
      ruleForm: {
        name: '',
        provice: '',
        address: '',
        remark: ''
      },
      //
      rules: {
        name: [{ required: true, message: '请填写机房名称', trigger: 'blur' }],
        address: [
          { required: true, message: '请填写机房地址', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      }
    }
  },
  watch: {
    datacenterEditVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:datacenterEditVisible', this.dialogShow) // 触发父组件修改
    },
    roomInfo(val, oldVal) {
      this.ruleForm.name = val.name
      this.ruleForm.provice = val.province
      this.ruleForm.address = val.address
      this.ruleForm.remark = val.description
    }
  },
  mounted() {
    this.getProvinceCity().then(res => {
      if (res.data.code == 0) {
        this.provinces = res.data.data.provinces
      }
    })
  },
  methods: {
    getProvinceCity,
    editDatacenterData,
    getSelVal(val) {
      console.log(val)
    },
    edithostRoomInfo(formName) {
      let data = {}
      data.area_uuid = this.roomInfo.area_uuid
      data.uuid = this.roomInfo.uuid
      data.name = this.ruleForm.name
      data.province = this.ruleForm.provice
      data.address = this.ruleForm.address
      data.description = this.ruleForm.remark
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editDatacenterData(data).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
              this.dialogShow = false
              this.$emit('edit')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang=less>
</style>

