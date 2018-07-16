<template>
  <div class="safeGroupPage">
    <div class="defaultScope">
      <div class="curPage">安全组</div>
      <div class="searchList">
        <a href="javascript:;" class="parentName" :class="{active: isShow}" @click="isShow=!isShow">
          <span>{{searchTitle.tenant_name}}</span>
          <i class="el-icon-arrow-down" v-if="!isShow"></i>
          <i class="el-icon-arrow-up" v-if="isShow"></i>
        </a>
        <ul class="childList" v-if="isShow">
          <li v-for="(item, index) in searchLesseeList" :key="index" @click="setSearchTitle(item)">
            {{item.tenant_name}}
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="tipText">
      <p>
        在这里用户可以设定安全组策略，对绑定的云主机进行内、外网访问权限控制，提高公有云的安全性
      </p>
    </div> -->
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :lg="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="createSecurity">创建</el-button>
            <el-button type="success" size="small">
              <router-link tag="span" to="/sf_cloud/workbench/safeGroupTemplate">模板管理</router-link>
            </el-button>
          </div>
        </el-col>
        <el-col :xs="24" :lg="12">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="getScreeningData"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入安全组名称" v-model.trim="search.security_name" @blur="getScreeningData" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="safeGroupList">
      <el-table :data="tableData" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" v-loading="securityStatu.loading" style="width: 100%" stripe>
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="uuid" label="UUID" :show-overflow-tooltip="true" min-width="100">
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.edit">
              <el-input class="edit-input" size="small" v-model="scope.row.name"></el-input>
              <el-button v-if="scope.row.edit" type="text" @click="confirmEdit(scope.row)">Ok</el-button>
              <el-button class='cancel-btn' type="text" @click="cancelEdit(scope.row)">cancel</el-button>
            </div>
            <div v-else>
              <span>{{ scope.row.name }}</span>
              <!-- <el-button type="text" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">Edit</el-button> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" :show-overflow-tooltip="true" label="类型">
          <template slot-scope="scope">
            {{scope.row.type=='1'?'项目专属':'公用'}}
          </template>
        </el-table-column>
        <el-table-column prop="sg_num" min-width="120" label="关联VM数量">
        </el-table-column>
        <el-table-column prop="project_name" :show-overflow-tooltip="true" label="所属项目">
        </el-table-column>
        <el-table-column prop="tenant_name" :show-overflow-tooltip="true" label="所属租户">
        </el-table-column>
        <el-table-column prop="created_at" :show-overflow-tooltip="true" label="创建时间" min-width="100">
        </el-table-column>
        <el-table-column prop="description" :show-overflow-tooltip="true" label="备注">
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editSafeGroupRules(scope.row)">修改规则</el-button>
            <el-button type="text" @click="relateVm(scope.row)">管理实例</el-button>
            <el-dropdown trigger="click" @command="someOperate">
              <span class="el-dropdown-link">
                <!-- 更多 -->
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type:1,info:scope.row}">删除</el-dropdown-item>
                <el-dropdown-item :command="{type:0,info:scope.row}">克隆安全组</el-dropdown-item>
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
    <el-dialog title="选择租户" class='dialogTemplate' :visible.sync="securityStatu.selectTenant" width="500px" center>
      <div>
        <el-form :model='selectForm' :rules='selectRules' ref='selectForm' label-width="100px">
          <el-form-item label='所属租户'>
            <el-select @change='handleChangeTenant' v-model="selectForm.tenant_index" placeholder="请选择租户">
              <el-option v-for='(item,index) in tenantList' :key='index' :label="item.tenant_name" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='所属项目'>
            <el-select v-model="selectForm.project_uuid" placeholder="请选择项目">
              <el-option v-for='(item,index) in selectForm.projectList' :key='index' :label="item.project_name" :value="item.project_uuid"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toRelateVm">确 定</el-button>
        <el-button @click="cancelSelect">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="创建安全组" class='dialogTemplate' :visible.sync="securityStatu.create" width="650px" center>
      <createSafeGroup @createRes='createRes' :tenantList='tenantList' :templateList='templateList'></createSafeGroup>
    </el-dialog>

    <el-dialog title="克隆安全组" class='dialogTemplate' :visible.sync="securityStatu.clone" width="650px" center>
      <cloneSafeGroup @cloneRes='cloneRes' :projectInfo='projectInfo' :rowInfo='rowInfo'></cloneSafeGroup>
    </el-dialog>

    <el-dialog title="删除安全组" class='dialogTemplate' :visible.sync="securityStatu.delete" width="650px" center>
      <deleteSafeGroup @deleteRes='deleteRes' :rowInfo='rowInfo'></deleteSafeGroup>
    </el-dialog>
  </div>
