<template>
  <div class="modify-page">
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
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleModify(row)">修改</el-button>
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
      v-model="modifyDialog.visible"
      title="警情修改"
      width="75vw"
      :close-on-click-modal="false"
      destroy-on-close
      class="modify-dialog"
    >
      <el-form
        ref="formRef"
        :model="modifyDialog.form"
        :rules="rules"
        label-width="140px"
        class="manage-form"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="接警类型" prop="alarmType">
              <el-select v-model="modifyDialog.form.alarmType" placeholder="请选择接警类型" style="width: 100%">
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
                v-model="modifyDialog.form.alarmTime"
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
                v-model="modifyDialog.form.dispatchTime"
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
                v-model="modifyDialog.form.policeOfficers"
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
              <el-select v-model="modifyDialog.form.cause" placeholder="请选择发生原因" style="width: 100%">
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
              <el-input v-model="modifyDialog.form.location" placeholder="请输入发生地点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="所属辖区" prop="jurisdiction">
              <el-select v-model="modifyDialog.form.jurisdiction" placeholder="请选择所属辖区" style="width: 100%">
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
                v-model="modifyDialog.form.incidentTime"
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
              <el-input v-model="modifyDialog.form.unit" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="简要警情及处理结果" prop="result">
              <el-input
                v-model="modifyDialog.form.result"
                type="textarea"
                :rows="4"
                placeholder="请输入简要警情及处理结果"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="modifyDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
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
  name: 'ModifyPage'
})

const searchForm = reactive({
  alarmNo: '',
  content: '',
  reporter: '',
  phone: '',
  time: '',
  address: ''
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

interface ModifyForm {
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

const formRef = ref<FormInstance>()
const modifyDialog = reactive({
  visible: false,
  currentRow: null as TodoItem | null,
  form: {
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
  } as ModifyForm
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

const randomType = () => {
  const types = ['刑事', '行政', '民事', '交通', '纠纷', '求助']
  return types[Math.floor(Math.random() * types.length)] as string
}

const randomCause = () => {
  const causes = ['打架斗殴', '盗窃', '诈骗', '交通事故', '噪音扰民', '家庭纠纷', '其他']
  return causes[Math.floor(Math.random() * causes.length)]  as string
} 

const randomJurisdiction = () => {
  const areas = ['东城区', '西城区', '朝阳区', '海淀区', '丰台区']
  return areas[Math.floor(Math.random() * areas.length)]  as string
}

const randomOfficers = () => {
  const all = ['王警官', '李警官', '张警官', '刘警官', '陈警官']
  const count = 2 + Math.floor(Math.random() * 2)
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const handleModify = (row: TodoItem) => {
  modifyDialog.currentRow = row
  modifyDialog.form.alarmType = randomType()
  modifyDialog.form.alarmTime = row.time || formatDateTime(new Date())
  modifyDialog.form.dispatchTime = formatDateTime(new Date())
  modifyDialog.form.policeOfficers = randomOfficers()
  modifyDialog.form.cause = randomCause()
  modifyDialog.form.location = row.address || '某区某路'
  modifyDialog.form.jurisdiction = randomJurisdiction()
  modifyDialog.form.incidentTime = formatDateTime(new Date())
  modifyDialog.form.unit = 'XX派出所'
  modifyDialog.form.result = `简要警情：${row.content || '...'}\n处理结果：已妥善处置。`
  modifyDialog.visible = true
}

const handleConfirm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      modifyDialog.visible = false
      ElMessage.success('修改成功')
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss">
.modify-dialog .el-dialog__header {
  text-align: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
  border-radius: 12px 12px 0 0;
}

.modify-dialog .el-dialog__title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 1px;
}

.modify-dialog .el-dialog__body {
  font-size: 15px;
  padding: 24px;
}
</style>

<style scoped lang="scss">
.modify-page {
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
