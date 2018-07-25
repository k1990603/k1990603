<template>
  <div class="userPage">
    <div class="defaultScope">
      <span class="el-icon-arrow-left" @click="$router.go(-1)">返回</span>
      用户详情
    </div>
    <div class="userList">
      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="userid" label="工号" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="username" label="姓名" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="tenant_name" label="租户名称" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="project_name_list" label="项目名称" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>
              {{scope.row.project_name_list.join(",")}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="电话号码" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click='deleteUserSubmit(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="删除用户" class='dialogTemplate' :visible.sync="adminUserStatu.authUser" width="650px" center>
      <delectUserDetail :rowInfo="rowInfo" @authUserRes="authUserRes"></delectUserDetail>
    </el-dialog>
  </div>
</template>
<script>
import { detailByUserId } from '@/api/admin/lesseeManage'
import { formateStatus, formateRoleType } from '@/filters/index'
import delectUserDetail from './delectUserDetail'

export default {
  data() {
    return {
      auth_type: 0,
      userDel: {}, // 外部用户详情
      authTitle: '', // 激活禁用的弹窗名称
      loading: false,
      adminUserStatu: {
        authUser: false
      },
      rowInfo: [],
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      transferParam: {},
      search: {
        user_id: ''
      }
    }
  },
  created() {
    this.transferParam = {
      user_id: this.$route.params.uuid.split(' ')[0],
      user_name: this.$route.params.uuid.split(' ')[1]
    }
    this.getDefaultList()
  },
  methods: {
    detailByUserId,
    authUserRes() {
      this.adminUserStatu.authUser = false
      this.getDefaultList()
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getDefaultList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getDefaultList()
    },
    getDefaultList() {
      this.loading = true
      this.detailByUserId({
        user_id: this.transferParam.user_id
      }).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.auth_type = res.data.data.auth_type
          this.tableData = []
          let arr = res.data.data
          this.tableData = res.data.data.tenant_list
          this.paginationInfo.total = 0
          for (
            let i = 0, att = res.data.data.tenant_list, obj = {};
            i < att.length;
            i++
          ) {
            this.tableData[i].email = res.data.data.email
            this.tableData[i].telephone = res.data.data.telephone
            this.tableData[i].userid = res.data.data.userid
            this.tableData[i].username = res.data.data.username
          }
          this.rowInfo = this.tableData
        }
      })
    },
    deleteUserSubmit(row) {
      this.rowInfo = row
      this.adminUserStatu.authUser = true
    }
  },
  watch: {},
  components: { delectUserDetail }
}
</script>
<style lang="less">
.userPage {
  position: relative;
  .btnList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    .batchBtn,
    .searchBtn,
    .columSel {
      display: inline-block;
    }
    .searchBtn {
      float: right;
    }
    .columSel {
      float: right;
      span {
        display: inline-block;
        width: 32px;
        height: 30px;
        line-height: 30px;
        font-size: 22px;
        margin-left: 10px;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid #ccc;
        color: #2277da;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  .defaultScope {
    padding-left: 15px;
    height: 50px;
    line-height: 50px;
    background: #fff;
    > span {
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
    .el-cascader {
      width: 400px !important;
    }
  }
  .userList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    .nameLink {
      cursor: pointer;
      color: #0778fd;
      font-weight: 500;
    }
    .waringColor {
      color: #9b153e;
    }
    .errorColor {
      color: #f00;
    }
    .normalColor {
      color: #2277da;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #2277da;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
