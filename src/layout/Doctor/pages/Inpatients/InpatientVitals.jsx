import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/vi';
import { message, Modal, Popconfirm } from 'antd';
import { createVitalSign, deleteVitalSign, updateVitalSign } from '@/services/doctorService';

const InpatientVitals = ({vitalsData, examId, isEditMode}) => {
    const [showNewVitalForm, setShowNewVitalForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localVitalsData, setLocalVitalsData] = useState([]);
    const [editingVital, setEditingVital] = useState(null);
    const [hoveredVitalId, setHoveredVitalId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [newVitalData, setNewVitalData] = useState({
        height: '',
        weight: '',
        temperature: '',
        breathingRate: '',
        glycemicIndex: '',
        fetalWeight: '',
        hightBloodPressure: '',
        lowBloodPressure: '',
        pulse: ''
    });
    
    useEffect(() => {
        setLocalVitalsData(Array.isArray(vitalsData) ? [...vitalsData] : []);
    }, [vitalsData]);

    const examinationVitalSignData = localVitalsData;
    const today = moment().format('YYYY-MM-DD');
    moment.locale('vi');

    const weekdaysVi = {
        "Monday": "Thứ Hai",
        "Tuesday": "Thứ Ba", 
        "Wednesday": "Thứ Tư",
        "Thursday": "Thứ Năm",
        "Friday": "Thứ Sáu",
        "Saturday": "Thứ Bảy",
        "Sunday": "Chủ Nhật"
    };    
    
    const groupByDate = () => {
        const grouped = {};
        
        if (isEditMode) {
            grouped[today] = [];
        }

        if (!examinationVitalSignData || !examinationVitalSignData.length) return grouped;

        examinationVitalSignData.forEach(vital => {
            const date = moment(vital.updatedAt).format('YYYY-MM-DD');
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(vital);
        });
        return grouped;
    };

    const groupedData = groupByDate();
    const sortedDates = Object.keys(groupedData).sort((a, b) => moment(b) - moment(a)); 
    
    const handleInputChange = (field, value) => {
        if (editingVital) {
            setEditingVital({
                ...editingVital,
                [field]: value
            });
        } else {
            setNewVitalData({
                ...newVitalData,
                [field]: value
            });
        }
    };

    const handleAddVitals = async () => {
        // Sử dụng data là newVitalData hoặc editingVital tùy vào trạng thái
        const inputData = editingVital || newVitalData;
        
        if (!inputData.height || !inputData.weight || !inputData.pulse || !inputData.hightBloodPressure ||
            !inputData.lowBloodPressure || !inputData.temperature || !inputData.breathingRate) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const data = {
            examinationId: examId,
            height: inputData.height,
            weight: inputData.weight,
            fetalWeight: inputData.fetalWeight || null,
            pulse: inputData.pulse,
            hightBloodPressure: inputData.hightBloodPressure,
            lowBloodPressure: inputData.lowBloodPressure,
            temperature: inputData.temperature,
            breathingRate: inputData.breathingRate,
            glycemicIndex: inputData.glycemicIndex || null,
        }

        setIsLoading(true);
        try {
            let response;
            
            if (editingVital && editingVital.id) {
                // Cập nhật sinh hiệu hiện có
                data.id = editingVital.id;
                response = await updateVitalSign(data);
                
                if (response && response.DT) {
                    message.success('Cập nhật sinh hiệu thành công!');
                    
                    // Cập nhật dữ liệu local
                    setLocalVitalsData(prevData => 
                        prevData.map(item => 
                            item.id === editingVital.id ? 
                            {
                                ...data,
                                id: editingVital.id,
                                updatedAt: response.DT.updatedAt,
                                createdAt: editingVital.createdAt
                            } : item
                        )
                    );
                } else {
                    message.error('Có lỗi trong quá trình cập nhật sinh hiệu.');
                }
            } else {
                // Tạo sinh hiệu mới
                response = await createVitalSign(data);
                
                if (response && response.DT) {
                    message.success('Lưu sinh hiệu thành công!');
                    // Thêm sinh hiệu mới vào mảng dữ liệu local
                    const newVitalSign = {
                        ...data,
                        id: response.DT.id, 
                        updatedAt: response.DT.updatedAt,
                        createdAt: response.DT.createdAt,
                    };
                    setLocalVitalsData(prevData => [...prevData, newVitalSign]);
                } else {
                    message.error('Có lỗi trong quá trình lưu sinh hiệu.');
                }
            }
        } catch (error) {
            console.error("Error creating/updating vital sign:", error.response || error.message);
            message.error('Thao tác không thành công.');
        } finally {
            setIsLoading(false);
            setNewVitalData({
                height: '',
                weight: '',
                temperature: '',
                breathingRate: '',
                glycemicIndex: '',
                fetalWeight: '',
                hightBloodPressure: '',
                lowBloodPressure: '',
                pulse: ''
            });
            setShowNewVitalForm(false);
            setEditingVital(null);
        }
    };

    const handleCancelAdd = () => {
        setShowNewVitalForm(false);
        setEditingVital(null);
        setNewVitalData({
            height: '',
            weight: '',
            temperature: '',
            breathingRate: '',
            glycemicIndex: '',
            fetalWeight: '',
            hightBloodPressure: '',
            lowBloodPressure: '',
            pulse: ''
        });
    };
    
    const handleEditVital = (vital) => {
        // Đặt dữ liệu sinh hiệu cần chỉnh sửa
        setEditingVital(vital);
        setShowNewVitalForm(false);
    };

    const handleDeleteVital = async (vitalId) => {
        try {
            setDeletingId(vitalId);
            const response = await deleteVitalSign(vitalId);
            
            if (response && response.EC === 0) {
                message.success('Xóa sinh hiệu thành công!');
                
                // Cập nhật dữ liệu local
                setLocalVitalsData(prevData => 
                    prevData.filter(item => item.id !== vitalId)
                );
            } else {
                message.error('Có lỗi trong quá trình xóa sinh hiệu.');
            }
        } catch (error) {
            console.error("Error deleting vital sign:", error.response || error.message);
            message.error('Xóa sinh hiệu thất bại.');
        } finally {
            setDeletingId(null);
        }
    };
    
    return (
        <div className="inpatient-vitals-content">
            {sortedDates.length === 0 ? (
                <div className="text-center p-4">Không có dữ liệu sinh hiệu</div>
            ) : (
                sortedDates.map(date => (
                    <div className="flex mb-4" key={date}>
                        <div className="inpatient-pres-date" style={{width: '15%'}}>
                            <p style={{fontSize: '18px', fontWeight: '500'}}>
                                {moment(date).format('D [Tháng] M')}
                            </p>
                            <p className="gray-p">{weekdaysVi[moment(date).format('dddd')] || moment(date).format('dddd')}</p>                        
                        </div>
                        <div className="flex-column" style={{width: '85%'}}>
                            {groupedData[date].length > 0 && (
                                <div className="inpatient-pres-detail flex-column m-0" >
                                    {groupedData[date].map(vital => (
                                        <div 
                                            key={vital.id}
                                            className="vital-item"
                                            onMouseEnter={() => setHoveredVitalId(vital.id)}
                                            onMouseLeave={() => setHoveredVitalId(null)}
                                        >
                                            {editingVital && editingVital.id === vital.id ? (
                                                // Form chỉnh sửa
                                                <>
                                                    <div className="flex ms-3 mt-2 d-flex align-items-center gray-p" style={{width: '100%'}}>
                                                        <i className="fa-regular fa-clock me-2 align-middle text-center"></i>
                                                        {moment(vital.updatedAt).format('HH:mm')}
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body flex flex-wrap mt-2 ms-3 mb-3">
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                            <p className="gray-p">Chiều cao</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="cm"
                                                                value={editingVital.height}
                                                                onChange={(e) => handleInputChange('height', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                            <p className="gray-p">Cân nặng</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="kg"
                                                                value={editingVital.weight}
                                                                onChange={(e) => handleInputChange('weight', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                            <p className="gray-p">Nhiệt độ</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="°C"
                                                                value={editingVital.temperature}
                                                                onChange={(e) => handleInputChange('temperature', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                            <p className="gray-p">Nhịp thở</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="Lần/phút"
                                                                value={editingVital.breathingRate}
                                                                onChange={(e) => handleInputChange('breathingRate', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}> 
                                                            <p className="gray-p">Chỉ số đường huyết</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="mg/dl"
                                                                value={editingVital.glycemicIndex || ''}
                                                                onChange={(e) => handleInputChange('glycemicIndex', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '13%'}}>
                                                            <p className="gray-p">Cân nặng con</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="gram"
                                                                value={editingVital.fetalWeight || ''}
                                                                onChange={(e) => handleInputChange('fetalWeight', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}>
                                                            <p className="gray-p">Huyết áp</p>
                                                            <div className="d-flex mt-1 gap-1">
                                                                <input 
                                                                    type="text" 
                                                                    className="input m-0" 
                                                                    placeholder="mmHg"
                                                                    style={{width: '45%'}}
                                                                    value={editingVital.hightBloodPressure}
                                                                    onChange={(e) => handleInputChange('hightBloodPressure', e.target.value)}
                                                                />
                                                                <span className="align-self-center">/</span>
                                                                <input 
                                                                    type="text" 
                                                                    className="input m-0" 
                                                                    placeholder="mmHg"
                                                                    style={{width: '45%'}}
                                                                    value={editingVital.lowBloodPressure}
                                                                    onChange={(e) => handleInputChange('lowBloodPressure', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                            <p className="gray-p">Mạch</p>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0 mt-1" 
                                                                placeholder="Lần/phút"
                                                                value={editingVital.pulse}
                                                                onChange={(e) => handleInputChange('pulse', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-content-end me-3 mb-3">
                                                        <button 
                                                            className="restore-button me-2" 
                                                            onClick={handleCancelAdd}>
                                                            Hủy
                                                        </button>
                                                        <button 
                                                            className="save-button" 
                                                            onClick={handleAddVitals}>
                                                            {isLoading ? (
                                                                <>
                                                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                                    Đang xử lý...
                                                                </>
                                                            ) : 'Lưu'}
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                // Hiển thị thông tin
                                                <>
                                                    <div className="flex ms-3 d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center gray-p">
                                                            <i className="fa-regular fa-clock me-2 align-middle text-center"></i>
                                                            {moment(vital.updatedAt).format('HH:mm')}
                                                        </div>
                                                        <div className={`vital-actions me-2 ${hoveredVitalId === vital.id && isEditMode ? 'visible' : ''}`}>
                                                            <button 
                                                                className=" action-btn"
                                                                title="Chỉnh sửa"
                                                                onClick={() => handleEditVital(vital)}
                                                            >
                                                                <i className="fa-solid fa-gear"></i>
                                                            </button>
                                                            <Popconfirm
                                                                title="Xác nhận xóa"
                                                                description="Bạn có chắc chắn muốn xóa sinh hiệu này?"
                                                                onConfirm={() => handleDeleteVital(vital.id)}
                                                                okText="Xóa"
                                                                cancelText="Hủy"
                                                            >
                                                                <button 
                                                                    className="action-btn action-delete"
                                                                    disabled={deletingId === vital.id}
                                                                >
                                                                    {deletingId === vital.id ? (
                                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                                    ) : (
                                                                        <i className="fa-solid fa-trash"></i>
                                                                    )}
                                                                </button>
                                                            </Popconfirm>
                                                        </div>
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body flex flex-wrap mt-2 ms-3 mb-3">
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                            <p className="gray-p">Chiều cao</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.height} cm</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                            <p className="gray-p">Cân nặng</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.weight} kg</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                            <p className="gray-p">Nhiệt độ</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.temperature} °C</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                            <p className="gray-p">Nhịp thở</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.breathingRate} Lần/phút</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}> 
                                                            <p className="gray-p">Chỉ số đường huyết</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.glycemicIndex} mg/dl</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '13%'}}>
                                                            <p className="gray-p">Cân nặng con</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.fetalWeight} gram</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}>
                                                            <p className="gray-p">Huyết áp</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.hightBloodPressure}/{vital.lowBloodPressure} mmHg</p>
                                                        </div>
                                                        <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                            <p className="gray-p">Mạch</p>
                                                            <p className="mt-1" style={{fontWeight: '500'}}>{vital.pulse} Lần/phút</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {date === today && !editingVital && (
                                <>
                                    {showNewVitalForm && (
                                        <div className="inpatient-pres-detail flex-column m-0 mt-2">
                                            <div>
                                                <div className="flex ms-3 d-flex align-items-center gray-p" style={{width: '100%'}}>
                                                    <i className="fa-regular fa-clock me-2 align-middle text-center"></i>
                                                    {moment().format('HH:mm')}
                                                </div>
                                                <div className="inpatient-vitals-detail__body flex flex-wrap mt-2 ms-3 mb-3">
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                        <p className="gray-p">Chiều cao</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="cm"
                                                            value={newVitalData.height}
                                                            onChange={(e) => handleInputChange('height', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                        <p className="gray-p">Cân nặng</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="kg"
                                                            value={newVitalData.weight}
                                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '9%'}}>
                                                        <p className="gray-p">Nhiệt độ</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="°C"
                                                            value={newVitalData.temperature}
                                                            onChange={(e) => handleInputChange('temperature', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                        <p className="gray-p">Nhịp thở</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="Lần/phút"
                                                            value={newVitalData.breathingRate}
                                                            onChange={(e) => handleInputChange('breathingRate', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}> 
                                                        <p className="gray-p">Chỉ số đường huyết</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="mg/dl"
                                                            value={newVitalData.glycemicIndex}
                                                            onChange={(e) => handleInputChange('glycemicIndex', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '13%'}}>
                                                        <p className="gray-p">Cân nặng con</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="gram"
                                                            value={newVitalData.fetalWeight}
                                                            onChange={(e) => handleInputChange('fetalWeight', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '16%'}}>
                                                        <p className="gray-p">Huyết áp</p>
                                                        <div className="d-flex mt-1 gap-1">
                                                            <input 
                                                                type="text" 
                                                                className="input m-0" 
                                                                placeholder="mmHg"
                                                                style={{width: '45%'}}
                                                                value={newVitalData.hightBloodPressure}
                                                                onChange={(e) => handleInputChange('hightBloodPressure', e.target.value)}
                                                            />
                                                            <span className="align-self-center">/</span>
                                                            <input 
                                                                type="text" 
                                                                className="input m-0" 
                                                                placeholder="mmHg"
                                                                style={{width: '45%'}}
                                                                value={newVitalData.lowBloodPressure}
                                                                onChange={(e) => handleInputChange('lowBloodPressure', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="inpatient-vitals-detail__body__item" style={{width: '12%'}}>
                                                        <p className="gray-p">Mạch</p>
                                                        <input 
                                                            type="text" 
                                                            className="input m-0 mt-1" 
                                                            placeholder="Lần/phút"
                                                            value={newVitalData.pulse}
                                                            onChange={(e) => handleInputChange('pulse', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-content-end me-3">
                                                    <button 
                                                        className="restore-button me-2" 
                                                        onClick={handleCancelAdd}>
                                                        Hủy
                                                    </button>
                                                    <button 
                                                        className="save-button" 
                                                        onClick={handleAddVitals}>
                                                        {isLoading ? (
                                                            <>
                                                                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                                Đang xử lý...
                                                            </>
                                                        ) : 'Lưu'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {!showNewVitalForm && isEditMode && (
                                        <div 
                                            className="flex mt-2 add-vitals-detail cursor-pointer" 
                                            style={{width: '100%'}}
                                            onClick={() => setShowNewVitalForm(true)}>
                                            <i className="fa-solid mr-2 fa-plus"></i> Thêm sinh hiệu
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

InpatientVitals.propTypes = {
    vitalsData: PropTypes.array,
    examId: PropTypes.number
};

export default InpatientVitals;