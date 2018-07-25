<template>
  <div>
    <div class="over_view">
      <div>
        <span class="user-name">欢迎，
          <!-- <span>{{userInfo.user_name}}</span> -->
        </span>
      </div>
      <!-- 平台概览 -->
      <div class="usedDetails boxLine">
        <p>平台概览</p>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan1" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>区域</dd>
                <dt>
                  <span>{{overview_dict.area_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">

            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan12" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>子区域</dd>
                <dt>
                  <span>{{overview_dict.sub_area_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>机房</dd>
                <dt>
                  <span>{{overview_dict.datacenter_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan4" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>集群</dd>
                <dt>
                  <span>{{overview_dict.hostcluster_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan5" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>host</dd>
                <dt>
                  <span>{{overview_dict.host_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan3" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>负载均衡</dd>
                <dt>
                  <span>{{overview_dict.loadbalance_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan22" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>专有网络</dd>
                <dt>
                  <span>{{overview_dict.network_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan7" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>VM</dd>
                <dt>
                  <span>{{overview_dict.vm_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <!-- <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan7" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>特殊服务VM</dd>
                <dt>
                  <span>{{overview_dict.vm_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col> -->
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan6" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>租户</dd>
                <dt>
                  <span>{{overview_dict.tenant_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan9" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>项目</dd>
                <dt>
                  <span>{{overview_dict.project_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="detailItem">
              <span class="detailIcon">
                <i class="iconfont icon-ziyuan11" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>用户</dd>
                <dt>
                  <span>{{overview_dict.user_nums}}</span>个
                </dt>
              </dl>
            </div>
          </el-col>
          <!-- <el-col :span="6" v-for="(item,index) in span" :key="index">
            <div class="detailItem">
              <span class="detailIcon">
                <i v-bind:class="item" aria-hidden="true"></i>
              </span>
              <dl>
                <dd>test</dd>
                <dt>
                  <span></span>个
                </dt>
              </dl>
            </div>
          </el-col> -->
        </el-row>
      </div>
      <!-- 资源使用情况 -->
      <div class="sourceUsePre boxLine">
        <div class="soureceTitle">
          <div class="block">
            <span class="demonstration">资源使用情况</span>
            <!--<el-cascader placeholder="试试搜索" :options="soureceOptions" filterable change-on-select></el-cascader>-->
            <el-select style='width:400px;' v-model="resource_usage_data" filterable placeholder="请选择" @change="resourceList()">
              <el-option v-for="(item,index) in resourceData" :key="index" :label="item.name" :value="item.uuid">
              </el-option>
            </el-select>
            <span class='tip'>搜索备注：
              <span>直属区域</span>-
              <span>机房</span>-
              <span>集群</span>
            </span>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item,index) in myChart.charData" :key="index">
            <div :id="item.id" style="height: 300px" class=""></div>
            <p class="center">{{item.name}}</p>
          </el-col>
        </el-row>
      </div>
      <!-- 机房分布 -->
      <div class="datacenterMapDeatail boxLine">
        <div class="datacenterMap-title" style="margin-left:15px;margin-right: 45px">
          <!--<span class="label label-info pull-right">CNSZ17</span>-->
          <h5>全国机房分布</h5>
        </div>
        <div class="datacenterMap-content">
          <div id="datacenterMap" style="height:600px;width:100%;"></div>
        </div>
      </div>
    </div>
  </div>

</template>
<style lang="less">
</style>
<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
import 'echarts/map/js/china'
// import chinaJson from '../../data/china.json'
import { getAdminIndex } from './../../api/index/index'
import { filterHostPoolPageData } from './../../api/admin/areaManage'
import { getAllAreaDcHcNet } from '@/api/admin/netWork'
export default {
  data() {
    return {
      // span:["iconfont icon-ziyuan1","iconfont icon-ziyuan2","iconfont icon-ziyuan3","iconfont icon-ziyuan4","iconfont icon-ziyuan5","iconfont icon-ziyuan6","iconfont icon-ziyuan7","iconfont icon-ziyuan8","iconfont icon-ziyuan9","iconfont icon-ziyuan10","iconfont icon-ziyuan11","iconfont icon-ziyuan12","iconfont icon-ziyuan13","iconfont icon-ziyuan14","iconfont icon-ziyuan15","iconfont icon-ziyuan16","iconfont icon-ziyuan17","iconfont icon-ziyuan18","iconfont icon-ziyuan19","iconfont icon-ziyuan20","iconfont icon-ziyuan21",
      // "iconfont icon-ziyuan22","iconfont icon-ziyuan23","iconfont icon-ziyuan24","iconfont icon-ziyuan25","iconfont icon-ziyuan26","iconfont icon-ziyuan27","iconfont icon-ziyuan28","iconfont icon-ziyuan29","iconfont icon-ziyuan30","iconfont icon-ziyuan31","iconfont icon-ziyuan32","iconfont icon-ziyuan33","iconfont icon-ziyuan34"],
      resource_usage_data: '', //资源使用选取集群
      overview_dict: {
        area_nums: 0,
        datacenter_nums: 0,
        host_nums: 0,
        hostcluster_nums: 0,
        loadbalance_nums: 0,
        network_nums: 0,
        project_nums: 0,
        sub_area_nums: 0,
        tenant_nums: 0,
        user_nums: 0,
        vm_nums: 0
      },
      // chinaJson,
      myChart: {
        vmBar: '',
        cpuBar: '',
        memBar: '',
        charData: [
          { id: 'vmBar', name: 'VM状态(个)' },
          { id: 'cpuBar', name: 'VCPU(核)' },
          { id: 'memBar', name: 'MEM(Mb)' }
        ]
      },
      datacenterMap: '',
      resourceData: [], //选取条件数据select
      totalEcharts: [],
      mapOption: {
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          //映射
          type: 'piecewise',
          splitNumber: '3',
          align: 'bottom',
          orient: 'horizontal',
          itemSymbol: 'arrow',
          left: '40%',
          // min: 0,
          // max: 2,
          pieces: [
            { value: 0, label: '正常' },
            { value: 1, label: '主机异常' },
            { min: 2, label: '严重异常' }
          ],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgb(19,185,61)', 'rgb(247,245,23)', 'rgb(255,8,6)']
          }
        },
        series: [
          {
            // name: '',
            type: 'map',
            mapType: 'china', // 自定义扩展图表类型
            roam: true,
            scaleLimit: {
              max: 6,
              min: 0.5
            },
            itemStyle: {
              normal: { label: { show: false } },
              emphasis: { label: { show: false } }
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    $route(val) {
      this.getAdminOverviewData()
    }
  },
  mounted() {
    this.myChart.vmBar = echarts.init(document.getElementById('vmBar'))
    this.myChart.cpuBar = echarts.init(document.getElementById('cpuBar'))
    this.myChart.memBar = echarts.init(document.getElementById('memBar'))
    this.datacenterMap = echarts.init(document.getElementById('datacenterMap'))
    this.getAdminOverviewData()
  },
  computed: {
    // ...mapGetters({
    //   userInfo: 'getUserInfo'
    // })
  },
  methods: {
    getAllAreaDcHcNet,
    getAdminIndex,
    filterHostPoolPageData,
    getAdminOverviewData() {
      this.getAdminIndex()
        .then(response => {
          if (response.data.code == 0) {
            this.totalEcharts = response.data.data.resource_usage_data
            this.overview_dict = response.data.data.overview_dict
            for (let item in this.overview_dict) {
              if (!this.overview_dict[item]) {
                this.overview_dict[item] = 0
              }
            }
            for (let item in this.overview_dict) {
              if (!this.overview_dict[item]) {
                this.overview_dict[item]
              }
            }
            for (
              let i = 0, map = response.data.data.global_map_data;
              i < map.length;
              i++
            ) {
              this.mapOption.series[0].data.push({
                name: map[i].name,
                value: [
                  map[i].datacenter_num,
                  map[i].host_num,
                  map[i].vm_num,
                  map[i].loadbalance_num,
                  map[i].abnormal_num
                ]
              })
            }
            // this.mapOption.series[0].data.push({
            //   name: '南海诸岛',
            //   itemStyle: {
            //     normal: {
            //       opacity: 0,
            //       label: { show: false },
            //       borderWidth: '0',
            //       borderColor: '#10242b',
            //       areaStyle: { color: '#10242b' }
            //     },
            //     emphasis: { opacity: 0, label: { show: false } }
            //   }
            // })
            this.mapOption.tooltip.formatter = n => {
              if (n.data) {
                if (n.data.value) {
                  return (
                    '全称 : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    n.name +
                    '' +
                    '<br/>' +
                    '机房数量 : ' +
                    n.data.value[0] +
                    '<br/>' +
                    '主机数量 : ' +
                    n.data.value[1] +
                    '<br/>' +
                    'VM数量 : &nbsp;&nbsp;' +
                    n.data.value[2] +
                    '<br/>' +
                    '负载均衡数量 : ' +
                    n.data.value[3]
                  )
                }
              }
            }
            this.getFilterHostPoolPageData()
            this.drawMap()
          }
        })
        .catch(error => {})
    },
    resourceList() {
      for (let i = 0; i < this.totalEcharts.length; i++) {
        if (
          this.totalEcharts[i].host_cluster_uuid == this.resource_usage_data
        ) {
          this.showEcharts(this.totalEcharts[i])
        }
      }
    },
    showEcharts(n) {
      let res = [
        ['运行中', '关机', '其他'],
        ['使用', '未使用'],
        ['使用', '未使用']
      ]
      this.drawBar(this.myChart.vmBar, res[0], [
        n.vm_running_nums,
        n.vm_poweroff_nums,
        n.vm_other_state_nums
      ])
      this.drawBar(this.myChart.cpuBar, res[1], [
        n.vm_cpu_core_used,
        n.vm_cpu_core_unused
      ])
      this.drawBar(this.myChart.memBar, res[2], [
        n.vm_mem_used_gb,
        n.vm_mem_unused_gb
      ])
    },
    handleAllAreaInfo() {},
    getFilterHostPoolPageData() {
      this.resourceData = []
      this.totalEcharts.forEach(item => {
        this.resourceData.push({
          name: `${item.area_name}-${item.datacenter_name}-${
            item.host_cluster_name
          }`,
          uuid: item.host_cluster_uuid
        })
      })
      this.resource_usage_data = this.resourceData[0].uuid
      this.resourceList()
    },
    drawMap() {
      //渲染地图
      this.datacenterMap.setOption(this.mapOption)
      window.addEventListener('resize', () => {
        this.datacenterMap.resize()
      })
    },
    drawBar: function(myChart, dataX, dataY) {
      let option = {
        grid: {
          left: '50px',
          // right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: dataX
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            data: dataY,
            type: 'bar',
            barWidth: 60,
            // barMaxWidth:60
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = ['#409eff', '#e6a23c', '#f56c6c']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option, true)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  },
  components: {}
}
</script>
<style lang="less">
.center {
  text-align: center;
  margin: 10px auto;
}

.over_view {
  padding: 20px;
  .boxLine {
    margin-top: 20px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 0 15px 10px;
  }
  .tip {
    display: inline-block;
    padding-left: 15px;
    vertical-align: bottom;
    color: #909399;
    font-size: 13px;
    & > span:nth-child(1) {
      color: #f56c6c;
    }
    & > span:nth-child(2) {
      color: #a7ab1f;
    }
    & > span:nth-child(3) {
      color: #66b1ff;
    }
  }
  .datacenterMap-content {
    margin: 0 45px 0 15px;
    padding-bottom: 25px;
  }
  h5 {
    font-size: 14px;
    font-weight: 700;
    line-height: 50px;
  }
  .usedDetails {
    & > p {
      padding: 7px 5px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      font-weight: 700;
      color: #000;
    }
    .detailItem {
      background: #f2f2f2;
      height: 70px;
      margin: 10px 5px;
      cursor: pointer;
      padding: 20px 20px 0;
      .detailIcon {
        display: inline-block;
        width: 80px;
        height: 50px;
        font-size: 20px;
        color: #409eff;
        line-height: 50px;
        text-align: center;
        border-right: 2px solid #ddd;
        margin-right: 10px;
      }
      dl {
        display: inline-block;
        vertical-align: middle;
        dd {
          margin-bottom: 6px;
        }
        dt {
          line-height: 1.1;
          span {
            font-weight: 600;
            font-size: 16px;
            padding-right: 5px;
          }
        }
      }
    }
  }
  .sourceUsePre {
    .soureceTitle {
      padding-top: 15px;
      .demonstration {
        padding-right: 10px;
      }
    }
  }
}
.iconfont {
  font-size: 24px;
}
</style>
