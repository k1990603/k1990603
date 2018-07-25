<template>
  <div class='diskScalePage'>
    <div class="title">
      <span class="el-icon-arrow-left" @click="goBack">返回</span>
      虚拟机({{vmInfo.displayname}}) 磁盘扩容
    </div>
    <div class="diskScale">
      <div class="oldInfo">
        <div class="itemInfo">
          <label>名称</label>
          <span>{{vmInfo.displayname}}</span>
        </div>
        <div class="itemInfo">
          <label>IP</label>
          <span>{{vmInfo.ip_address?vmInfo.ip_address:''}}</span>
        </div>
        <div class="itemInfo">
          <label>所属项目</label>
          <span>{{vmInfo.project_name}}</span>
        </div>
        <div class="itemInfo">
          <label>挂载点</label>
          <div class="mountPointTable">
            <el-table :data="diskInfo.mount_point_list" border v-loading="loading" element-loading-text="提交中,请耐心等待..." element-loading-spinner="el-icon-loading" width='860px'>
              <el-table-column prop="mount_point" label="挂载点" width="200px">
                <template slot-scope="scope">
                  <span v-if='!scope.row.edit'>{{scope.row.mount_point}}</span>
                  <div v-if='scope.row.edit'>
                    <el-form :model='scope.row' :ref="'_'+scope.$index" :rules='nameRules'>
                      <el-form-item prop='mount_point'>
                        <el-input size="mini" v-model.trim="scope.row.mount_point" placeholder="以'/'开头"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="default_size" label="磁盘大小(G)" width="150px">
                <template slot-scope="scope">
                  <span v-if='!scope.row.edit'>{{scope.row.default_size}}</span>
                  <div v-if='scope.row.edit'>
                    <el-form>
                      <el-form-item>
                        <el-input-number size="mini" controls-position="right" v-model.trim="scope.row.default_size" :min="50" :max="500" label="0-500的数值"></el-input-number>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mount_point_use" label="使用率" width="100px">
                <template slot-scope="scope">
                  <span v-if='!scope.row.edit'>{{scope.row.mount_point_use}}</span>
                  <el-form v-if='scope.row.edit'>
                    <el-form-item>
                      <span>{{scope.row.mount_point_use}}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="mount_point_size" label="磁盘扩容后大小(G)" min-width="200">
                <template slot-scope='scope' v-if='vmInfo.os_type=="linux"'>
                  <el-slider v-if='!scope.row.edit' :min='scope.row.default_size' :max='500' v-model="scope.row.mount_point_size" show-input>
                  </el-slider>
                  <el-form v-if='scope.row.edit'>
                    <el-form-item>
                      <el-slider :min='scope.row.default_size' :max='500' v-model="scope.row.mount_point_size" show-input>
                      </el-slider>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80px" fixed="right">
                <template slot-scope='scope'>
                  <el-form>
                    <el-form-item>
                      <el-button type="text" v-if='scope.row.edit' @click='deleteRow(scope.$index)'>删除</el-button>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="addOneRow">
        <el-button type="text" icon="el-icon-circle-plus-outline" @click='addRow'>新增</el-button>
      </div>
      <br>
      <div class='btn-footer'>
        <el-button type="primary" @click="submit" :disabled="loading">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getdiskScaleInfo, diskScale } from '@/api/admin/vm'
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入挂载点名称'))
      } else if (!this.checkMountName(value)) {
        callback(new Error('挂载点名称以/开头由字母组成'))
      } else {
        callback()
      }
    }
    return {
      nameRules: {
        mount_point: [{ validator: checkName, trigger: 'blur' }]
      },
      diskInfo: [],
      loading: false,
      vmInfo: {}
    }
  },
  mounted() {
    this.vmInfo = JSON.parse(this.$route.query.info)
    this.getList()
  },
  methods: {
    diskScale,
    getdiskScaleInfo,
    submit() {
      let deg = true
      this.diskInfo.mount_point_list.forEach((item, index) => {
        if (item.edit) {
          let _ref = '_' + index
          this.$refs[_ref].validate(res => {
            if (!res) {
              deg = false
            }
          })
        }
      })
      if (deg) {
        let options = []
        this.diskInfo.mount_point_list.forEach(item => {
          options.push({
            mount_partition_type: item.mount_partition_type,
            mount_point: item.mount_point,
            mount_partition_name: item.mount_partition_name,
            mount_extend_size: item.edit
              ? item.mount_point_size
              : item.mount_point_size - item.default_size
          })
        })
        this.loading = true
        this.diskScale({
          instance_uuid: this.$route.params.uuid,
          extend_list: JSON.stringify(options),
          qemu_ga_update: this.diskInfo.qemu_ga_update
        }).then(res => {
          this.loading = false
          if (res.data.code == 0) {
            this.$message({
              type: 'success',
              message: '磁盘扩容成功'
            })
          }
          this.getList()
        })
      }
    },
    cancel() {
      this.diskInfo = []
      this.$router.go(-1)
    },
    checkMountName(val) {
      if (val != '') {
        let str1 = val[0]
        let str2 = val.split('/')[1]
        if (str1 != '/') {
          return false
        } else {
          return new RegExp('[a-zA-Z]').test(str2)
        }
      } else {
        return false
      }
    },
    getList() {
      this.loading = true
      this.getdiskScaleInfo({ instance_uuid: this.$route.params.uuid }).then(
        res => {
          this.loading = false
          if (res.data.code == 0) {
            res.data.data.mount_point_list.forEach(item => {
              item.default_size = item.mount_point_size
            })
            this.diskInfo = res.data.data
          } else {
            this.diskInfo = []
          }
        }
      )
    },
    deleteRow(index) {
      this.diskInfo.mount_point_list.splice(index, 1)
    },
    addRow() {
      if (this.diskInfo.mount_point_list.length > 20) {
        this.$message({
          type: 'error',
          message: '最多只能增加20个挂载点'
        })
        return
      }
      this.diskInfo.mount_point_list.push({
        mount_partition_type: '',
        mount_point: '',
        default_size: 50,
        mount_point_size: 50,
        mount_point_use: '0%',
        edit: true,
        mount_partition_name: ''
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.diskScalePage {
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
  .diskScale {
    background: #fff;
    padding: 15px;
    .tipText {
      margin-top: 15px;
      font-size: 16px;
      span {
        font-size: 18px;
        color: #f00;
      }
    }
    .oldInfo {
      .itemInfo {
        font-size: 16px;
        padding: 15px 40px 0;
        & > label {
          width: 100px;
          display: inline-block;
        }
        & > span {
          color: #999;
        }
        .mountPointTable {
          min-height: 300px;
          padding-left: 100px;
        }
      }
    }
    .addOneRow {
      font-size: 14px;
      text-align: center;
    }
    .btn-footer {
      text-align: center;
      margin-bottom: 20px;
    }
  }
}
</style>

