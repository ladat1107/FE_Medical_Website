import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { message, Popconfirm } from 'antd';
import { useMutation } from '@/hooks/useMutation';
import PropTypes from 'prop-types';
import { createRequestParaclinical, deleteParaclinical, getServiceLaboratory } from '@/services/doctorService';
import { STATUS_BE } from '@/constant/value';

const InpatientParacs = ({ paracsData, examId, isEditMode}) => {

    const [selectedParaclinicals, setSelectedParaclinicals] = useState([]);
    const [inputParac, setInputParac] = useState('');
    const [shakeId, setShakeId] = useState(null);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [paracOptions, setParacOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localParacData, setLocalParacData] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const paraclinicalContainerRef = useRef(null);
    const inputRef = useRef(null);
    const searchResultsRef = useRef(null);

    useEffect(() => {
        setLocalParacData(Array.isArray(paracsData) ? [...paracsData] : []);
    }, [paracsData]);

    const examinationResultParaclincalData = localParacData;
    const today = moment().format('YYYY-MM-DD');
    moment.locale('vi');
    
    // Dùng map thay vì object để hiển thị thứ trong tuần bằng tiếng Việt
    const getDayOfWeekVi = (date) => {
        const day = moment(date).day();
        const daysInVietnamese = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        return daysInVietnamese[day];
    };

    const groupByDate = () => {
        const grouped = {};

        if (isEditMode) {
            grouped[today] = [];
        }

        if (!examinationResultParaclincalData || !examinationResultParaclincalData.length) return grouped;

        examinationResultParaclincalData.forEach(parac => {
            const date = moment(parac.updatedAt).format('YYYY-MM-DD');
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(parac);
        });
        return grouped;
    };

    const groupedData = groupByDate();
    const sortedDates = Object.keys(groupedData).sort((a, b) => moment(b) - moment(a)); 

    const zoomImage = (image) => {
        window.open(image, "_blank");
    }

    useEffect(() => {
        fetchParaclinical();
    }, []);

    let {
        data: dataParaclinicals,
        loading: comorbiditiesLoading,
        error: comorbiditiesError,
        execute: fetchParaclinical,
    } = useMutation((query) =>
        getServiceLaboratory()
    );

    useEffect(() => {
        if (dataParaclinicals && dataParaclinicals.DT) {
            const paracOptions = dataParaclinicals.DT.map(item => ({
                id: item.id,
                label: item.name,
                price: item.price,
            }));
            setParacOptions(paracOptions);
        }
    }, [dataParaclinicals]);

    const handleRemoveParaclinical = (id) => {
        setSelectedParaclinicals(selectedParaclinicals.filter(item => item.id !== id));
    };

    const handleInputChange = (event) => {
        setInputParac(event.target.value);
        setShowSearchResults(true);
    };

    const handleSelectParaclinical = (paraclinical) => {
        // Kiểm tra xem paraclinical đã tồn tại trong danh sách chưa
        if (selectedParaclinicals.some(item => item.id === paraclinical.id)) {
            setShakeId(paraclinical.id);
            setTimeout(() => setShakeId(null), 1000);
            return;
        }

        // const isDuplicate = examinationResultParaclincalData.some(detail =>
        //     detail.paraclinical === paraclinical.id
        // );

        // if (isDuplicate) {
        //     message.warning('Xét nghiệm đã tồn tại trong danh sách!');
        //     return;
        // }

        setSelectedParaclinicals((prevSelected) => [
            ...prevSelected,
            paraclinical
        ]);
        setInputParac('');
        setShowSearchResults(false);
    };

    const handleParacRequest = async () => {

        if (selectedParaclinicals.length === 0) {
            message.warning('Vui lòng chọn ít nhất một xét nghiệm!');
            return;
        }
    
        const data = {
            examinationId: examId,
            listParaclinicals: selectedParaclinicals,
            isInpatient: true,
        }
    
        setIsLoading(true);
    
        try {
            // Gọi API tạo yêu cầu xét nghiệm
            const response = await createRequestParaclinical(data);
    
            if (response.DT && response.EC === 0) {
                message.success('Tạo yêu cầu xét nghiệm thành công!');
                
                // Tạo mảng các mục mới để thêm vào state hiện tại
                const newParacItems = response.DT.map(item => ({
                    id: item.DT.id,
                    name: item.DT.paracName,
                    updatedAt: item.DT.updatedAt,
                    createdAt: item.DT.createdAt,
                    paracName: item.DT.paracName,
                    doctorParaclinicalData: { 
                        staffUserData: {
                            fullName: item.DT.staffName,
                        }
                    },
                    roomParaclinicalData: {
                        name: item.DT.roomName
                    }
                }));
                
                // Cập nhật state bằng cách thêm các mục mới
                setLocalParacData(prevData => [...prevData, ...newParacItems]);
                setSelectedParaclinicals([]);
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error('Error creating request:', error);
            message.error('Đã xảy ra lỗi khi tạo yêu cầu xét nghiệm!');
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteParac = async (paracId) => {
        setDeletingId(paracId);
        
        try {
            // Gọi API xóa paraclinical
            const data = {
                id: paracId,
                examinationId: examId,
            }
            const response = await deleteParaclinical(data);
            
            if (response && response.EC === 0) {
                message.success('Xóa yêu cầu xét nghiệm thành công!');
                
                // Cập nhật state bằng cách loại bỏ mục đã xóa
                setLocalParacData(prevData => prevData.filter(item => item.id !== paracId));
            } else {
                message.error(response.EM || 'Xóa yêu cầu xét nghiệm thất bại!');
            }
        } catch (error) {
            console.error('Error deleting paraclinical:', error);
            message.error('Đã xảy ra lỗi khi xóa yêu cầu xét nghiệm!');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredParaclinicals = paracOptions.filter(paraclinical =>
        paraclinical.label.toLowerCase().includes(inputParac.toLowerCase())
    );
    
    return (
        <div className="inpatient-vitals-content">
            {sortedDates.length === 0 ? (
                <div className="text-center p-4">Không có dữ liệu cận lâm sàng</div>
            ) : (
                sortedDates.map(date => (
                    <div className="flex mb-4" key={date}>
                        <div className="inpatient-pres-date" style={{width: '15%'}}>
                            <p style={{fontSize: '18px', fontWeight: '500'}}>
                                {moment(date).format('D [Tháng] M')}
                            </p>
                            <p className="gray-p">{getDayOfWeekVi(date)}</p>
                        </div>
                        <div className="flex-column" style={{width: '85%'}}>
                            {groupedData[date].length > 0 && (
                                <div className="d-flex flex-column">
                                    <div className="inpatient-pres-detail flex-column m-0">
                                        {groupedData[date].map(parac => (
                                            <div key={parac.id} className="flex mb-3" style={{width: '100%'}}>
                                                <div style={{width: '20%'}}>
                                                    <p className="gray-p">Bác sĩ thực hiện</p>
                                                    <p style={{fontWeight: '500'}}>
                                                    {
                                                        parac.doctorParaclinicalData?.staffUserData
                                                            ? (parac.doctorParaclinicalData.staffUserData.lastName && parac.doctorParaclinicalData.staffUserData.firstName)
                                                                ? `${parac.doctorParaclinicalData.staffUserData.lastName} ${parac.doctorParaclinicalData.staffUserData.firstName}`
                                                                : parac.doctorParaclinicalData.staffUserData.fullName || 'Không có thông tin'
                                                            : 'Không có thông tin'
                                                    }
                                                    </p>
                                                    <div className="flex mt-1 d-flex align-items-center gray-p" style={{width: '100%'}}>
                                                        <i className="fa-regular fa-clock me-2 align-middle text-center"></i>
                                                        {moment(parac.updatedAt).format('HH:mm')}
                                                    </div>
                                                </div>
                                                <div className="flex-column" style={{width: '80%'}}>
                                                    <div className="inpatient-vitals-detail__body__item">
                                                        <div className='flex mt-2' style={{justifyContent: 'space-between'}}>
                                                            <p style={{fontSize: '18px', fontWeight: '500'}}>{parac.paracName}</p> 
                                                            {isEditMode && parac.status !== STATUS_BE.DONE && (
                                                                <Popconfirm
                                                                    title="Xác nhận xóa"
                                                                    description="Bạn có chắc chắn muốn xóa xét nghiệm này?"
                                                                    onConfirm={() => handleDeleteParac(parac.id)}
                                                                    okText="Xóa"
                                                                    cancelText="Hủy"
                                                                >
                                                                    <button 
                                                                        className="action-btn action-delete"
                                                                        disabled={deletingId === parac.id}
                                                                    >
                                                                        {deletingId === parac.id ? (
                                                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                                                        ) : (
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        )}
                                                                    </button>
                                                                </Popconfirm>
                                                            )}
                                                        </div>  
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Kết quả:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{parac.result || 'Chưa có kết quả'}</div>
                                                        </div>  
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Mô tả:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{parac.description || ''}</div>
                                                        </div>  
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Hình ảnh:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>
                                                                {parac.image && 
                                                                    <span 
                                                                        onClick={() => zoomImage(parac.image)} 
                                                                        style={{ fontStyle: 'italic', textDecoration: 'underline', color: '#007BFF', cursor: 'pointer' }}>
                                                                        Nhấn để xem
                                                                    </span>
                                                                }
                                                                {!parac.image && ''}
                                                            </div>
                                                        </div>
                                                        <div className='flex mt-2'>
                                                            <div className='col-2 gray-p'>Phòng thực hiện:</div>
                                                            <div className='col-8' style={{fontWeight: '500'}}>{parac.roomParaclinicalData?.name || ''}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {date === today && isEditMode && (
                                <>
                                    <div
                                        ref={paraclinicalContainerRef}
                                        className='paraclinicals-action'
                                        style={groupedData[today].length > 0 ? { marginTop: '8px' } : {}}
                                    >
                                        <div className='paraclinicals-list'>
                                            {selectedParaclinicals.map(comorbidity => (
                                                <div
                                                    key={comorbidity.id}
                                                    className={`paraclinicals-item mb-2 ${shakeId === comorbidity.id ? 'shake' : ''}`}
                                                >
                                                    <p>{comorbidity.label}</p>
                                                    <i
                                                        className="fa-solid me-2 fa-times"
                                                        onClick={() => handleRemoveParaclinical(comorbidity.id)}
                                                    ></i>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Input tìm kiếm bệnh đi kèm */}
                                        <input
                                            ref={inputRef}
                                            className='input-add-prac'
                                            type='text'
                                            placeholder='Thêm yêu cầu cận lâm sàng...'
                                            style={{ background: '#eeeeee', border: 'none', boxShadow: 'none' }}
                                            value={inputParac}
                                            onChange={handleInputChange}
                                            //readOnly={!isEditMode} 
                                            onFocus={() => setShowSearchResults(true)}
                                        />
                                        {/* Hiển thị danh sách bệnh đi kèm khi có kết quả tìm kiếm */}
                                        {showSearchResults && inputParac && (
                                            <div
                                                ref={searchResultsRef}
                                                className='search-results'
                                            >
                                                {filteredParaclinicals.map(paraclinical => (
                                                    <div
                                                        key={paraclinical.id}
                                                        className='search-item'
                                                        onClick={() => handleSelectParaclinical(paraclinical)}
                                                    >
                                                        {paraclinical.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex mt-2 add-vitals-detail" style={{width: '100%'}}
                                        onClick={handleParacRequest}>
                                        {isLoading ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid mr-2 fa-plus"></i> 
                                                Thêm cận lâm sàng
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
InpatientParacs.propTypes = {
    paracsData: PropTypes.array,
    examId: PropTypes.number,
};

export default InpatientParacs;