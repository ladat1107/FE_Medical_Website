"use client"

import { useState, useEffect } from "react"
import { Tabs, Card, Statistic, Row, Col, Select, DatePicker, Button, message } from "antd"
import { CalendarOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"
import ExaminationList from "./ExaminationList"
import AppointmentList from "./AppointmentList"
import ExaminationStats from "./ExaminationStats"
import { SquareMenu } from "lucide-react"
import { useGetExamination } from "@/hooks"
import { STATUS_BE } from "@/constant/value"
import dayjs from "dayjs"
const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { Option } = Select
const ExaminationDashboard = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const [timeFrame, setTimeFrame] = useState("month");
  const { data: examinationData, isLoading: isLoadingExamination, refetch: refetchExamination, isFetching: isFetchingExamination } = useGetExamination(dateRange ? { startDate: dateRange[0].format("YYYY-MM-DD HH:mm:ss"), endDate: dateRange[1].format("YYYY-MM-DD HH:mm:ss") } : null)
  const { data: appointmentData, isLoading: isLoadingAppointment, refetch: refetchAppointment, isFetching: isFetchingAppointment } = useGetExamination({ startDate: dayjs().format("YYYY-MM-DD HH:mm:ss"), endDate: dayjs().add(1, "year").format("YYYY-MM-DD HH:mm:ss") })
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("1")
  const [stats, setStats] = useState({
    totalExaminations: 0,
    pendingExaminations: 0,
    completedExaminations: 0,
    upcomingAppointments: 0,
  })
  useEffect(() => {
    refetchExamination()
  }, [dateRange])

  useEffect(() => {
    if (examinationData?.EC === 0 && examinationData?.DT) {
      const examinations = (examinationData?.DT);
      let totalExaminations = 0;
      let pendingExaminations = 0;
      let completedExaminations = 0;
      let cancelExaminations = 0;

      examinations.forEach(examination => {
        if (examination.status === STATUS_BE.DONE || examination.status === STATUS_BE.DONE_INPATIENT) {
          completedExaminations += 1;
          totalExaminations += 1;
        } else if (examination.status === STATUS_BE.INACTIVE) {
          cancelExaminations += 1;
        } else if (examination.status === STATUS_BE.PENDING || examination.status === STATUS_BE.WAITING || examination.status === STATUS_BE.PAID || examination.status === STATUS_BE.EXAMINING) {
          pendingExaminations += 1;
          totalExaminations += 1;
        }
      })
      setStats({
        ...stats,
        totalExaminations: totalExaminations,
        pendingExaminations: pendingExaminations,
        completedExaminations: completedExaminations,
      })
    }
  }, [examinationData])
  useEffect(() => {
    if (appointmentData?.EC === 0 && appointmentData?.DT) {
      setAppointments(appointmentData?.DT)
      setStats({
        ...stats,
        upcomingAppointments: appointmentData?.DT.length,
      })
    }
  }, [appointmentData])

  const handleDateRangeChange = (dates) => {
    setDateRange(dates)
  }
  const handleRefetch = () => {
    refetchExamination()
    refetchAppointment()
  }
  
  const handleTimeFrameChange = (value) => {
    if (value === "today") {
      setDateRange([dayjs(), dayjs()])
    } else if (value === "yesterday") {
      setDateRange([dayjs().subtract(1, "day"), dayjs().subtract(1, "day")])
    } else if (value === "week") {
      setDateRange([dayjs().startOf("week"), dayjs().endOf("week")])
    } else if (value === "month") {
      setDateRange([dayjs().startOf("month"), dayjs().endOf("month")])
    }
    setTimeFrame(value)
  }
  return (
    <div className="p-4 bg-bgAdmin min-h-screen">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <SquareMenu className="text-secondaryText-tw" />
          <span className="text-secondaryText-tw text-[18px] uppercase">Quản lý đơn khám bệnh & lịch hẹn</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button loading={isFetchingExamination} type="default" onClick={handleRefetch}>Làm mới</Button>
          <RangePicker
            allowClear={false}
            value={dateRange}
            format="DD/MM/YYYY"
            onChange={handleDateRangeChange} />
          <Select defaultValue="month" style={{ width: 120 }} onChange={handleTimeFrameChange}>
            <Option value="today">Hôm nay</Option>
            <Option value="yesterday">Hôm qua</Option>
            <Option value="week">Theo tuần</Option>
            <Option value="month">Theo tháng</Option>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6 mt-4">
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="!shadow-table-admin rounded-xl  [&_.ant-card-body]:px-6 [&_.ant-card-body]:py-4">
            <Statistic
              title="Tổng đơn khám"
              value={stats.totalExaminations}
              prefix={<FileTextOutlined style={{ color: "#00B5F1" }} />}
              valueStyle={{ color: "#00B5F1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="!shadow-table-admin rounded-xl  [&_.ant-card-body]:px-6 [&_.ant-card-body]:py-4">
            <Statistic
              title="Đơn hoàn thành"
              value={stats.completedExaminations}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="!shadow-table-admin rounded-xl  [&_.ant-card-body]:px-6 [&_.ant-card-body]:py-4">
            <Statistic
              title="Đơn chờ xử lý"
              value={stats.pendingExaminations}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} className="!shadow-table-admin rounded-xl  [&_.ant-card-body]:px-6 [&_.ant-card-body]:py-4">
            <Statistic
              title="Lịch hẹn sắp tới"
              value={stats.upcomingAppointments}
              prefix={<CalendarOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className="!shadow-table-admin rounded-xl [&_.ant-card-body]:px-6 [&_.ant-card-body]:py-4 ">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          tabBarStyle={{ marginBottom: "16px", fontWeight: "bold" }}
        >
          <TabPane
            tab={
              <span className={`flex items-center gap-2 hover:text-primary-tw ${activeTab === "1" ? "!text-primary-tw" : ""}`} >
                <FileTextOutlined />
                Danh sách đơn khám
              </span>
            }
            key="1"
          >
            <ExaminationList examinationList={examinationData?.DT || []} />
          </TabPane>
          <TabPane
            tab={
              <span className={`flex items-center gap-2 hover:text-primary-tw ${activeTab === "2" ? "!text-primary-tw" : ""}`} >
                <CalendarOutlined />
                Lịch hẹn
              </span>
            }
            key="2"
          >
            <AppointmentList appointmentList={appointments} />
          </TabPane>
          <TabPane
            tab={
              <span className={`flex items-center gap-2 hover:text-primary-tw ${activeTab === "4" ? "!text-primary-tw" : ""}`} >
                <FileTextOutlined />
                Thống kê
              </span>
            }
            key="4"
          >
            <ExaminationStats examinationList={examinationData} dateRange={dateRange} timeFrame={timeFrame} refetchExamination={refetchExamination} isFetchingExamination={isFetchingExamination} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default ExaminationDashboard
