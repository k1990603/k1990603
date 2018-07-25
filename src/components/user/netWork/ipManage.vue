<template>
  <div class="ipUserManagePage">
    <div class="defaultScope">
      <div class="curPage">IP管理</div>
    </div>
    <div class="subNetBtn">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click='getList'></i>
            </span>
            <!-- <span @click="editColum">
              <i class="el-icon-menu"></i>
            </span> -->
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入子网名称" size="small" prefix-icon="el-icon-search" @change="searchSubNetNetworkName" v-model="searchSubNetworkname">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="ipManageList">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="subnetwork_name" label="子网" :show-overflow-tooltip='true' min-width="100">
        </el-table-column>
        <el-table-column prop="cidr" label="CIDR" min-width="150">
        </el-table-column>
        <el-table-column prop="network_type" label="网络类型" min-width="150">
          <template slot-scope='scope'>
            {{formateNetworkType(scope.row.network_type)}}
          </template>
        </el-table-column>
        <el-table-column prop="ip_total" label="IP总数" min-width="120">
        </el-table-column>
        <el-table-column prop="ip_avail" label="可分配数" min-width="120">
        </el-table-column>
        <el-table-column prop="network_segment_name" label="所属网络" min-width="120">
        </el-table-column>
        <el-table-column prop="tenant_name" label="所属租户" min-width="120">
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <div class="btnBox">
              <span class="addArea operateBtn" @click="getDetails(scope)">
                <img src="/static/svg/detail.svg" alt="">
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { bus, DataList } from './../../common/commonBus.js'
import store from './../../../state'
import { getIpList } from './../../../api/admin/netWork'
import { formateNetworkType } from '@/filters/index'
export default {
  data() {
    return {
      store,
      createShow: false,
      // 筛选框的显示隐藏
      filtShow: false,
      // 筛选根数据
      searchSubNetworkname: '', //搜索框
      tableData: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      searchBox: {
        project_name: '', // 搜索字段
        tenant_uuid: '-1' // 筛选租户名称
      }
    }
  },
  mounted() {
    this.getList({ tenant_uuid: this.userInfo.tenantInfo.tenant_uuid })
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    formateNetworkType,
    getIpList,
    // 获取列表
    getList(search) {
      this.getIpList({
        role_type: '2',
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
        // search: {tenant_name:JSON.stringify(search)} || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    // 筛选
    forSelect() {},
    // 创建页面回到主页
    goToMain() {
      this.createShow = false
    },
    getSelVal(val) {
      // console.log(val)
    },
    handleClick(row) {
      // console.log(row)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.searchSubNetNetworkName()
    },
    handleCurrentChange(val) {
      this.paginationInfo.currentPage = val
      this.searchSubNetNetworkName()
    },
    getDetails(scope) {
      this.$router.push({
        path: `/sf_cloud/workbench/userIpDetails/${scope.row.sub_network_uuid}`,
        query: { subNetInfo: JSON.stringify(scope.row) }
      })
    },
    searchSubNetNetworkName() {
      //搜索框
      if (this.searchBox.tenant_uuid == -1) {
        this.getList({
          subnetwork_name: this.searchSubNetworkname,
          tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
        })
      } else {
        this.getList({
          subnetwork_name: this.searchSubNetworkname,
          tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
        })
      }
    },
    editColum() {
      this.searchSubNetNetworkName()
    }
  },
  components: {}
}
</script>
<style lang="less">
.ipUserManagePage {
  position: relative;
  .defaultScope {
    .el-cascader {
      width: 400px !important;
    }
    .curPage {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      line-height: 50px; // font-weight: 400;
      font-weight: 700;
      margin-right: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .subNetBtn {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
    .batchBtn,
    .searchBtn,
    .selectArea,
    .columSel {
      display: inline-block;
    }
    .searchBtn {
      float: right;
    }
    .selectArea {
      float: right;
      margin-right: 10px;
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
  .ipManageBtn {
    margin-left: 10px;
    .filtTerm {
      margin-top: 15px;
      padding: 15px 10px;
      width: 100%;
      background: #eee;
    }
  }
  .ipManageList {
    margin-top: 10px;
    .operateBtn {
      cursor: pointer;
      padding: 0 5px;
      i {
        font-size: 18px;
        color: #0783f6;
      }
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
