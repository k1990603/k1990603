<template>
  <div class="deleteLB">
    <div class="image-box">
      <el-table :data="deleteList" style="width: 100%" stripe>
        <el-table-column prop="name" label="名称" min-width="100">
        </el-table-column>
        <el-table-column prop="_state" label="状态" min-width="100">
        </el-table-column>
        <el-table-column prop="project_name" label="所属项目" min-width="100">
        </el-table-column>
        <el-table-column prop="tenant_name" label="所属租户" min-width="100">
        </el-table-column>
      </el-table>
      <div class="tipText">
        确定执行
        <span>删除</span>
        操作？
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['rowInfo'],
  components: {},
  mounted() {},
  data() {
    return {
      deleteList: this.rowInfo
    }
  },
  computed: {},
  methods: {},
  watch: {
    rowInfo(val, oldVal) {
      this.deleteList = val
    }
  }
}
</script>
<style lang="less">
.deleteLB {
  .tipText {
    padding: 15px 10px;
    vertical-align: middle;
    color: #264663;
    // border: 1px solid #7ab1de;
    border-radius: 2px;
    // background: #d2e7f7;
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
}
</style>
