export interface ProblemAlarm {
  index: number
  alarmNo: string
  detail: string
  suggestion: string
}

export const getProblemAlarms = () => {
  return new Promise<{ code: number; data: ProblemAlarm[]; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { index: 1, alarmNo: '3201202401000001', detail: '地址信息填写不完整', suggestion: '补充详细地址' },
          { index: 2, alarmNo: '3201202401000002', detail: '警情类别选择错误', suggestion: '修改为治安案件' },
          { index: 3, alarmNo: '3201202401000003', detail: '缺少现场照片', suggestion: '上传现场照片' },
          { index: 4, alarmNo: '3201202401000004', detail: '报警人信息缺失', suggestion: '完善报警人信息' },
          { index: 5, alarmNo: '3201202401000005', detail: '处警时间超时', suggestion: '及时反馈处警情况' },
          { index: 6, alarmNo: '3201202401000006', detail: '案件描述过于简单', suggestion: '详细描述案件经过' },
          { index: 7, alarmNo: '3201202401000007', detail: '缺少相关附件', suggestion: '上传必要附件材料' },
          { index: 8, alarmNo: '3201202401000008', detail: '警情状态未更新', suggestion: '及时更新处理进度' },
          { index: 9, alarmNo: '3201202401000009', detail: '关联案件信息错误', suggestion: '核对关联案件信息' },
          { index: 10, alarmNo: '3201202401000010', detail: '处理结果填写不规范', suggestion: '规范填写处理结果' },
          { index: 11, alarmNo: '3201202401000011', detail: '缺少结案审批', suggestion: '补充结案审批流程' },
          { index: 12, alarmNo: '3201202401000012', detail: '当事人签名缺失', suggestion: '完善当事人签名' },
          { index: 13, alarmNo: '3201202401000013', detail: '证据材料不完整', suggestion: '补充完整证据材料' },
          { index: 14, alarmNo: '3201202401000014', detail: '案件分类不准确', suggestion: '重新选择案件分类' },
          { index: 15, alarmNo: '3201202401000015', detail: '移交手续不齐全', suggestion: '补齐移交相关手续' },
        ],
        message: 'success'
      })
    }, 500)
  })
}

export interface OfficerInfo {
  name: string
  policeNo: string
  position: string
  phone: string
}

export const getDutyOfficer = () => {
  return new Promise<{ code: number; data: OfficerInfo; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          name: '张伟',
          policeNo: '110102198801011234',
          position: '值班民警',
          phone: '13800138000'
        },
        message: 'success'
      })
    }, 500)
  })
}

export interface MajorAlarm {
  index: number
  alarmNo: string
  content: string
  reporter: string
  phone: string
  time: string
  address: string
}

export const getMajorAlarms = () => {
  return new Promise<{ code: number; data: MajorAlarm[]; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { index: 1, alarmNo: '3201202401000010', content: '聚众斗殴事件', reporter: '李明', phone: '13800138001', time: '2024-01-15 14:30:00', address: '某区某路某商场门口' },
          { index: 2, alarmNo: '3201202401000011', content: '交通事故逃逸', reporter: '王芳', phone: '13800138002', time: '2024-01-15 15:20:00', address: '某区某路交叉口' },
        ],
        message: 'success'
      })
    }, 500)
  })
}

export interface AlarmRecord {
  criminal: number
  administrative: number
  civil: number
  traffic: number
}

export const getAlarmRecords = () => {
  return new Promise<{ code: number; data: AlarmRecord; message: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          criminal: 45,
          administrative: 32,
          civil: 18,
          traffic: 67
        },
        message: 'success'
      })
    }, 500)
  })
}

export interface TodoItem {
  index: number
  alarmNo: string
  content: string
  reporter: string
  phone: string
  time: string
  address: string
  signed: boolean
  dispatched: boolean
  dispatcherName?: string
  handled: boolean
  relatedAlarmNo?: string
  duplicateOf?: string
  approved: boolean
  approvalResult?: string
  approver?: string
  approvalUnit?: string
  approvalTime?: string
  transferReason?: string
  transferSubmitted?: boolean
}

