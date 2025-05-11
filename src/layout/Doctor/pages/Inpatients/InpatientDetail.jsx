import './InpatientList.scss'
import { useEffect, useState } from 'react';
import InpatientVitals from './InpatientVitals';
import InpatientParacs from './InpatientParacs';
import InpatientPres from './InpatientPres';
import MultiSelect from '../../components/MultiSelect';
import SelectBox2 from '../../components/Selectbox';
import { useParams } from 'react-router-dom';
import { useMutation } from '@/hooks/useMutation';
import { createAdvanceMoney, getAllDisease, getExaminationById, updateExamination } from '@/services/doctorService';
import { message, Spin } from 'antd';
import { convertDateTime } from '@/utils/formatDate';
import { DISCHARGE_OPTIONS } from '@/constant/options';
import CustomDatePicker from '@/components/DatePicker';
import CustomDatePickerWithHighlights from '@/components/DatePicker/CustomDatePickerWithHighlights';
import { useSelector } from 'react-redux';
import { STATUS_BE, TIMESLOTS } from '@/constant/value';
import SummaryModal from './InpatientModals/InpatientSumary';
import MoneyInput from '@/components/Input/MoneyInput';
import FlexibleCollapsible from './Components/FlexibleCollapsible';

const InpatientDetail = () => {
    const { schedule } = useSelector(state => state.schedule);
    const { examId } = useParams();
    const [selectedRadio, setSelectedRadio] = useState('vitalsign');
    const [examData, setExamData] = useState({})
    const [comorbiditiesOptions, setComorbiditiesOptions] = useState([]);
    const [isEditMode, setIsEditMode] = useState(true);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDischarged, setIsLoadingDischarged] = useState(false);
    const [isLoadingReExam, setIsLoadingReExam] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [open, setOpen] = useState(false);
    const [isLoadingAddAdvance, setIsLoadingAddAdvance] = useState(false);
    const [amount, setAmount] = useState("");
    const handleAmountChange = (value) => {
        setAmount(value);
    };

    const handleRadioChange = (e) => {
        setSelectedRadio(e.target.value);
    };

    const [formData, setFormData] = useState({
        reason: examData.reason || '',
        symptom: examData.symptom || '',
        diseaseName: examData.diseaseName || null,
        comorbidities: examData.comorbidities ? examData.comorbidities.split(',') : [],
        dischargeStatus: examData.dischargeStatus || null,
        treatmentResult: examData.treatmentResult || '',
        dischargeDate: examData.dischargeDate || null,
        reExaminationDate: examData.reExaminationDate ? examData.reExaminationDate : null,
        time: examData.reExaminationTime || null,
    });

    useEffect(() => {
        setFormData({
            reason: examData.reason || '',
            symptom: examData.symptom || '',
            diseaseName: examData.diseaseName || null,
            comorbidities: examData.comorbidities ? examData.comorbidities.split(',') : [],
            dischargeStatus: examData.dischargeStatus || null,
            treatmentResult: examData.treatmentResult || '',
            dischargeDate: examData.dischargeDate || null,
            reExaminationDate: examData.reExaminationDate ? examData.reExaminationDate : null,
            time: examData.reExaminationTime || null,
        });
    }, [examData]); 

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const constHandleDiseaseChange = (value) => {
        const selectedOption = comorbiditiesOptions.find(option => option.value === value);
        const label = selectedOption ? selectedOption.label : null;

        setFormData(prev => ({
            ...prev,
            diseaseName: label
        }));
    }

    const handleComorbiditiesChange = (value) => {
        setFormData(prev => ({
            ...prev,
            comorbidities: value
        }));
    };

    const handleDateChange = (field) => (date) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleSelectChange = (field) => (value) => {
        setFormData(prev => {
            const newFormData = {
                ...prev,
                [field]: value,
            };

            console.log('newFormData', newFormData);
    
            if (field === 'dischargeStatus') {
                if (value !== null) {
                    newFormData.dischargeDate = new Date();
                } else {
                    newFormData.dischargeDate = null;
                }
    
                if (value !== 4) {
                    newFormData.reExaminationDate = null;
                    newFormData.time = null;
                }
            }
    
            if (field === 'dischargeDate' && value == null) {
                newFormData.reExaminationDate = null;
                newFormData.time = null;
            }
    
            return newFormData;
        });
    };
    

    const {
        data: dataComorbidities,
        loading: comorbiditiesLoading,
        error: comorbiditiesError,
        execute: fetchComorbidities,
    } = useMutation(() => getAllDisease());

    useEffect(() => {
        if (dataComorbidities?.DT) {
            const options = dataComorbidities.DT.map(item => ({
                value: item.code,
                label: item.disease,
            }));
            setComorbiditiesOptions(options);
        }
    }, [dataComorbidities]);

    useEffect(() => {
        fetchComorbidities();
        if (examId) {  // Thêm check để đảm bảo có examId
            fetchExaminationData();
        }
    }, []);
    
    let refresh = () => {
        fetchExaminationData();
    }

    let {
        data: dataExamination,
        loading: examinationLoading,
        error: examinationError,
        execute: fetchExaminationData,
    } = useMutation((query) =>
        getExaminationById(+examId)
    );

    useEffect(() => {
        if (dataExamination && dataExamination.DT) {
            setExamData(dataExamination.DT);
            if (dataExamination.DT.status === 7) setIsEditMode(false);
        }
    }, [dataExamination]);

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

    const handleUpdateInfoExamination = async () => {
        try{
            setIsLoading(true);
            const data = {
                id: examId,
                reason: formData.reason,
                symptom: formData.symptom,
                diseaseName: formData.diseaseName,
                comorbidities: formData.comorbidities.join(','),
                status: STATUS_BE.EXAMINING,
            }

            const response = await updateExamination(data);
            if (response && response.DT.includes(1)) {
                message.success('Lưu thông tin khám bệnh thành công!');
                //setInitialFormData(formData);
                refresh();
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error('Error updating examination info:', error);
            message.error('Cập nhật thông tin thất bại!');
        } finally {
            setIsLoading(false);
        }
    }

    const checkValid = () => {
        if (!formData.diseaseName) {
            message.error('Vui lòng nhập tên bệnh!');
            return false;
        }

        if (!formData.dischargeStatus) {
            message.error('Vui lòng chọn tình trạng xuất viện!');
            return false;
        }
        if (formData.dischargeStatus === 4 && !formData.reExaminationDate) {
            message.error('Vui lòng chọn ngày tái khám!');
            return false;
        }
        if (formData.dischargeStatus === 4 && !formData.time) {
            message.error('Vui lòng chọn khung giờ tái khám!');
            return false;
        }
        if (!formData.treatmentResult) {
            message.error('Vui lòng nhập kết quả điều trị!');
            return false;
        }
        if (!formData.dischargeDate) {
            message.error('Vui lòng chọn ngày xuất viện!');
            return false;
        }
    
        const dischargeDate = new Date(formData.dischargeDate);
        const today = new Date();
        dischargeDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
    
        if (dischargeDate < today) {
            message.error('Ngày xuất viện không hợp lệ!');
            return false;
        }
    
        if (formData.reExaminationDate) {
            const reExamDate = new Date(formData.reExaminationDate);
            reExamDate.setHours(0, 0, 0, 0);
    
            if (reExamDate <= today || reExamDate <= dischargeDate) {
                message.error('Ngày tái khám không hợp lệ!');
                return false;
            }
    
            if (formData.time === null) {
                message.error('Vui lòng chọn khung giờ tái khám!');
                return false;
            }
        }
        return true;
    }

    const handleDischargedExam = async () => {
        if (!checkValid()) return;

        try {
            setIsLoadingDischarged(true);
            const data = {
                id: examId,
                status: 7,
                dischargeStatus: formData.dischargeStatus,
                treatmentResult: formData.treatmentResult,
                dischargeDate: formData.dischargeDate,
                reExaminationDate: formData.reExaminationDate,
                time: formData.time,
            }

            const response = await updateExamination(data);
            if (response && response.DT.includes(1)) {
                message.success('Lưu thông tin xuất viện thành công!');
                refresh();
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error('Error updating examination info:', error);
            message.error('Cập nhật thông tin thất bại!');
        } finally {
            setIsLoadingDischarged(false);
        }
    }

    const handleReExam = async () => {
        if (!checkValid()) return;

        try {
            setIsLoadingReExam(true);
            const data = {
                id: examId,
                status: 7,
                dischargeStatus: formData.dischargeStatus,
                treatmentResult: formData.treatmentResult,
                dischargeDate: formData.dischargeDate,
                reExaminationDate: formData.reExaminationDate,
                time: formData.time,
                createReExamination: true,
            }

            const response = await updateExamination(data);
            if (response && response.DT.includes(1)) {
                message.success('Lưu thông tin tái khám thành công!');
                refresh();
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error('Error updating examination info:', error);
            message.error('Cập nhật thông tin thất bại!');
        } finally {
            setIsLoadingReExam(false);
        }
    }

    const handleCloseSummaryModal = () => {
        setOpen(false);
    }

    const handleOpenSummaryModal = () => {
        setOpen(true);
    }
    
    const handleAddAdvanceMoney = async () => {
        const hasUnpaid = examData.advanceMoneyExaminationData.some(item => item.status === 1);
        if (hasUnpaid) {
            message.error('Có tạm ứng chưa thanh toán, không thể tạo thêm!');
            return;
        }

        if(amount === "" || amount === 0) {
            message.error('Vui lòng nhập số tiền tạm ứng!');
            return;
        }

        if(+amount < 1000) {
            message.error('Số tiền tạm ứng tối thiểu là 1.000đ!');
            return;
        }

        setIsLoadingAddAdvance(true);
        try {
            
            const data = {
                examId: examId,
                amount: amount,
            }

            const response = await createAdvanceMoney(data);
            if (response.EC === 0 && response.DT) {
                message.success('Thêm tạm ứng thành công!');
                refresh();
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error('Error adding advance money:', error);
            message.error('Thêm tạm ứng thất bại!');
        } finally {
            setIsLoadingAddAdvance(false);
        }
    }

    return (
        <>
            {examinationLoading ? (
                <div className="loading text-center">
                    <Spin />
                </div>
            ) : (
                <div className="inpatient-exam-content">
                    <div className="inpatient-exam-content__header">
                        <h1>Bệnh án</h1>
                        <p className='mt-2' style={{fontSize: '20px', fontWeight: '500'}}>
                            {examData?.userExaminationData?.lastName} {examData?.userExaminationData?.firstName}
                        </p>
                        <div className='gray-text flex mt-2'>
                            <p className='me-3'>#{examData.id}</p>
                            <p className='me-3'>•</p>
                            <p className='me-2'>CCCD: </p>
                            <p className='me-3'>{examData?.userExaminationData?.cid}</p>
                            <p className='me-3'>•</p>
                            <p className='me-2'>Số điện thoại: </p>
                            <p className='me-3'>{examData?.userExaminationData?.phoneNumber}</p>
                            <p className='me-3'>•</p>
                            <p className='me-2'>Giới tính: </p>
                            <p className='me-3'>{examData?.userExaminationData?.gender == 0 ? 'Nam'
                                                    : examData?.userExaminationData?.gender == 1 ? 'Nữ'
                                                    : ''}</p>
                            <p className='me-3'>•</p>
                            <p className='me-2'>Ngày sinh: </p>
                            <p className='me-3'>{convertDateTime(examData?.userExaminationData?.dob)}</p>
                            <p className='me-3'>•</p>
                            <p className='me-3'>{examData?.userExaminationData?.currentResident}</p>
                        </div>
                        <hr className='mt-4'/>
                    </div>
                    <div className="inpatient-exam-content__body flex mt-4">
                        <div className='col-6'>
                            <p className='title mb-2'>Thông tin nhập viện</p>
                            <div className='flex mt-2'>
                                <div className='col-4 gray-p'>Ngày nhập viện:</div>
                                <div className='col-8' style={{fontWeight: '500'}}>{convertDateTime(examData?.admissionDate)}</div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='col-4 gray-p'>Khoa:</div>
                                <div className='col-8' style={{fontWeight: '500'}}>{examData?.examinationRoomData?.roomDepartmentData?.name}</div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='col-4 gray-p'>Phòng:</div>
                                <div className='col-8' style={{fontWeight: '500'}}>{examData?.examinationRoomData?.name}</div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='col-4 gray-p'>Bảo hiểm y tế:</div>
                                <div className='col-8' style={{fontWeight: '500'}}>{examData?.insuranceCode}</div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='col-4 gray-p'>Đối tượng ưu tiên:</div>
                                <div className='col-8' style={{fontWeight: '500'}}>
                                    <div className='col-3'>
                                        {SpecialText(examData?.special)}
                                    </div>
                                </div>
                            </div>
                            <div className='flex mt-3'>
                                <div>                  
                                    <button className='save-button me-2' onClick={handleOpenSummaryModal}>Báo cáo bệnh án</button>         
                                </div>   
                                {/* <div className="collapsible-box">
                                    <button
                                        className="collapsible-toggle"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        {isOpen ? 
                                            <>
                                                Thu gọn
                                                <i className="ms-2 fa-solid fa-caret-up"></i>
                                            </>
                                        : 
                                            <>
                                                Xem chi tiết tạm ứng
                                                <i className="ms-2 fa-solid fa-caret-down"></i>
                                            </>
                                        }
                                    </button>

                                    <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
                                        {examData?.advanceMoneyExaminationData?.length > 0 ? (
                                            examData.advanceMoneyExaminationData.map((item, index) => (
                                                <div className="flex" key={index}>
                                                    <p className="me-1">Ngày: {convertDateTime(item?.date)} -</p>
                                                    <p>Tạm ứng: {item.amount?.toLocaleString()} đ</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div>0 đ</div>
                                        )}
                                        <MoneyInput onChange={handleAmountChange}/>
                                    </div>
                                </div>                */}
                                <FlexibleCollapsible
                                    isOpen={isOpen}
                                    onToggle={() => setIsOpen(!isOpen)}
                                    expandedText="Thu gọn"
                                    collapsedText="Xem chi tiết tạm ứng"
                                >
                                    {examData?.advanceMoneyExaminationData?.length > 0 ? (
                                        examData.advanceMoneyExaminationData.map((item, index) => (
                                            <div className="flex mb-2" key={index}>
                                                <p className="me-1">Ngày: {convertDateTime(item?.date)} -</p>
                                                <p>Tạm ứng: {item.amount?.toLocaleString()} đ</p>
                                                {item.status=== 1 ?
                                                    <p className="ms-2" style={{color: '#FF8C00'}}>Chờ thanh toán</p> : 
                                                    item.status === 2 ?
                                                        <p className="ms-2" style={{color: '#008000'}}>Đã thanh toán</p> :
                                                        <p className="ms-2" style={{color: '#FF0000'}}>Đã hủy</p>                                                
                                                }
                                            </div>
                                        ))
                                    ) : (
                                        <div>0 đ</div>
                                    )}
                                    {isEditMode && (
                                        <>
                                            <MoneyInput onChange={handleAmountChange}/>
                                            <div className="flex">
                                                <button className="ml-auto save-button mt-2"
                                                    onClick={handleAddAdvanceMoney}>
                                                    {isLoadingAddAdvance ? (
                                                        <>
                                                            <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                            Đang xử lý...
                                                        </>
                                                    ) : 'Thêm tạm ứng'}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </FlexibleCollapsible>      
                            </div>
                        </div>
                        <div className='col-6'>
                            <p className='title mb-2'>Thông tin xuất viện</p>
                            <div className='flex align-items-center mt-2'>
                                <div className='col-4 gray-p'>Tình trạng xuất viện:</div>
                                <div className='col-8' style={{width: '50%'}}>
                                    {isEditMode ? (
                                        <SelectBox2
                                            placeholder="Chọn tình trạng ra viện"
                                            className="select-box2"
                                            options={DISCHARGE_OPTIONS}
                                            value={formData.dischargeStatus}
                                            onChange={handleSelectChange('dischargeStatus')}
                                            disabled={!(isEditMode)}
                                        />
                                    ) : (
                                        <div style={{fontWeight: '500'}}>
                                            {DISCHARGE_OPTIONS.find(option => option.value === formData.dischargeStatus)?.label || ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='flex align-items-center mt-2'>
                                <div className='col-4 gray-p'>Ngày xuất viện:</div>
                                <div className='col-8' style={{width: '50%'}}>
                                    {isEditMode ? (
                                        <CustomDatePicker
                                            className="date-picker"
                                            selectedDate={formData.dischargeDate}
                                            onDateChange={handleDateChange('dischargeDate')}
                                            disabled={!isEditMode}
                                            placeholder="Chọn ngày..." />
                                    ) : (
                                        <div style={{fontWeight: '500'}}>
                                            {formData?.dischargeDate ? convertDateTime(formData?.dischargeDate) : '--/--/20--'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='flex align-items-center mt-2'>
                                <div className='col-4 gray-p'>Kết quả điều trị:</div>
                                <div className='col-8' style={{width: '50%'}}>
                                    {isEditMode ? (
                                        <input type="text" className="input"
                                            value={formData.treatmentResult}
                                            readOnly={!isEditMode} 
                                            onChange={handleInputChange('treatmentResult')}
                                            placeholder="Kết quả điều trị" />
                                    ) : (
                                        <div style={{fontWeight: '500'}}>
                                            {formData?.treatmentResult}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='flex align-items-center mt-2'>
                                {isEditMode ? (
                                    <>
                                        {formData.dischargeStatus === 4 && formData.dischargeDate &&  (
                                            <>
                                                <div className="col-4">
                                                    <p className='gray-p'>Ngày tái khám:</p>
                                                </div>
                                                <div className="col-3">
                                                    <CustomDatePickerWithHighlights
                                                        className="date-picker"
                                                        selectedDate={
                                                            formData.reExaminationDate 
                                                                ? new Date(formData.reExaminationDate) 
                                                                : null
                                                            }
                                                        onDateChange={handleDateChange('reExaminationDate')}
                                                        disabled={!(isEditMode && formData.dischargeStatus === 4 ? true : false)}
                                                        placeholder="Chọn ngày..."
                                                        highlightDates={schedule}
                                                    />
                                                </div>
                                                <div className="col-2 flex justify-content-center">
                                                    <p>Khung giờ:</p>
                                                </div>
                                                <div className="col-3">
                                                    <SelectBox2
                                                        placeholder="Khung giờ"
                                                        className="select-box2"
                                                        options={TIMESLOTS}
                                                        value={formData.time}
                                                        onChange={handleSelectChange('time')}
                                                        disabled={!isEditMode}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {formData.dischargeStatus === 4 && formData.dischargeDate &&  (
                                                <>
                                            <div className='col-4 gray-p'>Thời gian tái khám:</div>
                                            <div className='col-3' style={{fontWeight: '500'}}>
                                                {formData?.reExaminationDate ? convertDateTime(formData?.reExaminationDate) : '--/--/20--'}
                                            </div>
                                            <div className='col-2 gray-p'>Khung giờ:</div>
                                            <div className='col-3' style={{fontWeight: '500'}}>
                                                {TIMESLOTS.find(option => option.value === formData.time)?.label || ''}
                                            </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className='flex mt-3'>
                                {isEditMode && 
                                <>
                                    <div style={{fontWeight: '500'}}>
                                        <button className={`restore-button ${!isEditMode ? 'disabled' : ''}`} 
                                                disabled={!isEditMode}  onClick={handleDischargedExam}>
                                            {isLoadingDischarged ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                    Đang xử lý...
                                                </>
                                            ) : 'Lưu xuất viện'}
                                        </button>               
                                    </div>
                                    { formData.dischargeStatus === 4 && formData.dischargeDate && (
                                        <div className='col-3' style={{fontWeight: '500'}}>
                                            <button className='safe-button' onClick={handleReExam}>
                                                {isLoadingReExam ? (
                                                    <>
                                                        <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                                        Đang xử lý...
                                                    </>
                                                ) : 'Lưu cùng lịch hẹn'}
                                            </button>                        
                                        </div>
                                    )}          
                                </>}  
                            </div>
                        </div>
                    </div>
                    <div className="inpatient-exam-content__body mt-2">
                        <p className='title mb-2'>Thông tin khám bệnh</p>
                        <div className="flex align-items-center">
                            <div className="mt-1" style={{width: '12%'}}>
                                <p>Lý do vào viện:</p>
                            </div>
                            <div className="mt-1" style={{width: '35%'}}>
                                <input type="text" className="input"
                                    readOnly={!isEditMode} 
                                    value={formData.reason}
                                    onChange={handleInputChange('reason')}
                                    placeholder="Mô tả lý do vào viện" />
                            </div>
                            <div className="mt-1" style={{width: '6%'}}/>
                            <div className="mt-1" style={{width: '12%'}}>
                                <p>Triệu chứng:</p>
                            </div>
                            <div className="mt-1" style={{width: '35%'}}>
                                <input type="text" 
                                    className="input"
                                    value={formData.symptom}
                                    readOnly={!isEditMode} 
                                    onChange={handleInputChange('symptom')}
                                    placeholder="Mô tả chi tiết triệu chứng" />
                            </div>
                        </div>
                        <div className="flex align-items-center">
                            <div className="mt-1" style={{width: '12%'}}>
                                <p>Tên bệnh chính:</p>
                            </div>
                            <div className="mt-1" style={{width: '35%'}}>
                                <SelectBox2
                                    placeholder="Nhập tên bệnh"
                                    options={comorbiditiesOptions}
                                    value={formData.diseaseName}
                                    onChange={constHandleDiseaseChange}
                                    disabled={!isEditMode}
                                />
                            </div>
                            <div className="mt-1" style={{width: '6%'}}/>
                            <div className="mt-1" style={{width: '12%'}}>
                                <p>Bệnh đi kèm:</p>
                            </div>
                            <div className="mt-1" style={{width: '35%'}}>
                                <MultiSelect
                                    options={comorbiditiesOptions}
                                    placeholder="Chọn bệnh đi kèm"
                                    onChange={handleComorbiditiesChange}
                                    disabled={!isEditMode}
                                    value={formData.comorbidities}
                                />
                            </div>
                        </div>
                        <div className='flex mt-2'>
                        {isEditMode && 
                            <div style={{fontWeight: '500', marginLeft: 'auto'}}>
                                <button className={`restore-button ${!isEditMode ? 'disabled' : ''}`} 
                                            disabled={!isEditMode} 
                                    onClick={handleUpdateInfoExamination}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                            Đang xử lý...
                                        </>
                                    ) : 'Cập nhật'}
                                </button>                        
                            </div>
                        }
                        </div>
                    </div>
                    <div className="inpatient-exam-content__body mt-1">
                        <div className="radio-inputs row m-0" style={{}}>
                            <div className="col-6 col-lg-2 d-flex justify-content-center p-0">
                                <label className="radio">
                                    <input type="radio" name="radio-inpatient"
                                        value="vitalsign"
                                        defaultChecked={selectedRadio === 'vitalsign'}
                                        onChange={handleRadioChange} />
                                    <span className="name">Sinh hiệu</span>
                                </label>
                            </div>
                            <div className="col-6 col-lg-2 d-flex justify-content-center p-0">
                                <label className="radio">
                                    <input type="radio" name="radio-inpatient"
                                        value="paraclinical"
                                        onChange={handleRadioChange} />
                                    <span className="name">Cận lâm sàng</span>
                                </label>
                            </div>
                            <div className="col-6 col-lg-2 d-flex justify-content-center p-0">
                                <label className="radio">
                                    <input type="radio" name="radio-inpatient"
                                        value="prescription"
                                        onChange={handleRadioChange} />
                                    <span className="name">Đơn thuốc</span>
                                </label>
                            </div>
                            <hr/>
                        </div>
                        {selectedRadio === 'vitalsign' && examData.id && (
                            <div className="radio-content mt-4">
                                <InpatientVitals
                                    vitalsData={examData?.examinationVitalSignData}
                                    examId={+examId}
                                    isEditMode = {isEditMode}
                                />
                            </div>
                        )}
                        {selectedRadio === 'paraclinical' && examData.id && (
                            <div className='radio-content mt-4'>
                                <InpatientParacs
                                    paracsData = {examData?.examinationResultParaclincalData}
                                    examId = {+examId}
                                    isEditMode = {isEditMode}
                                />
                            </div>
                        )}
                        {selectedRadio === 'prescription' && examData.id && (
                            <div className='radio-content mt-3'>
                                <InpatientPres
                                    prescriptionData = {examData?.prescriptionExamData}
                                    examinationId = {+examId}
                                    refresh = {refresh}
                                    isEditMode = {isEditMode}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <SummaryModal
                open={open}
                onCancel={handleCloseSummaryModal}
                examinationData={examData}
            />
        </>
    );
}

export default InpatientDetail;