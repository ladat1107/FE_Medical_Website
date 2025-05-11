"use client"

import { useEffect, useRef, useState } from "react"
import { Card, Col, Row, Progress, Tooltip, Table } from "antd"
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Line,
    ComposedChart,
} from "recharts"
import { AlertTriangle, TrendingDown, DollarSign, Activity } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import MedicineTable from "./MedicineTable"
import ResponsiveCards from "./ResponsiveCards"

dayjs.locale("vi")

const COLORS = [
    "#00B5F1", // Màu chính - xanh dương tươi
    "#00C48C", // Xanh ngọc lá – dịu mắt, đồng bộ
    "#FFC75F", // Vàng pastel – nổi bật nhưng nhẹ nhàng
    "#FFA07A", // Cam san hô – tươi sáng
    "#22C55E", // Xanh lá hiện đại – giữ lại
    "#F87171"  // Đỏ hồng nhạt – giữ lại
];

const MedicineStatistical = ({ medicineData, refetch, isRefetchingMedicineData, isLoadingMedicineData }) => {
    const [expiringMedicines, setExpiringMedicines] = useState([])
    const [lowStockMedicines, setLowStockMedicines] = useState([])
    const [medicinesByGroup, setMedicinesByGroup] = useState([])
    const [totalMedicines, setTotalMedicines] = useState(0)
    const [newMedicines, setNewMedicines] = useState(0)

    const expiringTableRef = useRef(null)
    const lowStockTableRef = useRef(null)

    const medicines = medicineData?.DT || []

    useEffect(() => {
        if (medicineData?.DT) {
            const medicines = medicineData.DT.filter((medicine) => medicine.status === 1 && new Date(medicine.exp) > new Date())
            setTotalMedicines(medicines.length)

            // Lọc thuốc sắp hết hạn (trong vòng 2 tháng)
            const threeMonthsFromNow = new Date()
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 2)

            const expiring = medicines
                .filter((medicine) => {
                    const expDate = new Date(medicine.exp)
                    return expDate <= threeMonthsFromNow && expDate > new Date()
                })
                .sort((a, b) => new Date(a.exp).getTime() - new Date(b.exp).getTime())

            setExpiringMedicines(expiring)

            // Lọc thuốc sắp hết hàng (nếu là viên thì dưới 500, nếu là lọ chai thì dưới 100)
            const lowStock = medicines.filter((medicine) => {
                if (medicine.unit.toLowerCase().includes("viên") || medicine.unit.toLowerCase().includes("gói") || medicine.unit.toLowerCase().includes("ống")) {
                    return medicine.inventory <= 500;
                } else if (medicine.unit.toLowerCase().includes("lọ") || medicine.unit.toLowerCase().includes("chai") || medicine.unit.toLowerCase().includes("hộp") || medicine.unit.toLowerCase().includes("can")) {
                    return medicine.inventory <= 50;
                }
                return false;
            }).sort((a, b) => a.inventory - b.inventory)

            setLowStockMedicines(lowStock)

            let medicineGroup = [];
            let _newMedicines = 0;
            medicines.forEach(medicine => {
                let group;
                if (medicine.group.toLowerCase().includes("tân")) { group = "Tân dược" }
                else if (medicine.group.toLowerCase().includes("đông")) { group = "Đông y" }
                else if (medicine.group.toLowerCase().includes("thuc pham chuc nang")) { group = "Thực phẩm chức năng" }
                else { group = "Không xác định" }

                if (!medicineGroup[group]) {
                    medicineGroup[group] = { count: 0 }
                }
                medicineGroup[group].count += 1;

                if (new Date(medicine.updatedAt) > new Date(new Date().setMonth(new Date().getMonth() - 1))) {
                    _newMedicines += 1;
                }
            });
            // Chuyển đổi dữ liệu cho biểu đồ thuốc theo nhóm
            const groupsData = Object.entries(medicineGroup).map(([name, data]) => ({
                name,
                value: data.count,
            }))
            setMedicinesByGroup(groupsData)
            setNewMedicines(_newMedicines)
        }
    }, [medicineData])


    // Cột cho bảng thuốc sắp hết hạn
    const expiringColumns = [
        {
            title: "Tên thuốc",
            className: "max-w-[30%] overflow-hidden text-ellipsis whitespace-nowrap",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Tooltip title={text}>
                    <span className="font-medium">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Số đăng ký",
            dataIndex: "registrationNumber",
            key: "registrationNumber",
        },
        {
            title: "Hạn sử dụng",
            dataIndex: "exp",
            key: "exp",
            render: (text) => {
                const expDate = new Date(text)
                const now = new Date()
                const diffTime = expDate.getTime() - now.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                return (
                    <span className={`${diffDays <= 30 ? "text-red-500 font-bold" : "text-orange-500"}`}>
                        {dayjs(text).format("DD/MM/YYYY")}
                        <span className="block text-xs">{diffDays <= 0 ? "Đã hết hạn" : `Còn ${diffDays} ngày`}</span>
                    </span>
                )
            },
        },
        {
            title: "Tồn kho",
            dataIndex: "inventory",
            key: "inventory",
            render: (inventory, record) => (
                <span>
                    {inventory.toLocaleString()} {record.unit}
                </span>
            ),
        },
    ]

    // Cột cho bảng thuốc sắp hết hàng
    const lowStockColumns = [
        {
            title: "Tên thuốc",
            className: "max-w-[30%] overflow-hidden text-ellipsis whitespace-nowrap",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Tooltip title={text}>
                    <span className="font-medium">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Số đăng ký",
            dataIndex: "registrationNumber",
            key: "registrationNumber",
        },
        {
            title: "Tồn kho",
            dataIndex: "inventory",
            key: "inventory",
            render: (inventory, record) => (
                <span className="text-purple-600 font-medium">
                    {inventory.toLocaleString()} {record.unit}
                </span>
            ),
        },
        {
            title: "Mức độ",
            key: "level",
            render: (_, record) => {
                let level = 0;
                if (record.unit.toLowerCase().includes("viên") || record.unit.toLowerCase().includes("gói") || record.unit.toLowerCase().includes("ống")) {
                    level = record.inventory <= 10 ? 90 : record.inventory <= 50 ? 70 : record.inventory <= 100 ? 50 : record.inventory <= 200 ? 30 : 10
                } else if (record.unit.toLowerCase().includes("lọ") || record.unit.toLowerCase().includes("chai") || record.unit.toLowerCase().includes("hộp") || record.unit.toLowerCase().includes("can")) {
                    level = record.inventory <= 10 ? 50 : record.inventory <= 20 ? 30 : 10
                }
                return <Progress percent={level} size="small" status="exception" showInfo={false} />
            },
        },
    ]

    const handleClickExpiring = () => {
        if (expiringTableRef.current) {
            expiringTableRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }
    const handleClickLowStock = () => {
        if (lowStockTableRef.current) {
            lowStockTableRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }
    return (
        <div className="mb-6">
            {/* Thẻ thống kê tổng quan */}
            <ResponsiveCards totalMedicines={totalMedicines} expiringMedicines={expiringMedicines} lowStockMedicines={lowStockMedicines} newMedicines={newMedicines} handleClickExpiring={handleClickExpiring} handleClickLowStock={handleClickLowStock} />

            {/* Biểu đồ và bảng */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center">
                                <Activity size={18} className="mr-2 text-blue-500" />
                                <span className="font-bold">Phân bố thuốc theo nhóm</span>
                            </div>
                        }
                        bordered={false}
                        className="!shadow-table-admin hover:shadow-md h-full rounded-xl [&_.ant-card-body]:p-0"
                    >
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={medicinesByGroup}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={90}
                                        fill={COLORS[1]}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {medicinesByGroup.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <RechartsTooltip formatter={(value) => [`${value} thuốc`, ""]} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center">
                                <DollarSign size={18} className="mr-2 text-green-500" />
                                <span className="font-bold">Thống kê thuốc theo số lượng và hạn sử dụng</span>
                            </div>
                        }
                        bordered={false}
                        className="!shadow-table-admin hover:shadow-md h-full rounded-xl [&_.ant-card-body]:p-0"
                    >
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    data={expiringMedicines}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke={COLORS[1]} />
                                    <YAxis yAxisId="right" orientation="right" stroke={COLORS[0]} />
                                    <RechartsTooltip
                                        formatter={(value, name, props) => {
                                            if (name === "Số lượng") {
                                                const unit = props.payload.unit || ''
                                                return [`${value} ${unit}`, name]
                                            }
                                            return [`${value} ngày`, name]
                                        }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="inventory" name="Số lượng" fill={COLORS[1]} barSize={25} />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey={(record) => {
                                            const expDate = new Date(record.exp)
                                            const now = new Date()
                                            const diffTime = expDate.getTime() - now.getTime()
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                            return diffDays
                                        }}
                                        name="Hạn sử dụng (ngày)"
                                        stroke={COLORS[0]}
                                        strokeWidth={3}
                                        activeDot={{ r: 8 }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Bảng quản lý thuốc */}
                <Col xs={24} className="my-8">
                    <MedicineTable medicines={medicines} refetch={refetch} isRefetchingMedicineData={isRefetchingMedicineData} isLoadingMedicineData={isLoadingMedicineData} />
                </Col>
                <Col xs={24} lg={12} >
                    <Card
                        title={
                            <div className="flex items-center">
                                <AlertTriangle size={18} className="mr-2 text-orange-500" />
                                <span className="font-bold">Thuốc sắp hết hạn</span>
                            </div>
                        }
                        bordered={false}
                        className="shadow-xl rounded-xl [&_.ant-card-body]:p-0 [&_.ant-card-head]:!bg-bgTableHead [&_.ant-card-head]:!text-textHeadTable"
                    >
                        <div ref={expiringTableRef}>
                            <Table
                                dataSource={expiringMedicines}
                                columns={expiringColumns}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 260 }}
                                className="p-2 h-[320px]"
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center">
                                <TrendingDown size={18} className="mr-2 text-red-500" />
                                <span className="font-bold">Thuốc sắp hết hàng</span>
                            </div>
                        }
                        bordered={false}
                        className="shadow-table-admin rounded-xl [&_.ant-card-body]:p-0 [&_.ant-card-head]:!bg-bgTableHead [&_.ant-card-head]:!text-textHeadTable"
                    >
                        <div ref={lowStockTableRef}>
                            <Table
                                dataSource={lowStockMedicines}
                                columns={lowStockColumns}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 260 }}
                                className="p-2 h-[320px]"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default MedicineStatistical
