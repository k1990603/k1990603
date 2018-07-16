
<template>
  <div class="areaCreate dialogTemplate">
    <el-dialog width="650px" title="区域创建" :visible.sync="dialogShow" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="区域" prop="parentArea">
          <el-cascader :clearable="true" placeholder="请选择父区域(可不选)" @change="getSelVal" v-model="selectList" :options="areaChildList" filterable popper-class="showButtn" change-on-select></el-cascader>
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
  props: ['areCreateVisible', 'areaChildList'],
  data() {
    return {
      dialogShow: this.areCreateVisible,
      selectList: [], // 选择联动框值
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
  mounted() {},
  watch: {
    areCreateVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:areCreateVisible', this.dialogShow) // 触发父组件修改
    }
  },
  computed: {},
  methods: {
    creatAreaInf,
    getSelVal(val) {
      let lastValue = val[val.length - 1]
      this.areaChildList.forEach((item, index) => {
        if (lastValue === item.label && item.children.length === 0) {
          conosole.log(item)
        }
      })
    },
    creatArea() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let parent_uuid =
            this.selectList.length > 0
              ? this.selectList[this.selectList.length - 1]
              : '-1'
          let params = {
            parent_uuid: parent_uuid,
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
