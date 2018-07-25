<template>
  <div class="editAreaContent dialogTemplate">
    <el-dialog :title="editAreaInfo.title" :visible.sync="getAuthEditAreaDialog" width="650px" center>
      <div class="oldInfo">
        <div class="itemInfo" v-for='(item,index) in editAreaInfo.info' :key="index">
          <label>{{item.label}}</label>
          <span>{{item.value}}</span>
        </div>
        <div class="itemInfo">
          <label>区域</label>
          <span class="areaInput">
            <el-tree :data="data3" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]">
            </el-tree>
          </span>
        </div>
      </div>
      <div class="tipText">
        确定执行
        <span>区域调整</span>
        操作？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setAuthEditAreaDialog(false)">确 定</el-button>
        <el-button @click="setAuthEditAreaDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: ['editAreaInfo'],
  data() {
    return {
      data3: [
        {
          id: 1,
          label: '一级 2',
          children: [
            {
              id: 3,
              label: '二级 2-1',
              children: [
                {
                  id: 4,
                  label: '三级 3-1-1'
                },
                {
                  id: 5,
                  label: '三级 3-1-2',
                  disabled: true
                }
              ]
            },
            {
              id: 2,
              label: '二级 2-2',
              disabled: true,
              children: [
                {
                  id: 6,
                  label: '三级 3-2-1'
                },
                {
                  id: 7,
                  label: '三级 3-2-2',
                  disabled: true
                }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getAuthEditAreaDialog: 'getAuthEditAreaDialog'
    })
  },
  methods: {
    ...mapActions({
      setAuthEditAreaDialog: 'setAuthEditAreaDialog'
    })
  }
}
</script>
<style lang="less">
.editAreaContent {
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
      .areaInput {
        display: inline-block;
        width: 300px;
        vertical-align: top;
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
