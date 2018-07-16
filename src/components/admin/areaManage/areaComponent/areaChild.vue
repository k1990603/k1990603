<template>
  <div class="areachildPage dialogTemplate">
    <el-dialog title="子区域" :visible.sync="dialogShow" width="650px">
      <el-table :data="childList" style="width: 100%" stripe>
        <el-table-column prop="name" label="区域名称" min-width="150">
        </el-table-column>
        <el-table-column prop="child_area_num" label="子区域数量" min-width="120">
        </el-table-column>
        <el-table-column prop="child_dc_num" label="机房数量" min-width="120">
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <div class="btnBox" @click="deleteSubarea(scope.row,scope.index)">
              <span class="seeChild operateBtn">
                <img src="/static/svg/delete.svg" alt="">
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogShow = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from './../../../../state'
import { fetchListChild } from '@/api/admin/lesseeManage'
import { deleteSubareaData } from '@/api/admin/areaManage'
export default {
  props: ['areaChildCheckVisible', 'childList'],
  data() {
    return {
      dialogShow: this.areaChildCheckVisible,
      tableData: [
        {
          areaName: '北京区',
          childAreaNum: 2,
          datacenterNum: 3,
          manager: '安珂'
        },
        {
          areaName: '广东区',
          childAreaNum: 2,
          datacenterNum: 3,
          manager: '安珂'
        },
        {
          areaName: '上海区',
          childAreaNum: 2,
          datacenterNum: 3,
          manager: '安珂'
        },
        {
          areaName: '江西区',
          childAreaNum: 2,
          datacenterNum: 3,
          manager: '安珂'
        },
        {
          areaName: '河南区',
          childAreaNum: 2,
          datacenterNum: 3,
          manager: '安珂'
        }
      ],
      store
    }
  },
  watch: {
    areaChildCheckVisible(val, oldVal) {
      this.dialogShow = val
    },
    dialogShow() {
      this.$emit('update:areaChildCheckVisible', this.dialogShow) // 触发父组件修改
    }
  },
  mounted() {},
  methods: {
    deleteSubareaData,
    deleteSubarea(row,index) {
      let options = {
        "uuid": row.uuid,
      }
      this.$confirm(
        `此操作将移除${row.name}, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          this.deleteSubareaData(options).then(res => {
            if (res.data.code != 0) {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            } else {
              this.$emit('refreshAreaData')
              this.childList.splice(index,1)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less">
.areachildPage {
  .operateBtn {
    cursor: pointer;
    padding: 0 5px;
  }
  .paginationBox {
    margin-top: 15px;
    text-align: right;
  }
  .dialog-footer {
    display: block;
    text-align: center;
  }
}
</style>