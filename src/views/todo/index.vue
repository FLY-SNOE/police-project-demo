<template>
  <div class="todo-page">
    <el-card shadow="hover" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="接警编号">
          <el-input v-model="searchForm.alarmNo" placeholder="请输入接警编号" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="报警电话">
          <el-input v-model="searchForm.phone" placeholder="请输入报警电话" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="table-card">
      <el-table :data="tableData" border height="calc(100vh - 340px)" v-loading="loading" element-loading-text="加载中..." @row-dblclick="handleRowDblclick">
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="alarmNo" label="接警编号" align="center" />
        <el-table-column prop="content" label="接警内容" align="center" />
        <el-table-column prop="reporter" label="报警人" align="center" />
        <el-table-column prop="phone" label="报警电话" align="center" />
        <el-table-column prop="time" label="报警时间" align="center" />
        <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
        <el-table-column prop="signed" label="是否签收" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.signed ? 'success' : 'danger'" size="small">
              {{ row.signed ? '已签收' : '未签收' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="!row.signed" type="primary" link @click="handleSign(row)">签</el-button>
            <el-button :type="row.dispatched ? 'info' : 'primary'" link @click="handleDispatch(row)">派</el-button>
            <el-button type="primary" link @click="handleReturn(row)">退</el-button>
            <el-button type="primary" link @click="handleOpen(row)">处</el-button>
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
      v-model="dispatchDialog.visible"
      title="警情下派"
      width="25vw"
      :close-on-click-modal="false"
    >
      <el-form :model="dispatchDialog.form" label-width="100px">
        <el-form-item label="选择民警">
          <el-select v-model="dispatchDialog.form.officerId" placeholder="请选择民警" @change="handleOfficerChange">
            <el-option
              v-for="officer in officerList"
              :key="officer.id"
              :label="`${officer.name}(${officer.station})`"
              :value="officer.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-descriptions :column="1" border v-if="dispatchDialog.selectedOfficer">
        <el-descriptions-item label="姓名">{{ dispatchDialog.selectedOfficer.name }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ dispatchDialog.selectedOfficer.phone }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ dispatchDialog.selectedOfficer.gender }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ dispatchDialog.selectedOfficer.position }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="dispatchDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleDispatchConfirm">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="returnDialog.visible"
      title="退单"
      width="25vw"
      :close-on-click-modal="false"
    >
      <p class="return-info">当前指挥中心值班人员:{{ returnDialog.dutyOfficer.name }}</p>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="姓名">{{ returnDialog.dutyOfficer.name }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ returnDialog.dutyOfficer.phone }}</el-descriptions-item>
      </el-descriptions>

      <el-form :model="returnDialog.form" label-width="80px" style="margin-top: 16px">
        <el-form-item label="退单原因">
          <el-input
            v-model="returnDialog.form.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入退单原因"
            style="height: 100px"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="returnDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleReturnConfirm">确定</el-button>
      </template>
    </el-dialog>

    <HandleDialog ref="handleDialogRef" />
    <DetailDialog ref="detailRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTodoList, type TodoItem } from '@/api/home'
import HandleDialog from './components/HandleDialog.vue'
import DetailDialog from '@/components/DetailDialog.vue'

defineOptions({
  name: 'TodoPage'
})
const detailRef = ref<InstanceType<typeof DetailDialog> | null>(null)
const handleDialogRef = ref<InstanceType<typeof HandleDialog> | null>(null)

const handleOpen = (row: TodoItem) => {
  handleDialogRef.value?.open(row)
}

const handleRowDblclick = (row: TodoItem) => {
  detailRef.value?.open(row)
}

const searchForm = reactive({
  alarmNo: '',
  phone: ''
})

const tableData = ref<TodoItem[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

interface Officer {
  id: number
  name: string
  station: string
  phone: string
  gender: string
  position: string
}

const officerList: Officer[] = [
  { id: 1, name: '张伟', station: '朝阳派出所', phone: '13800138001', gender: '男', position: '值班民警' },
  { id: 2, name: '李娜', station: '海淀派出所', phone: '13800138002', gender: '女', position: '社区民警' },
  { id: 3, name: '王强', station: '东城派出所', phone: '13800138003', gender: '男', position: '刑警' },
  { id: 4, name: '刘芳', station: '西城派出所', phone: '13800138004', gender: '女', position: '交警' },
  { id: 5, name: '陈明', station: '丰台派出所', phone: '13800138005', gender: '男', position: '巡警' }
]

const dispatchDialog = reactive({
  visible: false,
  currentRow: null as TodoItem | null,
  form: {
    officerId: null as number | null
  },
  selectedOfficer: null as Officer | null
})

const handleOfficerChange = (id: number) => {
  dispatchDialog.selectedOfficer = officerList.find(o => o.id === id) || null
}

const handleDispatchConfirm = () => {
  if (!dispatchDialog.form.officerId || !dispatchDialog.currentRow) {
    ElMessage.warning('请选择民警')
    return
  }
  const officer = officerList.find(o => o.id === dispatchDialog.form.officerId)
  if (officer) {
    dispatchDialog.currentRow.dispatched = true
    dispatchDialog.currentRow.dispatcherName = officer.name
    ElMessage.success('下派成功')
    dispatchDialog.visible = false
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getTodoList({
      alarmNo: searchForm.alarmNo || undefined,
      phone: searchForm.phone || undefined,
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
  searchForm.phone = ''
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

const handleSign = (row: TodoItem) => {
  row.signed = true
  ElMessage.success('签收成功')
}

const handleDispatch = (row: TodoItem) => {
  if (row.dispatched && row.dispatcherName) {
    ElMessageBox.confirm(`当前警情已下派至警员"${row.dispatcherName}"，是否重新下派？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      openDispatchDialog(row)
    }).catch(() => {})
  } else {
    openDispatchDialog(row)
  }
}

const openDispatchDialog = (row: TodoItem) => {
  dispatchDialog.currentRow = row
  dispatchDialog.form.officerId = null
  dispatchDialog.selectedOfficer = null
  dispatchDialog.visible = true
}

const returnDialog = reactive({
  visible: false,
  currentRow: null as TodoItem | null,
  dutyOfficer: {
    name: '赵建国',
    phone: '13800138000'
  },
  form: {
    reason: ''
  }
})

const handleReturn = (row: TodoItem) => {
  returnDialog.currentRow = row
  returnDialog.form.reason = ''
  returnDialog.visible = true
}

const handleReturnConfirm = () => {
  if (!returnDialog.form.reason.trim()) {
    ElMessage.warning('请输入退单原因')
    return
  }
  returnDialog.visible = false
  ElMessage.success('退单成功')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.todo-page {
  padding: 20px;

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

  .return-info {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }
}
</style>