export interface TodoPageResult {
  list: TodoItem[]
  total: number
}

export const getTodoList = (params?: { alarmNo?: string; content?: string; reporter?: string; phone?: string; time?: string; address?: string; signed?: boolean; handled?: boolean; approved?: boolean; page?: number; pageSize?: number }) => {
  return new Promise<{ code: number; data: TodoPageResult; message: string }>((resolve) => {
    const contents = [
      '邻里纠纷调解', '噪音扰民投诉', '车辆刮擦事故', '老人走失求助', '醉酒闹事事件',
      '商铺被盗报案', '电梯故障困人', '家庭暴力求助', '燃气泄漏报警', '宠物咬人事件',
      '交通事故处理', '物品丢失求助', '打架斗殴事件', '精神病患滋事', '消防隐患排查',
      '经济纠纷调解', '未成年人纠纷', '噪音施工投诉', '诈骗案件报案', '人身伤害求助',
      '房屋漏水纠纷', '流浪狗伤人事件', '广场舞噪音投诉', '高空抛物事件', '电动车丢失报案',
      '入室盗窃报案', '抢劫案件报警', '恶意破坏公物', '非法集会举报', '拖欠工资投诉',
      '医疗纠纷求助', '校园欺凌举报', '电信诈骗报案', '传销窝点举报', '环境污染投诉',
      '非法占道经营', '违章建筑举报', '非法行医举报', '食品安全投诉', '假冒伪劣举报',
      '恶意欠薪举报', '非法集资举报', '非法运输举报', '走私案件举报', '偷税漏税举报',
      '侵犯知识产权', '网络侵权举报', '诽谤造谣举报', '隐私泄露投诉', '数据盗窃报案',
      '黑客攻击报案', '网络诈骗举报', '虚拟财产被盗', '游戏账号被盗', '直播诈骗举报',
      '网约车纠纷', '快递丢失投诉', '外卖食品安全', '产品质量投诉', '售后服务纠纷',
      '装修合同纠纷', '租赁合同纠纷', '物业纠纷调解', '停车位纠纷', '邻里噪音纠纷',
      '宠物扰民投诉'
    ]

    const reporters = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '冯二',
      '陈三', '褚四', '卫五', '蒋六', '沈七', '韩八', '杨九', '朱十', '秦一', '尤二',
      '许三', '何四', '吕五', '施六', '张七', '孔八', '曹九', '严十', '华一', '金二',
      '魏三', '陶四', '姜五', '戚六', '谢七', '邹八', '喻九', '柏十', '水一', '窦二',
      '章三', '云四', '苏五', '潘六', '葛七', '奚八', '范九', '彭十', '郎一', '鲁二',
      '韦三', '昌四', '马五', '苗六', '凤七', '花八', '方九', '俞十', '任一', '袁二',
      '柳三', '酆四', '鲍五', '史六', '唐七', '费八', '廉九', '岑十', '薛一', '雷二']

    const addresses = [
      '朝阳区建国路88号', '海淀区中关村大街1号', '东城区王府井大街50号', '西城区西单北大街120号',
      '朝阳区三里屯路19号', '海淀区五道口购物中心', '东城区东方广场', '朝阳区望京SOHO',
      '海淀区知春路27号', '西城区金融街购物中心', '朝阳区国贸桥', '海淀区当代商城',
      '东城区簋街', '朝阳区工体北路', '海淀区中关村软件园', '西城区西直门外大街',
      '朝阳区朝阳大悦城', '海淀区清华科技园', '东城区银河SOHO', '朝阳区凤凰城',
      '海淀区万柳中路', '西城区积水潭桥', '朝阳区奥林匹克公园', '海淀区上地软件园',
      '东城区崇文门新世界', '朝阳区亚运村', '海淀区公主坟商圈', '东城区南锣鼓巷',
      '朝阳区CBD核心区', '海淀区学院路', '东城区东直门', '朝阳区大望路',
      '海淀区紫竹桥', '西城区金融街', '朝阳区亮马桥', '海淀区四季青',
      '东城区天坛公园', '朝阳区团结湖', '海淀区白石桥', '西城区什刹海',
      '朝阳区劲松', '海淀区马连洼', '东城区地安门', '朝阳区潘家园',
      '海淀区西三旗', '西城区德胜门', '朝阳区十里河', '海淀区清河',
      '东城区东四', '朝阳区六里屯', '海淀区安宁庄', '西城区阜成门',
      '朝阳区八里庄', '海淀区西北旺', '东城区安定门', '朝阳区将台路',
      '海淀区香山', '西城区西四', '朝阳区酒仙桥', '海淀区温泉镇',
      '东城区灯市口', '朝阳区来广营', '海淀区苏家坨', '西城区广安门',
      '朝阳区崔各庄', '海淀区上庄镇'
    ]

    const officers = ['李警官', '王警官', '张警官', '赵警官', '钱警官', '孙警官', '周警官', '吴警官', '郑警官', '冯警官']

    const transferReasons = ['管辖区域变更', '警力不足', '案件性质变更', '涉密案件移交', '跨区域协作', '重大案件上报']

    const allData: TodoItem[] = []
    const approvalResults = ['刑事', '行政', '交通', '纠纷', '斗殴', '盗窃', '诈骗', '求助', '噪音扰民', '其他']
    for (let i = 1; i <= 65; i++) {
      const dispatched = i % 3 === 0
      const signed = i % 4 === 0 || i % 5 === 0
      const handled = signed && i % 2 === 0
      const relatedAlarmNo = i % 7 === 0 && i + 1 <= 65 ? `3201202401${String(i + 1).padStart(6, '0')}` : undefined
      const duplicateOf = i % 11 === 0 && i + 2 <= 65 ? `3201202401${String(i + 2).padStart(6, '0')}` : undefined
      const approved = i % 3 === 0 || i % 4 === 0
      const approvalResult = approved ? approvalResults[i % approvalResults.length] : undefined
      const approverVal = approved ? '张三' : undefined
      const approvalUnit = approved ? 'XX派出所' : undefined
      const approvalTime = approved ? `2024-01-${15 + Math.floor((i - 1) / 24)} ${String(8 + (i - 1) % 14).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00` : undefined
      allData.push({
        index: i,
        alarmNo: `3201202401${String(i).padStart(6, '0')}`,
        content: contents[(i - 1) % contents.length],
        reporter: reporters[(i - 1) % reporters.length],
        phone: `13800138${String(i).padStart(3, '0')}`,
        time: `2024-01-${15 + Math.floor((i - 1) / 24)} ${String(8 + (i - 1) % 14).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:00`,
        address: addresses[(i - 1) % addresses.length],
        signed,
        dispatched,
        dispatcherName: dispatched ? officers[(i - 1) % officers.length] : undefined,
        handled,
        relatedAlarmNo,
        duplicateOf,
        approved,
        approvalResult,
        approver: approverVal,
        approvalUnit,
        approvalTime,
        transferReason: transferReasons[(i - 1) % transferReasons.length],
        transferSubmitted: i % 3 !== 0
      })
    }

    let result = allData
    if (params?.alarmNo) {
      result = result.filter(item => item.alarmNo.includes(params.alarmNo!))
    }
    if (params?.content) {
      result = result.filter(item => item.content.includes(params.content!))
    }
    if (params?.reporter) {
      result = result.filter(item => item.reporter.includes(params.reporter!))
    }
    if (params?.phone) {
      result = result.filter(item => item.phone.includes(params.phone!))
    }
    if (params?.time) {
      result = result.filter(item => item.time.includes(params.time!))
    }
    if (params?.address) {
      result = result.filter(item => item.address.includes(params.address!))
    }
    if (params?.signed !== undefined) {
      result = result.filter(item => item.signed === params.signed)
    }
    if (params?.handled !== undefined) {
      result = result.filter(item => item.handled === params.handled)
    }
    if (params?.approved !== undefined) {
      result = result.filter(item => item.approved === params.approved)
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = result.slice(start, end)

    setTimeout(() => {
      resolve({
        code: 200,
        data: { list: paginatedData, total: result.length },
        message: 'success'
      })
    }, 300)
  })
}
