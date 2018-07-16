<template>
  <div class="userPage">
    <div class="defaultScope">
      <div class="curPage">用户管理</div>
      <selectComponent @getSelect="getSelect" :tenantList="tenantList"></selectComponent>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="addUser">添加用户</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :md="12">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="inputSearch"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入内容" @change="inputSearch" v-model="searchBox.user_id" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="userList">
      <el-table :data="userList" style="width: 100%" stripe v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading">
        <el-table-column prop="user_id" label="账户名称">
          <template slot-scope="scope">
            <span class='nameLink' @click='toDetails(scope.row)'>{{ scope.row.user_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" :show-overflow-tooltip="true" label="账户显示名称">
        </el-table-column>
        <el-table-column prop="created_at" :show-overflow-tooltip="true" label="创建时间" min-width="150">
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="{waringColor: scope.row.status=='1', errorColor:scope.row.status==null,
            normalColor:scope.row.status=='0'}">
              {{formateStatus(scope.row.status)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click='deleteUser(scope)'>删除</el-button> -->
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type: 'activeUser', info: scope.row}" :disabled="scope.row.status==null ||scope.row.status=='0'">激活</el-dropdown-item>
                <el-dropdown-item :command="{type: 'disableUser', info: scope.row}" :disabled="scope.row.status==null ||scope.row.status=='1'">禁用</el-dropdown-item>
                <el-dropdown-item :command="{type: 'editInfo', info: scope.row}" :disabled="scope.row.status==null || scope.row.auth_type=='0'">修改信息</el-dropdown-item>
                <el-dropdown-item :command="{type: 'editPwd', info: scope.row}" :disabled="scope.row.status==null || scope.row.auth_type=='0'">修改密码</el-dropdown-item>
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
    <el-dialog title="添加用户" :visible.sync="userDialogStatu.add" width="650px" center>
      <addUser @addNewUser="addNewUser" :tenantList="tenantList"></addUser>
    </el-dialog>
    <el-dialog class="dialogTemplate" title="修改密码" :visible.sync="userDialogStatu.editPwd" width="650px" center>
      <editPwd @editPwdRes="editPwdRes" :rowInfo="rowInfo"></editPwd>
    </el-dialog>
    <el-dialog class="dialogTemplate" title="删除用户" :visible.sync="userDialogStatu.delete" width="650px" center>
      <deleteDialog :rowInfo="rowInfo" @deleteResponse="deleteResponse"></deleteDialog>
    </el-dialog>
    <el-dialog class="dialogTemplate" :title="isActive ? '激活用户':'禁用用户'" :visible.sync="userDialogStatu.active" width="650px" center>
      <authUser :rowInfo="rowInfo" :isActive="isActive" @activeResponse="activeResponse"></authUser>
    </el-dialog>

    <el-dialog class="dialogTemplate" title="修改信息" :visible.sync="userDialogStatu.editProInfo" width="650px" center>
      <editUserInfo @editProInfoRes="editProInfoRes" :userDel="userDel"></editUserInfo>
    </el-dialog>

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import selectComponent from './user/selectComponent'
import addUser from './user/addUser'
import authUser from './user/authUser'
import deleteDialog from './user/deleteUser'
import editUserInfo from './user/editUserInfo'
import editPwd from './user/editPwd'

import {
  getAllUser,
  getLesseeNameList,
  userDeatilsList
} from '@/api/admin/lesseeManage'
import { formateStatus } from '@/filters/index'
export default {
  data() {
    return {
      userDel: {}, // 指定用户的详情
      isActive: true, // 是激活还是禁用用户
      loading: false,
      tenantList: [],
      userDialogStatu: {
        add: false, // 添加用户
        editPwd: false, // 修改密码
        delete: false, // 删除用户
        active: false, // 激活用户
        editProInfo: false // 修改信息
      },
      rowInfo: {}, // 单行的用户信息
      searchBox: {
        tenant_uuid: '-1',
        // user_name: '',
        user_id: ''
      },
      userList: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      // 以下为测试数据
      editPwdDialog: false,
      authUserInfo: {},
      activeUserInfo: {
        title: '激活用户',
        info: []
      },
      deleteInfo: {
        title: '删除用户',
        info: [
          { label: '工号', value: '80002473' },
          { label: '姓名', value: '付太平' },
          { label: '所属租户', value: '租户一' }
        ]
      },
      forbiddenUserInfo: {
        title: '禁用用户',
        info: [
          { label: '工号', value: '80002473' },
          { label: '姓名', value: '付太平' },
          { label: '所属租户', value: '租户一' }
        ]
      },
      dialogVisible: false,
      lesseeList: {
        title: '全部租户',
        child: [{ key: '租户一' }, { key: '租户二' }, { key: '租户三' }]
      },
      title: '' // someOperate的弹框名
    }
  },
  created() {
    this.getUserList()
    this.getTenantList()
  },
  methods: {
    formateStatus,
    getAllUser,
    getLesseeNameList,
    userDeatilsList,
    someOperate(command) {
      switch (command.type) {
        case 'activeUser':
          this.rowInfo = command.info
          this.isActive = true
          this.userDialogStatu.active = true
          break
        case 'disableUser':
          this.rowInfo = command.info
          this.isActive = false
          this.userDialogStatu.active = true
          break
        case 'editInfo':
          this.userDeatilsList({ user_id: command.info.user_id }).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.userDel = res.data.data
              this.rowInfo = command.info
              this.userDialogStatu.editProInfo = true
            }
          })
          break
        case 'editPwd':
          this.rowInfo = command.info
          this.userDialogStatu.editPwd = true
          break
      }
    },
    editPwdRes() {
      this.userDialogStatu.editPwd = false
      this.inputSearch()
    },
    editProInfoRes() {
      this.userDialogStatu.editProInfo = false
      this.inputSearch()
    },
    activeResponse() {
      this.userDialogStatu.active = false
      this.inputSearch()
    },
    deleteResponse() {
      this.userDialogStatu.delete = false
      this.inputSearch()
    },
    addNewUser() {
      this.userDialogStatu.add = false
      this.inputSearch()
    },
    getTenantList() {
      this.getLesseeNameList().then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.tenantList = res.data.data
        }
      })
    },
    // 带租户条件搜索
    getSelect(item) {
      this.searchBox.tenant_uuid = item.tenant_uuid
      if (item.tenant_uuid === '-1') {
        this.getUserList()
      } else {
        this.getUserList({ tenant_uuid: this.searchBox.tenant_uuid })
      }
      this.searchBox.user_id = ''
    },
    // 带租户和用户名的搜索
    inputSearch() {
      if (
        this.searchBox.user_id === '' &&
        this.searchBox.tenant_uuid === '-1'
      ) {
        this.getUserList()
      } else if (
        this.searchBox.tenant_uuid != '-1' &&
        this.searchBox.user_id == ''
      ) {
        this.getUserList({
          tenant_uuid: this.searchBox.tenant_uuid
        })
      } else if (
        this.searchBox.tenant_uuid == '-1' &&
        this.searchBox.user_id != ''
      ) {
        this.getUserList({ user_id: this.searchBox.user_id })
      } else {
        this.getUserList(this.searchBox)
      }
    },
    // 获取用户列表
    getUserList(search) {
      this.loading = true
      this.getAllUser({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
      }).then(res => {
        this.loading = false
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.userList = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.inputSearch()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.inputSearch()
    },
    editPwd() {
      this.editPwdDialog = false
    },
    ...mapActions({
      updateDialog: 'updateDialog'
    }),
    // deleteUser(scope) {
    //   this.rowInfo = scope.row
    //   this.userDialogStatu.delete = true
    // },
    addUser() {
      this.userDialogStatu.add = true
    },
    toDetails(row) {
      this.$router.push(`/sf_cloud/workbench/userManageDetails/${row.user_id}`)
    }
  },
  watch: {},
  components: {
    selectComponent,
    addUser,
    deleteDialog,
    authUser,
    editUserInfo,
    editPwd
  }
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
    .el-cascader {
      width: 400px !important;
    }
    .curPage {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      line-height: 50px;
      // font-weight: 400;
      font-weight: 700;
      margin-right: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
