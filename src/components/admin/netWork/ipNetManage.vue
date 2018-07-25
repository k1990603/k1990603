<template>
  <div class="ipNetManagePage">
    <div class="defaultScope">
      <div class="curPage">公网IP管理</div>
      <!-- <selectComponent @getSelect="getSelect"></selectComponent> -->
    </div>
    <div class="ipNetManageBtn">
      <el-button size="small" type="primary" @click="writeIpNetTrigger">
        <i class="el-icon-edit"></i> 公网录入
      </el-button>
    </div>
    <div class="ipNetBtn">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24">
          <div class="columSel">
            <span>
              <i class="el-icon-refresh" @click="getList"></i>
            </span>
            <span>
              <i class="el-icon-download"></i>
            </span>
          </div>
          <div class="searchBtn">
            <el-input placeholder="请输入子网名称" @change='getList' v-model="search.cidr" size="small" prefix-icon="el-icon-search">
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="ipNetManageList">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="internet_segment_cidr" label="网段">
        </el-table-column>
        <el-table-column prop="avail_ip" label="可用IP">
        </el-table-column>
        <el-table-column prop="total_ip" label="IP总数">
        </el-table-column>
        <el-table-column label="操作">
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
    <el-dialog width="650px" class='dialogTemplate' title="公网网段录入" :visible.sync="writeIn" center>
      <writeIpNet @writeInRes='writeInRes' :topAreaData='topAreaData'></writeIpNet>
    </el-dialog>
  </div>
</template>
<script>
import { getAllAreaDcHcNet, ipNetList } from './../../../api/admin/netWork'
// import selectComponent from './selectComponent'
import writeIpNet from './ipNetManage/writeIpNet'
export default {
  data() {
    return {
      search: {
        cidr: ''
      },
      currentTenant: '',
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      writeIn: false, // 录入公网IP弹窗
      topAreaData: [], // 所有区域机房集群信息
      tableData: []
    }
  },
  mounted() {
    this.getList()
    this.getAreaList()
  },
  computed: {},
  methods: {
    ipNetList,
    getAllAreaDcHcNet,
    getList() {
      let search = {}
      if (this.search.cidr != '') {
        search.cidr = this.search.cidr
      } else {
        search = ''
      }
      this.ipNetList({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.tableData = res.data.data.rows
          this.paginationInfo.total = res.data.data.total
        }
      })
    },
    getAreaList() {
      // 获取所有的区域机房集群信息
      this.getAllAreaDcHcNet().then(res => {
        if (res.data.code == 0) {
          this.topAreaData = res.data.data
        }
      })
    },
    writeIpNetTrigger() {
      this.writeIn = true
    },
    writeInRes() {
      this.writeIn = false
      this.getList()
    },
    // getSelect(item) {
    //   this.currentTenant = item.tenant_uuid
    // },
    // 筛选
    forSelect() {},
    getSelVal(val) {
      // console.log(val)
    },
    handleClick(row) {
      // console.log(row)
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
    },
    getDetails(scope) {
      this.$router.push({
        path: `/sf_cloud/workbench/ipNetDetails/${scope.row.uuid}`,
        query: { ipNetInfo: JSON.stringify(scope.row) }
      })
    }
  },
  components: {
    // selectComponent,
    writeIpNet
  }
}
</script>
<style lang="less">
.ipNetManagePage {
  position: relative;
  .ipNetBtn {
    margin-top: 10px;
    padding-left: 10px;
    padding-right: 15px;
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
  .ipNetManageBtn {
    margin-left: 10px;
    .filtTerm {
      margin-top: 15px;
      padding: 15px 10px;
      width: 100%;
      background: #eee;
    }
  }
  .ipNetManageList {
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
