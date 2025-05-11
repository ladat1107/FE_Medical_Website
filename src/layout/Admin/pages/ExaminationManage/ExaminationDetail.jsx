"use client"
import { useGetExaminationById } from "@/hooks"
import { Drawer, Tag, Divider, Button, Empty, Statistic, Row, Col, Card, Typography, Collapse } from "antd"
import {
  User,
  Stethoscope,
  Pill,
  DollarSign,
  FileText,
  AlertCircle,
  Thermometer,
  CreditCard,
  Activity,
  FlaskRoundIcon as Flask,
  Heart,
  Weight,
  Ruler,
  Droplet,
  Printer,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  Phone,
  Mail,
  Building,
  Calendar,
  TreesIcon as Lungs,
  Calendar1,
  Hospital,
  Loader2,
  CheckCircle2,
  EyeOff,
} from "lucide-react"
import { SPECIAL_EXAMINATION, STATUS_BE } from "@/constant/value"
import HistoryModal from "@/layout/Doctor/components/HistoryModal/HistoryModal"
import { useEffect, useState } from "react"
import { formatDate } from "@/utils/formatDate"
import PaymentTooltip from "../../components/Tooltip/PaymentTooltip"
import ExaminationDetailSkeleton from "./Skeletons/ExaminationDetailSkeleton"
const { Title, Text } = Typography
const { Panel } = Collapse

// Status mapping functions
const getStatusTag = (status) => {
  const statusMap = {
    default: { color: "magenta", text: "Chưa xác định", icon: <Info size={14} className="mr-1" />, },
    pending: { color: "purple", text: "Chờ xác nhận", icon: <Loader2 size={14} className="mr-1" />, },
    processing: { color: "blue", text: "Đang khám", icon: <Stethoscope size={14} className="mr-1" />, },
    isHospitalized: { color: "gold", text: "Đang nằm viện", icon: <Hospital size={14} className="mr-1" />, },
    waitingPayment: { color: "orange", text: "Chờ thanh toán", icon: <CreditCard size={14} className="mr-1" />, },
    done: { color: "green", text: "Hoàn thành", icon: <CheckCircle2 size={14} className="mr-1" />, },
    cancel: { color: "red", text: "Đã hủy", icon: <XCircle size={14} className="mr-1" />, },
    hide: { color: "error", text: "Trốn viện", icon: <EyeOff size={14} className="mr-1" />, },
  };
  const statusInfo = statusMap[status] || {
    color: "default",
    text: "Không xác định",
    icon: <Info size={14} className="mr-1" />,
  }
  return (
    <Tag color={statusInfo.color} className="flex items-center text-sm py-1 px-2">
      {statusInfo.icon}
      {statusInfo.text}
    </Tag>
  )
}

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1).toISOString().slice(0, 10);
  const d2 = new Date(date2).toISOString().slice(0, 10);
  return d1 === d2
}

const getDischargeStatusTag = (status) => {
  if (status === 1) return <Text className="text-green-500">Đã xuất viện</Text>
  if (status === 2) return <Text className="text-red-500">Trốn viện</Text>
  if (status === 3) return <Text className="text-blue-500">Xin xuất viện</Text>
  if (status === 4) return <Text className="text-yellow-500">Hẹn tái khám</Text>
}
const getPaymentStatusTag = (status) => {
  const statusMap = {
    0: { color: "default", text: "Chưa hoàn tất", icon: <Clock size={14} className="mr-1" /> },
    1: { color: "success", text: "Hoàn tất", icon: <CheckCircle size={14} className="mr-1" /> },
  }

  const statusInfo = statusMap[status] || {
    color: "default",
    text: "Không xác định",
    icon: <Info size={14} className="mr-1" />,
  }
  return (
    <Tag color={statusInfo.color} className="flex items-center text-sm py-1 px-2">
      {statusInfo.icon}
      {statusInfo.text}
    </Tag>
  )
}

