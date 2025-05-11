"use client"

import { useState, useEffect } from "react"
import { Form, Input, Select, DatePicker, InputNumber, Button, Row, Col, Divider, Switch, message } from "antd"
import { SaveOutlined, CloseOutlined } from "@ant-design/icons"
import moment from "moment"

const { Option } = Select
const { TextArea } = Input

const ExaminationForm = ({ initialValues, onSave, onCancel }) => {
  const [form] = Form.useForm()
  const [isAppointment, setIsAppointment] = useState(initialValues?.is_appointment === 1)
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch necessary data
    fetchPatients()
    fetchDoctors()
    fetchRooms()

    // Set form values if editing
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        userId: initialValues.userId,
        staffId: initialValues.staffId,
        admissionDate: initialValues.admissionDate ? moment(initialValues.admissionDate) : null,
        dischargeDate: initialValues.dischargeDate ? moment(initialValues.dischargeDate) : null,
        reExaminationDate: initialValues.reExaminationDate ? moment(initialValues.reExaminationDate) : null,
        is_appointment: initialValues.is_appointment === 1,
      })
      setIsAppointment(initialValues.is_appointment === 1)
    }
  }, [initialValues, form])

  const fetchPatients = async () => {
    // Mock data for demonstration
    setPatients(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Bệnh nhân ${i + 1}`,
      })),
    )
  }

  const fetchDoctors = async () => {
    // Mock data for demonstration
    setDoctors(
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Bác sĩ ${i + 1}`,
        specialization: `Chuyên khoa ${(i % 5) + 1}`,
      })),
    )
  }

  const fetchRooms = async () => {
    // Mock data for demonstration
    setRooms(
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Phòng ${i + 1}`,
      })),
    )
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const formattedValues = {
        ...values,
        is_appointment: values.is_appointment ? 1 : 0,
        admissionDate: values.admissionDate ? values.admissionDate.toDate() : null,
        dischargeDate: values.dischargeDate ? values.dischargeDate.toDate() : null,
        reExaminationDate: values.reExaminationDate ? values.reExaminationDate.toDate() : null,
      }

      // Call the onSave function passed from parent
      onSave(formattedValues)
    } catch (error) {
      console.error("Error submitting form:", error)
      message.error("Có lỗi xảy ra khi lưu đơn khám")
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentChange = (checked) => {
    setIsAppointment(checked)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 0,
        is_appointment: false,
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="is_appointment" label="Loại đơn khám" valuePropName="checked">
            <Switch
              checkedChildren="Lịch hẹn"
              unCheckedChildren="Khám thường"
              onChange={handleAppointmentChange}
              style={{ backgroundColor: isAppointment ? "#00B5F1" : undefined }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="userId" label="Bệnh nhân" rules={[{ required: true, message: "Vui lòng chọn bệnh nhân" }]}>
            <Select
              showSearch
              placeholder="Chọn bệnh nhân"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="staffId" label="Bác sĩ" rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}>
            <Select
              showSearch
              placeholder="Chọn bác sĩ"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {doctors.map((doctor) => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="admissionDate"
            label={isAppointment ? "Ngày hẹn khám" : "Ngày khám"}
            rules={[{ required: true, message: "Vui lòng chọn ngày khám" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="time"
            label="Giờ khám"
            rules={[{ required: isAppointment, message: "Vui lòng chọn giờ khám" }]}
          >
            <Select placeholder="Chọn giờ khám">
              <Option value={1}>08:00 - 09:00</Option>
              <Option value={2}>09:00 - 10:00</Option>
              <Option value={3}>10:00 - 11:00</Option>
              <Option value={4}>13:30 - 14:30</Option>
              <Option value={5}>14:30 - 15:30</Option>
              <Option value={6}>15:30 - 16:30</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="roomName" label="Phòng khám">
            <Select placeholder="Chọn phòng khám">
              {rooms.map((room) => (
                <Option key={room.id} value={room.name}>
                  {room.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
            <Select placeholder="Chọn trạng thái">
              <Option value={0}>Chờ khám</Option>
              <Option value={1}>Đang khám</Option>
              <Option value={2}>Hoàn thành</Option>
              <Option value={3}>Hủy</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Thông tin khám bệnh</Divider>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="symptom" label="Triệu chứng">
            <TextArea rows={3} placeholder="Nhập triệu chứng" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="diseaseName" label="Chẩn đoán">
            <Input placeholder="Nhập chẩn đoán" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="comorbidities" label="Bệnh đi kèm">
            <Input placeholder="Nhập bệnh đi kèm (nếu có)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="treatmentResult" label="Kết quả điều trị">
            <TextArea rows={2} placeholder="Nhập kết quả điều trị" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Thông tin tái khám</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="reExaminationDate" label="Ngày tái khám">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Chọn ngày tái khám (nếu có)" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="reason" label="Lý do tái khám">
            <Input placeholder="Nhập lý do tái khám (nếu có)" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Thông tin thanh toán</Divider>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="price" label="Tổng tiền" rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập tổng tiền"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="insuranceCode" label="Mã BHYT">
            <Input placeholder="Nhập mã BHYT (nếu có)" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="insuranceCoverage" label="Mức hưởng BHYT (%)">
            <InputNumber style={{ width: "100%" }} min={0} max={100} placeholder="Nhập % hưởng BHYT" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="insuranceCovered" label="Tiền BHYT chi trả">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập tiền BHYT chi trả"
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="coveredPrice" label="Tiền bệnh nhân thanh toán">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập tiền bệnh nhân thanh toán"
              min={0}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="mt-4 text-right">
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          <CloseOutlined /> Hủy
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: "#00B5F1" }}>
          <SaveOutlined /> Lưu
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ExaminationForm
