<template>
  <div class="hostpoolCreate dialogTemplate">
    <el-dialog width="650px" v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" title="集群创建" :visible.sync="dialogShow" center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
        <el-form-item label="区域" prop="selectList" required>
          <el-cascader placeholder="请选择区域" @change="getSelVal" :options="areaChildList" v-model="ruleForm.selectList" filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="机房" prop="dc_uuid" required>
          <el-select v-model="ruleForm.dc_uuid" filterable placeholder="请选择机房名">
            <el-option v-for="item in dc_list" :key="item.value" :label="item.name" :value="item.uuid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集群名称" prop="name" required>
          <el-input type="text" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="HOST下限" prop="least_host_num" required>
          <el-input-number v-model="ruleForm.least_host_num" @change="handleChange" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="镜像缓存服务器" prop="imagecache" required>
          <el-input type="textarea" :rows="4" v-model="ruleForm.imagecache" placeholder="一行代表一个服务器地址,多个请换行输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="creatHost()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addHostpool, getDirectDc } from '@/api/admin/areaManage'
export default {
  props: ['hostpoolCreateVisible', 'areaChildList'],
  data() {
    return {
      loading: false,
      dc_list: [], // 指定区域的机房信息
      dialogShow: this.hostpoolCreateVisible,
      ruleForm: {
        selectList: [],
        dc_uuid: '',
        name: '',
        least_host_num: '',
        imagecache: ''
      },
      rules: {
        selectList: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
        dc_uuid: [{ required: true, message: '请选择机房', trigger: 'blur' }],
        name: [{ required: true, message: '请填写集群名称', trigger: 'blur' }],
        least_host_num: [
          { required: true, message: '请填写HOST下限', trigger: 'blur' }
        ],
        imagecache: [
          { required: true, message: '请填写镜像缓存服务器', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    hostpoolCreateVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:hostpoolCreateVisible', this.dialogShow) // 触发父组件修改
    }
  },
  methods: {
    getDirectDc,
    addHostpool,
    cancel() {
      this.ruleForm.selectList = []
      this.$refs.ruleForm.resetFields()
      this.dialogShow = false
      this.$emit('infRefresh')
    },
    handleChange() {
      console.log('change')
    },
    getSelVal(val) {
      this.ruleForm.dc_uuid = ''
      this.getDirectDc({
        area_uuid: val[val.length - 1]
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.dc_list = res.data.data
        }
      })
    },
    creatHost() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          let parent_uuid =
            this.ruleForm.selectList.length > 0
              ? this.ruleForm.selectList[this.ruleForm.selectList.length - 1]
              : '-1'
          let params = {
            dc_uuid: this.ruleForm.dc_uuid,
            name: this.ruleForm.name,
            least_host_num: this.ruleForm.least_host_num,
            imagecache: this.ruleForm.imagecache
          }
          this.addHostpool(params).then(res => {
            this.loading = false
            if (res.data.code == 0) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.cancel()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang=less>
</style>