</template>
<script>
import tableColumNameDialog from './../../common/tableColumName'
import {
  getSecurityList,
  // getTenantPro,
  getSecurityTmp
} from '@/api/admin/securityManage'
import { getUseTenant } from '@/api/admin/vm'
import { getLesseeNameList } from '@/api/admin/lesseeManage'
import createSafeGroup from './safeGroup/createSafeGroup'
import cloneSafeGroup from './safeGroup/cloneSafeGroup'
import deleteSafeGroup from './safeGroup/deleteSafeGroup'

export default {
  data() {
    return {
      selectRules: {
        tenant_index: [
          { required: true, message: '请选择租户', trigger: 'change' }
        ],
        project_uuid: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      },
      selectForm: {
        safeGroupUuid: '',
        safeGroupName: '',
        projectList: [],
        tenant_index: '',
        project_uuid: ''
      },
      projectInfo: [],
      rowInfo: [],
      search: {
        security_name: '',
        tenant_uuid: ''
      },
      isShow: false,
      templateList: [],
      searchLesseeList: [],
      tenantList: [],
      searchTitle: { tenant_name: '全部租户', tenant_uuid: '-1' },
      loadingText: '拼命加载中',
      securityStatu: {
        selectTenant: false,
        lodaing: false,
        hasTenant: false, // 是否有租户筛选
        create: false,
        clone: false,
        delete: false
      },
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  mounted() {
    this.getTableData()
    this.getTenantList()
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) this.isShow = false
    })
  },
  methods: {
    getUseTenant,
    getSecurityTmp,
    // getTenantPro,
    getSecurityList,
    getLesseeNameList,
    deleteRes() {
      this.securityStatu.delete = false
      this.getScreeningData()
    },
    cloneRes() {
      this.securityStatu.clone = false
      this.getScreeningData()
    },
    createRes() {
      this.securityStatu.create = false
      this.getScreeningData()
    },
    getTmp() {
      this.templateList = []
      this.getSecurityTmp().then(res => {
        if (res.data.code == 0) {
          this.templateList = res.data.data.rows
        }
      })
    },
    get_tenant_pro() {
      this.tenantList = []
      this.getUseTenant().then(res => {
        if (res.data.code == 0) {
          this.tenantList = res.data.data
        }
      })
    },
    createSecurity() {
      this.getTmp()
      this.get_tenant_pro()
      this.securityStatu.create = true
    },
    cancelEdit(row) {
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    },
    getTenantList() {
      this.getLesseeNameList().then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.searchLesseeList = [this.searchTitle].concat(res.data.data)
        }
      })
    },
    setSearchTitle(item) {
      this.searchTitle = item
      if (item.tenant_uuid == -1) {
        this.search.project_uuid = '-1'
        this.search.tenant_name = ''
        this.securityStatu.hasTenant = false
        this.getTableData()
      } else {
        this.search.tenant_uuid = item.tenant_uuid
        this.securityStatu.hasTenant = true
        this.getTableData({
          tenant_uuid: this.search.tenant_uuid
        })
      }
      this.search.security_name = ''
      this.isShow = false
    },
    getScreeningData() {
      if (this.securityStatu.hasTenant) {
        if (this.search.security_name == '') {
          this.getTableData({
            tenant_uuid: this.search.tenant_uuid
          })
        } else {
          this.getTableData({
            tenant_uuid: this.search.tenant_uuid,
            security_name: this.search.security_name
          })
        }
      } else {
        if (this.search.security_name == '') {
          this.getTableData()
        } else {
          this.getTableData({
            security_name: this.search.security_name
          })
        }
      }
    },
    getTableData(search) {
      this.securityStatu.loading = true
      this.getSecurityList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: search || {},
        role_type: 0
      }).then(res => {
        this.securityStatu.loading = false
        if (res.data.code == 0) {
          res.data.data.rows.forEach(item => {
            item.edit = false
          })
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getScreeningData()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getScreeningData()
    },
    someOperate(command) {
      switch (command.type) {
        case 0:
          this.rowInfo = command.info
          this.getUseTenant().then(res => {
            if (res.data.code == 0) {
              res.data.data.forEach(item => {
                if (item.tenant_uuid == command.info.tenant_uuid) {
                  this.projectInfo = item.project_info
                }
                this.securityStatu.clone = true
              })
            }
          })
          break
        case 1:
          command.info.isTmp = false
          this.rowInfo = command.info
          this.securityStatu.delete = true
          break
      }
    },
    editSafeGroupRules(row) {
      this.$router.push({
        path: `/sf_cloud/workbench/safeGroupRule/${row.uuid}`,
        query: {
          name: row.name,
          project_uuid: row.project_uuid,
          nic_info: JSON.stringify(row.nic_info),
          isTmp: false
        }
      })
    },
    handleChangeTenant() {
      this.selectForm.project_uuid = ''
      this.selectForm.projectList = this.tenantList[
        this.selectForm.tenant_index
      ].project_info
    },
    toRelateVm() {
      this.$refs.selectForm.validate(valid => {
        if (valid) {
          this.$router.push({
            path: `/sf_cloud/workbench/relateVm/${
              this.selectForm.safeGroupUuid
            }`,
            query: {
              name: this.selectForm.safeGroupName,
              project_uuid: this.selectForm.project_uuid
            }
          })
        }
      })
    },
    cancelSelect() {
      this.$refs.selectForm.resetFields()
      this.securityStatu.selectTenant = false
    },
    relateVm(row) {
      if (row.type == 1) {
        this.$router.push({
          path: `/sf_cloud/workbench/relateVm/${row.uuid}`,
          query: { name: row.name, project_uuid: row.project_uuid }
        })
      } else {
        this.getUseTenant().then(res => {
          if (res.data.code == 0) {
            this.tenantList = res.data.data
          }
        })
        this.selectForm.safeGroupName = row.name
        this.selectForm.safeGroupUuid = row.uuid
        this.securityStatu.selectTenant = true
      }
    }
  },
  watch: {},
  components: {
    createSafeGroup,
    cloneSafeGroup,
    deleteSafeGroup
  }
}
</script>
<style lang="less">
.safeGroupPage {
  position: relative;
  .tipText {
    padding: 15px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
  }
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
    .searchList {
      padding-left: 15px;
      display: inline-block;
      position: relative;
      font-size: 14px;
      line-height: 1;
      vertical-align: middle;
      .parentName {
        display: inline-block;
        position: relative;
        height: 36px;
        line-height: 36px;
        white-space: nowrap;
        font-size: 13px;
        padding: 0 10px;
        border-width: 1px 1px 0;
        border-style: solid;
        border-color: transparent;
        z-index: 3;
        color: #404a58;
        cursor: pointer;
        &.active {
          border-color: #d1d2d3;
          background-color: #fff;
        }
        span {
          padding-right: 10px;
        }
        i {
          float: right;
          line-height: 36px;
        }
      }
      .childList {
        position: absolute;
        margin-top: -1px;
        border: 1px solid #ddd;
        z-index: 2;
        white-space: nowrap;
        max-height: 250px;
        overflow-y: scroll;
        & > li {
          color: #404a58;
          padding: 0 10px;
          text-align: left;
          box-sizing: border-box;
          min-width: 121px;
          font-weight: 400;
          height: 36px;
          line-height: 36px;
          background: #fff;
          cursor: default;
          &.active {
            background-color: #409eff;
            color: #fff;
          }
          &:not(.active):hover {
            background-color: #ddd;
          }
        }
      }
    }
  }
  .safeGroupList {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
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
