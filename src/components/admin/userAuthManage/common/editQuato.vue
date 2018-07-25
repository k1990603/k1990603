<template>
  <div class="editContent dialogTemplate">
    <el-dialog :title="editInfo.title" :visible.sync="getAuthEditQuatoDialog" width="650px" center>
      <div class="oldInfo">
        <!-- <h3>选择克隆的安全组信息</h3> -->
        <div class="itemInfo" v-for='(item,index) in editInfo.info' :key="index">
          <label>{{item.label}}</label>
          <span>{{item.value}}</span>
        </div>
        <div class="itemInfo">
          <label>配额</label>
          <span class="quatoInput">
            <el-input :value="editInfo.quatoList.vm">
              <el-button slot="prepend">VM</el-button>
              <el-button slot="append">个</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.safeGroup">
              <el-button slot="prepend">安全组数量</el-button>
              <el-button slot="append">个</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.lb">
              <el-button slot="prepend">负载均衡</el-button>
              <el-button slot="append">个</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.pubNetIp">
              <el-button slot="prepend">专有网络</el-button>
              <el-button slot="append">个</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.pubNet">
              <el-button slot="prepend">公网</el-button>
              <el-button slot="append">个</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.pubNetWidth">
              <el-button slot="prepend">公网带宽</el-button>
              <el-button slot="append">Mbps</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.cpu">
              <el-button slot="prepend">CPU</el-button>
              <el-button slot="append">核</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.mem">
              <el-button slot="prepend">MEM</el-button>
              <el-button slot="append">G</el-button>
            </el-input>
            <el-input :value="editInfo.quatoList.disk">
              <el-button slot="prepend">DISK</el-button>
              <el-button slot="append">G</el-button>
            </el-input>
          </span>
        </div>
      </div>
      <div class="tipText">
        确定执行
        <span>配额调整</span>
        操作？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setAuthEditQuatoDialog(false)">确 定</el-button>
        <el-button @click="setAuthEditQuatoDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['editInfo'],
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      getAuthEditQuatoDialog: 'getAuthEditQuatoDialog'
    })
  },
  methods: {
    ...mapActions({
      setAuthEditQuatoDialog: 'setAuthEditQuatoDialog'
    })
  }
}
</script>
<style lang="less">
.editContent {
  .tipText {
    padding: 15px 10px;
    vertical-align: middle;
    color: #264663;
    border: 1px solid #7ab1de;
    border-radius: 2px;
    background: #d2e7f7;
    margin-top: 15px;
    font-size: 16px;
    span {
      font-size: 18px;
      color: #f00;
    }
  }
  .oldInfo {
    & > h3 {
      margin-bottom: 15px;
    }
    .itemInfo {
      font-size: 16px;
      padding-left: 15px;
      padding-bottom: 15px;
      & > .quatoInput {
        display: inline-block;
        width: 300px;
        vertical-align: top;
        .el-button {
          width: 100px;
        }
      }
      & > label {
        width: 120px;
        display: inline-block;
      }
      & > span {
        color: #999;
      }
      & > .nameBox {
        display: inline-block;
      }
      &.textAreaBox {
        & > label {
          vertical-align: top;
        }
        .nameBox {
          width: 400px;
        }
      }
    }
  }
}
</style>
