<template>
  <div class="userPage">
    <div class="defaultScope">
      <span class="el-icon-arrow-left" @click="$router.go(-1)">返回</span>
      用户详情
    </div>
    <!-- <div class="btnList">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="getDefaultList"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入内容" v-model='search.user_id' @blur="getDefaultList" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div> -->
    <div class="userList">
      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="userid" label="工号" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="userid" label="姓名" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="role_id" label="权限" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <!-- <span class='nameLink' @click='toDetails(scope.row)'>{{ scope.row.user_id }}</span> -->
            <span>{{scope.row.role_id=='1'?'超级管理员':'一般管理员'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role_status" label="状态">
          <template slot-scope="scope">
            <span :class="{waringColor: scope.row.role_status=='1', errorColor:scope.row.role_status==null,
            normalColor:scope.row.role_status=='0'}">
              {{formateStatus(scope.row.role_status)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="group_name" label="所属组" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>
              {{scope.row.group_name.join(",")}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="telephone" label="电话号码" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱" :show-overflow-tooltip="true">
        </el-table-column>

        <!-- <el-table-column prop="created_at" label="入组时间" :show-overflow-tooltip="true">
        </el-table-column> -->
        <!-- <el-table-column prop="group_name" label="所属组" :show-overflow-tooltip="true">
        </el-table-column> -->
        <!-- <el-table-column prop="role_status" label="状态">
          <template slot-scope="scope">
            <span :class="{waringColor: scope.row.role_status=='1', errorColor:scope.row.role_status==null,
            normalColor:scope.row.role_status=='0'}">
              {{formateStatus(scope.row.role_status)}}
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click='deleteUserSubmit(scope.row)'>删除</el-button> -->
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="scope.row.role_status==null ||scope.row.role_status=='0'" :command="{type:'activeUser',info:scope.row}">激活</el-dropdown-item>
                <el-dropdown-item :disabled="scope.row.role_status==null ||scope.row.role_status=='1'" :command="{type:'disableUser',info:scope.row}">禁用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="authTitle" class='dialogTemplate' :visible.sync="adminUserStatu.authUser" width="650px" center>
      <authUser :rowInfo="rowInfo" :authTitle="authTitle" @authUserRes="authUserRes"></authUser>
    </el-dialog>
  </div>
</template>
<script>
import { detailUser } from '@/api/admin/adminGroupManage'
import { formateStatus, formateRoleType } from '@/filters/index'
import authUser from '../common/authUser'

export default {
  data() {
    return {
      auth_type: 0,
      userDel: {}, // 外部用户详情
      authTitle: '', // 激活禁用的弹窗名称
      loading: false,
      adminUserStatu: {
        add: false,
        delete: false,
        authUser: false,
        allotUser: false,
        edit: false
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
    detailUser,
    formateStatus,
    formateRoleType,
    someOperate(command) {
      console.log(command.info)
      switch (command.type) {
        case 'activeUser':
          this.authTitle = '激活用户'
          this.rowInfo = command.info
          this.rowInfo.user_id = this.transferParam.user_id
          this.rowInfo.user_name = this.transferParam.user_name
          this.adminUserStatu.authUser = true
          break
        case 'disableUser':
          this.authTitle = '禁用用户'
          this.rowInfo = command.info
          this.rowInfo.user_id = this.transferParam.user_id
          this.rowInfo.user_name = this.transferParam.user_name
          this.adminUserStatu.authUser = true
          break
      }
    },
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
      this.detailUser({
        user_id: this.transferParam.user_id
      }).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.auth_type = res.data.data.auth_type
          this.tableData = []
          let arr = res.data.data
          this.tableData = res.data.data.data_list
          console.log(this.tableData)
          this.paginationInfo.total = 0
          for (
            let i = 0, att = res.data.data.data_list, obj = {};
            i < att.length;
            i++
          ) {
            this.tableData[i].email = res.data.data.email
            this.tableData[i].telephone = res.data.data.telephone
            this.tableData[i].userid = res.data.data.userid
            this.tableData[i].username = res.data.data.username
          }
        } else {
          // this.tableData = res.data.data.rows
          // this.paginationInfo.total = res.data.data.total
        }
      })
    },
    deleteUserSubmit(row) {
      this.rowInfo = row
      this.adminUserStatu.delete = true
    }
  },
  watch: {},
  components: { authUser }
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
    // .curPage {
    //   display: inline-block;
    //   vertical-align: middle;
    //   font-size: 16px;
    //   line-height: 50px;
    //   // font-weight: 400;
    //   font-weight: 700;
    //   margin-right: 20px;
    //   max-width: 70%;
    //   overflow: hidden;
    //   white-space: nowrap;
    //   text-overflow: ellipsis;
    // }
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
