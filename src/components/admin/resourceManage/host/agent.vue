<template>
  <div class="agentPage" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="提交中,请耐心等待...">
    <div style="text-align:center;">
      <el-upload class="upload-demo" :headers="{'currentUserInfo':currentUserInfo}" ref='agentUp' :with-credentials='true' drag :action="url" multiple :onError="uploadError" :limit='1' :on-remove="handleRemove" :onSuccess="uploadSuccess" :beforeUpload="beforeAvatarUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传一个zip文件，且不超过20M</div>
      </el-upload>
    </div>
    <p class='tipWarn' v-if='isRes'>md5核对：
      <span>{{md5}}</span>
    </p>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit" :disabled="!isRes">确认更新</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { agengUpLoad, agengUpNew } from '@/api/admin/hostManage'
export default {
  prop: ['id'],
  data() {
    return {
      currentUserInfo: '',
      loading: false,
      url: '',
      md5: '',
      isRes: false,
      resData: {}
    }
  },
  watch: {
    id(val) {
      this.loading = false
      this.isRes = false
      this.$refs.agentUp.clearFiles()
    }
  },
  mounted() {
    if (this.userInfo) {
      if (
        this.userInfo.curRole == '系统管理员' ||
        this.userInfo.curRole == '一般管理员'
      ) {
        this.currentUserInfo = JSON.stringify({ tab: '2' })
      } else if (this.userInfo.curRole == '用户') {
        this.currentUserInfo = JSON.stringify({
          tab: '1',
          tenant_uuid: this.userInfo.tenantInfo.tenant_uuid
        })
      }
    }
    this.url = this.agengUpLoad()
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    agengUpLoad,
    agengUpNew,
    handleRemove(file, fileList) {
      this.isRes = false
      this.md5 = ''
      this.resData = {}
    },
    submit() {
      this.loading = true
      this.agengUpNew(JSON.stringify(this.resData)).then(res => {
        this.loading = false
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.cancel()
        }
      })
    },
    cancel() {
      this.isRes = false
      this.$refs.agentUp.clearFiles()
      this.$emit('agentUpgradeRes')
    },
    uploadError(response, file, fileList) {
      this.isRes = false
      this.$message({
        type: 'error',
        message: response.msg
      })
    },
    uploadSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.resData = response.data
        this.isRes = true
        this.md5 = response.data.package_md5
        this.$message({
          type: 'success',
          message: response.msg
        })
      } else {
        this.isRes = false
        this.$message({
          type: 'error',
          message: response.msg
        })
      }
    },
    beforeAvatarUpload(file) {
      const extension =
        file.name.split('.')[file.name.split('.').length - 1] === 'zip'
      const isLt2M = file.size < 20 * 1024 * 1024
      if (!extension) {
        this.$message({
          type: 'error',
          message: '上传代码包只能是zip格式'
        })
      }
      if (!isLt2M) {
        this.$message({
          type: 'error',
          message: '上传代码包大小不能超过 20MB!'
        })
      }
      return extension && isLt2M
    }
  }
}
</script>
<style lang="less">
.agentPage {
  .tipWarn {
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    background: #fafafa;
    font-size: 16px;
    span {
      color: #67c23a;
    }
  }
}
</style>
