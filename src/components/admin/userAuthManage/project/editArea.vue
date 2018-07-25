<template>
  <div class="editHostpool">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      修改项目集群信息
    </div>
    <div>
      <div class="oldInfo">
        <div class="itemInfo">
          <label>名称</label>
          <span>{{defaultInfo.name}}</span>
        </div>
        <div class="itemInfo">
          <label>所有者</label>
          <span>{{defaultInfo.ownerid}}</span>
        </div>
        <el-form label-width="120px" status-icon>
          <el-form-item label="区域">
            <el-tree :props="props" :default-checked-keys="areaDefaultChecked" :data="areaList" ref='tree' node-key="uuid" show-checkbox @check-change="handleCheckChange">
            </el-tree>
          </el-form-item>
          <el-form-item label="所属机房">
            <div class="selectBox">
              <el-table ref="datacenterTable" height="250" :data="datacenterList" style="width: 500px" @selection-change="handleDatacenterChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="dc_name" label="机房名称" min-width="120">
                </el-table-column>
                <el-table-column prop="area_name" label="所属区域" min-width="120">
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="所属集群">
            <div class="selectBox">
              <el-table ref="hostpoolTable" height="250" :data="hostpoolList" tooltip-effect="dark" style="width: 500px" @selection-change="handleHostpoolChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="hc_name" label="集群" min-width="120">
                </el-table-column>
                <el-table-column prop="datacenterName" label="所属机房" min-width="120">
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click='onSubmit'>确定修改</el-button>
            <el-button @click="cancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getLesseeInfo,
  getProjectDetails,
  editQuatoSubmit
} from '@/api/admin/lesseeManage'
export default {
  data() {
    return {
      defaultInfo: {}, // 指定租户的所有信息
      areaDefaultChecked: [], // 区域默认选中项
      areaList: [], // 区域信息列表
      datacenterList: [], // 机房信息列表
      selectedDatacenterList: [], // 选中机房列表
      hostpoolList: [], // 集群信息
      hostcluster_uuid_list: [], // 选中集群uuid
      props: {
        // 区域树结构展示参数
        label: 'name',
        children: 'child_area'
      }
    }
  },
  created() {
    this.getAreaInfo()
    this.getDefaultLesseeInfo()
    // this.getDefaultAreaInfo()
  },
  methods: {
    getLesseeInfo,
    getProjectDetails,
    editQuatoSubmit,
    goBack() {
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    },
    getAreaInfo() {
      this.getLesseeInfo({
        tenant_uuid: JSON.parse(this.$route.query.rowInfo).tenant_uuid
      }).then(res => {
        if (res.data.code == 0) {
          this.areaList = res.data.data.host_cluster_data_list
        }
      })
    },
    getDefaultDc_hc(list) {
      list.forEach(item => {
        if (item.datacenter) {
          item.datacenter.forEach(ele => {
            ele.area_name = item.name
            ele.name = ele.dc_name
            ele.uuid = ele.dc_uuid
            if (ele.hostcluster) {
              ele.hostcluster.forEach(tmp => {
                tmp.name = tmp.hc_name
                tmp.uuid = tmp.hc_uuid
                tmp.datacenterName = ele.dc_name
                tmp.dc_uuid = ele.dc_uuid
              })
              this.hostpoolList = this.hostpoolList.concat(ele.hostcluster)
            }
          })
          this.datacenterList = this.datacenterList.concat(item.datacenter)
          if (item.child_area && item.child_area.length > 0) {
            this.getDefaultDc_hc(item.child_area)
          }
        } else {
          if (item.child_area && item.child_area.length > 0) {
            this.getDefaultDc_hc(item.child_area)
          }
        }
      })
    },
    getDefaultLesseeInfo() {
      this.getProjectDetails({ uuid: this.$route.params.uuid }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          let list = res.data.data
          this.defaultInfo = list
          if (list.host_cluster_data_list) {
            list.host_cluster_data_list.forEach(tmp => {
              this.areaDefaultChecked.push(tmp.uuid)
            })
            this.$refs.tree.setCheckedKeys(this.areaDefaultChecked)
            this.getDefaultDc_hc(this.defaultInfo.host_cluster_data_list)
          }
        }
      })
    },
    //区域筛选
    handleCheckChange(data, checked) {
      let dc_arr = this.$refs.tree.getCheckedNodes()
      let deg_arr = []
      dc_arr.forEach(item => {
        if (item.datacenter) {
          item.datacenter.forEach(tmp => {
            tmp.area_name = item.name
            tmp.area_uuid = item.uuid
          })
          deg_arr = deg_arr.concat(item.datacenter)
        }
      })
      this.datacenterList = deg_arr
    },
    // 机房筛选
    handleDatacenterChange(val) {
      this.hostcluster_uuid_list = []
      this.hostpoolList = []
      let list = val
      let deg_arr = []
      this.selectedDatacenterList = val
      if (list.length > 0) {
        list.forEach(item => {
          if (item.hostcluster) {
            item.hostcluster.forEach(tmp => {
              tmp.datacenterName = item.dc_name
              tmp.dc_uuid = item.dc_uuid
            })
            deg_arr = deg_arr.concat(item.hostcluster)
          }
        })
      }
      this.hostpoolList = deg_arr
    },
    // 选择集群
    handleHostpoolChange(val) {
      let list = val
      this.hostcluster_uuid_list = []
      if (list.length <= 0) {
        return false
      } else {
        list.forEach(item => {
          this.hostcluster_uuid_list.push(item.hc_uuid)
        })
      }
    },
    onSubmit() {
      if (this.hostcluster_uuid_list.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择需要绑定的集群'
        })
        return
      }
      this.hostcluster_uuid_list = Array.from(
        new Set(this.hostcluster_uuid_list)
      )
      let options = {
        project_uuid: this.$route.params.uuid,
        hostcluster_uuid_list: JSON.stringify(this.hostcluster_uuid_list)
      }
      this.editQuatoSubmit(options).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="less">
.editHostpool {
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
  .oldInfo {
    .selectBox {
      width: 500px;
      padding: 5px;
      background: #f5f7fa;
      .searchBox {
        position: relative;
        height: 50px;
        .el-select {
          position: absolute;
          right: 0px;
          top: 0;
        }
      }
    }
    .itemInfo {
      font-size: 14px;
      padding-bottom: 15px;
      & > label {
        width: 120px;
        padding-right: 12px;
        text-align: right;
        display: inline-block;
      }
      & > span {
        color: #999;
      }
    }
  }
}
</style>
