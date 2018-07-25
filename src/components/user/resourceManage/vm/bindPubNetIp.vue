<template>
  <div class="bindPubIpDialog dialogTemplate">
    <el-dialog title="绑定公网IP" width="650px" :visible.sync="bindPubIpVisible" center>
      <el-table :data="operateVmInfo" border>
        <el-table-column prop="uuid" label="UUID" width="150"></el-table-column>
        <el-table-column prop="vmName" label="主机名" width="200"></el-table-column>
        <el-table-column prop="ipAddr" label="IP地址"></el-table-column>
      </el-table>
      <div class="tipsText">
        请选择需要绑定的IP
      </div>
      <el-table :data="projectList" height="160" border style="width: 100%">
        <el-table-column width="50px">
          <template slot-scope="scope">
            <el-radio v-model="selectedProject" :label="scope.$index" class="configClass"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="projectDeatils" label="IP名称">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindPubIpVisible = false">确 定</el-button>
        <el-button @click="bindPubIpVisible = false">取 消</el-button>
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
      selectedProject: 0,
      projectList: [
        {
          projectName: '10.202.105.50',
          projectDeatils: '10.202.105.50'
        },
        {
          projectName: '10.202.105.50',
          projectDeatils: '10.202.105.50'
        },
        {
          projectName: '10.202.105.50',
          projectDeatils: '10.202.105.50'
        }
      ],
      editCpu: '1核',
      editMem: '4G',
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
    bindPubIpVisible: {
      get() {
        return this.store.state.vmPage.bindPubNetIp
      },
      set(newValue) {
        this.store.state.vmPage.bindPubNetIp = newValue
      }
    }
  },
  methods: {}
}
</script>
<style lang=less>
.bindPubIpDialog {
  .tipsText {
    font-size: 12px;
    line-height: 22px;
    margin: 15px 0px;
    padding: 5px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    position: relative;
  }
  .el-radio__label {
    display: none;
  }
}
</style>

