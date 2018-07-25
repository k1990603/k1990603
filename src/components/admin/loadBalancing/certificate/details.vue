<template>
  <div class="certificateDetailsPage">
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      证书({{info.name}})详情
    </div>
    <div class='detailsContent'>
      <el-card class="box-card">
        <!-- <div class="item-title">基本信息</div> -->
        <div class="item">
          <span class='item-label'>名称</span>
          <span class='item-value'>{{info.name}}</span>
          <!-- <el-button type="text" icon="el-icon-edit-outline" @click='editName=true'></el-button> -->
        </div>
        <div class="item">
          <span class='item-label'>证书用途</span>
          <span class='item-value'>{{info.available_tenant==0?'公用':'租户专用' }}</span>
        </div>
        <div class="item">
          <span class='item-label'>证书类型</span>
          <span class='item-value'>{{info.type==0?'客户端证书':'服务器证书'}}</span>
        </div>
        <div class="item" v-if='info.available_tenant==1'>
          <span class='item-label'>所属租户</span>
          <span class='item-value'>{{info.tenant_name }}</span>
        </div>
        <div class="item">
          <span class='item-label'>证书MD5</span>
          <span class='item-value'>{{info.contain_md5}}</span>
        </div>
        <div class="item">
          <span class='item-label'>证书内容</span>
          <span class='item-value'>{{info.contain}}</span>
        </div>
        <div class="item">
          <span class='item-label'>密钥内容</span>
          <span class='item-value'>{{info.private_key}}</span>
        </div>
        <div class="item">
          <span class='item-label'>创建时间</span>
          <span class='item-value'>{{info.created_at}}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getCertificateList } from '@/api/admin/lb'

export default {
  data() {
    return {
      info: {}
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getCertificateList,
    getDetails() {
      this.getCertificateList({
        page_size: 100000,
        page_no: 1,
        user_role: 0,
        search: JSON.stringify({ certificate_name: this.$route.query.name })
      }).then(res => {
        if (res.data.code == 0) {
          console.log(res.data.data)
          this.info = res.data.data.rows[0]
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
.certificateDetailsPage {
  // min-height: 500px;
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

