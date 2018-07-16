<template>
  <div class="groupCreatePage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      新建管理组
    </div>
    <div class="adminGroupInfo">
      <el-steps :active="stepActive" :align-center='true'>
        <el-step title="基本信息" icon="el-icon-edit"></el-step>
        <el-step title="关联集群" icon="el-icon-picture"></el-step>
      </el-steps>
      <el-form v-show="stepActive == 1" label-width="120px" :model="createInfo" status-icon :rules="createRules" ref="lesseeInfo">
        <el-form-item label="名称" prop='group_name'>
          <el-col :span="8">
            <el-input v-model="createInfo.group_name" placeholder="请输入组名称"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="管理组类型" prop='group_type'>
          <el-radio-group v-model="createInfo.group_type">
            <el-radio :label="1">区域管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所有者" prop='owner_id'>
          <el-col :span="8">
            <el-select v-model="createInfo.owner_id" filterable placeholder="请输入所有者">
              <el-option v-for="item in memberList" :key="item.user_id" :label="item.user_id" :value="item.user_id">
                <span style="float: left">{{ item.user_id }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <div>
            <el-button type="primary" plain @click="toNext('lesseeInfo')">下一步：设置配额</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-form v-show="stepActive == 2" label-width="120px" :model="createInfo" status-icon :rules="createRules" ref="createInfo">
        <el-form-item label="区域">
          <el-tree :props="props" :data="areaList" ref='tree' node-key="value" show-checkbox @check-change="handleCheckChange">
          </el-tree>
        </el-form-item>
        <el-form-item label="所属机房">
          <div class="selectBox">
            <el-table height="250" :data="datacenterList" tooltip-effect="dark" style="width: 500px" @selection-change="handleDatacenterChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="name" label="机房名称" min-width="120">
              </el-table-column>
              <el-table-column prop="area_name" label="所属区域" min-width="120">
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="所属集群">
          <div class="selectBox">
            <div class="searchBox">
              <el-select @change='searchHostpool' clearable v-model="hostpoolSearchText" filterable placeholder="机房名(支持下拉、模糊查询)">
                <el-option size="mini" v-for="item in selectedDatacenterList" :key="item.dc_uuid" :label="item.name" :value="item.dc_uuid">
                </el-option>
              </el-select>
            </div>
            <el-table height="250" :data="hostpoolList" tooltip-effect="dark" style="width: 500px" @selection-change="handleHostpoolChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="name" label="集群" min-width="120">
              </el-table-column>
              <el-table-column prop="datacenterName" label="所属机房" min-width="120">
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="warning" plain @click='prev'>上一步</el-button>
          <el-button type="primary" plain @click="onSubmit()">确认创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getAreaInfo } from '@/api/admin/lesseeManage'
import { addGroup, getAllAdmin } from '@/api/admin/adminGroupManage'
import {} from '@/filters/index'
export default {
  data() {
    return {
      memberList: [],
      stepActive: 1,
      areaList: null, // 树结构区域以及子区域信息
      datacenterList: [], // 树结构机房信息
      selectedDatacenterList: [], // 被选中的机房信息
      hostpoolSearchText: '', // 筛选集群所输入的机房名称
      hostpoolList: [], // 树结构集群信息
      selectedDatacenter: '', // 被选中的机房
      createInfo: {
        group_type: 1,
        group_name: '',
        owner_id: '',
        hostcluster_uuid_list: []
      },
      createRules: {
        group_name: [
          { required: true, message: '请输入租户名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        owner_id: [{ required: true, message: '请输入所有者', trigger: 'blur' }]
      },
      props: {
        // 区域树结构展示参数
        label: 'name',
        children: 'child_area'
      },
      count: 1
    }
  },
  created() {
    this.loadNode()
    this.getDefaultAllAdmin()
  },
  methods: {
    getAllAdmin,
    addGroup,
    getAreaInfo,
    getDefaultAllAdmin() {
      this.getAllAdmin({
        page_size: 10000000,
        page_no: 1,
        search: ''
      }).then(res => {
        if (res.data.code != 0) {
          this.memberList = []
        } else {
          this.memberList = res.data.data
        }
      })
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 上一步
    toNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.next()
        }
      })
    },
    prev() {
      if (this.stepActive <= 1) {
        this.stepActive = 1
      } else if (this.stepActive <= 2) {
        this.stepActive--
      }
    },
    // 下一步
    next() {
      if (this.stepActive >= 1) {
        this.stepActive++
      } else if (this.stepActive >= 2) {
        this.stepActive = 2
      }
    },
    // 创建租户
    onSubmit() {
      if (this.createInfo.hostcluster_uuid_list.length > 0) {
        this.createInfo.hostcluster_uuid_list = JSON.stringify(
          this.createInfo.hostcluster_uuid_list
        )
        let options = this.createInfo
        this.addGroup(options).then(res => {
          if (res.data.code != 0) {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.$router.go(-1)
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择租户需要绑定的集群'
        })
      }
    },
    // 树形结构
    //区域筛选
    handleCheckChange(data, checked) {
      this.datacenterList = []
      let dc_arr = this.$refs.tree.getCheckedNodes()
      dc_arr.forEach(item => {
        if (item.datacenter) {
          item.datacenter.forEach(tmp => {
            tmp.area_name = item.name
            tmp.area_uuid = item.uuid
          })
          this.datacenterList = this.datacenterList.concat(item.datacenter)
        }
      })
    },
    // 机房筛选
    handleDatacenterChange(val) {
      let list = val
      this.selectedDatacenterList = val
      this.hostpoolList = []
      if (list.length > 0) {
        list.forEach(item => {
          if (item.hostcluster) {
            item.hostcluster.forEach(tmp => {
              tmp.datacenterName = item.name
              tmp.dc_uuid = item.uuid
            })
            this.hostpoolList = this.hostpoolList.concat(item.hostcluster)
          }
        })
      }
    },
    // 筛选集群
    searchHostpool() {
      this.hostpoolList = []
      this.selectedDatacenterList.forEach(item => {
        if (item.uuid === this.hostpoolSearchText && item.hostcluster) {
          item.hostcluster.forEach(tmp => {
            tmp.datacenterName = item.name
          })
          this.hostpoolList = this.hostpoolList.concat(item.hostcluster)
        }
      })
    },
    // 选择集群
    handleHostpoolChange(val) {
      let list = val
      this.createInfo.hostcluster_uuid_list = []
      if (list.length <= 0) {
        return false
      } else {
        list.forEach(item => {
          this.createInfo.hostcluster_uuid_list.push(item.uuid)
        })
      }
    },
    // 加载区域选择树结构
    loadNode(node, resolve) {
      this.getAreaInfo().then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            msg: res.data.msg
          })
        } else {
          this.areaList = res.data.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.groupCreatePage {
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
  .adminGroupInfo {
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
  }
}
</style>