<template>
  <div class="datacenterCreate dialogTemplate">
    <el-dialog width="650px" title="机房创建" :visible.sync="dialogShow" center @close="closeHandle()">
      <el-form :model="ruleForm" :rules="rules" v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" ref="ruleForm" label-width="100px">
        <el-form-item label="区域" prop="selectList" required>
          <el-cascader placeholder="请选择区域" @change="getSelVal" :options="areaChildList" v-model="ruleForm.selectList" filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="机房名称" prop="name" required>
          <el-input type="text" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属省份" prop="provice" required>
          <el-select v-model="ruleForm.provice" filterable placeholder="请选择所属省份">
            <el-option :label="item.name" :value="item.name" v-for='(item,index) in provinces' :key='index'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机房地址" prop="adress" required>
          <el-input type="text" v-model="ruleForm.adress"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark" required>
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="creatArea()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { creatComputerRoom, getProvinceCity } from '@/api/admin/areaManage'
export default {
  props: ['datacenterCreateVisible', 'areaChildList'],
  data() {
    return {
      loading: false,
      provinces: [],
      dialogShow: this.datacenterCreateVisible,
      ruleForm: {
        selectList: [], // 选择区域
        name: '',
        provice: '',
        adress: '',
        remark: ''
      },
      rules: {
        selectList: [
          { required: true, message: '您未选择区域信息', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '您未填写机房名称', trigger: 'blur' }
        ],
        provice: [
          { required: true, message: '您未选择所属省份', trigger: 'blur' }
        ],
        adress: [
          { required: true, message: '您未填写机房地址', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '您未填写备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getProvinceCity().then(res => {
      if (res.data.code == 0) {
        this.provinces = res.data.data.provinces
      }
    })
  },
  watch: {
    datacenterCreateVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:datacenterCreateVisible', this.dialogShow) // 触发父组件修改
    }
  },
  methods: {
    getProvinceCity,
    creatComputerRoom,
    getSelVal(val) {
      console.log(val)
    },
    // 关闭处理
    closeHandle() {
      this.loading = false
      this.$refs.ruleForm.resetFields()
    },
    cancel() {
      this.dialogShow = false
      this.$refs.ruleForm.resetFields()
      this.$emit('infRefresh')
    },
    // 创建
    creatArea() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          let parent_uuid =
            this.ruleForm.selectList.length > 0
              ? this.ruleForm.selectList[this.ruleForm.selectList.length - 1]
              : '-1'
          let params = {
            area_uuid: parent_uuid,
            name: this.ruleForm.name,
            province: this.ruleForm.provice,
            address: this.ruleForm.adress,
            description: this.ruleForm.remark
          }
          this.creatComputerRoom(params).then(res => {
            if (res.data.code == 0) {
              this.loading = false
              this.ruleForm.selectList = []
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

