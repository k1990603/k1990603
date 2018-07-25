<template>
  <div class="privateEditDiag dialogTemplate">
    <el-dialog width="500px" title="编辑子网名称" :visible.sync="editNameVisible" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="子网名称" prop="name" required>
          <el-input type="text" v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="editNameVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from './../../../../state'
export default {
  data() {
    return {
      store,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写专有网络名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    editNameVisible: {
      get() {
        return this.store.state.subNet.editName
      },
      set(newValue) {
        this.store.state.subNet.editName = newValue
      }
    }
  },
  methods: {
    getSelVal(val) {
      console.log(val)
    }
  }
}
</script>
<style lang=less>
.privateEditDiag {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>

