<template>
  <div class="transfer-page">
    <!-- 上方：待接收警情 -->
    <el-card shadow="hover" class="top-card">
      <template #header>
        <div class="card-header">待接收警情</div>
      </template>
      <el-table :data="pendingData" border height="100%" v-loading="pendingLoading" @row-dblclick="handleRowDblclick">
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="alarmNo" label="接警编号" align="center" />
        <el-table-column prop="content" label="接警内容" align="center" />
        <el-table-column prop="reporter" label="报警人" align="center" />
        <el-table-column prop="phone" label="报警电话" align="center" />
        <el-table-column prop="time" label="报警时间" align="center" />
        <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
        <el-table-column prop="transferReason" label="移送原因" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleReceive(row)">接收</el-button>
            <el-button type="danger" link @click="handleReject(row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pendingPagination.currentPage"
          v-model:page-size="pendingPagination.pageSize"
          :total="pendingPagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePendingSizeChange"
          @current-change="handlePendingCurrentChange"
        />
      </div>
    </el-card>

    <!-- 下方：警情移送 -->
    <el-card shadow="hover" class="bottom-card">
      <template #header>
        <div class="card-header">警情移送</div>
      </template>
      <el-table :data="transferData" border height="100%" v-loading="transferLoading" @row-dblclick="handleRowDblclick">
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="alarmNo" label="接警编号" align="center" />
        <el-table-column prop="content" label="接警内容" align="center" />
        <el-table-column prop="reporter" label="报警人" align="center" />
        <el-table-column prop="phone" label="报警电话" align="center" />
        <el-table-column prop="time" label="报警时间" align="center" />
        <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
        <el-table-column prop="transferSubmitted" label="是否提交移送" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.transferSubmitted ? 'success' : 'info'" size="small">
              {{ row.transferSubmitted ? '已提交' : '未提交' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleTransfer(row)">移送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="transferPagination.currentPage"
          v-model:page-size="transferPagination.pageSize"
          :total="transferPagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleTransferSizeChange"
          @current-change="handleTransferCurrentChange"
        />
      </div>
    </el-card>

    <!-- 移送弹窗 -->
    <el-dialog
      v-model="transferDialog.visible"
      title="警情移送"
      width="520px"
      :close-on-click-modal="false"
      destroy-on-close
      class="transfer-dialog"
    >
      <el-form :model="transferDialog.form" label-width="100px">
        <el-form-item label="移送单位" required>
          <el-select
            v-model="transferDialog.form.station"
            placeholder="请选择移送单位"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in stationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人" required>
          <el-select
            v-model="transferDialog.form.applicant"
            placeholder="请选择申请人"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="officer in officerOptions"
              :key="officer"
              :label="officer"
              :value="officer"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="移送原因">
          <el-input
            v-model="transferDialog.form.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入移送原因"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div v-if="selectedStationInfo" class="station-info">
        <el-divider />
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="移送单位">{{ selectedStationInfo.value }}</el-descriptions-item>
          <el-descriptions-item label="值班民警">{{ selectedStationInfo.dutyOfficer }}</el-descriptions-item>
          <el-descriptions-item label="座机号码">{{ selectedStationInfo.phone }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="transferDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleTransferConfirm">确定</el-button>
      </template>
    </el-dialog>
    <DetailDialog ref="detailRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTodoList, type TodoItem } from '@/api/home'
import DetailDialog from '@/components/DetailDialog.vue'

defineOptions({
  name: 'TransferPage'
})

// 待接收警情
const pendingData = ref<TodoItem[]>([])
const pendingLoading = ref(false)
const pendingPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 警情移送
const transferData = ref<TodoItem[]>([])
const transferLoading = ref(false)
const transferPagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const fetchPendingData = async () => {
  pendingLoading.value = true
  try {
    const res = await getTodoList({
      page: pendingPagination.currentPage,
      pageSize: pendingPagination.pageSize
    })
    if (res.code === 200) {
      pendingData.value = res.data.list
      pendingPagination.total = res.data.total
    }
  } finally {
    pendingLoading.value = false
  }
}

const fetchTransferData = async () => {
  transferLoading.value = true
  try {
    const res = await getTodoList({
      page: transferPagination.currentPage,
      pageSize: transferPagination.pageSize
    })
    if (res.code === 200) {
      transferData.value = res.data.list
      transferPagination.total = res.data.total
    }
  } finally {
    transferLoading.value = false
  }
}

const handlePendingSizeChange = (size: number) => {
  pendingPagination.pageSize = size
  pendingPagination.currentPage = 1
  fetchPendingData()
}

const handlePendingCurrentChange = (page: number) => {
  pendingPagination.currentPage = page
  fetchPendingData()
}

const handleTransferSizeChange = (size: number) => {
  transferPagination.pageSize = size
  transferPagination.currentPage = 1
  fetchTransferData()
}

const detailRef = ref<InstanceType<typeof DetailDialog> | null>(null)

const handleRowDblclick = (row: TodoItem) => {
  detailRef.value?.open(row)
}

const handleTransferCurrentChange = (page: number) => {
  transferPagination.currentPage = page
  fetchTransferData()
}

const removeFromPending = (row: TodoItem) => {
  pendingData.value = pendingData.value.filter(item => item.alarmNo !== row.alarmNo)
  pendingPagination.total -= 1
}

const stations = ['朝阳派出所', '海淀派出所', '东城派出所', '西城派出所', '丰台派出所']
const officers = ['王警官', '李警官', '张警官', '刘警官', '陈警官']

const getRandomStation = () => stations[Math.floor(Math.random() * stations.length)]
const getRandomOfficer = () => officers[Math.floor(Math.random() * officers.length)]

const handleReceive = (row: TodoItem) => {
  ElMessageBox.confirm(
    `该警情(${row.alarmNo})由'${getRandomStation()},民警:${getRandomOfficer()} 申请移送至我所,是否接收该警情?`,
    '接收确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    removeFromPending(row)
    ElMessage.success('接收成功')
  }).catch(() => {})
}

const handleReject = (row: TodoItem) => {
  ElMessageBox.confirm(
    `该警情(${row.alarmNo})由'${getRandomStation()},民警:${getRandomOfficer()} 申请移送至我所,是否拒绝并退回该警情?`,
    '拒绝确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    removeFromPending(row)
    ElMessage.success('已拒绝并退回')
  }).catch(() => {})
}

interface TransferForm {
  station: string
  applicant: string
  reason: string
}

interface TransferDialogState {
  visible: boolean
  currentRow: TodoItem | null
  form: TransferForm
}

const stationOptions = [
  { label: '朝阳派出所', value: '朝阳派出所', dutyOfficer: '王警官', phone: '010-12345678' },
  { label: '海淀派出所', value: '海淀派出所', dutyOfficer: '李警官', phone: '010-23456789' },
  { label: '东城派出所', value: '东城派出所', dutyOfficer: '张警官', phone: '010-34567890' },
  { label: '西城派出所', value: '西城派出所', dutyOfficer: '刘警官', phone: '010-45678901' },
  { label: '丰台派出所', value: '丰台派出所', dutyOfficer: '陈警官', phone: '010-56789012' }
]

const officerOptions = ['王警官', '李警官', '张警官', '刘警官', '陈警官']

const transferDialog = reactive<TransferDialogState>({
  visible: false,
  currentRow: null,
  form: {
    station: '',
    applicant: '',
    reason: ''
  }
})

const selectedStationInfo = computed(() => {
  return stationOptions.find(item => item.value === transferDialog.form.station)
})

const handleTransfer = (row: TodoItem) => {
  transferDialog.currentRow = row
  transferDialog.form.station = ''
  transferDialog.form.applicant = ''
  transferDialog.form.reason = ''
  transferDialog.visible = true
}

const handleTransferConfirm = () => {
  if (!transferDialog.form.station) {
    ElMessage.warning('请选择移送单位')
    return
  }
  if (!transferDialog.form.applicant) {
    ElMessage.warning('请选择申请人')
    return
  }
  if (!transferDialog.form.reason.trim()) {
    ElMessage.warning('请输入移送原因')
    return
  }
  ElMessage.success('移送申请已提交')
  transferDialog.visible = false
}

onMounted(() => {
  fetchPendingData()
  fetchTransferData()
})
</script>

<style lang="scss">
.transfer-dialog .el-dialog__header {
  text-align: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border-radius: 12px 12px 0 0;
}

.transfer-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 1px;
}

