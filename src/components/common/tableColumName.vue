<template>
  <div class="tableColumNameDiag dialogTemplate">
    <el-dialog width="500px" title="自定义列名字段" :before-close="handleClose" :visible.sync="showTableCloum" center>
      <el-checkbox-group v-model="checkedArr">
        <el-row :gutter="20">
          <el-col :span="12" v-for="(item,index) in columArr" :key="index" style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">
            <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateTableCloum(false)">取 消</el-button>
        <el-button type="primary" @click="getChangeArr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['columArr', 'checkArr'],
  data() {
    return {
      checkedArr: []
    }
  },
  mounted() {
    this.checkedArr = this.checkArr
  },
  computed: {
    ...mapGetters({
      showTableCloum: 'getTableCloum'
    })
  },
  methods: {
    ...mapActions({
      updateTableCloum: 'updateTableCloum'
    }),
    handleClose() {
      this.updateTableCloum(false)
    },
    getChangeArr(val) {
      this.updateTableCloum(false)
      this.$emit('sendColum', this.checkedArr)
    }
  }
}
</script>
<style lang=less>
.tableColumNameDiag {
}
</style>

