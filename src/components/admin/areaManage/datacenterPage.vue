<template>
  <div class="datacenterPage">
    <div class="defaultScope">
      <div class="curPage">机房</div>
    </div>
    <div class="datacenterBtn">
      <el-button type="primary" size="small" @click="createDialogShow">
        新建机房</el-button>
    </div>
    <div class="datacenterList">
      <el-table :data="tableData" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="name" label="机房名" min-width="100" fixed="" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="hc_num" label="集群数量" min-width="120">
        </el-table-column>
        <el-table-column prop="area_name" label="所在区域" min-width="120">
        </el-table-column>
        <el-table-column prop="province" label="所在省份" min-width="120">
        </el-table-column>
        <el-table-column prop="address" label="机房地址" min-width="120">
        </el-table-column>
        <el-table-column prop="description" label="备注" min-width="120">
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="btnBox">
              <!-- <span class="operateBtn">
                <img src="/static/svg/detail.svg" alt="">
              </span> -->
              <span class="operateBtn" @click="deleteDialogShow(scope.row)">
                <img src="/static/svg/delete.svg" alt="">
              </span>
              <span class="operateBtn" @click="editDialogShow(scope.row)">
                <img src="/static/svg/edit.svg" alt="">
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
    <datacenterCreate @infRefresh="infRefresh" :areaChildList="areaChildList" :datacenterCreateVisible.sync="dialogStates.datacenterCreateVisible"></datacenterCreate>
    <datacenterDelete :datacenterDeleteVisible.sync="dialogStates.datacenterDeleteVisible"></datacenterDelete>
    <datacenterEdit @edit="refreshHomeRoomData" :roomInfo="roomInfo" :datacenterEditVisible.sync="dialogStates.datacenterEditVisible"></datacenterEdit>
  </div>
</template>
<script>
import datacenterCreate from './datacenterComponent/datacenterCreate'
import datacenterDelete from './datacenterComponent/datacenterDelete'
import datacenterEdit from './datacenterComponent/datacenterEdit'
import store from './../../../state'
import {
  queryDCList,
  queryAreaList,
  deleteDatacenterData
} from '@/api/admin/areaManage'
export default {
  data() {
    return {
      roomInfo: {},
      store,
      dialogStates: {
        datacenterCreateVisible: false, // 新建机房
        datacenterEditVisible: false, // 编辑弹框
        datacenterDeleteVisible: false // 删除弹框
      },
      areaChildList: [], // 查询所有大小区的信息
      tableData: [],
      loading: false,
      paginationInfo: {
        // 机房分页信息
        total: 0,
        pageSize: 5,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  mounted() {
    this.getDCList()
    this.getAreaChildList()
  },
  methods: {
    deleteDatacenterData,
    queryDCList,
    queryAreaList,
    handleClick(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      this.paginationInfo.pageSize = val
      this.getDCList()
    },
    handleCurrentChange(val) {
      this.paginationInfo.currentPage = val
      this.getDCList()
    },
    // 刷新页面信息
    infRefresh() {
      this.getDCList()
      this.getAreaChildList()
    },
    refreshHomeRoomData() {
      this.getDCList()
    },
    // 查询所有机房信息
    getDCList() {
      this.loading = true
      let params = {
        page_size: this.paginationInfo.pageSize,
        page_num: this.paginationInfo.currentPage
      }
      this.queryDCList(params).then(res => {
        let data = res.data
        this.loading = false
        if (data.code === 0) {
          this.tableData = data.data.dc_list
          this.paginationInfo.total = data.data.total_num
        }
      })
    },
    // 查询所有区域信息
    getAreaChildList() {
      this.queryAreaList().then(res => {
        let data = res.data
        if (data.code === 0) {
          this.areaChildList = data.data
        }
      })
    },
    // 新建机房
    createDialogShow() {
      this.dialogStates.datacenterCreateVisible = true
    },
    editDialogShow(row) {
      this.dialogStates.datacenterEditVisible = true
      this.roomInfo = row
    },
    deleteDialogShow(row) {
      //this.dialogStates.datacenterDeleteVisible = true
      let options = {
        uuid: row.uuid
      }
      this.$confirm(
        `此操作将移除机房名为${row.name}的机房, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.deleteDatacenterData(options).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              // 刷新机房列表数据
              this.getDCList()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  components: {
    datacenterCreate,
    datacenterDelete,
    datacenterEdit
  }
}
</script>
<style lang="less">
.datacenterPage {
  position: relative;
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
  .datacenterList {
    margin-top: 10px;
    .operateBtn {
      cursor: pointer;
      padding: 0 5px;
    }
    .paginationBox {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
