<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="stat-card problem-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon warning"><Warning /></el-icon>
              <span>问题警情</span>
              <span class="badge" v-if="problemAlarms.length">{{ problemAlarms.length }}</span>
            </div>
          </template>
          <div class="card-content">
            <el-table :data="problemAlarms" border height="100%" :row-class-name="tableRowClassName">
              <el-table-column prop="index" label="序号" width="60" align="center" />
              <el-table-column prop="alarmNo" label="接警编号" align="center" />
              <el-table-column prop="detail" label="问题详情" align="center" />
              <el-table-column prop="suggestion" label="修改建议" align="center" />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="stat-card officer-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon primary"><User /></el-icon>
              <span>当前值班民警</span>
            </div>
          </template>
          <div class="card-content officer-content">
            <div class="officer-info">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="姓名">{{ officerInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="警号">{{ officerInfo.policeNo }}</el-descriptions-item>
                <el-descriptions-item label="职位">{{ officerInfo.position }}</el-descriptions-item>
                <el-descriptions-item label="电话">{{ officerInfo.phone }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="officer-photo">
              <el-avatar :size="100" :icon="UserFilled" />
            </div>
          </div>
          <div class="card-footer">
            <div class="datetime">
              <span class="time">{{ currentTime }}</span>
            </div>
            <div class="weather">
              <el-icon :size="20"><Sunny /></el-icon>
              <span>{{ weather }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="stat-card major-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon danger"><CircleClose /></el-icon>
              <span>重大警情</span>
            </div>
          </template>
          <div class="card-content">
            <el-table :data="majorAlarms" border height="100%" :row-class-name="tableRowClassName">
              <el-table-column prop="index" label="序号" width="60" align="center" />
              <el-table-column prop="alarmNo" label="接警编号" align="center" />
              <el-table-column prop="content" label="报警内容" align="center" />
              <el-table-column prop="reporter" label="报警人" align="center" />
              <el-table-column prop="phone" label="报警电话" align="center" />
              <el-table-column prop="time" label="报警时间" align="center" />
              <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card shadow="hover" class="stat-card record-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon success"><DataLine /></el-icon>
              <span>警情记录</span>
            </div>
          </template>
          <div class="card-content">
            <div id="alarmChart" class="chart-container"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { UserFilled, Sunny, Warning, User, CircleClose, DataLine } from '@element-plus/icons-vue'
import { getProblemAlarms, getDutyOfficer, getMajorAlarms, getAlarmRecords, type ProblemAlarm, type OfficerInfo, type MajorAlarm, type AlarmRecord } from '@/api/home'

defineOptions({
  name: 'HomePage'
})

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 2 === 0) {
    return 'warning-row'
  }
  return ''
}

const problemAlarms = ref<ProblemAlarm[]>([])
const officerInfo = ref<OfficerInfo>({ name: '', policeNo: '', position: '', phone: '' })
const majorAlarms = ref<MajorAlarm[]>([])
const currentTime = ref('')
const weather = ref('晴 26°C')
const alarmRecord = ref<AlarmRecord>({ criminal: 0, administrative: 0, civil: 0, traffic: 0 })
let timer: ReturnType<typeof setInterval>
let chartInstance: echarts.ECharts | null = null

const fetchProblemAlarms = async () => {
  const res = await getProblemAlarms()
  if (res.code === 200) {
    problemAlarms.value = res.data
  }
}

const fetchDutyOfficer = async () => {
  const res = await getDutyOfficer()
  if (res.code === 200) {
    officerInfo.value = res.data
  }
}

const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}年${month}月${date}日 ${hours}时${minutes}分${seconds}秒`
}

const fetchMajorAlarms = async () => {
  const res = await getMajorAlarms()
  if (res.code === 200) {
    majorAlarms.value = res.data
  }
}

const fetchAlarmRecords = async () => {
  const res = await getAlarmRecords()
  if (res.code === 200) {
    alarmRecord.value = res.data
    nextTick(() => {
      renderChart()
    })
  }
}

const renderChart = () => {
  const chartDom = document.getElementById('alarmChart')
  if (!chartDom) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartDom)
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 起'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['刑事', '行政', '民事', '交通'],
      axisLabel: {
        fontSize: 13,
        color: '#606266'
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        name: '警情数量',
        type: 'bar',
        barWidth: '40%',
        data: [
          { value: alarmRecord.value.criminal, itemStyle: { color: '#e6a23c' } },
          { value: alarmRecord.value.administrative, itemStyle: { color: '#409eff' } },
          { value: alarmRecord.value.civil, itemStyle: { color: '#67c23a' } },
          { value: alarmRecord.value.traffic, itemStyle: { color: '#f56c6c' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontSize: 13,
          color: '#303133'
        }
      }
    ]
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  fetchProblemAlarms()
  fetchDutyOfficer()
  fetchMajorAlarms()
  fetchAlarmRecords()
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
}

.stat-card {
  height: calc(50vh - 90px);
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 30px;
  border-radius: 16px;
  border: none;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
    border-radius: 16px 16px 0 0;
  }

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0;
    height: 0;
    border-radius: 0 0 16px 16px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;

    .header-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;

      &.warning {
        color: #d97706;
        background: #fef3c7;
      }
      &.primary {
        color: #2563eb;
        background: #dbeafe;
      }
      &.danger {
        color: #dc2626;
        background: #fee2e2;
      }
      &.success {
        color: #059669;
        background: #d1fae5;
      }
    }

    .badge {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
      margin-left: auto;
      box-shadow: 0 2px 6px rgba(220, 38, 38, 0.25);
    }
  }

  .card-content {
    flex: 1;
    overflow: hidden;
    padding: 12px;

    :deep(.el-table) {
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #f1f5f9;

      th {
        background: #f8fafc;
        color: #475569;
        font-weight: 600;
        font-size: 13px;
        height: 40px;
      }

      td {
        font-size: 13px;
        color: #475569;
        height: 40px;
      }

      .el-table__row {
        transition: background 0.2s ease;
      }

      .el-table__row:hover > td {
        background: #f8fafc !important;
      }

      .warning-row {
        background: #fef2f2;
      }
    }

    .chart-container {
      width: 100%;
      height: 100%;
      min-height: 150px;
    }
  }

  .officer-content {
    padding: 16px;

    .officer-info {
      flex: 1;
      display: flex;
      align-items: center;
      padding-right: 20px;
      border-right: 1px solid #f1f5f9;

      :deep(.el-descriptions) {
        width: 100%;

        .el-descriptions__label {
          background: #f8fafc;
          color: #64748b;
          font-weight: 600;
          font-size: 13px;
        }

        .el-descriptions__content {
          color: #1e293b;
          font-weight: 500;
        }
      }
    }

    .officer-photo {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .card-footer {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    border-top: 1px solid #f1f5f9;
    background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
    flex-shrink: 0;

    .datetime {
      .time {
        font-size: 14px;
        font-weight: 700;
        color: #2563eb;
        letter-spacing: 0.5px;
      }
    }

    .weather {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 13px;
      font-weight: 500;
    }
  }
}

.problem-card {
  :deep(.el-card__header) {
    border-bottom: 2px solid #f59e0b;
  }
}

.officer-card {
  :deep(.el-card__header) {
    border-bottom: 2px solid #3b82f6;
  }
}

.major-card {
  :deep(.el-card__header) {
    border-bottom: 2px solid #ef4444;
  }
}

.record-card {
  :deep(.el-card__header) {
    border-bottom: 2px solid #10b981;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px;
  }

  .stat-card {
    height: auto;
    min-height: 300px;
    margin-bottom: 30px;
  }
}
</style>
