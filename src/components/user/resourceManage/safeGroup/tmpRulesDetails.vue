<template>
  <div class="safeGroupTemplatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      {{securityName}} 规则详情
    </div>
    <div class="ruleTabs">
      <el-tabs tab-position="top" v-model="rulePos" style="height: 200px;" @tab-click='tabClick'>
        <el-tab-pane label="入站规则" name="first">
        </el-tab-pane>
        <el-tab-pane label="出站规则" name="second"></el-tab-pane>
      </el-tabs>
      <div class="ruleList">
        <el-table :data="list" style="width: 100%" stripe>
          <el-table-column prop="protocol" label="协议" min-width="120">
            <template slot-scope='scope'>
              {{formatProtocol(scope.row.protocol)}}
            </template>
          </el-table-column>
          <el-table-column prop="cidr" label="CIDR" min-width="120">
          </el-table-column>
          <el-table-column prop="start_port" label="开始端口" min-width='100'>
            <template slot-scope='scope'>
              {{scope.row.start_port=='-1'?'':scope.row.start_port}}
            </template>
          </el-table-column>
          <el-table-column prop="end_port" label="结束端口" min-width='100'>
            <template slot-scope='scope'>
              {{scope.row.start_port=='-1'?'':scope.row.end_port}}
            </template>
          </el-table-column>
          <el-table-column prop="description" label="备注" :show-overflow-tooltip="true" min-width="120">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { formatProtocol } from '@/filters/index'
import { getAllRules } from '@/api/admin/securityManage'
export default {
  data() {
    return {
      tmpInfo: {},
      securityName: '',
      rulePos: 'first',
      ruleType: 0,
      list: []
    }
  },
  created() {
    this.tmpInfo = JSON.parse(this.$route.query.info)
    this.securityName = this.tmpInfo.name
    this.getList()
  },
  methods: {
    formatProtocol,
    getAllRules,
    tabClick(tab, event) {
      switch (tab.name) {
        case 'first':
          this.ruleType = 0
          break
        case 'second':
          this.ruleType = 1
          break
      }
      this.getList()
    },
    goBack() {
      this.$router.go(-1)
    },
    getList(search) {
      this.getAllRules({
        owner_uuid: this.$route.params.uuid,
        rule_type: this.ruleType,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.list = res.data.data.rows
        }
      })
    }
  }
}
</script>
<style lang="less">
.safeGroupTemplatePage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
  .sortable-ghost {
    opacity: 0.8;
    color: #fff !important;
    background: #42b983 !important;
  }
  & > .title {
    padding-left: 15px;
    height: 90px;
    line-height: 90px;
    background: #fff;
    span {
      cursor: pointer;
      display: inline-block;
      padding-right: 30px;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 10px;
      margin-right: 30px;
      background: #dcdfe6;
      border-radius: 4px;
      color: #128dff;
    }
  }
  .ruleTabs {
    padding: 0 20px;
    .el-tabs {
      height: inherit !important;
    }
    .templateBtn {
      .el-button--mini,
      .el-button--small {
        font-size: 16px;
      }
    }
    .ruleList {
      padding: 0 15px;
      .el-upload-list.el-upload-list--text {
        display: none;
      }
      .el-table {
        .el-button {
          padding: 0;
          font-size: 14px;
        }
        .el-dropdown-link {
          color: #409eff;
          cursor: pointer;
        }
        .drag-handler {
          font-size: 18px;
          color: #128dff;
          cursor: pointer;
        }
        .typeSelect {
          height: 27px;
          line-height: 15px;
          padding: 5px 24px 4px 6px;
          font-size: 12px;
        }
        .typeSelect1 {
          min-width: 120px;
        }
        .typeSelect2 {
          width: 60px;
          padding: 0;
        }
        .tableInput {
          width: 80%;
          height: 29px;
          font-size: 12px;
          padding-left: 5px;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          box-sizing: border-box;
        }
        .remarkInput {
          width: 80%;
        }
      }
    }
    .paginationBox {
      margin-top: 15px;
      padding-right: 15px;
      text-align: right;
    }
    .saveSortBtn {
      border-top: 1px solid #ccc;
      padding: 15px 10px;
    }
  }
}
</style>

