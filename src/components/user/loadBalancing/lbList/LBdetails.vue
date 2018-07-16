<template>
  <div class="userLbDetailsPage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      负载均衡({{info.name}})详情
    </div>
    <div class='detailsContent'>
      <el-card class="box-card">
        <div class="item-title">基本信息</div>
        <el-row :gutter="20">
          <el-col :span='14'>
            <div class="item">
              <span class='item-label'>名称</span>
              <span class='item-value'>{{info.name}}</span>
              <el-button type="text" icon="el-icon-edit-outline" @click='editName=true'></el-button>
            </div>
            <div class="item">
              <span class='item-label'>UUID</span>
              <span class='item-value'>{{info.uuid}}</span>
            </div>
            <div class="item">
              <span class='item-label'>创建时间</span>
              <span class='item-value'>{{info.created_at}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属集群</span>
              <span class='item-value'>{{info.hostcluster_name }}</span>
            </div>
          </el-col>
          <el-col :span='10'>
            <div class="item">
              <span class='item-label'>所有者</span>
              <span class='item-value'>{{info.owner}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属项目</span>
              <span class='item-value'>{{info.project_name}}</span>
            </div>
            <div class="item">
              <span class='item-label'>所属租户</span>
              <span class='item-value'>{{info.tenant_name}}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br>
      <el-card class="box-card">
        <div class="item-title">网络信息</div>
        <div class="item">
          <span class='item-label'>内网VIP</span>
          <span class='item-value'>{{info.vip }}</span>
        </div>
        <div class="item" v-if="info.network_type=='1'">
          <span class='item-label'>外网VIP</span>
          <span class='item-value'>{{internet_vip }}</span>
        </div>
        <div class="item">
          <span class='item-label'>所属子网</span>
          <span class='item-value'>{{info.subnetwork_name }}</span>
        </div>
        <div class="item">
          <span class='item-label'>网络类型</span>
          <span class='item-value'>{{info.network_type=='0'?'内网':'外网' }}</span>
        </div>
        <div class="item" v-if="info.network_type=='1'">
          <span class='item-label'>带宽</span>
          <span class='item-value'>{{info.internet_bandwidth}}Mbps</span>
        </div>
      </el-card>
    </div>
    <el-dialog title="修改负载均衡名称" class="dialogTemplate" :visible.sync="editName" width="450px" center>
      <el-form :model="nameForm" :rules="nameRules" ref="nameForm" label-width="100px">
        <el-form-item label="名称" prop="new_lb_name">
          <el-input v-model="nameForm.new_lb_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelName">取 消</el-button>
        <el-button type="primary" @click="submitName">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { changeName, lbDetails } from '@/api/admin/lb'
import { checkUserName } from '@/filters/index'

export default {
  data() {
    var checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入主机名'))
      } else if (!this.checkUserName(value)) {
        callback(new Error('字母开头大小写字母+数字6-20位!'))
      } else {
        callback()
      }
    }
    return {
      internet_vip: '',
      nameRules: {
        new_lb_name: [{ validator: checkUserName, trigger: 'blur' }]
      },
      nameForm: {
        new_lb_name: ''
      },
      editName: false,
      ruleForm: { sys_os: '' },
      rules: {
        sys_os: [
          {
            required: true,
            message: '请输入系统版本(例：6.6,7.2,2012...)',
            trigger: 'blur'
          }
        ]
      },
      editSysShow: false,
      info: {}
    }
  },
  mounted() {
    this.internet_vip = this.$route.query.internetIp
    this.getDetails()
  },
  methods: {
    changeName,
    lbDetails,
    checkUserName,
    submitName() {
      this.$refs['nameForm'].validate(valid => {
        if (valid) {
          this.changeName({
            loadbalance_uuid: this.info.uuid,
            new_lb_name: this.nameForm.new_lb_name
          }).then(res => {
            if (res.data.code == 0) {
              this.cancelName()
              this.$message.success('修改成功')
              this.getDetails()
            }
          })
        }
      })
    },
    cancelName() {
      this.$refs['nameForm'].resetFields()
      this.editName = false
    },
    getDetails() {
      this.lbDetails({
        loadbalance_uuid: this.$route.params.id
      }).then(res => {
        if (res.data.code == 0) {
          this.info = res.data.data
          this.nameForm.new_lb_name = this.info.name
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
.userLbDetailsPage {
  min-height: 500px;
  background: #fff;
  padding-bottom: 30px;
  & > .title {
    padding-left: 15px;
    height: 50px;
    line-height: 50px;
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
    margin: 20px;
    font-size: 15px;
    .box-card {
      .item-title {
        width: 90px;
        line-height: 36px;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #ccc;
        margin-bottom: 10px;
        text-align: center;
      }
      .item {
        padding: 10px 0;
        padding-left: 30px;
        .sysEdit {
          color: #128dff;
          font-size: 16px;
          cursor: pointer;
        }
        .item-label {
          display: inline-block;
          width: 100px;
          text-align: left;
        }
        .item-value {
          margin-left: 10px;
          color: #999;
        }
        .tableBox {
          padding-left: 100px;
        }
      }
    }
  }
}
</style>

