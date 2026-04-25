<template>
  <el-dialog
    v-model="visible"
    title="警情详情"
    width="1100px"
    :close-on-click-modal="false"
    destroy-on-close
    class="detail-dialog"
  >
    <div class="detail-section">
      <div class="section-title">
        <el-icon :size="18" color="#409EFF"><Document /></el-icon>
        <span>接警信息</span>
      </div>
      <el-descriptions :column="2" border size="default">
        <el-descriptions-item label="接警编号" :span="1">{{ data.alarmNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="接警内容" :span="1">{{ data.content || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报警人" :span="1">{{ data.reporter || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报警电话" :span="1">{{ data.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报警时间" :span="1">{{ data.time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="报警地点" :span="1">{{ data.address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="是否签收" :span="1">
          <el-tag :type="data.signed ? 'success' : 'danger'" size="small">
            {{ data.signed ? '已签收' : '未签收' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="是否下派" :span="1">
          <el-tag :type="data.dispatched ? 'success' : 'info'" size="small">
            {{ data.dispatched ? '已下派' : '未下派' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="data.dispatched && data.dispatcherName" label="下派民警" :span="1">{{ data.dispatcherName }}</el-descriptions-item>
        <el-descriptions-item label="是否处警" :span="1">
          <el-tag :type="data.signed && data.handled ? 'success' : 'danger'" size="small">
            {{ data.signed && data.handled ? '已处警' : '未处警' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="data.relatedAlarmNo" label="关联警情" :span="1">{{ data.relatedAlarmNo }}</el-descriptions-item>
        <el-descriptions-item v-if="data.duplicateOf" label="重复警情" :span="1">{{ data.duplicateOf }}</el-descriptions-item>
        <el-descriptions-item v-if="data.transferReason" label="移送原因" :span="2">{{ data.transferReason }}</el-descriptions-item>
        <el-descriptions-item label="是否提交移送" :span="1">
          <el-tag :type="data.transferSubmitted ? 'success' : 'info'" size="small">
            {{ data.transferSubmitted ? '已提交' : '未提交' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="detail-section">
      <div class="section-title">
        <el-icon :size="18" color="#67C23A"><FirstAidKit /></el-icon>
        <span>处警信息</span>
      </div>
      <el-descriptions :column="2" border size="default">
        <el-descriptions-item label="接警类型" :span="1">{{ handleInfo.alarmType }}</el-descriptions-item>
        <el-descriptions-item label="发生原因" :span="1">{{ handleInfo.cause }}</el-descriptions-item>
        <el-descriptions-item label="发生地点" :span="1">{{ handleInfo.location }}</el-descriptions-item>
        <el-descriptions-item label="所属辖区" :span="1">{{ handleInfo.jurisdiction }}</el-descriptions-item>
        <el-descriptions-item label="报警时间" :span="1">{{ handleInfo.alarmTime }}</el-descriptions-item>
        <el-descriptions-item label="出警时间" :span="1">{{ handleInfo.dispatchTime }}</el-descriptions-item>
        <el-descriptions-item label="事发时间" :span="1">{{ handleInfo.incidentTime }}</el-descriptions-item>
        <el-descriptions-item label="处警单位" :span="1">{{ handleInfo.unit }}</el-descriptions-item>
        <el-descriptions-item label="出警民警" :span="2">
          <el-tag v-for="officer in handleInfo.policeOfficers" :key="officer" size="small" style="margin-right: 8px">
            {{ officer }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="是否审批" :span="1">
          <el-tag :type="data.handled && data.approved ? 'success' : 'danger'" size="small">
            {{ data.handled && data.approved ? '已审批' : '未审批' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="data.handled && data.approvalResult" label="审批结果" :span="1">{{ data.approvalResult }}</el-descriptions-item>
        <el-descriptions-item v-if="data.handled && data.approver" label="审批人" :span="1">{{ data.approver }}</el-descriptions-item>
        <el-descriptions-item v-if="data.handled && data.approvalUnit" label="审批单位" :span="1">{{ data.approvalUnit }}</el-descriptions-item>
        <el-descriptions-item v-if="data.handled && data.approvalTime" label="审批时间" :span="1">{{ data.approvalTime }}</el-descriptions-item>
        <el-descriptions-item label="简要警情及处理结果" :span="2">
          <pre class="result-pre">{{ handleInfo.result }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Document, FirstAidKit } from '@element-plus/icons-vue'
import type { TodoItem } from '@/api/home'

const visible = ref(false)
const data = ref<Partial<TodoItem>>({})

interface HandleInfo {
  alarmType: string
  alarmTime: string
  dispatchTime: string
  policeOfficers: string[]
  cause: string
  location: string
  jurisdiction: string
  incidentTime: string
  unit: string
  result: string
}

const handleInfo = reactive<HandleInfo>({
  alarmType: '',
  alarmTime: '',
  dispatchTime: '',
  policeOfficers: [],
  cause: '',
  location: '',
  jurisdiction: '',
  incidentTime: '',
  unit: 'XX派出所',
  result: ''
})

const alarmTypes = ['刑事', '行政', '民事', '交通', '纠纷', '求助']
const causes = ['打架斗殴', '盗窃', '诈骗', '交通事故', '噪音扰民', '家庭纠纷', '其他']
const jurisdictions = ['东城区', '西城区', '朝阳区', '海淀区', '丰台区']
const allOfficers = ['王警官', '李警官', '张警官', '刘警官', '陈警官']

const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const generateHandleInfo = (row: TodoItem): HandleInfo => {
  const seed = hashCode(row.alarmNo || '0')
  const rand = (mod: number) => Math.floor(seededRandom(seed + mod) * mod)
  const randArr = <T>(arr: T[]) => arr[rand(arr.length)]  as string

  const officerCount = 2 + rand(2)
  const shuffled = [...allOfficers].sort(() => seededRandom(seed + 99) - 0.5)

  const now = new Date()
  const alarmDate = row.time ? new Date(row.time.replace(/-/g, '/')) : now
  const dispatchDate = new Date(alarmDate.getTime() + 5 * 60 * 1000 + rand(10) * 60 * 1000)
  const incidentDate = new Date(alarmDate.getTime() - 10 * 60 * 1000 - rand(30) * 60 * 1000)

  return {
    alarmType: randArr(alarmTypes),
    alarmTime: row.time || formatDateTime(alarmDate),
    dispatchTime: formatDateTime(dispatchDate),
    policeOfficers: shuffled.slice(0, officerCount),
    cause: randArr(causes),
    location: row.address || '某区某路',
    jurisdiction: randArr(jurisdictions),
    incidentTime: formatDateTime(incidentDate),
    unit: 'XX派出所',
    result: `简要警情：${row.content || '暂无内容'}\n处理结果：已派遣警力前往现场处置，目前情况已得到控制。`
  }
}

const open = (row: TodoItem) => {
  data.value = row
  const info = generateHandleInfo(row)
  Object.assign(handleInfo, info)
  visible.value = true
}

defineExpose({
  open
})
</script>

<style lang="scss">
.detail-dialog .el-dialog__header {
  text-align: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border-radius: 12px 12px 0 0;
}

.detail-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.detail-dialog .el-dialog__body {
  padding: 20px 24px;
  max-height: calc(80vh - 120px);
  overflow-y: auto;
}

.detail-dialog .el-descriptions__cell {
  white-space: nowrap;
}
</style>

<style scoped lang="scss">
.detail-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    color: #303133;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e4e7ed;
  }
}

.result-pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style>
