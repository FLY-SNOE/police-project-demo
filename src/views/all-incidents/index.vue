<template>
  <div class="all-incidents-page">
    <el-card shadow="hover" class="search-card">
      <el-form :model="searchForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="接警编号">
              <el-input v-model="searchForm.alarmNo" placeholder="请输入接警编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接警内容">
              <el-input v-model="searchForm.content" placeholder="请输入接警内容" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警人">
              <el-input v-model="searchForm.reporter" placeholder="请输入报警人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警电话">
              <el-input v-model="searchForm.phone" placeholder="请输入报警电话" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 16px">
          <el-col :span="6">
            <el-form-item label="报警时间">
              <el-date-picker
                v-model="searchForm.time"
                type="date"
                placeholder="选择日期"
                clearable
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警地点">
              <el-input v-model="searchForm.address" placeholder="请输入报警地点" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否签收">
              <el-select v-model="searchForm.signed" placeholder="请选择" clearable style="width: 100%">
                <el-option label="已签收" :value="true" />
                <el-option label="未签收" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否处警">
              <el-select v-model="searchForm.handled" placeholder="请选择" clearable style="width: 100%">
                <el-option label="已处警" :value="true" />
                <el-option label="未处警" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 16px">
          <el-col :span="24">
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
        <el-table-column prop="signed" label="是否签收" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.signed ? 'success' : 'danger'" size="small">
              {{ row.signed ? '已签收' : '未签收' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handled" label="是否处警" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.handled ? 'success' : 'danger'" size="small">
              {{ row.handled ? '已处警' : '未处警' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.signed" type="primary" link @click="handleOpen(row)">处</el-button>
            <el-button :type="row.relatedAlarmNo ? 'info' : 'primary'" link @click="handleRelate(row)">关</el-button>
            <el-button :type="row.duplicateOf ? 'info' : 'primary'" link @click="handleDuplicate(row)">重</el-button>
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

    <HandleDialog ref="handleDialogRef" />
    <DetailDialog ref="detailRef" />

    <el-dialog
      v-model="relateDialog.visible"
      title="警情关联"
      width="60vw"
      :close-on-click-modal="false"
      destroy-on-close
      class="relate-dialog"
    >
      <el-table
        :data="relateDialog.tableData"
        border
        height="calc(60vh - 160px)"
        highlight-current-row
        @row-click="handleRelateRowClick"
        class="relate-table"
      >
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="alarmNo" label="接警编号" align="center" />
        <el-table-column prop="content" label="接警内容" align="center" />
        <el-table-column prop="reporter" label="报警人" align="center" />
        <el-table-column prop="phone" label="报警电话" align="center" />
        <el-table-column prop="time" label="报警时间" align="center" />
        <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <el-button @click="relateDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleRelateConfirm">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="duplicateDialog.visible"
      title="警情重复"
      width="60vw"
      :close-on-click-modal="false"
      destroy-on-close
      class="relate-dialog"
    >
      <el-table
        :data="duplicateDialog.tableData"
        border
        height="calc(60vh - 160px)"
        highlight-current-row
        @row-click="handleDuplicateRowClick"
        class="relate-table"
      >
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="alarmNo" label="接警编号" align="center" />
        <el-table-column prop="content" label="接警内容" align="center" />
        <el-table-column prop="reporter" label="报警人" align="center" />
        <el-table-column prop="phone" label="报警电话" align="center" />
        <el-table-column prop="time" label="报警时间" align="center" />
        <el-table-column prop="address" label="报警地点" align="center" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <el-button @click="duplicateDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleDuplicateConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTodoList, type TodoItem } from '@/api/home'
import HandleDialog from '../todo/components/HandleDialog.vue'
import DetailDialog from '@/components/DetailDialog.vue'

defineOptions({
  name: 'AllIncidentsPage'
})
const detailRef = ref<InstanceType<typeof DetailDialog> | null>(null)
const handleDialogRef = ref<InstanceType<typeof HandleDialog> | null>(null)

const handleOpen = (row: TodoItem) => {
  handleDialogRef.value?.open(row)
}

const handleRowDblclick = (row: TodoItem) => {
  detailRef.value?.open(row)
}

const relateDialog = reactive({
  visible: false,
  currentRow: null as TodoItem | null,
  selectedRow: null as TodoItem | null,
  tableData: [] as TodoItem[]
})

const duplicateDialog = reactive({
  visible: false,
  currentRow: null as TodoItem | null,
  selectedRow: null as TodoItem | null,
  tableData: [] as TodoItem[]
})

const handleRelate = async (row: TodoItem) => {
  if (row.relatedAlarmNo) {
    ElMessageBox.confirm(
      `该警情已与警情(${row.relatedAlarmNo})相关联，是否确定取消关联？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(() => {
      ElMessageBox.confirm(
        '取消关联后该警情将恢复可关联状态，请再次确认',
        '二次确认',
        { confirmButtonText: '确定取消', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        row.relatedAlarmNo = undefined
        ElMessage.success('取消关联成功')
      }).catch(() => {})
    }).catch(() => {})
    return
  }
  relateDialog.currentRow = row
  relateDialog.selectedRow = null
  const res = await getTodoList({ page: 1, pageSize: 1000 })
  if (res.code === 200) {
    relateDialog.tableData = res.data.list.filter(item => item.alarmNo !== row.alarmNo)
    relateDialog.visible = true
  }
}

const handleRelateRowClick = (row: TodoItem) => {
  relateDialog.selectedRow = row
}

const handleRelateConfirm = () => {
  if (!relateDialog.selectedRow) return
  const currentNo = relateDialog.currentRow?.alarmNo
  const selectedNo = relateDialog.selectedRow.alarmNo
  ElMessageBox.confirm(
    `是否将当前警情(${currentNo})和选中警情(${selectedNo})相关联?关联之后被选中警情将无法再关联其他警情`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    relateDialog.visible = false
  }).catch(() => {})
}

const handleDuplicate = async (row: TodoItem) => {
  if (row.duplicateOf) {
    ElMessageBox.confirm(
      `该警情已重复警情(${row.duplicateOf})，是否确定取消重复？`,
      '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    ).then(() => {
      ElMessageBox.confirm(
        '取消重复后该警情将恢复可重复状态，请再次确认',
        '二次确认',
        { confirmButtonText: '确定取消', cancelButtonText: '取消', type: 'warning' }
      ).then(() => {
        row.duplicateOf = undefined
        ElMessage.success('取消重复成功')
      }).catch(() => {})
    }).catch(() => {})
    return
  }
  duplicateDialog.currentRow = row
  duplicateDialog.selectedRow = null
  const res = await getTodoList({ page: 1, pageSize: 1000 })
  if (res.code === 200) {
    duplicateDialog.tableData = res.data.list.filter(item => item.alarmNo !== row.alarmNo)
    duplicateDialog.visible = true
  }
}

const handleDuplicateRowClick = (row: TodoItem) => {
  duplicateDialog.selectedRow = row
}

const handleDuplicateConfirm = () => {
  if (!duplicateDialog.selectedRow) return
  const currentNo = duplicateDialog.currentRow?.alarmNo
  const selectedNo = duplicateDialog.selectedRow.alarmNo
  ElMessageBox.confirm(
    `是否将当前警情(${currentNo})标记为选中警情(${selectedNo})的重复警情?标记之后当前警情将无法再重复其他警情`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    duplicateDialog.visible = false
  }).catch(() => {})
}

const searchForm = reactive({
  alarmNo: '',
  content: '',
  reporter: '',
  phone: '',
  time: '',
  address: '',
  signed: '' as '' | boolean,
  handled: '' as '' | boolean
})

const tableData = ref<TodoItem[]>([])
const loading = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getTodoList({
      alarmNo: searchForm.alarmNo || undefined,
      content: searchForm.content || undefined,
      reporter: searchForm.reporter || undefined,
      phone: searchForm.phone || undefined,
      time: searchForm.time || undefined,
      address: searchForm.address || undefined,
      signed: searchForm.signed === '' ? undefined : searchForm.signed,
      handled: searchForm.handled === '' ? undefined : searchForm.handled,
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
  searchForm.content = ''
  searchForm.reporter = ''
  searchForm.phone = ''
  searchForm.time = ''
  searchForm.address = ''
  searchForm.signed = ''
  searchForm.handled = ''
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

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss">
.relate-dialog .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}

.relate-table .el-table__body tr.current-row > td.el-table__cell {
  background-color: #ecf5ff;
}
</style>

<style scoped lang="scss">
.all-incidents-page {
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
  }
}
</style>
