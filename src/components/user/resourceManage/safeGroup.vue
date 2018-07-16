<template>
  <div class="safeGroupPage">
    <div class="defaultScope">
      <div class="curPage">安全组</div>
      <div class="searchList">
        <a href="javascript:;" class="parentName" :class="{active: isShow}" @click="isShow=!isShow">
          <span>{{searchTitle.project_name}}</span>
          <i class="el-icon-arrow-down" v-if="!isShow"></i>
          <i class="el-icon-arrow-up" v-if="isShow"></i>
        </a>
        <ul class="childList" v-if="isShow">
          <li v-for="(item, index) in projectList" :key="index" @click="setSearchTitle(item)">
            {{item.project_name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="btnList">
      <el-row>
        <el-col :xs="24" :lg="12">
          <div class="batchBtn">
            <el-button type="primary" size="small" @click="createSecurity">创建</el-button>
            <el-button type="success" size="small" @click="toSysTmp">系统安全组模板</el-button>
          </div>
        </el-col>
        <el-col :xs="24" :lg="12">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="getSearchList"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入安全组名称" v-model.trim='search.security_name' @change="getSearchList" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="safeGroupList">
      <el-table :data="tableData" style="width: 100%" stripe>
        <!-- <el-table-column type="selection" width="55">
        </el-table-column> -->
        <el-table-column prop="uuid" :show-overflow-tooltip="true" label="UUID" min-width="100">
        </el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" min-width="100">
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
        <el-table-column prop="sg_num" min-width="120" label="关联VM数量">
        </el-table-column>
        <el-table-column prop="project_name" :show-overflow-tooltip="true" label="项目">
        </el-table-column>
        <!-- <el-table-column prop="created_at" :show-overflow-tooltip="true" label="创建时间" min-width="150">
        </el-table-column> -->
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
                <el-dropdown-item :command="{type:0,info:scope.row}">克隆</el-dropdown-item>
                <el-dropdown-item :command="{type:1,info:scope.row}">删除</el-dropdown-item>
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
    <el-dialog title="创建安全组" class='dialogTemplate' :visible.sync="securityStatu.create" width="650px" center>
      <createSafeGroup @createRes='createRes' :projectList='defaultProjectList' :templateList='templateList'></createSafeGroup>
    </el-dialog>
    <el-dialog title="克隆安全组" class='dialogTemplate' :visible.sync="securityStatu.clone" width="650px" center>
      <cloneSafeGroup @cloneRes='cloneRes' :projectList='defaultProjectList' :rowInfo='rowInfo'></cloneSafeGroup>
    </el-dialog>

    <el-dialog title="删除安全组" class='dialogTemplate' :visible.sync="securityStatu.delete" width="650px" center>
      <deleteSafeGroup @deleteRes='deleteRes' :rowInfo='rowInfo'></deleteSafeGroup>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {
  getSecurityList,
  getSecurityTmp,
  getProjectList
} from '@/api/user/userSecurityManage'

import createSafeGroup from './safeGroup/createSafeGroup'
import cloneSafeGroup from './safeGroup/cloneSafeGroup'
import deleteSafeGroup from './safeGroup/deleteSafeGroup'

export default {
  data() {
    return {
      rowInfo: [],
      isShow: false,
      searchTitle: { project_name: '全部项目', project_uuid: '-1' },
      projectList: [],
      defaultProjectList: [],
      templateList: [],
      securityStatu: {
        create: false,
        clone: false,
        delete: false
      },
      // 表格数据
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      search: {
        tenant_uuid: '',
        security_name: '',
        project_uuid: '-1'
      }
    }
  },
  mounted() {
    this.search.tenant_uuid = this.userInfo.tenantInfo.tenant_uuid
    this.getProList()
    this.getList({ tenant_uuid: this.search.tenant_uuid })
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    getSecurityList,
    getSecurityTmp,
    getProjectList,
    toSysTmp() {
      this.$router.push('/sf_cloud/workbench/userSafeGroupTmp')
    },
    setSearchTitle(item) {
      this.searchTitle = item
      if (item.project_uuid == -1) {
        this.search.project_uuid = '-1'
        this.search.security_name = ''
        this.getList({ tenant_uuid: this.search.tenant_uuid })
      } else {
        this.search.project_uuid = item.project_uuid
        this.getList({
          tenant_uuid: this.search.tenant_uuid,
          project_uuid: this.search.project_uuid
        })
      }
      this.search.security_name = ''
      this.isShow = false
    },
    createSecurity() {
      this.getTmp()
      this.securityStatu.create = true
    },
    getProList() {
      this.getProjectList({ tenant_uuid: this.search.tenant_uuid }).then(
        res => {
          if (res.data.code == 0) {
            if (res.data.data.length > 0) {
              this.defaultProjectList = res.data.data
              this.projectList = [this.searchTitle].concat(res.data.data)
            } else {
              this.projectList = [
                { project_name: '暂无项目', project_uuid: '-1' }
              ]
            }
          }
        }
      )
    },
    getTmp() {
      this.templateList = []
      this.getSecurityTmp().then(res => {
        if (res.data.code == 0) {
          this.templateList = res.data.data.rows
        }
      })
    },
    cloneRes() {
      this.securityStatu.clone = false
      this.getSearchList()
    },
    deleteRes() {
      this.securityStatu.delete = false
      this.getSearchList()
    },
    createRes() {
      this.securityStatu.create = false
      this.getSearchList()
    },
    getSearchList() {
      if (this.search.project_uuid == '-1') {
        if (this.search.security_name == '') {
          this.getList({
            tenant_uuid: this.search.tenant_uuid
          })
        } else {
          this.getList({
            tenant_uuid: this.search.tenant_uuid,
            security_name: this.search.security_name
          })
        }
      } else {
        if (this.search.security_name == '') {
          this.getList({
            tenant_uuid: this.search.tenant_uuid,
            project_uuid: this.search.project_uuid
          })
        } else {
          this.getList(this.search)
        }
      }
    },
    getList(search) {
      this.getSecurityList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || JSON.stringify({}),
        role_type: 1
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getSearchList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getSearchList()
    },
    someOperate(command) {
      switch (command.type) {
        case 0:
          this.rowInfo = command.info
          this.securityStatu.clone = true
          break
        case 1:
          command.info.isTmp = true
          this.rowInfo = command.info
          this.securityStatu.delete = true
          break
      }
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    },
    editSafeGroupRules(row) {
      this.$router.push({
        path: `/sf_cloud/workbench/userSafeGroupRule/${row.uuid}`,
        query: {
          name: row.name,
          project_uuid: row.project_uuid,
          nic_info: JSON.stringify(row.nic_info),
          isTmp: false
        }
      })
    },
    relateVm(row) {
      this.$router.push({
        path: `/sf_cloud/workbench/userRelateVm/${row.uuid}`,
        query: { name: row.name, project_uuid: row.project_uuid }
      })
    }
  },
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
