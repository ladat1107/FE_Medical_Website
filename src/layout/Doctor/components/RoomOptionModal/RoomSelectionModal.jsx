import { useEffect, useState } from 'react';
import { Modal, Button, Table, Badge, Tooltip, Spin, Select } from 'antd';
import PropTypes from 'prop-types';
import './RoomSelectionModal.scss'; // Bạn cần tạo file SCSS tương ứng
import { useMutation } from "@/hooks/useMutation";
import { getAvailableRooms } from '@/services/doctorService';

const { Option } = Select;

const RoomSelectionModal = ({ isVisible, onClose, onRoomSelect, selected, medicalTreatmentTier }) => {
    const [selectedRoom, setSelectedRoom] = useState(selected || null); 
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    
    // Filter states
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedServiceType, setSelectedServiceType] = useState(null);

    const {
        data: dataAvailableRooms,
        loading: availableRoomsLoading, 
        error: availableRoomsError,
        execute: fetchAvailableRooms,
    } = useMutation(() => getAvailableRooms(medicalTreatmentTier));

    useEffect(() => {
        if (isVisible) {
            setLoading(true);
            fetchAvailableRooms();
        }
    }, [isVisible, medicalTreatmentTier]);

    useEffect(() => {
        if (dataAvailableRooms?.DT) {
            const roomsData = dataAvailableRooms.DT;
            setRooms(roomsData);
            setFilteredRooms(roomsData);
            setLoading(false);
            
            // Extract unique departments
            const uniqueDepartments = Array.from(
                new Set(
                    roomsData
                        .filter(room => room.roomDepartmentData)
                        .map(room => JSON.stringify({
                            id: room.roomDepartmentData.id,
                            name: room.roomDepartmentData.name
                        }))
                )
            ).map(str => JSON.parse(str));
            
            setDepartments(uniqueDepartments);
            
            // Extract unique service types
            const uniqueServiceTypes = Array.from(
                new Set(
                    roomsData
                        .filter(room => room.serviceData && room.serviceData.length > 0)
                        .map(room => JSON.stringify({
                            id: room.serviceData[0].id,
                            name: room.serviceData[0].id === 3 ? 'Phòng thường' : 
                                  room.serviceData[0].id === 4 ? 'Phòng VIP' : 'Phòng cấp cứu'
                        }))
                )
            ).map(str => JSON.parse(str));
            
            setServiceTypes(uniqueServiceTypes);
        }
    }, [dataAvailableRooms]);

    // Apply filters when filter states change
    useEffect(() => {
        let result = [...rooms];
        
        if (selectedDepartment) {
            result = result.filter(
                room => room.roomDepartmentData && room.roomDepartmentData.id === selectedDepartment
            );
        }
        
        if (selectedServiceType) {
            result = result.filter(
                room => room.serviceData && 
                room.serviceData.length > 0 && 
                room.serviceData[0].id === selectedServiceType
            );
        }
        
        setFilteredRooms(result);
    }, [selectedDepartment, selectedServiceType, rooms]);

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
    };

    const handleServiceTypeChange = (value) => {
        setSelectedServiceType(value);
    };

    const resetFilters = () => {
        setSelectedDepartment(null);
        setSelectedServiceType(null);
    };

    const columns = [
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <div>
                    <div className="room-name">{text}</div>
                    <div className="department-name">
                        {record.roomDepartmentData && `Khoa: ${record.roomDepartmentData.name}`}
                    </div>
                </div>
            )
        },
        {
            title: 'Giường trống',
            dataIndex: 'capacity',
            key: 'capacity',
            render: (_, record) => {
                const availableCapacity = record?.availableCapacity || 0;
                const totalCapacity = record?.totalCapacity || 0;
                const usedPercentage = totalCapacity > 0 ? 
                Math.round(((totalCapacity - availableCapacity) / totalCapacity) * 100) : 0;
                
                let status = 'success';
                if (usedPercentage >= 80) status = 'error';
                else if (usedPercentage >= 50) status = 'warning';

                return (
                    <Tooltip title={`Đã sử dụng: ${usedPercentage}%`}>
                        <div className="capacity-container">
                            {/* <Badge status={status}/> */}
                            <span className="capacity-text">
                                {(totalCapacity - availableCapacity)}/{totalCapacity}
                            </span>
                            <div className="capacity-bar">
                                <div 
                                    className={`capacity-bar-fill ${status}`}
                                    style={{ width: `${usedPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Giá dịch vụ',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => {
                const price = record.serviceData[0]?.price || 0;
                return (
                    <span>{price.toLocaleString('vi-VN')} VNĐ</span>
                );
            },
            sorter: (a, b) => {
                const priceA = a.serviceData[0]?.price || 0;
                const priceB = b.serviceData[0]?.price || 0;
                return priceA - priceB;
            }
        },
        {
            title: 'Loại dịch vụ',
            dataIndex: 'serviceType',
            key: 'serviceType',
            render: (_, record) => {
                const serviceType = record.serviceData[0]?.id || 0;
                return (
                    <span>
                        {serviceType === 3 ? 'Phòng thường' 
                        : serviceType === 4 ? 'Phòng VIP'
                        : serviceType === 6 ? 'Phòng cấp cứu'
                        : 'Phòng khác'}
                    </span>
                );
            },
            sorter: (a, b) => {
                const typeA = a.serviceData[0]?.id || 0;
                const typeB = b.serviceData[0]?.id || 0;
                return typeA - typeB;
            }
        }
    ];

    const handleSelectChange = (selectedRowKeys, selectedRows) => {
        setSelectedRoom(selectedRows[0]);
    };

    const handleOk = () => {
        if (selectedRoom) {
            onRoomSelect(selectedRoom);
        }
    };

    return (
        <Modal
            title="Chọn phòng khám"
            visible={isVisible}
            onCancel={onClose}
            width={1000}
            style={{ top: '25px' }}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleOk}
                    disabled={!selectedRoom}
                >
                    Xác nhận
                </Button>,
            ]}
        >
            {loading ? (
                <div className="loading text-center mt-5">
                    <Spin />
                </div>
            ) : (
                <>
                    <div className="filter-section">
                        <p className='flex items-center'>Lọc phòng bệnh:</p>
                        <Select
                            placeholder="Lọc theo khoa"
                            style={{ width: 200 }}
                            allowClear
                            onChange={handleDepartmentChange}
                            value={selectedDepartment}
                        >
                            {departments.map(dept => (
                                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                            ))}
                        </Select>
                        
                        <Select
                            placeholder="Lọc theo loại dịch vụ"
                            style={{ width: 200 }}
                            allowClear
                            onChange={handleServiceTypeChange}
                            value={selectedServiceType}
                        >
                            {serviceTypes.map(type => (
                                <Option key={type.id} value={type.id}>{type.name}</Option>
                            ))}
                        </Select>
                        
                        {(selectedDepartment || selectedServiceType) && (
                            <Button onClick={resetFilters}>Xóa bộ lọc</Button>
                        )}
                    </div>
                    
                    <Table
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: selectedRoom ? [selectedRoom.id] : [],
                            onChange: handleSelectChange,
                            columnWidth: 60,
                        }}
                        columns={columns}
                        dataSource={filteredRooms}
                        rowKey="id"
                        pagination={false}
                        scroll={{ y: 400 }}
                        locale={{ emptyText: 'Không có dữ liệu' }}
                    />
                </>
            )}
        </Modal>
    );
};

RoomSelectionModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRoomSelect: PropTypes.func.isRequired,
    selected: PropTypes.object,
    medicalTreatmentTier: PropTypes.number,
};

export default RoomSelectionModal;