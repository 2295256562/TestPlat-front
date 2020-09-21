/* eslint-disable vue/require-default-prop */
<!-- 组件说明 -->
<template>
  <a-modal
    :visible.sync="modalVisible"
    :title="title"
    width="60%"
    @cancel="handleCancel"
  >
    <div class="ShowDw">
      <div class="show-left">
        <a-icon id="icon-hover" type="left-circle" style="font-size:24px"/>
      </div>
      <div style="float: left; width: 90%;">
        <div>
          <span class="Precondition">用例标题</span>
          <a-input id="inputDiss" placeholder="未命名标题" style="margin-top:10px;font-size:16px" v-model="name"></a-input>
        </div>
        <div class="css-unfu59-ToolWrapper">
          <div style="float: left">
            <a-icon type="folder" style="font-size:20px; line-height:32px"/>
            <a-select
              show-search
              placeholder="请选择分组"
              option-filter-prop="children"
              style="width: 160px; margin-left: 10px"
              :filter-option="filterOption"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="handleChange"
            >
              <a-select-option value="jack">
                Jack
              </a-select-option>
            </a-select>

            <span class="mag">等级</span>
            <a-select id="select" class="mag" default-value="3" style="width: 100px" @change="handleChangeLevel">
              <a-select-option value="1">
                <div class="css-1r39inl-PriorityWrapper">
                  <div class="css-1ok1vvp-PriorityIcon"></div>
                  <span>P0</span>
                </div>
              </a-select-option>

              <a-select-option value="2">
                <div class="css-1r39inl-PriorityWrapper">
                  <div class="css-1lg18e4-PriorityIcon"></div>
                  <span>P1</span>
                </div>
              </a-select-option>
              <a-select-option value="3">
                <div class="css-1r39inl-PriorityWrapper">
                  <div class="css-74z9al-PriorityIcon"></div>
                  <span>P2</span>
                </div>
              </a-select-option>
              <a-select-option value="4">
                <div class="css-1r39inl-PriorityWrapper">
                  <div class="css-i579lm-PriorityIcon"></div>
                  <span>P3</span>
                </div>
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 前置条件 -->
        <div class="mag-t">
          <span class="Precondition">前置条件</span>
          <a-textarea id="inputDiss" :auto-size="{ minRows: 1, maxRows: 10 }" placeholder="点击此处添加前置条件（可选）" style="margin-top:10px;" v-model="precondition">
          </a-textarea>
        </div>

        <!-- 用例描述 -->
        <div class="mag-t">
          <span class="Precondition">{{ despType }}</span>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更改类型 <a-icon type="down" />
            </a>
            <div slot="overlay" class="css-mnouyc-OperationPanel">
              <div class="css-1crgxt-OperationItem" v-for="item in this.desp" :key="item.type" @click="handleChangeType(item)">
                <div>
                  <span style="color: rgb(32, 45, 64);font-weight: bold; ">{{ item.type }}</span>
                  <div style="margin-top: 10px">{{ item.value }}</div>
                </div>
              </div>
            </div>
          </a-dropdown>
        </div>

        <!-- 文本描述 -->
        <div v-if="this.despType === '文本描述'">
          <a-textarea
            id="inputDiss"
            :auto-size="{ minRows: 1, maxRows: 10 }"
            placeholder="点击此处输入用例描述"
            style="margin-top:10px;"
            v-model="caseDesc">
          </a-textarea>
          <!-- 预期结果 -->
          <div class="mag-t">
            <span class="Precondition">预期结果</span>
            <a-textarea id="inputDiss" :auto-size="{ minRows: 1, maxRows: 10 }" placeholder="点击此处添加前置条件（可选）" style="margin-top:10px;" v-model="eResult">
            </a-textarea>
          </div>
        </div>
        <!-- 步骤描述 -->
        <div v-else>
          <el-table
            :data="tableData"
          >
            <el-table-column type="index" label="#" width="50">
            </el-table-column>
            <el-table-column
              prop="step"
              label="步骤">
              <template slot-scope="scope">
                <a-input v-model="scope.row.step" placeholder="输入步骤" @click="handleAddTableList(scope.$index)"></a-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="step"
              label="预期">
              <template slot-scope="scope">
                <a-input v-model="scope.row.expected" placeholder="输入预期"></a-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" style="padding:0" :disabled="scope.$index == 0" @click="moveUpward(scope.row, scope.$index)">上移</el-button>
                <el-button type="text" style="padding:0" :disabled="(scope.$index + 1) == tableData.length" @click="moveDown(scope.row, scope.$index)">下移</el-button>
                <el-button type="text" style="padding:0" @click="handleCopy(scope.row, scope.$index)">复制</el-button>
                <el-button type="text" style="padding:0" :disabled="scope.$index == 0" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <!-- 附件 -->
        <div class="mag-t">
          <span class="Precondition">附件</span>
        </div>
      </div>
      <div class="show-left">
        <a-icon id="icon-hover" type="right-circle" style="font-size:24px; padding-left:24px"/>
      </div>
    </div>

    <div slot="footer">
      <a-button type="primary" @click="handleOk">保存</a-button>
      <a-button type="primary" @click="handleOkNext">保存并下一个</a-button>
      <a-button type="primary" @click="handleCancel">关闭</a-button>
    </div>
  </a-modal>
