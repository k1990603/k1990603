<template>
  <div class="allotProjectContent dialogTemplate">
    <div class="oldInfo">
      <div class="itemInfo">
        <label>工号</label>
        <span>{{rowInfo.user_id}}</span>
      </div>
      <div class="itemInfo">
        <label>工号</label>
        <span>{{rowInfo.user_name}}</span>
      </div>
    </div>
    <el-table :data="groupList" height="300" ref="multipleTable" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="group_name" label="组名称">
      </el-table-column>
      <el-table-column prop="group_owner_name" label="所有者">
      </el-table-column>
    </el-table>
    <br>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="$emit('allotInfoRes')">取 消</el-button>
    </span>
  </div>
</template>
<script>
import { getAviableGroup, allotGroup } from '@/api/admin/adminGroupManage'
export default {
  props: ['rowInfo'],
  data() {
    return {
      selectedGroup: '',
      multipleSelection: [],
      groupList: []
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    getAviableGroup,
    allotGroup,
    getGroupList() {
      this.getAviableGroup().then(res => {
        if (res.data.code != 0) {
          this.groupList = []
        } else {
          this.groupList = res.data.data
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    submit() {
      let group_ids = []
      this.multipleSelection.forEach(item => {
        group_ids.push(item.group_id)
      })
      this.allotGroup({
        group_ids: JSON.stringify(group_ids),
        id_for_user: this.rowInfo.id_for_user
      }).then(res => {
        if (res.data.code != 0) {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: '分配管理组成功'
          })
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          this.$emit('allotInfoRes')
        }
      })
    }
  }
}
</script>
<style lang="less">
.allotProjectContent {
  .oldInfo {
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
