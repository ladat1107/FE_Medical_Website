import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./ExamInfo.scss"
import CustomDatePicker from "@/components/DatePicker";
import { updateExamination } from "@/services/doctorService";
import MultiSelect from "@/layout/Doctor/components/MultiSelect";
import { convertDateTime } from "@/utils/convertToTimestamp";
import { message } from 'antd';
import SelectBox2 from "@/layout/Doctor/components/Selectbox";
import CustomDatePickerWithHighlights from "@/components/DatePicker/CustomDatePickerWithHighlights";
import { useSelector } from "react-redux";
import { TIMESLOTS } from "@/constant/value";
import RoomSelectionModal from "@/layout/Doctor/components/RoomOptionModal/RoomSelectionModal";

const ExamInfo = ({ examData, refresh, comorbiditiesOptions, isEditMode }) => {

    const { schedule } = useSelector(state => state.schedule);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSafe, setIsLoadingSafe] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(examData.selectedRoom || null);    

    const formatSafeDate = (dateString) => {
        if (!dateString) return new Date();
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    };

    const [formData, setFormData] = useState({
        medicalTreatmentTier: examData.medicalTreatmentTier?.toString() || '2',
        staffName: examData.staffName || '',
        reason: examData.reason || '',
        symptom: examData.symptom || '',
        diseaseName: examData.diseaseName || null,
        comorbidities: examData.comorbidities ? examData.comorbidities.split(',') : [],
        treatmentResult: examData.treatmentResult || '',
        admissionDate: formatSafeDate(examData.admissionDate) || null,
        dischargeDate: examData.dischargeDate || null,
        price: examData.price || 0,
        special: examData.special || '0',
        reExaminationDate: examData.reExaminationDate ? examData.reExaminationDate : null,
        dischargeStatus: examData.dischargeStatus || null,
        time: examData.reExaminationTime || null,
    });

    const [initialFormData, setInitialFormData] = useState(formData);
    const [isChanged, setIsChanged] = useState(false);

    const options = [
        { value: '1', label: 'Khám bệnh' },
        { value: '2', label: 'Điều trị ngoại trú' }
    ];
    
    const dischargeOptions = [
        { value: 1, label: 'Ra viện' },
        { value: 2, label: 'Trốn viện' },
        { value: 3, label: 'Xin ra viện' },
        { value: 4, label: 'Hẹn tái khám' },
    ];

    const specialOptions = [
        { value: 'normal', label: 'Không' },
        { value: 'children', label: 'Trẻ em' },
        { value: 'old', label: 'Người già' },
        { value: 'pregnant', label: 'Phụ nữ mang thai' },
        { value: 'disabled', label: 'Người khuyết tật' }
    ];

    // Check for changes
    useEffect(() => {
        const isDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
        setIsChanged(isDataChanged);
    }, [formData, initialFormData]);

    // Handlers for form updates
    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleDateChange = (field) => (date) => {
        setFormData(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleComorbiditiesChange = (value) => {
        setFormData(prev => ({
            ...prev,
            comorbidities: value
        }));
    };

    const handleSelectChange = (field) => (value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'dischargeStatus' && value !== 4) {
            setFormData(prev => ({
                ...prev,
                reExaminationDate: null
            }));
        }

        if (field === 'medicalTreatmentTier' && value !== '1') {
            setSelectedRoom(null);
            setFormData(prev => ({
                ...prev,
                dischargeDate: new Date(),
            }));
        }

        if (field === 'dischargeDate' && value === null) {
            setFormData(prev => ({
                ...prev,
                dischargeStatus: null,
                reExaminationDate: null,
            }));
        }
    };

    const constHandleDiseaseChange = (value) => {

        const selectedOption = comorbiditiesOptions.find(option => option.value === value);
        const label = selectedOption ? selectedOption.label : null;

        setFormData(prev => ({
            ...prev,
            diseaseName: label
        }));
    }

    const handleSaveButton = async () => {

        if (!formData.reason || !formData.symptom || !formData.medicalTreatmentTier) {
            message.error('Vui lòng điền đầy đủ tất cả các trường!');
            return;
        }

        if(formData.dischargeStatus === 4 && !formData.reExaminationDate) {
            message.error('Vui lòng chọn ngày tái khám!');
            return;
        }

        if(formData.dischargeStatus === 4 && formData.reExaminationDate && formData.reExaminationDate <= new Date()) {
            message.error('Ngày tái khám phải sau ngày hôm nay!');
            return;
        }

        const data = {
            id: examData.id,
            userId: examData.userId,
            staffId: examData.staffId,
            symptom: formData.symptom,
            diseaseName: formData.diseaseName,
            treatmentResult: formData.treatmentResult,
            comorbidities: formData.comorbidities.join(','),
            admissionDate: convertDateTime(formData.admissionDate),
            dischargeDate: formData.dischargeDate,
            reason: formData.reason,
            medicalTreatmentTier: formData.medicalTreatmentTier,
            price: formData.price,
            special: formData.special,
            paymentDoctorStatus: 1,
            insuranceCoverage: 1,
            status: 6,
            dischargeStatus: formData.dischargeStatus,
            reExaminationDate: formData.reExaminationDate ? convertDateTime(formData.reExaminationDate) : null,
            roomId: selectedRoom ? selectedRoom.id : null,
            roomName: selectedRoom ? selectedRoom.name : null,
        };

        setIsLoading(true);

        try {
            const response = await updateExamination(data);
            if (response && response.DT.includes(1)) {
                message.success('Lưu thông tin khám bệnh thành công!');
                setInitialFormData(formData);
                refresh();
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error("Error creating examination:", error.response || error.message);
            message.error('Lưu thông tin khám bệnh thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSafeButton = async () => {
        if (!formData.reason || !formData.symptom || !formData.medicalTreatmentTier) {
            message.error('Vui lòng điền đầy đủ tất cả các trường!');
            return;
        }

        if(formData.dischargeStatus === 4 && !formData.reExaminationDate) {
            message.error('Vui lòng chọn ngày tái khám!');
            return;
        }

        if(formData.dischargeStatus === 4 && formData.reExaminationDate && formData.reExaminationDate < new Date()) {
            message.error('Ngày tái khám phải sau ngày hôm nay!');
            return;
        }

        if(formData.dischargeStatus === 4 && !formData.time) {
            message.error('Vui lòng chọn khung giờ!');
            return;
        }

        const data = {
            id: examData.id,
            userId: examData.userId,
            staffId: examData.staffId,
            symptom: formData.symptom,
            diseaseName: formData.diseaseName,
            treatmentResult: formData.treatmentResult,
            comorbidities: formData.comorbidities.join(','),
            admissionDate: convertDateTime(formData.admissionDate),
            dischargeDate: formData.dischargeDate,
            reason: formData.reason,
            medicalTreatmentTier: formData.medicalTreatmentTier,
            price: formData.price,
            special: formData.special,
            paymentDoctorStatus: 1,
            insuranceCoverage: 1,
            status: 6,

            dischargeStatus: formData.dischargeStatus,
            reExaminationDate: formData.reExaminationDate ? formData.reExaminationDate : null,
            time: formData.time,
            createReExamination: true,
        };

        setIsLoadingSafe(true);

        try {
            const response = await updateExamination(data);
            if (response && response.DT.includes(1)) {
                message.success('Lưu thông tin khám bệnh thành công!');
                setInitialFormData(formData);
                refresh();
            } else {
                message.error(response.EM);
            }
        } catch (error) {
            console.error("Error creating examination:", error.response || error.message);
            message.error('Lưu thông tin khám bệnh thất bại.');
        } finally {
            setIsLoadingSafe(false);
        }
    };

    const handleRestoreButton = () => {
        setFormData(initialFormData);
    };

    const showModal = () => {
        if (!formData.reason || !formData.symptom || !formData.medicalTreatmentTier) {
            message.error('Vui lòng điền đầy đủ tất cả các trường!');
            return;
        }

        if(formData.dischargeStatus === 4 && !formData.reExaminationDate) {
            message.error('Vui lòng chọn ngày tái khám!');
            return;
        }

        if(formData.dischargeStatus === 4 && formData.reExaminationDate && formData.reExaminationDate <= new Date()) {
            message.error('Ngày tái khám phải sau ngày hôm nay!');
            return;
        }
        setIsModalVisible(true);
    };
    
    const handleModalClose = () => {
        setIsModalVisible(false);
    };
    
    const handleRoomSelect = (room) => {
        // Lưu giá trị room vào biến
        const selectedRoomData = room;
        
        // Cập nhật state
        setSelectedRoom(selectedRoomData);
        setIsModalVisible(false);
        
        // Gọi handleSaveButton với dữ liệu room đã chọn
        // thay vì dựa vào state selectedRoom mới được cập nhật
        const data = {
            id: examData.id,
            userId: examData.userId,
            staffId: examData.staffId,
            symptom: formData.symptom,
            diseaseName: formData.diseaseName,
            treatmentResult: formData.treatmentResult,
            comorbidities: formData.comorbidities.join(','),
            admissionDate: convertDateTime(formData.admissionDate),
            dischargeDate: formData.dischargeDate,
            reason: formData.reason,
            medicalTreatmentTier: formData.medicalTreatmentTier,
            price: formData.price,
            special: formData.special,
            paymentDoctorStatus: 1,
            insuranceCoverage: 1,
            status: 6,
            dischargeStatus: formData.dischargeStatus,
            reExaminationDate: formData.reExaminationDate ? convertDateTime(formData.reExaminationDate) : null,
            roomId: selectedRoomData ? selectedRoomData.id : null,
            roomName: selectedRoomData ? selectedRoomData.name : null,
        };
        
        // Gọi API trực tiếp tại đây thay vì qua handleSaveButton
        setIsLoading(true);
        
        updateExamination(data)
            .then(response => {
                if (response && response.DT.includes(1)) {
                    message.success('Lưu thông tin khám bệnh thành công!');
                    setInitialFormData(formData);
                    refresh();
                } else {
                    message.error(response.EM);
                }
            })
            .catch(error => {
                console.error("Error creating examination:", error.response || error.message);
                message.error('Lưu thông tin khám bệnh thất bại.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <div className="exam-container">
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Lý do vào viện:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <input type="text" className="input"
                            readOnly={!isEditMode} 
                            value={formData.reason}
                            onChange={handleInputChange('reason')}
                            placeholder="Mô tả lý do vào viện" />
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Triệu chứng:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <input type="text" className="input"
                            value={formData.symptom}
                            readOnly={!isEditMode} 
                            onChange={handleInputChange('symptom')}
                            placeholder="Mô tả chi tiết triệu chứng" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Tên bệnh chính:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <SelectBox2
                            placeholder="Nhập tên bệnh"
                            className="select-box2"
                            options={comorbiditiesOptions}
                            value={formData.diseaseName}
                            onChange={constHandleDiseaseChange}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Bệnh đi kèm:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <MultiSelect
                            options={comorbiditiesOptions}
                            placeholder="Chọn bệnh đi kèm"
                            onChange={handleComorbiditiesChange}
                            disabled={!isEditMode}
                            value={formData.comorbidities}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Loại KCB:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <SelectBox2
                            placeholder="Chọn loại KCB"
                            //className="select-box2"
                            options={options}
                            value={formData.medicalTreatmentTier}
                            onChange={handleSelectChange('medicalTreatmentTier')}
                            disabled={!isEditMode}
                        />
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Kết quả điều trị:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <input type="text" className="input"
                            value={formData.treatmentResult}
                            readOnly={!isEditMode} 
                            onChange={handleInputChange('treatmentResult')}
                            placeholder="Kết quả điều trị" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Ngày nhập viện:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <CustomDatePicker
                            className="date-picker"
                            selectedDate={formData.admissionDate}
                            onDateChange={handleDateChange('admissionDate')}
                            disabled={!isEditMode}  
                            isClearable={false}
                            placeholder="Chọn ngày..." />
                    </div>
                    <div className="col-4 mt-3 col-lg-2">   
                        <p>Ngày xuất viện:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <CustomDatePicker
                            className="date-picker"
                            selectedDate={formData.dischargeDate}
                            onDateChange={handleDateChange('dischargeDate')}
                            disabled={!isEditMode}
                            placeholder="Chọn ngày..." />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Giá:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <p className="info">{formData.price.toLocaleString()} VND</p>
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Ưu tiên:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-4">
                        <SelectBox2
                            placeholder="Chọn loại ưu tiên"
                            className="select-box2"
                            options={specialOptions}
                            value={formData.special}
                            onChange={handleSelectChange('special')}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="row">
                    {formData.dischargeDate && (
                        <>
                            <div className="col-4 mt-3 col-lg-2">
                                <p>Tình trạng ra viện:</p>
                            </div>
                            <div className="col-8 mt-3 col-lg-4">
                                <SelectBox2
                                    placeholder="Chọn tình trạng ra viện"
                                    className="select-box2"
                                    options={dischargeOptions}
                                    value={formData.dischargeStatus}
                                    onChange={handleSelectChange('dischargeStatus')}
                                    disabled={!(isEditMode && formData.treatmentResult)}
                                />
                            </div>
                        </>
                    )}
                    {formData.dischargeStatus === 4 && formData.dischargeDate && (
                        <>
                            <div className="col-4 mt-3 col-lg-2">
                                <p>Ngày tái khám:</p>
                            </div>
                            <div className="col-8 mt-3 col-lg-4">
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
                            <div className="col-4 mt-3 col-lg-6"/>
                            <div className="col-4 mt-3 col-lg-2">
                                <p>Khung giờ:</p>
                            </div>
                            <div className="col-8 mt-3 col-lg-4">
                                <SelectBox2
                                    placeholder="Chọn khung giờ"
                                    className="select-box2"
                                    options={TIMESLOTS}
                                    value={formData.time}
                                    onChange={handleSelectChange('time')}
                                    disabled={!isEditMode}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="row">
                    {selectedRoom && (
                        <div className="selected-room">
                            <h3 style={{fontSize: '16px'}}><strong>Phòng đã chọn</strong></h3>
                            <p className="mt-1"><strong>Tên phòng:</strong> {selectedRoom.name} - <strong>Khoa:</strong> {selectedRoom.roomDepartmentData?.name}</p>
                            <p></p>
                            <p><strong>Giá:</strong> {selectedRoom.serviceData[0]?.price.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                    )}
                </div>

                <div className="row mt-4">
                    <div className="col-8 col-lg-12 text-end">
                        <button
                            className={`restore-button ${!isChanged ? 'disabled' : ''}`}
                            onClick={handleRestoreButton}
                            disabled={!isChanged}>
                            Hoàn tác
                        </button>
                        <button
                            className={`save-button ${!isChanged ? 'disabled' : ''}`}
                            onClick={
                                formData.medicalTreatmentTier === '1' ? showModal : handleSaveButton
                            }
                            disabled={!isChanged}>
                            {isLoading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                    Đang xử lý...
                                </>
                            ) : 'Cập nhật'}
                        </button>
                        {formData.dischargeStatus === 4 && formData.dischargeDate && (
                            <button
                                className={`safe-button ${!isChanged ? 'disabled' : ''}`}
                                onClick={handleSafeButton}
                                disabled={!isChanged}>
                                {isLoadingSafe ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                        Đang xử lý...
                                    </>
                                ) : 'Lưu cùng lịch hẹn'}
                            </button> 
                        )}
                    </div>
                </div>
            </div>
            {isModalVisible && (
                <RoomSelectionModal
                    isVisible={isModalVisible}
                    onClose={handleModalClose}
                    onRoomSelect={handleRoomSelect}
                    selected={selectedRoom}
                />
            )}
        </>
    );
};

ExamInfo.propTypes = {
    examData: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    comorbiditiesOptions: PropTypes.array.isRequired,
    isEditMode: PropTypes.bool.isRequired
};

export default ExamInfo;