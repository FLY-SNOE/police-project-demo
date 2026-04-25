<template>
  <div class="police-page">
    <el-card shadow="hover" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="接警编号">
              <el-input v-model="searchForm.alarmNo" placeholder="请输入接警编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否审批">
              <el-select v-model="searchForm.approved" placeholder="请选择" clearable style="width: 100%">
                <el-option label="已审批" :value="true" />
                <el-option label="未审批" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="table-card">
      <el-table :data="tableData" border height="100%" v-loading="loading" element-loading-text="加载中..." @row-dblclick="handleRowDblclick">
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="alarmNo" label="接警编号" align="center" />
        <el-table-column prop="content" label="接警内容" align="center" />
        <el-table-column prop="reporter" label="报警人" align="center" />
        <el-table-column prop="phone" label="报警电话" align="center" />
        <el-table-column prop="time" label="报警时间" align="center" />
        <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
        <el-table-column prop="approved" label="是否审批" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.approved ? 'success' : 'danger'" size="small">
              {{ row.approved ? '已审批' : '未审批' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approvalResult" label="审批结果" width="100" align="center">
          <template #default="{ row }">
            {{ row.approvalResult || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="!row.approved" type="primary" link @click="handleApprove(row)">审批</el-button>
            <el-button v-else type="primary" link @click="handleEdit(row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="approveDialog.visible"
      title="处警审批"
      width="35vw"
      :close-on-click-modal="false"
      destroy-on-close
      class="approve-dialog"
    >
      <el-form
        ref="approveFormRef"
        :model="approveDialog.form"
        :rules="approveRules"
        label-width="100px"
      >
        <el-form-item label="审批结果" prop="approvalResult">
          <el-select v-model="approveDialog.form.approvalResult" placeholder="请选择审批结果" style="width: 100%">
            <el-option label="刑事" value="刑事" />
            <el-option label="行政" value="行政" />
            <el-option label="交通" value="交通" />
            <el-option label="纠纷" value="纠纷" />
            <el-option label="斗殴" value="斗殴" />
            <el-option label="盗窃" value="盗窃" />
            <el-option label="诈骗" value="诈骗" />
            <el-option label="求助" value="求助" />
            <el-option label="噪音扰民" value="噪音扰民" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="审批人" prop="approver">
          <el-select v-model="approveDialog.form.approver" disabled style="width: 100%">
            <el-option label="张三" value="张三" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位">
          <el-input v-model="approveDialog.form.approvalUnit" disabled />
        </el-form-item>
        <el-form-item label="审批时间">
          <el-input v-model="approveDialog.form.approvalTime" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleApproveConfirm">确定</el-button>
      </template>
    </el-dialog>
    <DetailDialog ref="detailRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { getTodoList, type TodoItem } from '@/api/home'
import DetailDialog from '@/components/DetailDialog.vue'

defineOptions({
  name: 'PolicePage'
})

const searchForm = reactive({
  alarmNo: '',
  approved: '' as '' | boolean
})

const detailRef = ref<InstanceType<typeof DetailDialog> | null>(null)

const handleRowDblclick = (row: TodoItem) => {
  detailRef.value?.open(row)
}

const tableData = ref<TodoItem[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const approveFormRef =  ref<FormInstance>()
const approveDialog = reactive({
  visible: false,
  isEdit: false,
  currentRow: null as TodoItem | null,
  form: {
    approvalResult: '',
    approver: '张三',
    approvalUnit: 'XX派出所',
    approvalTime: ''
  }
})

const approveRules: FormRules = {
  approvalResult: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
  approver: [{ required: true, message: '请选择审批人', trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getTodoList({
      alarmNo: searchForm.alarmNo || undefined,
      approved: searchForm.approved === '' ? undefined : searchForm.approved,
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  fetchData()
}

const handleReset = () => {
  searchForm.alarmNo = ''
  searchForm.approved = ''
  pagination.currentPage = 1
  fetchData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchData()
}

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const openApproveDialog = (row: TodoItem, isEdit: boolean) => {
  approveDialog.isEdit = isEdit
  approveDialog.currentRow = row
  if (isEdit && row.approvalResult) {
    approveDialog.form.approvalResult = row.approvalResult
    approveDialog.form.approver = row.approver || '张三'
    approveDialog.form.approvalUnit = row.approvalUnit || 'XX派出所'
    approveDialog.form.approvalTime = row.approvalTime || formatDateTime(new Date())
  } else {
    approveDialog.form.approvalResult = ''
    approveDialog.form.approver = '张三'
    approveDialog.form.approvalUnit = 'XX派出所'
    approveDialog.form.approvalTime = formatDateTime(new Date())
  }
  approveDialog.visible = true
}

const handleApprove = (row: TodoItem) => {
  openApproveDialog(row, false)
}

const handleEdit = (row: TodoItem) => {
  openApproveDialog(row, true)
}

const handleApproveConfirm = async () => {
  if (!approveFormRef.value || !approveDialog.currentRow) return
  await approveFormRef.value.validate((valid) => {
    if (valid) {
      const row = approveDialog.currentRow!
      row.approved = true
      row.approvalResult = approveDialog.form.approvalResult
      row.approver = approveDialog.form.approver
      row.approvalUnit = approveDialog.form.approvalUnit
      row.approvalTime = approveDialog.form.approvalTime
      approveDialog.visible = false
      ElMessage.success(approveDialog.isEdit ? '修改成功' : '审批成功')
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss">
.approve-dialog .el-dialog__header {
  text-align: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border-radius: 12px 12px 0 0;
}

.approve-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 1px;
}
</style>

<style scoped lang="scss">
.police-page {
  padding: 20px;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;

  .search-card {
    margin-bottom: 20px;
    flex-shrink: 0;
    border-radius: 14px;
    border: none;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    :deep(.el-card__body) {
      padding: 20px 24px;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-form-item__label) {
      font-weight: 600;
      color: #475569;
      font-size: 13px;
    }

    :deep(.el-input__inner),
    :deep(.el-select .el-input__inner) {
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    :deep(.el-button) {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.25s ease;
    }

    :deep(.el-button--primary) {
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
    }
  }

  .table-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 14px;
    border: none;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
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
    padding: 16px 0 0;
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

  }

</style>
