<template>
  <div class="ipDetails">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      {{curIpNet}}公网网段详情
    </div>
    <div class="detailsContent">
      <el-row>
        <el-col :xs="24">
          <div class="ipDetailBtn">
            <el-button-group>
              <el-button size="small" @click="showDialog(1)">初始化</el-button>
              <el-button size="small" @click="showDialog(2)">取消初始化</el-button>
              <el-button size="small" @click="showDialog(3)">保留</el-button>
              <el-button size="small" @click="showDialog(4)">取消保留</el-button>
              <el-button size="small" @click="giveProjectIp">授权项目</el-button>
            </el-button-group>
            <el-select v-model="initSegement" @change='getList' filterable placeholder="请选择网段" size="small">
              <el-option v-for="(item,index) in segements" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :xs="24">
          <div class="actionColor">
            <span class="item">
              未初始化
            </span>
            <span class="item">
              已初始化
            </span>
            <span class="item">
              已保留
            </span>
            <span class="item">
              已使用
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="ipBox" v-loading="loading">
            <el-button v-for="(item,index) in ipArr" :key="index" :type="item.status?formateIpStatus(item.status):''" @click="singleOperate(item)">
              {{item.ip_address}}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog class='dialogTemplate' width="500px" :title="dialogTitle" :visible.sync="ipNetStatu.batch" center>
      <ipOperateDialog @operaRes='operaRes' :dialogTitle='dialogTitle' :initSegement='initSegement'></ipOperateDialog>
    </el-dialog>
    <el-dialog class='dialogTemplate' width="650px" title="单个IP操作" :visible.sync="ipNetStatu.single" center>
      <singleIp @singelRes='singelRes' :ipInfo='ipInfo' :initSegement='initSegement'></singleIp>
    </el-dialog>

    <el-dialog class='dialogTemplate' width="500px" title="授权项目" :visible.sync="ipNetStatu.distribution" center>
      <projectIpDialog @distributionRes='distributionRes' :ipArr='ipArr' :initSegement='initSegement'></projectIpDialog>
    </el-dialog>
  </div>
</template>
<script>
import ipOperateDialog from './ipOperateDialog.vue'
import projectIpDialog from './giveIp.vue'
import singleIp from './singleIp.vue'
import { getipNetDetails } from '@/api/admin/netWork'
import { formateIpStatus } from '@/filters/index.js'
export default {
  data() {
    return {
      curIpNet: '', //所属公网网段
      loading: false,
      dialogTitle: '',
      initSegement: '', // 所在网段
      ipInfo: '', // 单个IP信息
      ipNetStatu: {
        batch: false,
        single: false,
        distribution: false
      },
      ipArr: [], // ip集合
      segements: []
    }
  },
  mounted() {
    this.curIpNet = JSON.parse(
      this.$route.query.ipNetInfo
    ).internet_segment_cidr
    this.getList()
  },
  methods: {
    formateIpStatus,
    getipNetDetails,
    getCurNetIp() {},
    getList() {
      this.loading = true
      this.getipNetDetails({
        internet_network_segment_uuid: this.$route.params.uuid,
        network: this.initSegement
      }).then(res => {
        if (res.data.code == 0) {
          this.loading = false
          this.segements = res.data.data.network_list
          this.ipArr = res.data.data.ip_data
          if (this.initSegement == '') {
            this.initSegement = this.segements[0]
          }
        }
      })
    },
    distributionRes() {
      this.ipNetStatu.distribution = false
      this.getList()
    },
    singelRes() {
      this.ipNetStatu.single = false
      this.getList()
    },
    singleOperate(item) {
      this.ipInfo = item
      this.ipNetStatu.single = true
    },
    operaRes() {
      this.ipNetStatu.batch = false
      this.getList()
    },
    giveProjectIp() {
      this.ipNetStatu.distribution = true
    },
    goBack() {
      this.$router.go(-1)
    },
    showDialog(type) {
      switch (type) {
        case 1:
          this.dialogTitle = '初始化IP'
          break
        case 2:
          this.dialogTitle = '取消初始化IP'
          break
        case 3:
          this.dialogTitle = '保留IP'
          break
        case 4:
          this.dialogTitle = '取消保留IP'
          break
      }
      this.ipNetStatu.batch = true
    }
  },
  components: {
    singleIp,
    ipOperateDialog,
    projectIpDialog
  }
}
</script>
<style lang=less>
.ipDetails {
  background: #f6f6f6;
  .title {
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
  .detailsContent {
    padding-top: 20px;
    padding-left: 15px;
    .ipDetailBtn {
      .el-button-group {
        .el-button:nth-child(1) {
          background-color: #23c6c8;
          border-color: #23c6c8;
          color: #ffffff;
        }
      }
      .el-input {
        width: 140px !important;
      }
    }
    .ipBox {
      padding-top: 10px;
      min-height: 400px;
      .el-button {
        width: 135px;
        margin-bottom: 10px;
        margin-right: 10px;
        margin-left: 0;
      }
    }
    .actionColor {
      text-align: right;
      line-height: 32px;
      padding-right: 60px;
      .item {
        margin-right: 20px;
        position: relative;
        padding-left: 20px;
        &::before {
          content: '';
          left: 0;
          top: 0;
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
        &:nth-child(1)::before {
          background: rgb(255, 255, 255);
          border: 1px solid rgb(235, 235, 255);
        }
        &:nth-child(2)::before {
          background: #409eff;
          border: 1px solid #409eff;
        }
        &:nth-child(3)::before {
          background: #e6a23c;
          border: 1px solid #e6a23c;
        }
        &:nth-child(4)::before {
          background: #f56c6c;
          border: 1px solid #f56c6c;
        }
        &:nth-child(5)::before {
          background: #67c23a;
          border: 1px solid #67c23a;
        }
      }
    }
  }
}
</style>

