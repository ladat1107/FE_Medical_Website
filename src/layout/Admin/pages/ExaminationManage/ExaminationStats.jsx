"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Table, Tooltip as TooltipAntd } from "antd"
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"
import { UserOutlined, MedicineBoxOutlined, DollarOutlined, CalendarOutlined } from "@ant-design/icons"
import dayjs from "dayjs";
import { MEDICAL_TREATMENT_TIER, PAYMENT_STATUS, STATUS_BE } from "@/constant/value"
import TooltipTypeExam from "../../components/Tooltip/TooltipTypeExam"
import { ChartBar, ChartScatter, ClipboardPlus, GraduationCap, Info, TrendingUp } from "lucide-react"

const examTrendDefault = [{ name: "T2", examinations: 0, appointments: 0, revenue: 0 },
{ name: "T3", examinations: 0, appointments: 0, revenue: 0 },
{ name: "T4", examinations: 0, appointments: 0, revenue: 0 },
{ name: "T5", examinations: 0, appointments: 0, revenue: 0 },
{ name: "T6", examinations: 0, appointments: 0, revenue: 0 },
{ name: "T7", examinations: 0, appointments: 0, revenue: 0 },
{ name: "CN", examinations: 0, appointments: 0, revenue: 0 },
]

const ExaminationStats = ({ examinationList, dateRange, timeFrame }) => {

  const [examinationStats, setExaminationStats] = useState({
    totalInpatient: 0,
    totalOutpatient: 0,
    totalEmergency: 0,
    averageExaminationsPerDay: 0,
    statusDistribution: [],
    examinationTrend: [],
    topDoctors: [],
    topDiseases: [],
  })

  useEffect(() => {
    if (examinationList?.EC === 0 && examinationList?.DT) {
      const examinations = (examinationList?.DT);
      let totalInpatient = 0;
      let totalOutpatient = 0;
      let totalEmergency = 0;
      let doneExaminations = { name: "Hoàn thành", value: 0, detail: [0, 0, 0], color: "#52c41a" };
      let cancelExaminations = { name: "Hủy", value: 0, detail: [0, 0, 0], color: "#ff4d4f" };
      let processingExaminations = { name: "Đang khám", value: 0, detail: [0, 0, 0], color: "#faad14" };
      let pendingExaminations = { name: "Chờ khám", value: 0, detail: [0, 0, 0], color: "#1890ff" };
      let statusDistribution = [];
      let examinationTrend = examTrendDefault.map(item => ({ ...item }));
      let topDoctors = [];
      let topDiseases = [];
      examinations.forEach(examination => {
        // Thống kê về loại đơn khám
        if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT) totalInpatient += 1;
        else if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.EMERGENCY) totalEmergency += 1;
        else totalOutpatient += 1;

        // Thống kê về trạng thái đơn khám
        if (examination.status === STATUS_BE.PENDING || examination.status === STATUS_BE.ACTIVE) {
          if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT) {
            pendingExaminations.detail[0] += 1;
          }
          else if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {
            pendingExaminations.detail[1] += 1;
          }
          else {
            pendingExaminations.detail[2] += 1;
          }
          pendingExaminations.value += 1;
        }
        else if (examination.status === STATUS_BE.DONE || examination.status === STATUS_BE.DONE_INPATIENT) {
          if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT) { doneExaminations.detail[0] += 1; }
          else if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) { doneExaminations.detail[1] += 1; }
          else { doneExaminations.detail[2] += 1; }
          doneExaminations.value += 1;

          // Thống kê về xu hướng đơn khám và Bác sĩ khám nhiều nhất
          if (examination.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {
            // Thống kê về xu hướng đơn khám
            const dayOfWeek = dayjs(examination.admissionDate).day();
            const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek === 1 ? 0 : dayOfWeek === 2 ? 1 : dayOfWeek === 3 ? 2 : dayOfWeek === 4 ? 3 : dayOfWeek === 5 ? 4 : 5;
            if (examination.is_appointment === 1) { examinationTrend[dayIndex].examinations += 1 }
            else {
              examinationTrend[dayIndex].appointments += 1;
            }
            if (examination?.paymentData && examination?.paymentData?.status === PAYMENT_STATUS.PAID) {
              examinationTrend[dayIndex].revenue += examination?.price || 0;
            }
            if (examination?.examinationResultParaclincalData?.length > 0 &&
              ((examination?.examinationResultParaclincalData[0]?.paymentData && examination?.examinationResultParaclincalData[0]?.paymentData?.status === PAYMENT_STATUS.PAID))) {
              examination?.examinationResultParaclincalData.forEach(paraclinical => {
                examinationTrend[dayIndex].revenue += paraclinical?.price || 0;
              })
            }
            if (examination?.prescriptionExamData?.length > 0 && ((examination?.prescriptionExamData[0]?.paymentData && examination?.prescriptionExamData[0]?.paymentData?.status === PAYMENT_STATUS.PAID))) {
              examination?.prescriptionExamData.forEach(prescription => {
                examinationTrend[dayIndex].revenue += prescription?.totalMoney || 0;
              })
            }
          }
        }
        else if (examination.status === STATUS_BE.INACTIVE) {
          if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT) {
            cancelExaminations.detail[0] += 1;
          }
          else if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {
            cancelExaminations.detail[1] += 1;
          }
          else {
            cancelExaminations.detail[2] += 1;
          }
          cancelExaminations.value += 1;
        }
        else {
          if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT) {
            processingExaminations.detail[0] += 1;
          }
          else if (examination?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {
            processingExaminations.detail[1] += 1;
          }
          else {
            processingExaminations.detail[2] += 1;
          }
          processingExaminations.value += 1;
        }
      })

      if (cancelExaminations.value > 0) {
        statusDistribution.push(cancelExaminations)
      }
      if (processingExaminations.value > 0) {
        statusDistribution.push(processingExaminations)
      }
      if (pendingExaminations.value > 0) {
        statusDistribution.push(pendingExaminations)
      }
      if (doneExaminations.value > 0) {
        statusDistribution.push(doneExaminations)
      }

      // Thống kê về Bác sĩ khám nhiều nhất
      topDoctors = examinations.reduce((acc, item) => {
        const staff = item.examinationStaffData;
        if (!staff || staff.staffUserData.status === STATUS_BE.INACTIVE || item.status !== STATUS_BE.DONE) return acc; // Bỏ qua nếu không có bác sĩ

        const staffId = staff.id;

        if (!acc[staffId]) {
          acc[staffId] = {
            id: staffId,
            name: `${staff?.staffUserData?.lastName?.trim() || ''} ${staff?.staffUserData?.firstName?.trim() || ''}`.trim(),
            position: staff?.staffUserData?.position || '',
            cid: staff?.staffUserData?.cid || '',
            phoneNumber: staff?.staffUserData?.phoneNumber || '',
            email: staff?.staffUserData?.email || '',
            department: staff.staffDepartmentData?.name || '',
            examinations: 0,
          };
        }

        acc[staffId].examinations += 1;
        return acc;
      }, {});

      // Thống kê về bệnh phổ biến nhất
      topDiseases = examinations.reduce((acc, item) => {
        const disease = item?.diseaseName;
        if (!disease || (item.status !== STATUS_BE.DONE && item.status !== STATUS_BE.DONE_INPATIENT)) return acc;
        if (!acc[disease]) {
          const [code, ...nameParts] = disease.split(" - ");
          const name = nameParts.join(" - ");
          acc[disease] = {
            id: code,
            name: name,
            count: 0,
            percentage: 0,
          };
        }
        acc[disease].count += 1;
        return acc;
      }, {});
      topDoctors = Object.values(topDoctors).sort((a, b) => b.examinations - a.examinations);
      topDoctors = topDoctors.slice(0, 5);
      topDiseases = Object.values(topDiseases).sort((a, b) => b.count - a.count);
      topDiseases = topDiseases.slice(0, 10).map(item => ({
        ...item,
        percentage: ((item.count / (doneExaminations.value)) * 100).toFixed(1),
      }));

      setExaminationStats({
        totalInpatient,
        totalOutpatient,
        totalEmergency,
        averageExaminationsPerDay: Math.round((examinations.length - cancelExaminations.value) / (timeFrame === "today" || timeFrame === "yesterday" ? 1 : dateRange[1].diff(dateRange[0], "day"))),
        statusDistribution,
        examinationTrend,
        topDoctors,
        topDiseases,
      })
    }
  }, [examinationList])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  const doctorColumns = [
    {
      title: "Bác sĩ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Khoa",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Số ca khám",
      dataIndex: "examinations",
      key: "examinations",
      sorter: (a, b) => a.examinations - b.examinations,
    }, {
      title: "",
      dataIndex: "detail",
      key: "detail",
      className: "text-center",
      render: (_, record) => {
        const tooltipContent = (
          <div className="text-sm text-left p-2 rounded-md shadow-md">
            <div className="flex flex-wrap justify-between gap-1"><strong>Họ tên</strong> {record.name}</div>
            <div className="flex flex-wrap justify-between gap-1"><strong>CCCD</strong> {record.cid}</div>
            <div className="flex flex-wrap justify-between gap-1"><strong>SĐT</strong> {record.phoneNumber}</div>
            <div className="flex flex-wrap justify-between gap-1"><strong>Khoa</strong> {record.department}</div>
            <div className="flex flex-wrap justify-between gap-1"><strong>Email</strong> {record.email}</div>
          </div>
        );

        return (
          <TooltipAntd title={tooltipContent} placement="left">
            <span className="text-center cursor-pointer">
              <Info size={12} />
            </span>
          </TooltipAntd>
        );
      }
    }
  ]

  const diseaseColumns = [
    {
      title: "Mã bệnh",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Bệnh",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số ca",
      dataIndex: "count",
      key: "count",
      width: 80,
      className: "text-center",
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: "Tỷ lệ",
      dataIndex: "percentage",
      key: "percentage",
      width: 80,
      className: "text-center",
      render: (percentage) => `${percentage}%`,
      sorter: (a, b) => a.percentage - b.percentage,
    },
  ]

  const COLORS = ["#1890ff", "#faad14", "#52c41a", "#ff4d4f", "#722ed1", "#13c2c2"]

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div>
          <div className="flex items-center gap-2 text-xl font-medium text-secondaryText-tw"><ChartBar size={20} /> Thống kê đơn khám bệnh</div>
        </div>
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl border-1 border-gray-300">
            <Statistic
              title={<div className="flex items-center gap-2"><span className="text-black">Nhập viện</span><MedicineBoxOutlined style={{ color: "black" }} /></div>}
              value={examinationStats.totalInpatient}
              valueStyle={{ color: "black", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl border-1 border-gray-300">
            <Statistic
              title={<div className="flex items-center gap-2"><span className="text-black">Khám bệnh</span><CalendarOutlined style={{ color: "black" }} /></div>}
              value={examinationStats.totalOutpatient}
              valueStyle={{ color: "black", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl border-1 border-gray-300">
            <Statistic
              title={<div className="flex items-center gap-2"><span className="text-black">Cấp cứu</span><DollarOutlined style={{ color: "black" }} /></div>}
              value={examinationStats.totalEmergency}
              valueStyle={{ color: "black", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="shadow-sm rounded-xl border-1 border-gray-300">
            <Statistic
              title={<div className="flex items-center gap-2"><span className="text-black">Trung bình/ngày</span><UserOutlined style={{ color: "black" }} /></div>}
              value={examinationStats.averageExaminationsPerDay}
              valueStyle={{ color: "black", fontWeight: "bold" }}
              suffix="ca"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-10">
        <Col xs={24} lg={12}>
          <Card title={<div className="flex items-center gap-2 text-primary-tw text-base font-bold"><ChartScatter size={18} /><span>Phân bố trạng thái đơn khám</span></div>}
            className="shadow-sm rounded-xl border-1 border-gray-300">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={examinationStats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {examinationStats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipTypeExam />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<div className="flex items-center gap-2 text-primary-tw text-base font-bold"><TrendingUp size={18} /><span>Xu hướng đơn khám và doanh thu</span></div>}
            className="shadow-sm rounded-xl border-1 border-gray-300">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={examinationStats.examinationTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Doanh thu") return [formatCurrency(value), name];
                    return [`${value} ca`, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="examinations"
                  stroke="#00B5F1"
                  name="Đơn khám"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="appointments"
                  stroke="#722ed1"
                  name="Lịch hẹn"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#52c41a"
                  name="Doanh thu"
                  barSize={30}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<div className="flex items-center gap-2 text-primary-tw text-base font-bold"><GraduationCap size={18} /><span>Danh sách bác sĩ có nhiều ca khám nhất</span></div>}
            className="shadow-sm rounded-xl border-1 border-gray-300 [&_.ant-card-body]:!p-2">
            <Table
              columns={doctorColumns}
              dataSource={examinationStats.topDoctors}
              rowKey="id"
              pagination={false}
              size="middle"
              className="p-2 h-[320px]"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<div className="flex items-center gap-2 text-primary-tw text-base font-bold"><ClipboardPlus size={18} /><span>Danh sách bệnh phổ biến nhất</span></div>}
            className="shadow-sm rounded-xl border-1 border-gray-300 [&_.ant-card-body]:!p-2">
            <Table
              columns={diseaseColumns}
              dataSource={examinationStats.topDiseases}
              rowKey="id"
              pagination={false}
              size="middle"
              scroll={{ y: 260 }}
              className="p-2 h-[320px] "
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ExaminationStats
