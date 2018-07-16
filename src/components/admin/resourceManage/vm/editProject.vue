<template>
  <div class="assignProjectDialog dialogTemplate" v-loading='loading' element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
    <el-table :data="[rowInfo]">
      <el-table-column prop="instance_uuid" label="UUID" :show-overflow-tooltip='true' min-width="150"></el-table-column>
      <el-table-column prop="displayname" label="主机名" :show-overflow-tooltip='true' width="200"></el-table-column>
      <el-table-column prop="project_name" label="所属项目" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop="tenant_name" label="所属租户" :show-overflow-tooltip='true'></el-table-column>
    </el-table>
    <div class="tipsText">
      云主机迁移后需重新绑定安全组
    </div>
    <el-table :data="projectList" height="160" border style="width: 100%">
      <el-table-column width="50px">
        <template slot-scope="scope">
          <el-radio v-model="selectedProject" :label="scope.$index" class="configClass"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="project_name" label="项目名称">
      </el-table-column>
      <el-table-column prop="projectDeatils" label="项目说明">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { distributionTarget } from '@/api/admin/vm'
export default {
  props: ['rowInfo', 'instanceUuid', 'projectList'],
  data() {
    return {
      loading: false,
      selectedProject: 0
    }
  },
  mounted() {},
  watch: {
    instanceUuid(val) {
      if (val != '') {
        this.loading = false
        this.selectedProject = 0
      }
    }
  },
  methods: {
    distributionTarget,
    submit() {
      this.loading = true
      let params = {
        instance_uuid: this.rowInfo.instance_uuid,
        project_uuid: this.projectList[this.selectedProject].project_uuid
      }
      this.distributionTarget(params).then(res => {
        this.loading = false
        let data = res.data
        if (data.code == '0') {
          this.$message({
            message: '恭喜你，分配至项目成功！',
            type: 'success'
          })
          this.cancel()
        }
      })
    },
    cancel() {
      this.selectedProject = 0
      this.$emit('editProRes')
    }
  }
}
</script>
<style lang=less>
.assignProjectDialog {
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

