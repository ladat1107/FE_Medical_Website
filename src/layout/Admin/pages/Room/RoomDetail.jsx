import { useEffect, useState } from "react";
import { Modal, Tabs, Card, Table, Tag, Badge, Alert, Spin, Button, Avatar, Empty, Row, Col } from "antd";
import { UserOutlined, CloseOutlined, MedicineBoxOutlined, DatabaseOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { STATUS_BE, TYPE_ROOM } from "@/constant/value";

dayjs.extend(relativeTime);
dayjs.locale('vi');

const RoomDetail = ({ visible, onClose, roomData }) => {
    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(false);
    const [mockExaminations, setMockExaminations] = useState([])
    const [mockStaffs, setMockStaffs] = useState([])
    const [mockParaclinicalServices, setMockParaclinicalServices] = useState([])

    useEffect(() => {
        if (roomData) {
            let _mockExaminations = []
            let _mockStaffs = []
            let _mockParaclinicalServices = []
            roomData?.examinationRoomData?.forEach(examination => {
                let patientData = (examination?.userExaminationData?.lastName || "") + " " + (examination?.userExaminationData?.firstName || "")
                _mockExaminations.push({
                    id: examination.id,
                    patientData: {
                        fullName: patientData,
                        phoneNumber: examination?.userExaminationData?.phoneNumber || "",
                        avatar: examination?.userExaminationData?.avatar || null
                    },
                    status: examination.status
                })
            })

            roomData?.scheduleRoomData?.forEach(schedule => {
                let staff = schedule?.staffScheduleData || {}
                let staffData = (staff?.staffUserData?.lastName || "") + " " + (staff?.staffUserData?.firstName || "")
                _mockStaffs.push({
                    id: staff.id,
                    fullName: staffData,
                    email: staff?.staffUserData?.email || "",
                    avatar: staff?.staffUserData?.avatar || null,
                    specialtyData: { ...staff?.staffSpecialtyData, name: staff?.staffSpecialtyData?.name || "" },
                    roleData: { ...staff?.staffUserData?.userRoleData, name: staff?.staffUserData?.userRoleData?.name || "" },
                })
            })

            roomData?.serviceData?.forEach(service => {
                _mockParaclinicalServices.push({
                    id: service.id,
                    name: service?.name || "",
                    price: service?.price || "",
                    description: service?.description || "",
                    isAvailable: true
                })
            })
            setMockExaminations(_mockExaminations)
            setMockStaffs(_mockStaffs)
            setMockParaclinicalServices(_mockParaclinicalServices)
            if (roomData?.typeRoom?.value === TYPE_ROOM.CLINIC || roomData?.typeRoom?.value === TYPE_ROOM.LABORATORY || roomData?.typeRoom?.value === TYPE_ROOM.DUTY) {
                setActiveTab("2")
            } else if (roomData?.typeRoom?.value === TYPE_ROOM.INPATIENT_NORMAL || roomData?.typeRoom?.value === TYPE_ROOM.INPATIENT_VIP || roomData?.typeRoom?.value === TYPE_ROOM.EMERGENCY) {
                setActiveTab("1")
            }
        }
    }, [roomData])

    const examinationColumns = [
        {
            title: 'Mã khám',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Bệnh nhân',
            dataIndex: 'patientData',
            key: 'patient',
            render: (patient) => (
                <div className="flex items-center">
                    <Avatar icon={<UserOutlined />} className="mr-2" />
                    <div>
                        <div className="font-medium">{patient?.fullName || 'Không có tên'}</div>
                        <div className="text-xs text-gray-500">{patient?.phoneNumber || 'Không có SĐT'}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thời gian nhập viện',
            dataIndex: 'admissionDate',
            key: 'admissionDate',
            render: (admissionDate) => (
                <div>
                    <div>{dayjs(admissionDate).format('DD/MM/YYYY HH:mm')}</div>
                    <div className="text-xs text-gray-500">{dayjs(admissionDate).fromNow()}</div>
                </div>
            ),
        },
        {
            title: 'Trạng thái hôm nay',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                let text = 'Không xác định';
                switch (status) {
                    case STATUS_BE.EXAMINING:
                        color = 'green';
                        text = 'Đã khám';
                        break;
                    case STATUS_BE.PAID:
                        color = 'orange';
                        text = 'Chưa khám';
                        break;
                    case STATUS_BE.DONE:
                        color = 'blue';
                        text = 'Ra viện';
                        break;
                    default:
                        break;
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    const staffColumns = [
        {
            title: 'Nhân viên',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (fullName, record) => (
                <div className="flex items-center">
                    <Avatar src={record.avatar} icon={!record.avatar && <UserOutlined />} className="mr-2" />
                    <div>
                        <div className="font-medium">{fullName}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Chuyên khoa',
            dataIndex: 'specialtyData',
            key: 'specialty',
            render: (specialty) => specialty?.name || "Không",
        },
        {
            title: 'Chức vụ',
            dataIndex: 'roleData',
            key: 'role',
            render: (role) => role?.name || 'Không có chức vụ',
        },
    ];

    const paraclinicalColumns = [
        {
            title: 'Dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá (VND)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => new Intl.NumberFormat('vi-VN').format(price),
        },
    ];

    // Chuẩn bị tabs cho modal
    const items = [];

    let paraclinicalServices = {
        key: '3',
        label: (
            <span className="flex items-center">
                <DatabaseOutlined className="mr-1" />
                <span>Dịch vụ cận lâm sàng ({mockParaclinicalServices.length})</span>
            </span>
        ),
        children: (
            <Table
                dataSource={mockParaclinicalServices}
                columns={paraclinicalColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: <Empty description="Không có dịch vụ nào" /> }}
            />
        ),
    }

    let dutyStaff = {
        key: '2',
        label: (
            <span className="flex items-center">
                <TeamOutlined className="mr-1" />
                <span>Nhân viên trực ({mockStaffs.length})</span>
            </span>
        ),
        children: (
            <Table
                dataSource={mockStaffs}
                columns={staffColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: <Empty description="Không có nhân viên nào" /> }}
            />
        ),
    }

    let examination = {
        key: '1',
        label: (
            <span className="flex items-center">
                <MedicineBoxOutlined className="mr-1" />
                <span>Ca khám hiện tại ({mockExaminations.length})</span>
            </span>
        ),
        children: (
            <Table
                dataSource={mockExaminations}
                columns={examinationColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: <Empty description="Không có ca khám nào" /> }}
            />
        ),
    }

    // Thêm tab dịch vụ cận lâm sàng nếu phòng là phòng xét nghiệm (typeRoom = 5)
    if (roomData?.typeRoom?.value === TYPE_ROOM.LABORATORY) {
        items.push(dutyStaff)
        items.push(paraclinicalServices)
    } else if (roomData?.typeRoom?.value === TYPE_ROOM.CLINIC) {
        items.push(dutyStaff)
    } else if (roomData?.typeRoom?.value === TYPE_ROOM.INPATIENT_NORMAL || roomData?.typeRoom?.value === TYPE_ROOM.INPATIENT_VIP || roomData?.typeRoom?.value === TYPE_ROOM.EMERGENCY) {
        items.push(examination)
    } else if (roomData?.typeRoom?.value === TYPE_ROOM.DUTY) {
        items.push(dutyStaff)
    }

    // Tính tỷ lệ sử dụng phòng/giường
    const calculateOccupancy = () => {
        if (!roomData || !roomData.capacity) return 0;
        const used = roomData?.examinationRoomData?.length || 0;
        return Math.round((used / roomData.capacity) * 100);
    };

    const occupancyRate = calculateOccupancy();
    const isAlmostFull = occupancyRate >= 80;

    const renderRoomStatus = () => {
        if (!roomData || !roomData.capacity) return null;

        const usedBeds = roomData?.examinationRoomData?.length || 0;
        const totalBeds = roomData?.capacity || 0;

        let statusColor = 'success';
        if (occupancyRate >= 80) statusColor = 'error';
        else if (occupancyRate >= 50) statusColor = 'warning';

        return (
            <div className="flex items-center mt-2">
                <Badge status={statusColor} />
                <span>
                    Đang sử dụng: <span className="font-bold">{usedBeds}/{totalBeds}</span> giường
                    ({occupancyRate}%)
                </span>
            </div>
        );
    };

    return (
        <Modal
            title={<div className="text-xl font-bold text-white">Thông tin chi tiết</div>}
            open={visible}
            onCancel={onClose}
            footer={null}
            className="room-detail-modal !w-full md:!w-[600px] lg:!w-[800px] min-h-[600px]"
        >
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="px-1">
                    {isAlmostFull && (
                        <Alert
                            message="Cảnh báo phòng sắp đầy"
                            description={`Phòng này đã sử dụng ${occupancyRate}% công suất. Cân nhắc chuẩn bị thêm phòng.`}
                            type="warning"
                            showIcon
                            closable
                            className="mb-4"
                        />
                    )}

                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={16}>
                            <Card className="shadow-sm h-full" >
                                <div className="flex flex-col h-full">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{roomData?.name}</h2>
                                        <p className="text-gray-600 mt-1">
                                            Khoa: <span className="font-medium">{roomData?.department || 'Không có thông tin'}</span>
                                        </p>
                                        <div className="mt-2 space-x-2">
                                            <Tag color="blue">{roomData?.typeRoom?.label || 'Không xác định loại phòng'}</Tag>
                                            {roomData?.status === 1 ?
                                                <Tag color="green">Đang hoạt động</Tag> :
                                                <Tag color="red">Ngừng hoạt động</Tag>
                                            }
                                        </div>
                                        {renderRoomStatus()}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="shadow-sm">
                        <Tabs
                            defaultActiveKey="1"
                            items={items}
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            className="overflow-auto"
                        />
                    </Card>
                </div>
            )}
        </Modal>
    );
};

export default RoomDetail; 