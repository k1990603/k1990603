<template>
  <div>
    <div class="deleteContent " v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
      <div class="oldInfo">
        <el-table :data="rowInfos" border style="width: 100%">
          <el-table-column prop="name" label="名称" min-width="120">
          </el-table-column>
          <el-table-column prop="host_ip" label="HOST IP" min-width="120">
          </el-table-column>
          <el-table-column prop="hostcluster" label="所属集群">
          </el-table-column>
          <el-table-column prop="datacenter" label="所在机房">
          </el-table-column>
          <el-table-column prop="_status" label="状态">
          </el-table-column>
        </el-table>
      </div>
      <div v-if="title === '关机'" class="shutOff">
        强制关机&nbsp;&nbsp;
        <el-switch v-model="isForce" active-color="#13ce66" inactive-color="#ff4949" active-text="否" inactive-text="是">
        </el-switch>
      </div>
      <div class="tipText">
        确定执行
        <span>{{title}}</span>
        操作？
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('batchSomeRes')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { operateSome, deleteHost } from '@/api/admin/hostManage'
export default {
  props: ['rowInfos', 'title', 'id'],
  watch: {
    id(val) {
      this.loading = false
    }
  },
  data() {
    return {
      loading: false,
      isForce: true,
      flag: ''
    }
  },
  computed: {},
  methods: {
    operateSome,
    deleteHost,
    formart() {
      switch (this.$props.title) {
        case '开机':
          this.flag = 0
          break
        case '关机':
          !this.isForce && (this.flag = 1)
          this.isForce && (this.flag = 2)
          break
      }
    },
    submit() {
      this.loading = true
      let host_uuid = []
      this.rowInfos.forEach(element => {
        host_uuid.push(element.host_uuid)
      })
      if (this.$props.title == '删除') {
        this.deleteHost({ host_uuid: host_uuid.join(',') }).then(res => {
          this.loading = false
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: this.$props.title + '成功'
            })
            this.$emit('batchSomeRes')
          }
        })
      } else {
        this.formart()
        this.operateSome({
          host_uuid: host_uuid.join(','),
          flag: this.flag
        }).then(res => {
          this.loading = false
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: this.$props.title + '成功'
            })
            this.$emit('batchSomeRes')
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
.deleteContent {
  .tipText {
    margin-bottom: 15px;
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
  .shutOff {
    padding-top: 15px;
    font-size: 16px;
  }
  .oldInfo {
    & > h3 {
      margin-bottom: 15px;
    }
    .itemInfo {
      font-size: 16px;
      padding-left: 15px;
      padding-bottom: 15px;
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
