<template>
  <div class="editNameDialog dialogTemplate">
    <el-dialog title="修改名称" width="650px" :visible.sync="editNameVisible" center>
      <el-table :data="operateVmInfo">
        <el-table-column prop="uuid" label="UUID" width="150"></el-table-column>
        <el-table-column prop="vmName" label="主机名" width="200"></el-table-column>
        <el-table-column prop="ipAddr" label="IP地址"></el-table-column>
      </el-table>
      <el-form label-width="105px" style="margin-top:15px;">
        <el-form-item label="新云主机名称:">
          <el-col :span="8">
            <el-input placeholder="请新云主机名称"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editNameVisible = false">确 定</el-button>
        <el-button @click="editNameVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from './../../../../state'
export default {
  props: [],
  data() {
    return {
      store,
      operateVmInfo: [
        {
          uuid: 'test_ii',
          vmName: 'KVMSIT103',
          ipAddr: '10.202.105.50'
        }
      ]
    }
  },
  computed: {
    editNameVisible: {
      get() {
        return this.store.state.vmPage.editName
      },
      set(newValue) {
        this.store.state.vmPage.editName = newValue
      }
    }
  },
  methods: {}
}
</script>
<style lang=less>
.someVmOperateDialog {
  .tipText {
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
}
</style>

