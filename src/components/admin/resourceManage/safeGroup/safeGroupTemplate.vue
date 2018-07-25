<template>
  <div class="safeGroupTemplatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      安全组模板管理
    </div>
    <div class="btnBox">
      <el-button type="primary" size="small" @click="createTmpTrigger">创建新模板</el-button>
    </div>
    <div class="templateList">
      <el-table :data="templateList" style="width: 100%" stripe>
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="uuid" label="UUID" :show-overflow-tooltip='true' min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip='true' min-width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.edit">
              <el-row>
                <el-col :span="18">
                  <el-input class="edit-input" size="small" v-model="scope.row.name"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button v-if="scope.row.edit" type="text" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">Ok</el-button>
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <span>{{ scope.row.name }}</span>
              <!-- <el-button type="text" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">Edit</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="100" :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            {{scope.row.type=='0'?'系统模板':'普通模板'}}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="100" :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column prop="description" label="备注" :show-overflow-tooltip='true'>
        </el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editSafeGroupRules(scope.row)">修改规则</el-button>
            <el-button type="text" @click="deleteGroup(scope.row)" v-if="scope.row.type=='1'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationBox">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
      </el-pagination>
    </div>
    <el-dialog title="创建安全组模板" class='dialogTemplate' :visible.sync="tmpStatu.create" width="650px" center>
      <createSafeGroupTmp @createRes='createRes'></createSafeGroupTmp>
    </el-dialog>
    <el-dialog title="删除安全组" class='dialogTemplate' :visible.sync="tmpStatu.delete" width="650px" center>
      <deleteSafeGroup @deleteRes='deleteRes' :rowInfo='rowInfo'></deleteSafeGroup>
    </el-dialog>
  </div>
</template>
<script>
import { srcurityTmpList } from '@/api/admin/securityManage'
import createSafeGroupTmp from './createTemplate'
import deleteSafeGroup from './deleteSafeGroup'
export default {
  data() {
    return {
      rowInfo: {},
      tmpStatu: {
        create: false,
        delete: false
      },
      templateList: [],
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
    deleteGroup(row) {
      row.isTmp = true
      this.rowInfo = row
      this.tmpStatu.delete = true
    },
    deleteRes() {
      this.tmpStatu.delete = false
      this.getList()
    },
    createRes() {
      this.tmpStatu.create = false
      this.getList()
    },
    createTmpTrigger() {
      this.tmpStatu.create = true
    },
    editSafeGroupRules(row) {
      this.$router.push({
        path: `/sf_cloud/workbench/safeGroupRule/${row.uuid}`,
        query: {
          name: row.name,
          project_uuid: '',
          isTmp: true
        }
      })
    },
    getList() {
      this.srcurityTmpList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage
      }).then(res => {
        if (res.data.code == 0) {
          this.templateList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  },
  components: {
    createSafeGroupTmp,
    deleteSafeGroup
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
  .btnBox {
    padding-left: 15px;
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

