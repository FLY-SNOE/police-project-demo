<template>
  <el-dialog
    v-model="visible"
    title="处警页面"
    width="75vw"
    :close-on-click-modal="false"
    destroy-on-close
    class="handle-dialog"
  >
    <el-tabs v-model="activeTab" tab-position="left" class="handle-tabs">
      <el-tab-pane label="处警管理" name="manage">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="140px"
          class="manage-form"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="接警类型" prop="alarmType">
                <el-select v-model="form.alarmType" placeholder="请选择接警类型" style="width: 100%">
                  <el-option label="刑事" value="刑事" />
                  <el-option label="行政" value="行政" />
                  <el-option label="民事" value="民事" />
                  <el-option label="交通" value="交通" />
                  <el-option label="纠纷" value="纠纷" />
                  <el-option label="求助" value="求助" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报警时间" prop="alarmTime">
                <el-date-picker
                  v-model="form.alarmTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出警时间" prop="dispatchTime">
                <el-date-picker
                  v-model="form.dispatchTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="出警民警" prop="policeOfficers">
                <el-select
                  v-model="form.policeOfficers"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="请选择出警民警（至少两位）"
                  style="width: 100%"
                >
                  <el-option label="王警官（朝阳派出所）" value="王警官" />
                  <el-option label="李警官（海淀派出所）" value="李警官" />
                  <el-option label="张警官（东城派出所）" value="张警官" />
                  <el-option label="刘警官（西城派出所）" value="刘警官" />
                  <el-option label="陈警官（丰台派出所）" value="陈警官" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发生原因" prop="cause">
                <el-select v-model="form.cause" placeholder="请选择发生原因" style="width: 100%">
                  <el-option label="打架斗殴" value="打架斗殴" />
                  <el-option label="盗窃" value="盗窃" />
                  <el-option label="诈骗" value="诈骗" />
                  <el-option label="交通事故" value="交通事故" />
                  <el-option label="噪音扰民" value="噪音扰民" />
                  <el-option label="家庭纠纷" value="家庭纠纷" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发生地点" prop="location">
                <el-input v-model="form.location" placeholder="请输入发生地点" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="所属辖区" prop="jurisdiction">
                <el-select v-model="form.jurisdiction" placeholder="请选择所属辖区" style="width: 100%">
                  <el-option label="东城区" value="东城区" />
                  <el-option label="西城区" value="西城区" />
                  <el-option label="朝阳区" value="朝阳区" />
                  <el-option label="海淀区" value="海淀区" />
                  <el-option label="丰台区" value="丰台区" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事发时间" prop="incidentTime">
                <el-date-picker
                  v-model="form.incidentTime"
                  type="datetime"
                  placeholder="选择事发时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处警单位" prop="unit">
                <el-input v-model="form.unit" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="简要警情及处理结果" prop="result">
                <el-input
                  v-model="form.result"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入简要警情及处理结果"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="涉警人员" name="person">
        <div class="dev-placeholder">
          <el-icon :size="48" color="#c0c4cc"><User /></el-icon>
          <p class="dev-text">涉警人员模块 · 待开发</p>
          <p class="dev-desc">Demo 演示项目，该功能暂未实现</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="涉警物品" name="item">
        <div class="dev-placeholder">
          <el-icon :size="48" color="#c0c4cc"><Box /></el-icon>
          <p class="dev-text">涉警物品模块 · 待开发</p>
          <p class="dev-desc">Demo 演示项目，该功能暂未实现</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="涉警单位" name="unit">
        <div class="dev-placeholder">
          <el-icon :size="48" color="#c0c4cc"><OfficeBuilding /></el-icon>
          <p class="dev-text">涉警单位模块 · 待开发</p>
          <p class="dev-desc">Demo 演示项目，该功能暂未实现</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Box, OfficeBuilding } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { TodoItem } from '@/api/home'

const visible = ref(false)
const activeTab = ref('manage')
const formRef = ref<FormInstance>()
const currentRow = ref<TodoItem | null>(null)

const form = reactive({
  alarmType: '',
  alarmTime: '',
  dispatchTime: '',
  policeOfficers: [] as string[],
  cause: '',
  location: '',
  jurisdiction: '',
  incidentTime: '',
  unit: 'XX派出所',
  result: ''
})

const validatePoliceOfficers = (_rule: unknown, value: string[], callback: (error?: Error) => void) => {
  if (!value || value.length === 0) {
    callback(new Error('请选择出警民警'))
  } else if (value.length < 2) {
    callback(new Error('至少选择两位出警民警'))
  } else {
    callback()
  }
}
const rules: FormRules = {
  alarmType: [{ required: true, message: '请选择接警类型', trigger: 'change' }],
  alarmTime: [{ required: true, message: '请选择报警时间', trigger: 'change' }],
  dispatchTime: [{ required: true, message: '请选择出警时间', trigger: 'change' }],
  policeOfficers: [{ required: true, validator: validatePoliceOfficers, trigger: 'change' }],
  cause: [{ required: true, message: '请选择发生原因', trigger: 'change' }],
  location: [{ required: true, message: '请输入发生地点', trigger: 'blur' }],
  incidentTime: [{ required: true, message: '请选择事发时间', trigger: 'change' }],
  result: [{ required: true, message: '请输入简要警情及处理结果', trigger: 'blur' }]
}

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const open = (row: TodoItem) => {
  currentRow.value = row
  form.alarmType = ''
  form.alarmTime = row.time || formatDateTime(new Date())
  form.dispatchTime = formatDateTime(new Date())
  form.policeOfficers = []
  form.cause = ''
  form.location = ''
  form.jurisdiction = ''
  form.incidentTime = ''
  form.unit = 'XX派出所'
  form.result = ''
  activeTab.value = 'manage'
  visible.value = true
}

const handleConfirm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      visible.value = false
    }
  })
}

defineExpose({
  open
})
</script>

<style lang="scss">
.handle-dialog .el-dialog__header {
  text-align: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border-radius: 12px 12px 0 0;
}

.handle-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 1px;
}

.handle-dialog .el-dialog__body {
  font-size: 15px;
  padding: 24px;
}
</style>

<style scoped lang="scss">
.handle-tabs {
  min-height: 400px;

  :deep(.el-tabs__content) {
    padding: 20px;
  }

  :deep(.el-tabs__item) {
    font-size: 16px;
    padding: 0 24px;
    height: 48px;
    line-height: 48px;
    font-weight: 600;
  }

  :deep(.el-tabs__item.is-active) {
    color: #409eff;
    background: #ecf5ff;
  }

  .tab-content {
    min-height: 350px;
  }

  .dev-placeholder {
    min-height: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #909399;

    .dev-text {
      font-size: 18px;
      font-weight: 600;
      color: #606266;
      margin: 0;
    }

    .dev-desc {
      font-size: 14px;
      color: #c0c4cc;
      margin: 0;
    }
  }
}

.manage-form {
  :deep(.el-form-item__label) {
    font-size: 15px;
    font-weight: 600;
    color: #606266;
  }

  :deep(.el-input__inner),
  :deep(.el-textarea__inner),
  :deep(.el-select .el-input__inner) {
    font-size: 15px;
  }

  :deep(.el-date-picker .el-input__inner) {
    font-size: 15px;
  }
}
</style>
