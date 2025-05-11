"use client"

import { useState, useEffect } from "react"
import { Table, Tag, Button, Input, Space, Select, DatePicker, Modal, Tooltip, message } from "antd"
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import ExaminationForm from "./ExaminationForm"
import ExaminationDrawer from "./ExaminationDetail"
import { STATUS_BE, TIMESLOTS } from "@/constant/value"

const { RangePicker } = DatePicker
const { Option } = Select

const AppointmentList = ({ appointmentList }) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    let filteredData = [...appointmentList]
    if (filterStatus !== "all") {
      if (filterStatus === "pending") {
        filteredData = filteredData.filter((item) => !item?.paymentData || item?.paymentData?.status === 1)
      } else if (filterStatus === "paid") {
        filteredData = filteredData.filter((item) => item?.paymentData?.status === 2)
      } else if (filterStatus === "cancel") {
        filteredData = filteredData.filter((item) => item?.paymentData?.status === 0 || item?.status === STATUS_BE.INACTIVE)
      }
    }

    if (dateRange) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.admissionDate)
        return itemDate >= dateRange[0].toDate() && itemDate <= dateRange[1].toDate()
      })
    }
    if (searchText) {
      let searchTextLower = " " + searchText.toLowerCase() + " "
      filteredData = filteredData.filter((item) => {
        const patient = " " + item?.userExaminationData?.lastName + " " + item?.userExaminationData?.firstName + " ";
        const doctor = " " + item?.examinationStaffData?.staffUserData?.lastName + " " + item?.examinationStaffData?.staffUserData?.firstName + " ";
        return patient.toLowerCase().includes(searchTextLower) || doctor.toLowerCase().includes(searchTextLower)
          || searchTextLower.includes(item?.id?.toString().toLowerCase())
      })
    }

    setAppointments(filteredData.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)
      .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate)))

    setPagination({
      ...pagination,
      total: filteredData.length,
    })

  }, [appointmentList, pagination.current, pagination.pageSize, filterStatus, dateRange, searchText])



  const handleTableChange = (pagination) => {
    setPagination(pagination)
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
    setPagination({ ...pagination, current: 1 })
  }

  const handleStatusFilter = (value) => {
    setFilterStatus(value)
    setPagination({ ...pagination, current: 1 })
  }

  const handleDateRangeChange = (dates) => {
    setDateRange(dates)
    setPagination({ ...pagination, current: 1 })
  }

  const showModal = (record = null) => {
    const initialValues = record ? { ...record, is_appointment: 1 } : { is_appointment: 1 }
    setCurrentAppointment(initialValues)
    setIsModalVisible(true)
  }

  const showDetailModal = (record) => {
    setCurrentAppointment(record)
    setIsDetailModalVisible(true)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    setCurrentAppointment(null)
  }

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false)
    setCurrentAppointment(null)
  }

  const handleSave = (values) => {
    // Handle save logic here
    if (currentAppointment?.id) {
      // Update existing appointment
      message.success("Cập nhật lịch hẹn thành công")
    } else {
      // Create new appointment
      message.success("Tạo lịch hẹn mới thành công")
    }
    setIsModalVisible(false)
    fetchAppointments()
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa lịch hẹn này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        // Delete logic here
        message.success("Xóa lịch hẹn thành công")
        fetchAppointments()
      },
    })
  }

  const getTimeSlot = (timeCode) => {
    const timeSlots = TIMESLOTS.find((slot) => slot.value === timeCode)
    return timeSlots?.label || "Không xác định"
  }

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (text, record) =>
        <div className="cursor-pointer" onClick={() => showDetailModal(record)}>{record?.userExaminationData?.firstName || ""} {record?.userExaminationData?.lastName || ""}</div>,
    },
    {
      title: "Thời gian",
      className: "text-center",
      dataIndex: "admissionDate",
      key: "admissionDate",
      render: (date, record) =>
        <div className="cursor-pointer flex flex-col items-center justify-center">
          <span className="font-bold">{new Date(date).toLocaleDateString("vi-VN")}</span>
          <Tag color="blue">{getTimeSlot(record?.time)}</Tag>
        </div>,
    },

    {
      title: "Phòng khám",
      dataIndex: "roomName",
      key: "roomName",
    },
    {
      title: "Bác sĩ",
      dataIndex: "staffId",
      key: "staffId",
      render: (staffId, record) =>
        <div className="">
          {record?.examinationStaffData?.position || "BS. "} {record?.examinationStaffData?.staffUserData?.firstName || ""} {record?.examinationStaffData?.staffUserData?.lastName || ""}
        </div>,
    },
    {
      title: "Triệu chứng",
      dataIndex: "symptom",
      key: "symptom",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color = "blue"
        let text = "Không xác định"
        console.log(record)
        if ((!record?.paymentData || record?.paymentData?.status === 1) && status !== STATUS_BE.INACTIVE) {
          color = "orange"
          text = "Chưa thanh toán"
        } else if (record?.paymentData?.status === 2) {
          color = "green"
          text = "Đã thanh toán"
        } else if (record?.paymentData?.status === 0 || status === STATUS_BE.INACTIVE) {
          color = "red"
          text = "Hủy"
        }

        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#00B5F1" }} />}
              onClick={() => showDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Tìm kiếm đơn khám"
            prefix={<SearchOutlined />}
            className="w-full sm:w-64 border-gray-300"
            value={searchText}
            onChange={handleSearch}
          />
          <Select placeholder="Trạng thái" style={{ width: 150 }} onChange={handleStatusFilter} defaultValue="all">
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chưa thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="cancel">Hủy</Option>
          </Select>
          <RangePicker allowClear={true} onChange={handleDateRangeChange} format="DD/MM/YYYY" />

        </div>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ backgroundColor: "#00B5F1" }}
          >
            Tạo lịch hẹn mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
        size="middle"
      />

      {/* Appointment Form Modal */}
      <Modal
        title={currentAppointment?.id ? "Cập nhật lịch hẹn" : "Tạo lịch hẹn mới"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <ExaminationForm initialValues={currentAppointment} onSave={handleSave} onCancel={handleModalCancel} />
      </Modal>

      {currentAppointment &&
        <ExaminationDrawer open={isDetailModalVisible}
          onClose={() => setIsDetailModalVisible(false)}
          examinationId={currentAppointment.id} />}
    </div>
  )
}

export default AppointmentList