</template>

<script>
const desp = [
  { type: '文本描述', value: '适用于简单的测试场景，没有明确测试步骤。' },
  { type: '步骤描述', value: '适用于需要每一个步骤进行测试的场景，有明确的测试步骤、预期结果。' }
]
export default {
  props: {
    modalVisible: Boolean,
    title: String
  },
  data () {
    return {
      desp,
      name: '',
      precondition: '',
      despType: '文本描述',
      caseDesc: '',
      eResult: '',
      tableData: [{ index: 1, step: '', expected: '' }]
    }
  },
  methods: {
    // 确认按钮
    handleOk () {},
    // 取消按钮
    handleCancel (e) {
      this.$emit('changeVisible', false)
    },
    // 保存并下一个
    handleOkNext () {
      Object.assign(this.$data, this.$options.data())
    },

    // 项目change事件
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },

    // 等级change
    handleChangeLevel () {},
    // 类型change
    handleChangeType (item) {
      this.despType = item.type
    },

    // 表格push数据
    handleAddTableList (index) {
      if ((index + 1) === this.tableData.length) {
        this.tableData.push({ step: '', expected: '' })
      }
    },

    // 表格上移操作
    moveUpward (row, index) {
      if (index > 0) {
        const upData = this.tableData[index - 1]
        this.tableData.splice(index - 1, 1)
        this.tableData.splice(index, 0, upData)
      } else {
        this.$message({
          message: '已经是第一条，上移失败',
          type: 'warning'
        })
      }
    },

    // 表格下移操作
    moveDown (row, index) {
      if ((index + 1) === this.tableData.length) {
          this.$message({
              message: '已经是最后一条，下移失败',
              type: 'warning'
          })
      } else {
          const downData = this.tableData[index + 1]
          this.tableData.splice(index + 1, 1)
          this.tableData.splice(index, 0, downData)
      }
    },

    // 表格复制
    handleCopy (row, index) {
      this.tableData.splice(index, 0, row)
    },

    // 表格删除
    handleDelete (row, index) {
      this.tableData.splice(index, 1)
      if (this.tableData.length === 0) {
        this.tableData.push({ step: '', expected: '' })
      }
    }
  }
}
</script>
<style>
.css-yaguj6-HeaderWrapper {
  flex-shrink: 0;
    border-bottom: 1px solid rgba(216, 221, 228, 0.5);
    /* padding: 12px 20px 8px 24px; */
    position: sticky;
    top: 0px;
    z-index: 100;
    background: rgb(255, 255, 255);
}
.css-unfu59-ToolWrapper {
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  margin-top: 10px
}
#inputDiss {
  border-width: 0;
}
#select{border: none;outline: none;}

.mag {
  margin-left: 10px;
}
.ShowDw {
  display: flex;
  width: 100%;
  align-items: center;
}
.show-left {
  width: 60px;
}
#icon-hover:hover {
  font-size: 40px !important;
  color: aquamarine;
}

.css-1r39inl-PriorityWrapper {
    flex-shrink: 0;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    font-size: 13px;
    line-height: 16px;
    color: rgb(32, 45, 64);
}
.css-1ok1vvp-PriorityIcon {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  background: rgba(236, 57, 62, 0.1);
  border: 2px solid rgb(236, 57, 62);
  border-radius: 50%;
  box-sizing: border-box;
  margin-right: 8px;
}
.css-1lg18e4-PriorityIcon {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    background: rgba(255, 149, 0, 0.1);
    border: 2px solid rgb(255, 149, 0);
    border-radius: 50%;
    box-sizing: border-box;
    margin-right: 8px;
}
.css-74z9al-PriorityIcon {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    background: rgba(50, 116, 250, 0.1);
    border: 2px solid rgb(50, 116, 250);
    border-radius: 50%;
    box-sizing: border-box;
    margin-right: 8px;
}
.css-i579lm-PriorityIcon {
    flex-shrink: 0;
    width: 12px;
    height: 12px;
    background: rgba(161, 172, 191, 0.1);
    border: 2px solid rgb(161, 172, 191);
    border-radius: 50%;
    box-sizing: border-box;
    margin-right: 8px;
}
.mag-t {
 margin-top: 20px;
}
.Precondition {
    /* font-size: 14px; */
    line-height: 16px;
    color: rgb(32, 45, 64);
    margin-top: 24px;
    margin-bottom: 7px;
    position: relative;
    font-weight: bold;
}
.css-1crgxt-OperationItem {
    padding: 16px;
    font-size: 14px;
    line-height: 16px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease 0s;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
}
.css-7f7soz-OperationItemContent {
    font-size: 12px;
    line-height: 18px;
    margin-top: 8px;
    color: rgb(168, 168, 168);
    font-weight: normal;
}
.css-mnouyc-OperationPanel {
    overflow: hidden;
    width: 224px;
    padding: 4px 0px;
    position: absolute;
    background: rgb(255, 255, 255);
    left: -16px;
    top: 22px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 6px 0px, rgba(20, 20, 21, 0.1) 0px 8px 28px -3px;
    border-radius: 3px;
    z-index: 20;
}
.css-1crgxt-OperationItem:hover{
  background-color: #e6f7ff;
}
</style>
