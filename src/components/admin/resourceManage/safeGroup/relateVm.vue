<template>
  <div class="safeGroupTemplatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      {{securityName}} 实例管理
    </div>
    <div class="btnBox">
      <el-button type="primary" size="small" @click="addInstance">新增关联</el-button>
      <el-button type="default" size="small" @click="batchDelete" :disabled='!(multipleSelection.length>0)'>批量移出</el-button>
    </div>
    <div class="templateList">
      <el-table :data="templateList" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="instance_nic_name" label="网卡名称" min-width="80">
        </el-table-column>
        <el-table-column prop="instance_nic_type" label="网卡类型">
          <template slot-scope="scope">
            {{scope.row.instance_nic_type == 0 ?'内网':'外网'}}
          </template>
        </el-table-column>
        <el-table-column prop="instance_name" label="VM名称" min-width="80">
        </el-table-column>
        <el-table-column prop="ip_address" label="主IP地址" min-width="100">
        </el-table-column>
        <!-- <el-table-column prop="use_type" label="是否绑定其他安全组" min-width="100">
          <template slot-scope="scope">
            {{scope.row.use_type == 0 ?'否':'是'}}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <div class="templateBtn">
              <el-button type="text" size="small" @click="deleteInstance(scope.row)">移出安全组</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="paginationBox">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationInfo.currentPage" :page-sizes="paginationInfo.pageSizes" :page-size="paginationInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationInfo.total">
      </el-pagination>
    </div>
    <el-dialog title="新增关联" width="650px" class="dialogTemplate" :visible.sync="relateStatu.add" center>
      <addVmInstance @addRes='addRes' :instanceList='instanceList' @searchInstance='searchInstance' :instanceNameList='instanceNameList'></addVmInstance>
    </el-dialog>

    <el-dialog title="移除安全组" width="650px" class="dialogTemplate" :visible.sync="relateStatu.delete" center>
      <deleteVmInstance :multipleSelection="multipleSelection" @deleteRes='deleteRes'></deleteVmInstance>
    </el-dialog>

  </div>
</template>
<script>
import { getVms, getAllVm } from '@/api/admin/securityManage'
import addVmInstance from './addVmInstance'
import deleteVmInstance from './deleteVmInstance'
export default {
  data() {
    return {
      instanceNameList: [],
      instanceList: [],
      multipleSelection: [],
      securityName: '',
      rowInfo: [],
      templateList: [],
      paginationInfo: {
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      },
      relateStatu: {
        add: false,
        delete: false
      }
    }
  },
  mounted() {
    this.securityName = this.$route.query.name
    this.getVmList()
  },
  methods: {
    getAllVm,
    getVms,
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.paginationInfo.pageSize = val
      this.getVmList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.paginationInfo.currentPage = val
      this.getVmList()
    },
    batchDelete() {
      this.relateStatu.delete = true
    },
    deleteInstance(row) {
      this.multipleSelection = [row]
      this.relateStatu.delete = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteRes() {
      this.relateStatu.delete = false
      this.multipleSelection = []
      this.getVmList()
    },
    addRes() {
      this.relateStatu.add = false
      this.getVmList()
    },
    getVmList(search) {
      this.getVms({
        page_size: this.paginationInfo.pageSize,
        page_no: this.paginationInfo.currentPage,
        search: JSON.stringify(search) || '',
        securitygroup_uuid: this.$route.params.uuid
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
    getRelateInstances(search) {
      this.getAllVm({
        project_uuid: this.$route.query.project_uuid,
        search: JSON.stringify(search) || ''
      }).then(res => {
        if (res.data.code == 0) {
          this.instanceList = res.data.data.rows
          this.instanceList.forEach(item => {
            if (this.instanceNameList.indexOf(item.instance_name) < 0) {
              this.instanceNameList.push(item.instance_name)
            }
          })
        }
      })
    },
    searchInstance(val) {
      this.getRelateInstances(val)
    },
    addInstance() {
      this.getRelateInstances()
      this.relateStatu.add = true
    }
  },
  components: {
    addVmInstance,
    deleteVmInstance
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
  // .templateBtn {
  //   .el-button--mini,
  //   .el-button--small {
  //     // font-size: 16px;
  //   }
  // }
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