const getParaclinicalStatusTag = (status) => {
  const statusMap = {
    5: { color: "blue", text: "Chờ thực hiện", icon: <Clock size={14} className="mr-1" /> },
    4: { color: "warning", text: "Chờ thanh toán", icon: <Clock size={14} className="mr-1" /> },
    7: { color: "success", text: "Hoàn thành", icon: <CheckCircle size={14} className="mr-1" /> },
    0: { color: "error", text: "Đã hủy", icon: <XCircle size={14} className="mr-1" /> },
  }

  const statusInfo = statusMap[status] || {
    color: "default",
    text: "Không xác định",
    icon: <Info size={14} className="mr-1" />,
  }
  return (
    <Tag color={statusInfo.color} className="flex items-center text-sm py-1 px-2">
      {statusInfo.icon}
      {statusInfo.text}
    </Tag>
  )
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}
const ArraySpecialExamination = Object.entries(SPECIAL_EXAMINATION).map(([key, value]) => ({
  value: value.value,
  label: value.label,
}))
const formatSpecialExamination = (specialExamination) => {
  return ArraySpecialExamination.find((item) => item.value.includes(specialExamination))?.label || "Không xác định"
}


const ExaminationDrawer = ({ open, onClose, examinationId }) => {
  const { data: examination, isLoading } = useGetExaminationById(examinationId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusExamination, setStatusExamination] = useState("default")
  const examinationData = examination?.DT || {}
  const percentInsuranceCoverage = examinationData?.insuranceCoverage === 1 ? 100 : examinationData?.insuranceCoverage === 2 ? 95 : examinationData?.insuranceCoverage === 3 ? 80 : examinationData?.insuranceCoverage === 4 ? 100 : 0
  const [totalPricePrescription, setTotalPricePrescription] = useState(0)
  const [insuranceCoveredPrescription, setInsuranceCoveredPrescription] = useState(0)
  const [coveredPricePrescription, setCoveredPricePrescription] = useState(0)
  const [totalPriceParaclinical, setTotalPriceParaclinical] = useState(0)
  const [insuranceCoveredParaclinical, setInsuranceCoveredParaclinical] = useState(0)
  const [coveredPriceParaclinical, setCoveredPriceParaclinical] = useState(0)
  useEffect(() => {
    if (examinationData) {
      setTotalPricePrescription(examinationData?.prescriptionExamData?.reduce((sum, p) => sum + (p.totalMoney || 0), 0) || 0)
      setInsuranceCoveredPrescription(examinationData?.prescriptionExamData?.reduce((sum, p) => sum + (p.insuranceCovered || 0), 0) || 0)
      setCoveredPricePrescription(examinationData?.prescriptionExamData?.reduce((sum, p) => sum + (p.coveredPrice || 0), 0) || 0)
      setTotalPriceParaclinical(examinationData?.examinationResultParaclincalData?.reduce((sum, p) => sum + (p?.coveredPrice || 0), 0) || 0)
      setInsuranceCoveredParaclinical(examinationData?.examinationResultParaclincalData?.reduce((sum, p) => sum + (p?.insuranceCovered || 0), 0) || 0)
      setCoveredPriceParaclinical(examinationData?.examinationResultParaclincalData?.reduce((sum, p) => sum + (p?.coveredPrice || 0), 0) || 0)

      if (examinationData.status === STATUS_BE.DONE_INPATIENT || examinationData.status === STATUS_BE.DONE) {
        if (examinationData?.dischargeStatus === 2) {
          setStatusExamination("hide")
        } else {
          setStatusExamination("done")
        }
      } else if (examinationData.status === STATUS_BE.INACTIVE) {
        setStatusExamination("cancel")
      } else if (examinationData?.status === STATUS_BE.EXAMINING || examinationData?.status === STATUS_BE.PAID) {
        if (examinationData.medicalTreatmentTier === 1) setStatusExamination("isHospitalized")
        else setStatusExamination("processing")
      } else if (examinationData.status === STATUS_BE.WAITING) {
        setStatusExamination("waitingPayment")
      } else if (examinationData.status === STATUS_BE.PENDING || examinationData.status === STATUS_BE.ACTIVE) {
        setStatusExamination("pending")
      } else setStatusExamination("default")
    }
  }, [examinationData])

  // Header section with basic info and actions
  const renderHeader = () => (
    <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Title level={4} className="!m-0 !text-primary-tw">
              Đơn khám #{examinationData.id}
            </Title>
            {getStatusTag(statusExamination)}
          </div>
          <Text type="secondary" className="block mt-1">
            Ngày tạo: {formatDate(examinationData.createdAt)}
          </Text>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Statistic
            title="Tổng tiền"
            value={(examinationData?.price || 0) + totalPriceParaclinical + totalPricePrescription}
            precision={0}
            valueStyle={{ color: "#cf1322" }}
            suffix="₫"
            className="!mr-4"
          />
          {examinationData.paymentData && (
            <div className="flex items-center">
              <Text className="mr-2">Thanh toán:</Text>
              {getPaymentStatusTag(examinationData?.paymentData?.status || 1)}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button icon={<Printer size={16} />} className="flex items-center">
          In đơn khám
        </Button>
        <Button type="primary" style={{ backgroundColor: "#00B5F1" }} className="flex items-center" onClick={() => setIsModalOpen(true)}>
          Xem lịch sử
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center text-primary-tw">
            <FileText className="mr-2" size={20} />
            <span className="font-bold">Chi tiết đơn khám #{examinationData.id}</span>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={open}
        width={1000}
        footer={
          <div className="flex justify-end">
            <Button onClick={onClose} className="mr-2">
              Đóng
            </Button>
            <Button type="primary" style={{ backgroundColor: "#00B5F1" }} icon={<Printer size={16} />}>
              In đơn khám
            </Button>
          </div>
        }
        className="overflow-hidden"
        headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
        bodyStyle={{ padding: "16px", backgroundColor: "#f5f7fa" }}
      >
        {isLoading ? <ExaminationDetailSkeleton /> :
          <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(100vh - 120px)" }}>
            {renderHeader()}

            {/* Patient Information Section */}
            <Card
              title={
                <div className="flex items-center text-[#00B5F1]">
                  <User className="mr-2" size={18} />
                  <span className="font-bold">Thông tin bệnh nhân</span>
                </div>
              }
              className="mb-4"
              bordered={false}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card title="Thông tin cá nhân" bordered={false} className="h-full bg-bgAdmin">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Text type="secondary">Họ và tên:</Text>
                        <Text strong>
                          {examinationData.userExaminationData.lastName} {examinationData.userExaminationData.firstName}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">CMND/CCCD:</Text>
                        <Text>{examinationData.userExaminationData.cid}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Số điện thoại:</Text>
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1 text-gray-500" />
                          <Text>{examinationData.userExaminationData.phoneNumber || "Không có"}</Text>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Email:</Text>
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1 text-gray-500" />
                          <Text>{examinationData.userExaminationData.email || "Không có"}</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card title="Thông tin bảo hiểm" bordered={false} className="h-full bg-bgAdmin">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Text type="secondary">Mã bảo hiểm:</Text>
                        <Text>{examinationData.insuranceCode || "Không sử dụng bảo hiểm"}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Mức hưởng BHYT:</Text>
                        <Text>
                          {percentInsuranceCoverage}%
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Ngày hết hạn:</Text>
                        <Text className="text-green-600">{examinationData?.userExaminationData?.userInsuranceData?.exp ? formatDate(examinationData?.userExaminationData?.userInsuranceData?.exp) : "Chưa cập nhật"}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Mã đăng ký KCB:</Text>
                        <Text className="text-blue-600">
                          {examinationData?.userExaminationData?.userInsuranceData?.residentialCode || "Chưa cập nhật"}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Vital Signs Section */}
            <Card
              title={
                <div className="flex items-center text-primary-tw">
                  <Activity className="mr-2" size={18} />
                  <span className="font-bold">Thông tin sinh hiệu</span>
                </div>
              }
              className="mb-4"
              bordered={false}
            >
              {examinationData.examinationVitalSignData && examinationData.examinationVitalSignData.length > 0 ? (
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Ruler className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Chiều cao</div>
                      <div className="text-base font-semibold">{examinationData.examinationVitalSignData[0].height} cm</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Weight className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Cân nặng</div>
                      <div className="text-base font-semibold">{examinationData.examinationVitalSignData[0].weight} kg</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Heart className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Mạch</div>
                      <div className="text-base font-semibold">{examinationData.examinationVitalSignData[0].pulse} bpm</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Thermometer className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Nhiệt độ</div>
                      <div className="text-base font-semibold">{examinationData.examinationVitalSignData[0].temperature} °C</div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Activity className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Huyết áp</div>
                      <div className="text-base font-semibold">
                        {examinationData.examinationVitalSignData[0].hightBloodPressure}/
                        {examinationData.examinationVitalSignData[0].lowBloodPressure} mmHg
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Lungs className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Nhịp thở</div>
                      <div className="text-base font-semibold">
                        {examinationData.examinationVitalSignData[0].breathingRate} lần/phút
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Droplet className="text-primary-tw mx-auto mb-1" size={20} />
                      <div className="text-xs text-gray-500">Đường huyết</div>
                      <div className="text-base font-semibold">
                        {examinationData.examinationVitalSignData[0].glycemicIndex} mg/dL
                      </div>
                    </div>
                  </Col>
                  {examinationData.examinationVitalSignData[0].fetalWeight && (
                    <Col xs={12} sm={8} md={6} lg={4}>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Weight className="text-primary-tw mx-auto mb-1" size={20} />
                        <div className="text-xs text-gray-500">Cân nặng thai nhi</div>
                        <div className="text-base font-semibold">
                          {examinationData.examinationVitalSignData[0].fetalWeight} g
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>
              ) : (
                <Empty description="Không có dữ liệu sinh hiệu" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>

            {/* Doctor and Examination Information */}
            <Card
              title={
                <div className="flex items-center text-primary-tw">
                  <Stethoscope className="mr-2" size={18} />
                  <span className="font-bold">Thông tin khám bệnh</span>
                </div>
              }
              className="mb-4"
              bordered={false}
            >
              <Row gutter={[16, 16]}>
                {examinationData?.medicalTreatmentTier !== 1 &&
                  <Col xs={24} md={12}>
                    <Card title="Thông tin bác sĩ" bordered={false} className="h-full bg-bgAdmin">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Text type="secondary">Bác sĩ:</Text>
                          <Text strong>
                            {examinationData?.examinationStaffData?.staffUserData?.lastName || ""}{" "}
                            {examinationData?.examinationStaffData?.staffUserData?.firstName || ""}
                          </Text>
                        </div>
                        <div className="flex justify-between">
                          <Text type="secondary">Chức danh:</Text>
                          <Text>{examinationData?.examinationStaffData?.position || ""}</Text>
                        </div>
                        <div className="flex justify-between">
                          <Text type="secondary">Khoa:</Text>
                          <div className="flex items-center">
                            <Building size={14} className="mr-1 text-gray-500" />
                            <Text>{examinationData?.examinationStaffData?.staffDepartmentData?.name || ""}</Text>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Text type="secondary">Phòng khám:</Text>
                          <Text>{examinationData?.examinationStaffData?.staffDepartmentData?.name || ""}</Text>
                        </div>
                        <div className="flex justify-between">
                          <Text type="secondary">Số điện thoại:</Text>
                          <div className="flex items-center">
                            <Phone size={14} className="mr-1 text-gray-500" />
                            <Text>{examinationData?.examinationStaffData?.staffUserData?.phoneNumber || ""}</Text>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Text type="secondary">Email:</Text>
                          <div className="flex items-center">
                            <Mail size={14} className="mr-1 text-gray-500" />
                            <Text>{examinationData?.examinationStaffData?.staffUserData?.email || ""}</Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                }
                <Col xs={24} md={examinationData?.medicalTreatmentTier === 1 ? 24 : 12}>
                  <Card title="Chi tiết khám bệnh" bordered={false} className="h-full bg-bgAdmin">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Text type="secondary">Ngày khám:</Text>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-gray-500" />
                          <Text>{isSameDay(examinationData?.admissionDate, examinationData?.dischargeDate) ? formatDate(examinationData?.admissionDate || "") : `${formatDate(examinationData?.admissionDate || "")} - ${formatDate(examinationData?.dischargeDate || "")}`}</Text>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Triệu chứng:</Text>
                        <div className="flex items-center">
                          <Thermometer size={14} className="mr-1 text-gray-500" />
                          <Text>{examinationData?.symptom || "Không có"}</Text>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Chẩn đoán:</Text>
                        <Text strong className="text-right max-w-[250px]">
                          {examinationData?.diseaseName || "Chưa có chẩn đoán"}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Bệnh đi kèm:</Text>
                        <Text>{examinationData?.comorbidities || "Không có"}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Ưu tiên:</Text>
                        <Text>{formatSpecialExamination(examinationData?.special || "")}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Loại khám:</Text>
                        <Text>
                          {examinationData?.medicalTreatmentTier === 1
                            ? `Nhập viện`
                            : "Ngoại trú"}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Tuyến khám:</Text>
                        <Text>
                          {examinationData?.isWrongTreatment === 0
                            ? `Đúng tuyến`
                            : "Trái tuyến"}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Lý do nhập viện:</Text>
                        <Text>{examinationData?.reason || "Không có"}</Text>
                      </div>
                      <div className="flex justify-between">
                        <Text type="secondary">Kết quả điều trị:</Text>
                        <Text>{examinationData?.treatmentResult || "Chưa có kết quả điều trị"}</Text>
                      </div>
                      {examinationData?.dischargeStatus && (
                        <div className="flex justify-between">
                          <Text type="secondary">Tình trạng:</Text>
                          {getDischargeStatusTag(examinationData?.dischargeStatus)}
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* Payment Information */}
            <Card
              title={
                <div className="flex items-center text-primary-tw">
                  <CreditCard className="mr-2" size={18} />
                  <span className="font-bold">Thông tin thanh toán</span>
                </div>
              }
              className="mb-4"
              bordered={false}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card className="bg-bgAdmin h-full">
                    <Statistic
                      title={
                        <div className="flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          Tổng tiền
                        </div>
                      }
                      value={examinationData?.price + totalPriceParaclinical + totalPricePrescription}
                      precision={0}
                      suffix="₫"
                      valueStyle={{ color: "#cf1322" }}
                    />
                    <div className="mt-2 text-xs text-gray-500">Tổng chi phí khám bệnh</div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="bg-bgAdmin h-full">
                    <Statistic
                      title={
                        <div className="flex items-center">
                          <CreditCard size={14} className="mr-1" />
                          BHYT chi trả
                        </div>
                      }
                      value={insuranceCoveredParaclinical + insuranceCoveredPrescription + (examinationData?.insuranceCovered || 0)}
                      precision={0}
                      valueStyle={{ color: "#3f8600" }}
                      suffix="₫"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      {examinationData?.insuranceCoverage
                        ? `Mức hưởng: ${percentInsuranceCoverage}%`
                        : "Không có BHYT"}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card className="bg-bgAdmin h-full">
                    <Statistic
                      title={
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />
                          Bệnh nhân chi trả
                        </div>
                      }
                      value={(coveredPriceParaclinical > 0 ? coveredPriceParaclinical : totalPriceParaclinical) + (coveredPricePrescription > 0 ? coveredPricePrescription : totalPricePrescription) + (examinationData?.coveredPrice || examinationData?.price)}
                      precision={0}
                      valueStyle={{ color: "#1677ff" }}
                      suffix="₫"
                    />
                    <div className="mt-2 text-xs text-gray-500">Số tiền bệnh nhân phải thanh toán</div>
                  </Card>
                </Col>
              </Row>

              <Divider />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text strong>Thông tin giao dịch</Text>
                </div>

                <Row gutter={16}>
                  <Col xs={24}>
                    <div className="bg-white shadow-sm p-4 rounded-lg border border-gray-100">
                      <Text strong className="block mb-3 text-base text-gray-800">
                        Chi tiết chi phí
                      </Text>
                      <div className="space-y-3 text-sm text-gray-700">
                        {examinationData.price && examinationData?.medicalTreatmentTier === 1 ? (
                          <div className="flex justify-between">
                            <Text className="text-gray-600">Giường:</Text>
                            <Text className="font-medium text-right">{formatCurrency(examinationData.coveredPrice || examinationData.price)}</Text>
                          </div>
                        ) : (
                          <div className={`grid gap-2 items-start ${examinationData?.insuranceCovered ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            <Text className="text-gray-600">Phí khám bệnh:</Text>
                            {examinationData?.insuranceCovered && (
                              <Text className="text-right">
                                {formatCurrency(examinationData?.price)}
                                <span className="ml-2 border border-green-400 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">BHYT: {formatCurrency(examinationData?.insuranceCovered)}</span>
                              </Text>
                            )}
                            <Text className="flex flex-wrap items-center justify-end text-end gap-1">
                              {formatCurrency(examinationData?.coveredPrice || examinationData?.price || 0)}
                              {!examinationData?.paymentData || examinationData?.paymentData?.status !== 2 ? (
                                <span className="ml-1 text-blue-500 italic text-xs">(Chưa thanh toán)</span>
                              ) : (
                                <PaymentTooltip
                                  paymentData={examinationData?.paymentData}
                                >
                                  <span className="ml-1 text-gray-400 italic text-xs cursor-pointer"><Info size={12} className="mr-1" /></span>
                                </PaymentTooltip>
                              )}
                            </Text>
                          </div>
                        )}

                        {examinationData.prescriptionExamData && examinationData.prescriptionExamData.length > 0 && (
                          <div className={`grid gap-2 items-start ${insuranceCoveredPrescription > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            <Text className="text-gray-600">Tiền thuốc:</Text>
                            {insuranceCoveredPrescription > 0 && (
                              <Text className="text-right">
                                {formatCurrency(totalPricePrescription)}
                                <span className="ml-2 border border-green-400 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">BHYT: {formatCurrency(coveredPricePrescription)}</span>
                              </Text>
                            )}
                            <Text className="flex flex-wrap items-center justify-end text-end gap-1">
                              {formatCurrency(totalPricePrescription - insuranceCoveredPrescription)}
                              {examinationData?.medicalTreatmentTier !== 1 &&
                                <>
                                  {(!examinationData?.prescriptionExamData[0]?.paymentData ||
                                    examinationData?.prescriptionExamData[0]?.paymentData?.status !== 2) ? (
                                    <span className="ml-1 text-blue-500 italic text-xs">(Chưa thanh toán)</span>
                                  ) : (
                                    <PaymentTooltip
                                      paymentData={examinationData?.prescriptionExamData[0]?.paymentData}
                                    >
                                      <span className="ml-1 text-gray-400 cursor-pointer"><Info size={12} className="mr-1" /></span>
                                    </PaymentTooltip>
                                  )}
                                </>
                              }
                            </Text>
                          </div>
                        )}

                        {examinationData.examinationResultParaclincalData && examinationData.examinationResultParaclincalData.length > 0 && (
                          <div className={`grid gap-2 items-start ${insuranceCoveredParaclinical > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            <Text className="text-gray-600">Xét nghiệm cận lâm sàng:</Text>
                            {insuranceCoveredParaclinical > 0 && (
                              <Text className="text-right">
                                {formatCurrency(totalPriceParaclinical)}
                                <span className="ml-2 border border-green-400 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">BHYT: {formatCurrency(coveredPriceParaclinical)}</span>
                              </Text>
                            )}
                            <Text className="flex flex-wrap items-center justify-end text-end gap-1">
                              {formatCurrency(insuranceCoveredParaclinical > 0 ? coveredPriceParaclinical : totalPriceParaclinical)}
                              {examinationData?.medicalTreatmentTier !== 1 &&
                                <>
                                  {(!examinationData?.examinationResultParaclincalData[0]?.paymentData ||
                                    examinationData?.examinationResultParaclincalData[0]?.paymentData?.status !== 2) ? (
                                    <span className="ml-1 text-blue-500 italic text-xs">(Chưa thanh toán)</span>
                                  ) : (
                                    <PaymentTooltip
                                      paymentData={examinationData?.examinationResultParaclincalData[0]?.paymentData}
                                    >
                                      <span className="ml-1 text-gray-400 cursor-pointer"><Info size={12} className="mr-1" /></span>
                                    </PaymentTooltip>
                                  )}
                                </>}
                            </Text>
                          </div>
                        )}

                        <Divider className="my-2" />

                        <div className="flex justify-between font-semibold text-base">
                          <Text strong className="text-gray-800">Tổng cộng:</Text>
                          <Text strong className="text-red-500">
                            {formatCurrency(
                              (examinationData.coveredPrice || examinationData.price) +
                              (coveredPriceParaclinical > 0 ? coveredPriceParaclinical : totalPriceParaclinical) +
                              (coveredPricePrescription > 0 ? coveredPricePrescription : totalPricePrescription)
                            )}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Col>

                </Row>
              </div>
            </Card>

            {/* Prescription Section */}
            <Card
              title={
                <div className="flex items-center text-primary-tw">
                  <Pill className="mr-2" size={18} />
                  <span className="font-bold">Đơn thuốc</span>
                </div>
              }
              className="mb-4 [&_.ant-card-body]:p-0"
              bordered={false}
            >
              {examinationData.prescriptionExamData && examinationData.prescriptionExamData.length > 0 ? (
                examinationData.prescriptionExamData.map((prescription) => (
                  <Card
                    key={prescription.id}
                    title={
                      <div className="flex flex-col sm:flex-row items-start font-normal gap-2">
                        <span className="flex items-center text-sm text-secondaryText-tw">Đơn thuốc #{prescription.id} </span>
                        <span className="flex items-center ms-1 text-[12px] text-gray-500"><Calendar1 size={12} className="mr-1" />
                          {isSameDay(prescription?.createdAt, prescription?.endDate)
                            ? formatDate(prescription?.createdAt || "")
                            : `${formatDate(prescription?.createdAt || "")} - ${formatDate(prescription?.endDate || "")}`}
                        </span>
                      </div>
                    }
                    bordered={false}
                    className="mb-4 bg-gray-50"
                    extra={<Tag color="blue">Tổng: {formatCurrency(prescription.totalMoney)}</Tag>}
                  >
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tên thuốc
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Liều dùng
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Số lượng
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đơn vị
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đơn giá
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prescription.prescriptionDetails.map((medicine) => (
                            <tr key={medicine.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {medicine.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {medicine.PrescriptionDetail.dosage}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {medicine.PrescriptionDetail.quantity}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {medicine.PrescriptionDetail.unit}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                                {formatCurrency(medicine.price)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {prescription.note && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-start">
                          <AlertCircle className="mr-2 text-yellow-500 mt-0.5" size={16} />
                          <div>
                            <Text strong>Ghi chú:</Text>
                            <Text className="block">{prescription.note}</Text>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Empty description="Không có đơn thuốc" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>

            {/* Paraclinical Tests Section */}
            <Card
              title={
                <div className="flex items-center text-primary-tw">
                  <Flask className="mr-2" size={18} />
                  <span className="font-bold">Xét nghiệm cận lâm sàng</span>
                </div>
              }
              className="mb-4"
              bordered={false}
            >
              {examinationData.examinationResultParaclincalData &&
                examinationData.examinationResultParaclincalData.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Text strong>Danh sách xét nghiệm ({examinationData.examinationResultParaclincalData.length})</Text>
                    <Text>
                      Tổng chi phí:{" "}
                      <span className="text-red-500 font-medium">
                        {formatCurrency(
                          examinationData.examinationResultParaclincalData.reduce((sum, p) =>
                            p?.paymentData && p?.paymentData?.status === 2 ? sum + (p?.coveredPrice || p?.price) : sum + p?.price, 0),
                        )}
                      </span>
                    </Text>
                  </div>

                  <Collapse defaultActiveKey={["0"]} className="bg-white">
                    {examinationData.examinationResultParaclincalData.map((paraclinical, index) => (
                      <Panel
                        key={index}
                        header={
                          <div className="flex justify-between items-center w-full pr-8">
                            <div className="flex items-center">
                              <Flask size={16} className="mr-2 text-primary-tw" />
                              <Text strong>{paraclinical.paracName}</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              {getParaclinicalStatusTag(paraclinical.status)}
                              <Text className="text-red-500">
                                {paraclinical?.paymentData && paraclinical?.paymentData?.status === 2 ?
                                  formatCurrency(paraclinical?.coveredPrice || paraclinical?.price) :
                                  paraclinical?.paymentData?.status === 0 ? "Đã hủy" : "Chờ thanh toán"}
                              </Text>
                            </div>
                          </div>
                        }
                        className="mb-2 border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <Row gutter={[16, 16]}>
                          <Col xs={24} md={12}>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between">
                                <Text type="secondary">Mã xét nghiệm:</Text>
                                <Text>#{paraclinical.id}</Text>
                              </div>
                              <div className="flex justify-between">
                                <Text type="secondary">Phòng xét nghiệm:</Text>
                                <Text>{paraclinical.roomParaclinicalData.name}</Text>
                              </div>
                              <div className="flex justify-between">
                                <Text type="secondary">Khoa:</Text>
                                <Text>{paraclinical.doctorParaclinicalData.staffDepartmentData.name}</Text>
                              </div>
                              <div className="flex justify-between">
                                <Text type="secondary">Bác sĩ thực hiện:</Text>
                                <Text>
                                  {paraclinical.doctorParaclinicalData.staffUserData.lastName}{" "}
                                  {paraclinical.doctorParaclinicalData.staffUserData.firstName}
                                </Text>
                              </div>
                              <div className="flex justify-between">
                                <Text type="secondary">Ngày thực hiện:</Text>
                                <div className="flex items-center">
                                  <Calendar size={14} className="mr-1 text-gray-500" />
                                  <Text>{formatDate(paraclinical.createdAt)}</Text>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <Text type="secondary">Giá:</Text>
                                <div className="flex items-center">
                                  <Text>{formatCurrency(paraclinical.price)}</Text>
                                </div>
                              </div>
                              {paraclinical.insuranceCovered && < div className="flex justify-between">
                                <Text type="secondary">BHYT chi trả:</Text>
                                <div className="flex items-center">
                                  <Text>{formatCurrency(paraclinical.insuranceCovered)}</Text>
                                </div>
                              </div>}
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <div className="bg-gray-50 p-4 rounded-lg h-full">
                              {paraclinical.result || paraclinical.description || paraclinical.image ? (
                                <div className="space-y-3">
                                  {paraclinical.result && (
                                    <div>
                                      <Text strong className="block mb-1">
                                        Kết quả:
                                      </Text>
                                      <div className="p-2 bg-white rounded border border-gray-200">
                                        {paraclinical.result}
                                      </div>
                                    </div>
                                  )}

                                  {paraclinical.description && (
                                    <div>
                                      <Text strong className="block mb-1">
                                        Mô tả:
                                      </Text>
                                      <div className="p-2 bg-white rounded border border-gray-200">
                                        {paraclinical.description}
                                      </div>
                                    </div>
                                  )}

                                  {paraclinical.image && (
                                    <div>
                                      <Text strong className="block mb-1">
                                        Hình ảnh:
                                      </Text>
                                      <div className="p-2 bg-white rounded border border-gray-200">
                                        <img
                                          src={paraclinical.image || "/placeholder.svg"}
                                          alt="Kết quả xét nghiệm"
                                          className="max-w-full h-auto rounded"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Empty description="Chưa có kết quả" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                  </Collapse>
                </div>
              ) : (
                <Empty description="Không có dữ liệu cận lâm sàng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          </div >}
      </Drawer >

      {!isLoading && (
        <div className="modal-history-content">
          <HistoryModal
            isModalOpen={isModalOpen}
            handleCancel={() => setIsModalOpen(false)}
            userId={examinationData?.userExaminationData?.id}
          />
        </div>
      )}
    </>
  )
}

export default ExaminationDrawer