.transfer-dialog .el-dialog__body {
  padding: 20px 24px;
}
</style>

<style scoped lang="scss">
.transfer-page {
  padding: 20px;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;

  .card-header {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 4px;
      height: 16px;
      background: linear-gradient(180deg, #3b82f6, #6366f1);
      border-radius: 2px;
    }
  }

  .top-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 16px;
    border-radius: 14px;
    border: none;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);

    :deep(.el-card__header) {
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
      border-radius: 14px 14px 0 0;
    }

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;
    }

    :deep(.el-table) {
      flex: 1;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #f1f5f9;

      .el-table__header th {
        background: #f8fafc;
        color: #475569;
        font-weight: 600;
        font-size: 13px;
        height: 44px;
      }

      .el-table__row {
        transition: background 0.2s ease;
        height: 44px;
      }

      .el-table__row:hover > td {
        background: #f8fafc !important;
      }

      td {
        font-size: 13px;
        color: #475569;
      }
    }
  }

  .bottom-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 14px;
    border: none;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);

    :deep(.el-card__header) {
      padding: 14px 20px;
      border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
      border-radius: 14px 14px 0 0;
    }

    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px;
    }

    :deep(.el-table) {
      flex: 1;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #f1f5f9;

      .el-table__header th {
        background: #f8fafc;
        color: #475569;
        font-weight: 600;
        font-size: 13px;
        height: 44px;
      }

      .el-table__row {
        transition: background 0.2s ease;
        height: 44px;
      }

      .el-table__row:hover > td {
        background: #f8fafc !important;
      }

      td {
        font-size: 13px;
        color: #475569;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 12px 0 0;
    flex-shrink: 0;

    :deep(.el-pagination) {
      --el-pagination-button-bg-color: #ffffff;
      font-weight: 500;
    }

    :deep(.el-pagination__total) {
      color: #64748b;
      font-weight: 500;
    }
  }

  .station-info {
    margin-top: 8px;
  }
}
</style>
