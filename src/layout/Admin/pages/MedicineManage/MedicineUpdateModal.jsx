"use client"

import { Modal, Form, Input, InputNumber, Select, Tabs, Badge, Row, Col, Card, Statistic, Typography, Button, DatePicker, message } from "antd"
import {
    DollarOutlined,
    EditOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    CalendarOutlined,
    MedicineBoxOutlined,
    FileTextOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { useState } from "react"
import DeleteModal from "../../components/Modal/DeleteModal"
import { TABLE } from "@/constant/value"
import { BadgePercent } from "lucide-react"
import { calculateExpirationDate } from "@/utils/formatDate"
import { formatCurrency } from "@/utils/formatCurrency"
import { useUpdateMedicine } from "@/hooks"

const { TextArea } = Input
const { Title, Text } = Typography

const MedicineUpdateModal = ({ open, onClose, data, onSubmit }) => {
    const [form] = Form.useForm()
    const { mutate: updateMedicine, isPending } = useUpdateMedicine()
    const [activeTab, setActiveTab] = useState("1")
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleOk = () => {
        form.validateFields().then((values) => {
            const newInventory = (data?.inventory || 0) + (values.addInventory || 0)
            const updatedData = {
                ...values,
                id: data?.id,
                inventory: newInventory,
            }
            updateMedicine(updatedData, {
                onSuccess: (data) => {
                    if (data?.EC === 0) {
                        onSubmit()
                    } else {
                        message.error(data?.EM)
                    }
                }
            })
        }).catch((errorInfo) => {
            const errorField = errorInfo.errorFields[0]
            if (errorField) {
                form.setFields([{ name: errorField.name, errors: [errorField.errors[0]] }])
                message.error(errorField.errors[0])
            }
        })
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "—"
        try {
            return dayjs(dateStr).format("DD/MM/YYYY")
        } catch (error) {
            return "—"
        }
    }

    const items = [
        {
            key: "1",
            label: (
                <span className="flex items-center gap-1">
                    <InfoCircleOutlined />
                    Thông tin cơ bản
                </span>
            ),
            children: (
                <div className="space-y-6 px-3">
                    <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-100 rounded-full">
                                    <MedicineBoxOutlined className="text-2xl text-cyan-700" />
                                </div>
                                <div>
                                    <Title level={4} className="!m-0 text-cyan-800">
                                        {data?.name || "—"}
                                    </Title>
                                    <Text type="secondary">
                                        {data?.activeIngredient || "—"} - <span className="font-semibold">Nhóm: {data?.group || "—"}</span>
                                    </Text>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Badge
                                    count={data?.status ? "Đang sử dụng" : "Ngừng sử dụng"}
                                    style={{ backgroundColor: data?.status ? "#52c41a" : "#ff4d4f" }}
                                    className="ml-auto"
                                />
                                <div className="flex items-center gap-2 font-semibold text-yellow-500 text-lg">
                                    <BadgePercent size={18} />
                                    <span>{formatCurrency(data?.price || 0)}</span>
                                </div>
                            </div>
                        </div>

                        <Row gutter={[16, 16]} className="mt-4">
                            <Col xs={24} sm={12} md={8} className="mb-0">
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Số đăng ký
                                    </Text>
                                    <Text strong>{data?.registrationNumber || "—"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8} className="mb-0">
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Bảo hiểm y tế hỗ trợ
                                    </Text>
                                    <Text strong>{data?.insuranceCovered ? `${Number(data.insuranceCovered) * 100}%` : "Không hỗ trợ"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Dạng bào chế
                                    </Text>
                                    <Text strong>{data?.dosageForm || "—"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Số lô
                                    </Text>
                                    <Text strong>{data?.batchNumber || "—"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Ngày nhập kho
                                    </Text>
                                    <Text strong>{formatDate(data?.updatedAt) || "—"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Tồn kho
                                    </Text>
                                    <Text strong>{data?.inventory || "—"} {data?.unit || ""}</Text>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} className="mt-4">
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Đơn vị
                                    </Text>
                                    <Text strong>{data?.unit || "—"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Nước SX
                                    </Text>
                                    <Text strong>{data?.manufacturerCountry || "—"}</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div className="flex flex-col">
                                    <Text type="secondary" className="text-xs">
                                        Hàm lượng
                                    </Text>
                                    <Text strong>{data?.concentration || "—"}</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-2 text-[16px]">
                                <CheckCircleOutlined />
                                <span>Thông tin phê duyệt</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>Số phê duyệt:</span>
                                    <span className="font-medium text-yellow-500">{data?.approvalNumber || "—"}</span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>Ngày phê duyệt:</span>
                                    <span className="font-medium">{formatDate(data?.approvalDate) || "—"}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gray-50 border border-gray-200 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 text-sky-500 font-semibold text-[16px]">
                                    <CalendarOutlined />
                                    <span>Hạn sử dụng</span>
                                </div>
                                <Badge
                                    count={calculateExpirationDate(data?.exp)}
                                    style={{ backgroundColor: calculateExpirationDate(data?.exp)?.includes("Đã hết hạn") ? "#FFCC00" : "#1890ff" }}
                                    className="ml-auto"
                                />
                            </div>
                            <div className="mt-3 text-sm text-gray-700 space-y-1">
                                <div className="flex justify-between">
                                    <span>NSX:</span>
                                    <span className="font-medium">{formatDate(data?.mfg) || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>HSD:</span>
                                    <span className="font-medium">{formatDate(data?.exp) || "—"}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="rounded-lg border border-cyan-200 shadow-sm p-3">
                        <div className="flex flex-col items-start gap-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
                                <span className="text-[16px] font-semibold text-gray-700">Chi tiết</span>
                                <Text type="secondary" className="text-xs">
                                    Cập nhật lần cuối: {formatDate(new Date())}
                                </Text>
                            </div>
                            <div className="text-sm text-gray-500">{data?.description || "—"}</div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <span className="flex items-center gap-1">
                    <EditOutlined />
                    Cập nhật thông tin
                </span>
            ),
            children: (
                <Form layout="vertical" form={form} initialValues={{
                    ...data,
                    exp: data?.exp ? dayjs(dayjs(data?.exp).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                    mfg: data?.mfg ? dayjs(dayjs(data?.mfg).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                    approvalDate: data?.approvalDate ? dayjs(dayjs(data?.approvalDate).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                }} className="p-3">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title={
                            <span className="flex items-center gap-2 text-blue-700">
                                <InfoCircleOutlined /> Thông tin cơ bản
                            </span>
                        } className="col-span-1 lg:col-span-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    className="mb-0"
                                    label="Tên thuốc"
                                    name="name"
                                    rules={[{ required: true, message: "Vui lòng nhập tên thuốc!" }]}
                                >
                                    <Input className="border-blue-200 focus:border-blue-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Hoạt chất"
                                    name="activeIngredient"
                                    rules={[{ required: true, message: "Vui lòng nhập hoạt chất!" }]}
                                >
                                    <Input className="border-blue-200 focus:border-blue-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Nhóm thuốc"
                                    name="group"
                                    rules={[{ required: true, message: "Vui lòng nhập nhóm thuốc!" }]}
                                >
                                    <Input className="border-blue-200 focus:border-blue-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Hàm lượng"
                                    name="concentration"
                                >
                                    <Input className="border-blue-200 focus:border-blue-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Dạng bào chế"
                                    name="dosageForm"
                                >
                                    <Input className="border-blue-200 focus:border-blue-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Đơn vị"
                                    name="unit"
                                    rules={[{ required: true, message: "Vui lòng nhập đơn vị!" }]}
                                >
                                    <Input className="border-blue-200 focus:border-blue-500" />
                                </Form.Item>
                            </div>
                        </Card>

                        <Card title={
                            <span className="flex items-center gap-2 text-yellow-700">
                                <CheckCircleOutlined /> Thông tin phê duyệt và sản xuất
                            </span>
                        } className="col-span-1 lg:col-span-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    className="mb-0"
                                    label="Số đăng ký"
                                    name="registrationNumber"
                                >
                                    <Input className="border-yellow-200 focus:border-yellow-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Số phê duyệt"
                                    name="approvalNumber"
                                >
                                    <Input className="border-yellow-200 focus:border-yellow-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Số lô"
                                    name="batchNumber"
                                    rules={[{ required: true, message: "Vui lòng nhập số lô!" }]}
                                >
                                    <Input className="border-yellow-200 focus:border-yellow-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Nước sản xuất"
                                    name="manufacturerCountry"
                                    rules={[{ required: true, message: "Vui lòng nhập nước sản xuất!" }]}
                                >
                                    <Input className="border-yellow-200 focus:border-yellow-500" />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Ngày sản xuất"
                                    name="mfg"
                                    rules={[{ required: true, message: "Vui lòng chọn ngày sản xuất!" }]}
                                >
                                    <DatePicker
                                        className="border-yellow-200 focus:border-yellow-500"
                                        format="DD/MM/YYYY"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    className="mb-0"
                                    label="Hạn sử dụng"
                                    name="exp"
                                    rules={[{ required: true, message: "Vui lòng chọn hạn sử dụng!" }]}
                                >
                                    <DatePicker
                                        className="border-yellow-200 focus:border-yellow-500"
                                        format="DD/MM/YYYY"
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </div>
                        </Card>

                        <Card title={
                            <span className="flex items-center gap-2 text-emerald-700">
                                <DollarOutlined /> Thông tin kho và giá
                            </span>
                        } className="col-span-1 lg:col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                            <Form.Item
                                label="Tồn kho hiện tại"
                            >
                                <Statistic value={data?.inventory} suffix={data?.unit} valueStyle={{ color: "#10b981" }} />
                            </Form.Item>

                            <Form.Item
                                className="mb-2"
                                label="Nhập thêm vào kho"
                                name="addInventory"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="0"
                                    addonAfter={data?.unit}
                                    className="border-emerald-200 focus:border-emerald-500"
                                />
                            </Form.Item>

                            <Form.Item
                                className="mb-2"
                                label="Giá"
                                name="price"
                                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    addonAfter="VNĐ"
                                    className="border-emerald-200 focus:border-emerald-500"
                                />
                            </Form.Item>

                            <Form.Item
                                className="mb-0"
                                label="Bảo hiểm y tế hỗ trợ"
                                name="insuranceCovered"
                                rules={[{ required: true, message: "Vui lòng nhập bảo hiểm y tế hỗ trợ!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    style={{ width: "100%" }}
                                    placeholder="0"
                                    addonAfter="%"
                                    className="border-emerald-200 focus:border-emerald-500"
                                />
                            </Form.Item>
                        </Card>

                        <Card title={
                            <span className="flex items-center gap-2 text-purple-700">
                                <FileTextOutlined /> Trạng thái và mô tả
                            </span>
                        } className="col-span-1 lg:col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                            >
                                <Select className="border-purple-200 focus:border-purple-500">
                                    <Select.Option value={1}>
                                        <span className="flex items-center gap-2">
                                            <Badge status="success" />
                                            Hoạt động
                                        </span>
                                    </Select.Option>
                                    <Select.Option value={0}>
                                        <span className="flex items-center gap-2">
                                            <Badge status="error" />
                                            Ngừng hoạt động
                                        </span>
                                    </Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Mô tả"
                                name="description"
                            >
                                <TextArea
                                    rows={4}
                                    className="border-purple-200 focus:border-purple-500"
                                    placeholder="Nhập mô tả về thuốc..."
                                />
                            </Form.Item>
                        </Card>
                    </div>
                </Form>
            ),
        },
    ]

    return (
        <Modal
            open={open}
            title={
                <div className="flex items-center gap-2 text-[18px] font-semibold text-white">
                    Cập nhật thuốc <EditOutlined />
                </div>
            }
            onCancel={onClose}
            onOk={handleOk}
            width={window.innerWidth < 768 ? '95%' : window.innerWidth < 1024 ? '90%' : 800}
            okText="Lưu thay đổi"
            footer={activeTab === "1" ? <div className="h-2"></div> : <div className="flex justify-between gap-2">
                <Button className="w-fit bg-red-500 text-white hover:!bg-red-400" onClick={() => setShowDeleteModal(true)}>Xóa thuốc</Button>
                <div className="flex justify-end gap-2">
                    <Button className="bg-gray-500 text-white hover:!bg-gray-400" onClick={onClose} >Hủy</Button>
                    <Button type="primary" className='bg-primary-tw' onClick={handleOk} loading={isPending}>Lưu thay đổi</Button>
                </div>
            </div>
            }
            className="medicine-update-modal"
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                className="medicine-tabs"
                type="card"
                tabPosition="top"
            />
            <DeleteModal
                show={showDeleteModal}
                isShow={setShowDeleteModal}
                data={data}
                table={TABLE.MEDICINE}
                refresh={onSubmit}
            />
        </Modal>
    )
}

export default MedicineUpdateModal
