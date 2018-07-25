<template>
  <div class="hostpoolDeleteDiag dialogTemplate">
    <el-dialog title="删除集群" width="650px" :visible.sync="hostpoolDeleteVisible" center>
      <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hostpoolDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="hostpoolDeleteVisible = false">确 定</el-button>
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
      gridData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  computed: {
    hostpoolDeleteVisible: {
      get() {
        return this.store.state.hostpoolDialog.delete
      },
      set(newValue) {
        this.store.state.hostpoolDialog.delete = newValue
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

</style>

