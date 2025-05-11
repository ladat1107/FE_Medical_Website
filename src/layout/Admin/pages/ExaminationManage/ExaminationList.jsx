"use client"

import { useState, useEffect } from "react"
import { Table, Tag, Button, Input, Select, message } from "antd"
import {
  FileExcelOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import ExaminationDrawer from "./ExaminationDetail"
import { MEDICAL_TREATMENT_TIER, STATUS_BE } from "@/constant/value"
import DropdownTypeExamination from "../../components/Dropdown/DropdownTypeExamination"

const { Option } = Select

const ExaminationList = ({ examinationList }) => {
  const [examinations, setExaminations] = useState([])
  const [typeExamination, setTypeExamination] = useState("all")
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [dateRange, setDateRange] = useState(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [currentExamination, setCurrentExamination] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  useEffect(() => {
    // Filter by status if needed
    let filteredData = [...examinationList]
    if (filterStatus !== "all") {
      if (filterStatus === STATUS_BE.EXAMINING) {
        filteredData = filteredData.filter((item) => item.status === STATUS_BE.WAITING || item.status === STATUS_BE.PAID || item.status === STATUS_BE.EXAMINING)
      } else if (filterStatus === STATUS_BE.DONE) {
        filteredData = filteredData.filter((item) => item.status === STATUS_BE.DONE || item.status === STATUS_BE.DONE_INPATIENT)
      } else if (filterStatus === STATUS_BE.PENDING) {
        filteredData = filteredData.filter((item) => item.status === STATUS_BE.PENDING || item.status === STATUS_BE.ACTIVE)
      } else if (filterStatus === STATUS_BE.INACTIVE) {
        filteredData = filteredData.filter((item) => item.status === STATUS_BE.INACTIVE)
      }
    }

    if (typeExamination !== "all") {
      if (typeExamination === "appointment")
        filteredData = filteredData.filter((item) => item.is_appointment === 1 && item.medicalTreatmentTier !== MEDICAL_TREATMENT_TIER.INPATIENT && item.medicalTreatmentTier !== MEDICAL_TREATMENT_TIER.EMERGENCY)
      else if (typeExamination === MEDICAL_TREATMENT_TIER.INPATIENT)
        filteredData = filteredData.filter((item) => item.is_appointment !== 1 && item.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT)
      else if (typeExamination === MEDICAL_TREATMENT_TIER.EMERGENCY)
        filteredData = filteredData.filter((item) => item.is_appointment !== 1 && item.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.EMERGENCY)
      else if (typeExamination === MEDICAL_TREATMENT_TIER.OUTPATIENT)
        filteredData = filteredData.filter((item) => item.is_appointment !== 1 && item.medicalTreatmentTier !== MEDICAL_TREATMENT_TIER.INPATIENT && item.medicalTreatmentTier !== MEDICAL_TREATMENT_TIER.EMERGENCY)
    }

    // Filter by search text
    if (searchText) {
      filteredData = filteredData.filter(
        (item) => {
          const patient = " " + item?.userExaminationData?.lastName + " " + item?.userExaminationData?.firstName + " ";
          return patient.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.diseaseName?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.symptom?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.id?.toString().includes(searchText) ||
            item?.userExaminationData?.phoneNumber?.toString().includes(searchText) ||
            item?.userExaminationData?.cid?.toString().includes(searchText)
        }
      )
    }
    setExaminations(
      filteredData.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize),
    )
    setPagination({
      ...pagination,
      total: filteredData.length,
    })

  }, [examinationList, pagination.current, pagination.pageSize, filterStatus, dateRange, searchText, typeExamination])

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

  const handleTypeExaminationChange = (value) => {
    setTypeExamination(value)
    setPagination({ ...pagination, current: 1 })
  }
  const showDetailModal = (record) => {
    setCurrentExamination(record)
    setIsDetailModalVisible(true)
  }

  const handleExport = () => {
    message.success("Xuất dữ liệu thành công")
  }

  const handlePrint = (record) => {
    message.success("Đang chuẩn bị in đơn khám")
  }

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 80,
      className: "text-center",
    },
    {
      title: "Tên bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      width: 200,
      render: (_, record) => {
        const patient = record?.userExaminationData?.lastName + " " + record?.userExaminationData?.firstName;
        return <a className="w-full overflow-hidden text-ellipsis whitespace-nowrap" title={patient} onClick={() => showDetailModal(record)}>{patient}</a>
      }
    },
    {
      title: "Triệu chứng",
      dataIndex: "symptom",
      key: "symptom",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Chẩn đoán",
      dataIndex: "diseaseName",
      key: "diseaseName",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Ngày khám",
      dataIndex: "admissionDate",
      key: "admissionDate",
      width: 110,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Phòng khám",
      dataIndex: "roomName",
      key: "roomName",
      width: 150,
      render: (roomName) => {
        return <div className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap " title={roomName}>{roomName}</div>
      }
    },
    {
      title: (<div className="flex justify-center items-center gap-2">Loại <DropdownTypeExamination typeExamination={typeExamination} setTypeExamination={handleTypeExaminationChange} /></div>),
      dataIndex: "is_appointment",
      key: "is_appointment",
      width: 100,
      className: "text-center",
      render: (_, record) => {
        const value = record?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT ? 1 : record?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.EMERGENCY ? 2 : record?.is_appointment === 1 ? 3 : 4
        return <Tag color={value === 1 ? "purple" : value === 2 ? "cyan" : value === 3 ? "blue" : "pink"}>{value === 1 ? "Nội trú" : value === 2 ? "Cấp cứu" : value === 3 ? "Lịch hẹn" : "Ngoại trú"}</Tag>
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      className: "text-center",
      render: (status) => {
        let color = "blue"
        let text = "Chờ duyệt"

        if (status === STATUS_BE.EXAMINING || status === STATUS_BE.PAID || status === STATUS_BE.WAITING) {
          color = "orange"
          text = "Đang khám"
        } else if (status === STATUS_BE.DONE || status === STATUS_BE.DONE_INPATIENT) {
          color = "green"
          text = "Hoàn thành"
        } else if (status === STATUS_BE.INACTIVE) {
          color = "red"
          text = "Hủy"
        } else if (status === STATUS_BE.PENDING) {
          color = "blue"
          text = "Chờ duyệt"
        }

        return <Tag color={color}>{text}</Tag>
      },
    }
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
            <Option value={STATUS_BE.PENDING}>Chờ duyệt</Option>
            <Option value={STATUS_BE.EXAMINING}>Đang khám</Option>
            <Option value={STATUS_BE.DONE}>Hoàn thành</Option>
            <Option value={STATUS_BE.INACTIVE}>Đã hủy</Option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button icon={<FileExcelOutlined />} onClick={handleExport}>
            Xuất Excel
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={examinations}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
        size="middle"
        rowClassName={(_, index) =>
          `${index % 2 === 0 ? 'bg-white' : 'bg-evenRow'}
          `
        }
      />


      {currentExamination &&
        <ExaminationDrawer open={isDetailModalVisible}
          onClose={() => setIsDetailModalVisible(false)}
          examinationId={currentExamination.id} />}
    </div>
  )
}

export default ExaminationList
