import { convertDateTime } from '@/utils/formatDate';
import { useState, useEffect } from 'react';
import './RecordModal.scss';
import SelectBox2 from '@/layout/Doctor/components/Selectbox';
import { RELATIVE_OPTIONS } from '@/constant/options';
import { createRelative, deleteRelative } from '@/services/doctorService';
import { message, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

const RecordModal = ({ isOpen, onClose, record }) => {
    const [relatives, setRelatives] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (record?.userExaminationData?.userRelativeData) {
            setRelatives(record.userExaminationData.userRelativeData);
        }
    }, [record]);
    
    // State cho thông tin người thân
    const [relativeInfo, setRelativeInfo] = useState({
        fullName: '',
        cid: '',
        phoneNumber: '',
        address: '',
        relationship: null,
        email: ''
    });

    // Xử lý thay đổi input người thân
    const handleRelativeChange = (field) => (e) => {
        if (field === 'relationship') {
            setRelativeInfo(prev => ({
                ...prev,
                [field]: e
            }));
            return;
        }
        setRelativeInfo(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    // Xử lý lưu thông tin người thân
    const handleSaveRelative = async () => {

        if(!relativeInfo.fullName) {
            message.error('Vui lòng nhập họ và tên');
            return;
        }

        if(!relativeInfo.cid) {
            message.error('Vui lòng nhập CCCD');
            return;
        }

        if(!relativeInfo.phoneNumber) {
            message.error('Vui lòng nhập số điện thoại');
            return;
        }

        if(!relativeInfo.address) {
            message.error('Vui lòng nhập địa chỉ');
            return;
        }

        if(!relativeInfo.relationship) {
            message.error('Vui lòng chọn quan hệ');
            return;
        }

        try {
            const data = {
                ...relativeInfo,
                userId: +record?.userExaminationData?.id,
            };

            const res = await createRelative(data);
            if (res && res.EC === 0) {
                message.success('Lưu thông tin người thân thành công');
                setRelatives(prev => [...prev, {
                    ...data,
                    id: res.DT.id
                }]);
                setRelativeInfo({
                    fullName: '',
                    cid: '',
                    phoneNumber: '',
                    address: '',
                    relationship: null,
                    email: ''
                });
                setShowForm(false);
            } else {
                message.error(res.EM);
            }
        } catch (error) {
            console.error('Error saving relative info:', error);
            message.error('Lưu thông tin người thân thất bại');
        }
    };

    const SpecialText = (special) => {
        let specialClass = '';
        let specialText = '';

        switch (special) {
            case 'normal':
                specialClass = 'special';
                specialText = '';
                break;
            case 'old':
                specialClass = 'special-old';
                specialText = 'Người già';
                break;
            case 'children':
                specialClass = 'special-children';
                specialText = 'Trẻ em';
                break;
            case 'disabled':
                specialClass = 'special-disabled';
                specialText = 'Người tàn tật';
                break;
            case 'pregnant':
                specialClass = 'special-pregnant';
                specialText = 'P.nữ mang thai';
                break;
            default:
                specialClass = '';
        }

        return <p className={`special ${specialClass}`}>{specialText}</p>;
    };

    const handleDeleteRelative = async (id) => {
        setDeletingId(id);
        try {
            const res = await deleteRelative(id);
            if (res && res.EC === 0) {
                message.success('Xóa thông tin người thân thành công');
                setRelatives(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting relative:', error);
            message.error('Xóa thông tin người thân thất bại');
        } finally {
            setDeletingId(null);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="add-exam-container">
            <div className="add-exam-content">
                <div className='add-exam-header row'>
                    <div className='col-4'>
                        <p className='add-exam-title'>Thông tin bệnh nhân</p>
                    </div>
                    <div className='col-5'>
                        <p className='add-exam-subtitle'>Thông tin khám bệnh</p>
                    </div>
                    <div className='col-1 d-flex justify-content-end'>
                        <button className='btn-close' onClick={onClose}></button>
                    </div>
                </div>
                <div className='add-exam-body row'>
                    <div className='col-5'>
                        <div className="avatar-container align-items-center flex-column">
                            <div className="avatar-circle">
                                {record?.userExaminationData?.avatar ? (
                                    <img 
                                        src={record.userExaminationData.avatar} 
                                        alt="Avatar" 
                                        className="avatar-image" 
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {record?.userExaminationData?.firstName ? record?.userExaminationData.firstName.charAt(0) : "U"}
                                    </div>
                                )}
                            </div>
                            <div className="avatar-info">
                                <p className="avatar-name">
                                    {record?.userExaminationData?.lastName} {record?.userExaminationData?.firstName} 
                                </p>
                                <p className="avatar-id">
                                    Mã bệnh nhân: {record?.userExaminationData?.id}
                                </p>
                            </div>
                        </div>
                        <div className="patient-info">
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Địa chỉ:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.userExaminationData?.address || ''}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Giới tính:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.userExaminationData?.gender == 0 ? 'Nam'
                                                    : record?.userExaminationData?.gender == 1 ? 'Nữ'
                                                    : ''}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Ngày sinh:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{convertDateTime(record?.userExaminationData?.dob)}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>SĐT:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.userExaminationData?.phoneNumber || ''}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>CCCD:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.userExaminationData?.cid || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-7'>
                        <div className="examination-info">
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Số BHYT:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.insuranceCode}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Ngày khám:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{convertDateTime(record?.admissionDate)}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Tuyến điều trị:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.isWrongTreatment === 1 ? 'Trái tuyến' : 'Đúng tuyến' }</p>
                                </div>
                            </div>
                            {record?.medicalTreatmentTier === 2 && (
                                <div className='row'>
                                    <div className='col-4'>
                                        <p className='info-label'>Bác sĩ khám:</p>
                                    </div>
                                    <div className='col-8'>
                                        <p className='info-value'>{record?.examinationStaffData?.staffUserData?.lastName} {record?.examinationStaffData?.staffUserData?.firstName}</p>
                                    </div>
                                </div>
                            )}
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Ưu tiên:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{SpecialText(record?.special)}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Phòng khám:</p>
                                </div>
                                <div className='col-8'>
                                    <p className='info-value'>{record?.roomName}</p>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p className='info-label'>Trạng thái:</p>
                                </div>
                                <div className='col-8'>
                                    {record.status == 4 || record.status == 5 ? (
                                        <span style={{ color: '#FF0000' }}>Chưa khám</span>) : (
                                        record.status == 6 ? (
                                            <span style={{ color: '#00FF00' }}>Đang khám</span>)  : ''
                                        )
                                    }
                                </div>
                            </div>
                            
                            <div className='relative-info-section mt-4'>
                                <div className='add-exam-header d-flex justify-content-between align-items-center mb-0'>
                                    <p className='add-exam-title'>Thông tin người thân</p>
                                </div>
                                {!showForm && (
                                    <>
                                        {relatives.length > 0 ? (
                                            <div className='relative-info-list flex-column'>
                                                {relatives.map((item, index) => (
                                                    <div key={index} className='relative-info-item mt-2'>
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p className='info-label'>Họ và tên:</p>
                                                            </div>
                                                            <div className='col-7'>
                                                                <p className='info-value'>{item?.fullName}</p>
                                                            </div>
                                                            <div className='col-1'>
                                                                <Popconfirm
                                                                    title="Xác nhận xóa"
                                                                    description="Bạn có chắc chắn muốn xóa quan hệ này?"
                                                                    onConfirm={() => handleDeleteRelative(item.id)}
                                                                    okText="Xóa"
                                                                    cancelText="Hủy"
                                                                >
                                                                    <button 
                                                                        className="action-btn action-delete"
                                                                        disabled={deletingId === item.id}
                                                                    >
                                                                        {deletingId === item.id ? (
                                                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                                                        ) : (
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        )}
                                                                    </button>
                                                                </Popconfirm>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p className='info-label'>CCCD:</p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <p className='info-value'>{item?.cid}</p>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p className='info-label'>SĐT:</p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <p className='info-value'>{item?.phoneNumber}</p>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p className='info-label'>Địa chỉ:</p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <p className='info-value'>{item?.address}</p>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p className='info-label'>Q.Hệ với bệnh nhân:</p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <p className='info-value'>{
                                                                    RELATIVE_OPTIONS.find(option => option.value === item?.relationship)?.label    
                                                                }</p>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p className='info-label'>Email:</p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <p className='info-value'>{item?.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                <p className='info-value'>Chưa có thông tin người thân</p>
                                            </>
                                        )}
                                        
                                        <div className='d-flex justify-content-end'>
                                            <button className='save-button' onClick={() => setShowForm(true)}>Thêm mới</button>
                                        </div>
                                    </>
                                )}
                                
                                {showForm && (
                                    <div className=''>
                                        <div className=''>
                                            <label>Họ và tên</label>
                                            <input 
                                                type="text" 
                                                name="fullName" 
                                                className="input" 
                                                value={relativeInfo.fullName}
                                                onChange={handleRelativeChange('fullName')}
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <label>CCCD</label>
                                            <input 
                                                type="text" 
                                                name="cid" 
                                                className="input" 
                                                value={relativeInfo.cid}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || /^\d+$/.test(value)) {
                                                        if (value.length <= 12) {
                                                            handleRelativeChange('cid')(e);
                                                        }
                                                    }
                                                }}
                                                placeholder="Nhập số CCCD"
                                                maxLength={12}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <label>SĐT</label>
                                            <input 
                                                type="text" 
                                                name="phoneNumber" 
                                                className="input" 
                                                value={relativeInfo.phoneNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || /^\d+$/.test(value)) {
                                                        if (value.length <= 10) {
                                                            handleRelativeChange('phoneNumber')(e);
                                                        }
                                                    }
                                                }}
                                                placeholder="Nhập số điện thoại"
                                                maxLength={10}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <label>Địa chỉ</label>
                                            <input 
                                                type="text" 
                                                name="address" 
                                                className="input" 
                                                value={relativeInfo.address}
                                                onChange={handleRelativeChange('address')}
                                                placeholder="Nhập địa chỉ"
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <label>Quan hệ với bệnh nhân</label>
                                            <SelectBox2
                                                name="relationship"
                                                placeholder="Chọn quan hệ"
                                                className="select-box2"
                                                options={RELATIVE_OPTIONS}
                                                value={relativeInfo.relationship}
                                                onChange={handleRelativeChange('relationship')}
                                                allowClear={false}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <label>Email</label>
                                            <input 
                                                type="text" 
                                                name="email" 
                                                className="input" 
                                                value={relativeInfo.email}
                                                onChange={handleRelativeChange('email')}
                                                placeholder="Nhập email"
                                            />
                                        </div>
                                        <div className='form-group mt-2 d-flex justify-content-end'>
                                            <button className='restore-button' onClick={() => setShowForm(false)}>Hủy</button>
                                            <button className='safe-button' onClick={handleSaveRelative}>Lưu</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
RecordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    record: PropTypes.object,
};

export default RecordModal;