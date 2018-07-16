<template>
  <div class="areaPage">
    <div class="defaultScope">
      <div class="curPage">区域</div>
    </div>
    <div class="areaBtn">
      <el-button type="primary" size="small" @click="createDialogShow">
        新建区域
      </el-button>
    </div>
    <div class="areaList">
      <el-table :data="showTable" style="width: 100%" stripe v-loading="loading">
        <el-table-column prop="name" label="区域名称" width="100" fixed>
        </el-table-column>
        <el-table-column prop="child_area_num" label="子区域数量" min-width="120">
        </el-table-column>
        <el-table-column prop="child_dc_num" label="机房数量" min-width="120">
        </el-table-column>
        <el-table-column prop="owner" label="管理员" min-width="120">
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="btnBox">
              <span class="seeChild operateBtn" @click="childtDialogShow(scope.row.uuid)">
                <img src="/static/svg/detail.svg" alt="">
              </span>
              <span class="addArea operateBtn" @click="addDialogShow(scope.row)">
                <img src="/static/svg/add.svg" alt="">
              </span>
              <span class="editArea operateBtn" @click="editDialogShow(scope.row)">
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
    <areaCreate @infRefresh="infRefresh" :areaChildList="areaChildList" :areCreateVisible.sync="dialogStates.areCreateVisible"></areaCreate>
    <areaEdit @edit="editAfterRefresh" :rowInfo="rowInfo" :areaEditVisible.sync="dialogStates.areaEditVisible"></areaEdit>

    <areaAdd @infRefresh="infRefresh" :rowInfo="rowInfo" :areaAddVisible.sync="dialogStates.areaAddVisible"></areaAdd>

    <areaChild @refreshAreaData="refreshAreaData" :childList="childList" :areaChildCheckVisible.sync="dialogStates.areaChildCheckVisible"></areaChild>
  </div>
</template>
<script>
import areaCreate from './areaComponent/createArea'
import areaEdit from './areaComponent/areaEdit'
import areaAdd from './areaComponent/addArea'
import areaChild from './areaComponent/areaChild'
import store from './../../../state'
import {
  fetchList,
  fetchListChild,
  queryAreaList
} from '@/api/admin/areaManage'
export default {
  components: {
    areaCreate,
    areaEdit,
    areaAdd,
    areaChild
  },
  data() {
    return {
      loading: false,
      areauuid: '',
      store,
      rowInfo: [],
      dialogStates: {
        areCreateVisible: false, // 新建区域显示弹框
        areaEditVisible: false, // 编辑弹框
        areaAddVisible: false, // 新建子区域显示弹框
        areaChildCheckVisible: false // 详情显示弹框
      },
      areaChildList: [], // 查询所有大小区的信息
      childList: [], // 子区域详情
      selectChildId: '', // 添加大区域的子区域
      tableData: [],
      paginationInfo: {
        total: 1,
        pageSize: 10,
        currentPage: 1,
        pageSizes: [5, 10, 20, 100]
      }
    }
  },
  computed: {
    showTable() {
      let start =
        (this.paginationInfo.currentPage - 1) * this.paginationInfo.pageSize
      let end = this.paginationInfo.currentPage * this.paginationInfo.pageSize
      return this.tableData.slice(start, end)
    }
  },
  mounted() {
    this.getAreaList()
    this.getAreaChildList()
  },
  methods: {
    fetchList,
    fetchListChild,
    queryAreaList,
    refreshAreaData() {
      this.getAreaList()
    },
    editAfterRefresh() {
      this.getAreaList()
    },
    // 查询所有大区信息
    getAreaList() {
      this.loading = true
      this.fetchList().then(res => {
        let data = res.data
        this.loading = false
        if (data.code === 0) {
          this.tableData = data.data
          this.paginationInfo.total = data.data.length
        }
      })
    },
    // 查询子区域
    getChildList(childId) {
      let params = {
        area_uuid: childId
      }
      this.fetchListChild(params).then(res => {
        let data = res.data
        if (data.code === 0) {
          this.childList = data.data
        }
      })
    },
    // 查询所有大区-小区信息
    getAreaChildList() {
      this.queryAreaList().then(res => {
        let data = res.data
        if (data.code === 0) {
          this.areaChildList = data.data
        }
      })
    },
    // 刷新页面信息
    infRefresh() {
      this.getAreaList()
      this.getAreaChildList()
    },
    handleSizeChange(val) {
      this.paginationInfo.pageSize = val
    },
    handleCurrentChange(val) {
      this.paginationInfo.currentPage = val
    },
    createDialogShow() {
      this.dialogStates.areCreateVisible = true
    },
    editDialogShow(row) {
      this.rowInfo = row
      this.dialogStates.areaEditVisible = true
    },
    addDialogShow(row) {
      this.rowInfo = row
      this.dialogStates.areaAddVisible = true
    },
    childtDialogShow(id) {
      this.getChildList(id)
      this.dialogStates.areaChildCheckVisible = true
    }
  }
}
</script>
<style lang="less">
.areaPage {
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
  .areaList {
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
