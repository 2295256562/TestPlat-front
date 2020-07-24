<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div style="height: 240px;display:flex">
        <div style="float:left">
          <h1 style="font-family: Microsoft YaHei">接口测试报告</h1>
          <p class="attribute">
            <strong>测试人员 :</strong> {{ this.report.create_user }}
          </p>
          <p class="attribute">
            <strong>开始时间 :</strong> {{ this.report.start_time }}
          </p>
          <p class="attribute">
            <strong>结束时间 :</strong> {{ this.report.end_time }}
          </p>
          <p class="attribute">
            <strong>合计耗时 :</strong> {{ this.report.spendTimeInSec }}
          </p>
          <p class="attribute">
            <strong>测试结果 :</strong> 共 {{ this.report.case_count }}，错误 {{ this.report.case_error }}，通过率= {{ this.pass_rate }} %
          </p>
          <p id="show_detail_line">
            <a-tag color="LimeGreen">通过{{ case_pass }}</a-tag>
            <a-tag color="Crimson">失败{{ this.report.case_error }}</a-tag>
            <a-tag color="#ed9c28">错误{{ this.report.case_fail }}</a-tag>
            <a-tag color="#39b3d7">所有{{ this.report.case_count }}</a-tag>
          </p>
        </div>
        <div style="float: right" id="c1"></div>
      </div>
    </a-card>
    <a-card title="本次任务结果" class="card-p" :bordered="false" style="margin-top:20px;width:55%">
      <a-collapse :bordered="false">
        <a-collapse-panel :key="index" :header="item.case_name" v-for="(item, index) in this.reportDetailList" :style="item.case_stauts === 'pass' ? pass : error ">
          <!-- <div style="background-color: gainsboro"></div> -->
          <a-tabs default-active-key="1" style="background-color: 0">
            <a-tab-pane key="1" tab="执行情况">
              <p>用例接口：{{ item.case_url }}</p>
              <p>请求方式：<a-tag color="green">{{ item.case_method }}</a-tag></p>
              <p>请求方式：{{ JSON.parse(item.case_parameter) }}</p>
              <p>响应结果</p>
              <div class="st">{{ item.case_response }} </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="执行日志">
              <a-list size="large" bordered :data-source="item.case_log">
                <a-list-item slot="renderItem" slot-scope="item">
                  {{ item }}
                </a-list-item>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { Collapse } from 'ant-design-vue'
import { reportinfo, report } from '@/api/interface'

import Vue from 'vue'
Vue.use(Collapse)
export default {
  data () {
    return {
      number: 0,
      reportDetailList: [],
      report: [],
      data: [],
      pass: 'background-color: LimeGreen;',
      error: 'background-color: Crimson',
      case_pass: null,
      case_count: null,
      pass_rate: null
    }
  },
  watch: {
    activeKey (key) {
      console.log(key)
    }
  },

  created () {
    this.number = this.$route.query.number
    this.GetReportInfo()
  },
  methods: {
    // 获取报告基本信息及详情
    GetReportInfo () {
      report(this.number).then(res => {
        this.report = res.data
        this.case_pass = res.data.case_pass
        this.case_count = res.data.case_count
      })
      reportinfo(this.number).then(res => {
        console.log(res.data)
        this.reportDetailList = res.data
      })
    }
  },
  computed: {
    passRate: function () {
      // this.pass_rate = this.case_pass / this.case_count
      return this.pass_rate
    }
  }
}
</script>
<style>
.ant-collapse-content > .ant-collapse-content-box {
    padding: 16px;
    background-color: snow;
}
.st {
  overflow: hidden;
}
</style>
