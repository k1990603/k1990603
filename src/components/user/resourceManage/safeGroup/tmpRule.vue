<template>
  <div class="safeGroupTemplatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      系统安全组模板
    </div>
    <div class="templateList">
      <el-table :data="tableList" style="width: 100%" stripe>
        <el-table-column prop="uuid" label="UUID" :show-overflow-tooltip='true' min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip='true' min-width="120">
        </el-table-column>
        <el-table-column prop="description" label="备注" :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="getRuleDetails(scope.row)">查看规则</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationBox">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { srcurityTmpList } from '@/api/admin/securityManage'
export default {
  data() {
    return {
      tableList: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    srcurityTmpList,
    getRuleDetails(row) {
      this.$router.push({
        path: `/sf_cloud/workbench/userSafeGroupTmpRule/${row.uuid}`,
        query: { info: JSON.stringify(row) }
      })
    },
    getList() {
      this.srcurityTmpList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage
      }).then(res => {
        if (res.data.code == 0) {
          this.tableList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getList()
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
.safeGroupTemplatePage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
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

  .templateBtn {
    .el-button--mini,
    .el-button--small {
      font-size: 16px;
    }
  }
  .templateList {
    padding: 0 15px;
  }
  .paginationBox {
    margin-top: 15px;
    padding-right: 15px;
    text-align: right;
  }
}
</style>

