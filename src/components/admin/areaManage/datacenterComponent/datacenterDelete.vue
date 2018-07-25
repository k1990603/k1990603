<template>
  <div class="datacenterDeleteDiag dialogTemplate">
    <el-dialog title="删除机房" width="650px" :visible.sync="dialogShow" center>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from './../../../../state'
export default {
  props: ['datacenterDeleteVisible'],
  data() {
    return {
      store,
      dialogShow: this.datacenterDeleteVisible,
      gridData: []
    }
  },
  watch: {
    datacenterDeleteVisible (val, oldVal) {
      this.dialogShow = val
    },
    dialogShow () {
      this.$emit('update:datacenterDeleteVisible', this.dialogShow)  // 触发父组件修改
    }
  },
  methods: {
    getSelVal(val) {
      console.log(val)
    },
    deleteSubarea(row,index) {
      let options = {
        "uuid": row.uuid,
      }
      this.$confirm(
        `此操作将移除${row.name}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).then(() => {
          this.deleteSubareaData(options).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$emit('refreshAreaData')
              this.childList.splice(index,1)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang=less>

</style>

