import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Select, message } from 'antd';
import 'moment/locale/vi';
import { createPrescription, getAllMedicinesForExam } from '@/services/doctorService';
import { useMutation } from '@/hooks/useMutation';
import EnhancedSelectBox from '@/components/EnhancedSelectBox/EnhancedSelectBox';
import Presdetail from '../../Examination/Presdetail';
import './PrescriptionChangeModal.scss';
import moment from 'moment';
import SelectBox2 from '@/layout/Doctor/components/Selectbox';

const PrescriptionChangeModal = ({ visible, onCancel, onSave, prescriptionData, examinationId }) => {

    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

    const [medicineOptions, setMedicineOptions] = useState([]);
    const [medicineId, setMedicineId] = useState(0);
    const [presDetails, setPresDetails] = useState([]);
    const [nextId, setNextId] = useState(1);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [prescriptionPrice, setPrescriptionPrice] = useState(0);
    const [prescriptionType, setPrescriptionType] = useState(1);

    // Function to copy prescription details from prescriptionData
    const handleCopyPrescription = () => {
        if (!prescriptionData || !prescriptionData.length) {
            message.warning('Không có đơn thuốc để sao chép');
            return;
        }

        const prescription = prescriptionData[0];
        setNote(prescription.note || '');
        
        // Create a new array of prescription details
        const copiedDetails = prescription.prescriptionDetails.map((medicine, index) => {
            // Parse the session string into an array
            const sessionArray = medicine.PrescriptionDetail.session 
                ? medicine.PrescriptionDetail.session.split(',').map(String) 
                : [];
            
            return {
                id: nextId + index,
                medicineId: medicine.id,
                name: medicine.name,
                quantity: medicine.PrescriptionDetail.quantity,
                unit: medicine.PrescriptionDetail.unit,
                price: medicine.PrescriptionDetail.price,
                dosage: medicine.PrescriptionDetail.dosage,
                session: sessionArray,
                dose: medicine.PrescriptionDetail.dose
            };
        });
        
        // Update the next ID for future additions
        setNextId(nextId + copiedDetails.length);
        
        // Set the prescription details
        setPresDetails(copiedDetails);
        
        // Calculate and set the total price
        setPrescriptionPrice(prescription.totalMoney);
        
        message.success('Đã sao chép đơn thuốc thành công');
    };

    const handleMedicineChange = (value) => {
        setMedicineId(value);
    };

    useEffect(() => {
        if (medicineId) {
            handleAddPresdetail();
        }
    }, [medicineId]);

    const selectedMedicine = useMemo(() => {
        return medicineOptions.find(option => option.value === medicineId);
    }, [medicineId, medicineOptions]);

    const handleAddPresdetail = useCallback(() => {
        if (!selectedMedicine) return;

        const isDuplicate = presDetails.some(item => item.medicineId === selectedMedicine.value);
        if (isDuplicate) return;
    
        setPresDetails(prevDetails => [
            ...prevDetails,
            {
                id: nextId,
                medicineId: medicineId,
                name: selectedMedicine.label || '',
                quantity: 1,
                unit: selectedMedicine.unit || '',
                price: selectedMedicine.price || 0,
                dosage: '',
                session: [],
                dose: null
            }
        ]);
        setNextId(prevId => prevId + 1);
    }, [nextId, selectedMedicine]);
    
    //#region get medicine
    let {
        data: dataMedicines,
        loading: comorbiditiesLoading,
        error: comorbiditiesError,
        execute: fetchMedicines,
    } = useMutation(() => getAllMedicinesForExam());

    useEffect(() => {
        fetchMedicines();
    }, []);

    useEffect(() => {
        if (dataMedicines && dataMedicines.DT) {
            const medicineOptions = dataMedicines.DT.map(item => ({
                value: item.id,
                label: item.name,
                price: item.price,
                unit: item.unit,
                batchNumber: item.batchNumber,
                inventory: item.inventory,
                exp: item.exp,
            }));
            setMedicineOptions(medicineOptions);
        }
    }, [dataMedicines]);

    //#endregion

    const handleDeletePresdetail = useCallback((id) => {
        setPresDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
    }, []);

    const handlePresdetailChange = useCallback((id, medicineId, quantity, unit, price, dosage, session, dose) => {
        setPresDetails(prevDetails =>
            prevDetails.map(detail =>
                detail.id === id ? { ...detail, medicineId, quantity, unit, price, dosage, session, dose } : detail
            )
        );
    }, []);

    const sortedPresDetails = useMemo(() => {
        return [...presDetails].sort((a, b) => b.id - a.id);
    }, [presDetails]);

    // Calculate the total price whenever presDetails changes
    useEffect(() => {
        const total = presDetails.reduce((sum, detail) => {
            return sum + (detail.price * detail.quantity);
        }, 0);
        setPrescriptionPrice(total);
    }, [presDetails]);

    const handleSaveButton = async () => {

        if(presDetails.length === 0) {
            message.warning('Đơn thuốc trống, không thể lưu!');
            return;
        }

        for (const detail of presDetails) {
            if (!detail.medicineId || !detail.quantity || !detail.unit || !detail.price || !detail.session || !detail.dose) {
                message.warning('Vui lòng điền đầy đủ thông tin thuốc!');
                return;
            }
        }

        // Kiểm tra trùng medicineId
        const medicineIds = presDetails.map(detail => detail.medicineId);
        const uniqueMedicineIds = new Set(medicineIds);
        if (uniqueMedicineIds.size !== medicineIds.length) {
            message.warning('Không được phép có hai thuốc trùng nhau!');
            return;
        }

        const data = {
            examinationId: +examinationId,
            note: note,
            totalMoney: prescriptionPrice,
            prescriptionDetails: presDetails.map(detail => ({
                medicineId: detail.medicineId,
                quantity: detail.quantity,
                unit: detail.unit,
                price: detail.price,
                dosage: detail.dosage,
                session: detail.session.join(','),
                dose: detail.dose
            })),
            oldPresId: prescriptionData[0]?.id || null,
            prescriptionType: prescriptionType,
        };

        setLoading(true);
        try {
            const response = await createPrescription(data);
           
            if (response && response.EC === 0) {
                message.success('Lưu đơn thuốc thành công!');
                if (onSave) {
                    onSave();
                }
            } else {
                message.error(response.EM || 'Lưu đơn thuốc thất bại!');
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn thuốc:", error.response || error.message);
            message.error('Lưu đơn thuốc thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const clearModal = () => {
        setMedicineId(0);
        setPresDetails([]);
        setNextId(1);
        setNote('');
        setPrescriptionPrice(0);
        setPrescriptionType(1);
    };

    return (
        <Modal
            title="Thay đổi đơn thuốc"
            open={visible}
            onCancel={onCancel}
            width="80%"
            style={{ top: '5%' }}
            destroyOnClose
            onOk={handleSaveButton}
            okText="Lưu"
            cancelText="Hủy"
            confirmLoading={loading}
        >
            <div style={{ maxHeight: '75vh', minHeight: '75vh' , overflowY: 'auto' }}>
                <div className="prescription-change-modal">
                    <div className="info-section mb-2">
                        <p>Đơn thuốc cũ sẽ được chốt với ngày kết thúc là {moment(yesterday).format('DD/MM/YYYY')}</p>
                        <p>Đơn thuốc mới sẽ có ngày bắt đầu là {moment(today).format('DD/MM/YYYY')}</p>
                    </div>
                    <div className='row padding mb-2'>
                        <div className='col-5'>
                            <EnhancedSelectBox
                                className="select-box2"
                                options={medicineOptions}
                                value={medicineId !== 0 ? medicineId : undefined}
                                placeholder="Nhập tên thuốc"
                                disabled={false}
                                onChange={handleMedicineChange}
                            />
                        </div>
                        <div className='col-2 ps-0'>
                            <SelectBox2
                                placeholder="Chọn loại đơn thuốc"
                                options={[
                                    { value: 1, label: 'Cấp toa điều trị' },
                                    { value: 2, label: 'Cấp toa xuất viện' },
                                ]}
                                allowClear={false}
                                value={prescriptionType}
                                onChange={
                                    (value) => setPrescriptionType(value)
                                }
                            />
                        </div>
                        <div className='col-5 p-0'>
                            <button 
                                className='save-button me-2'
                                onClick={handleCopyPrescription}
                                disabled={!prescriptionData || !prescriptionData.length}
                            >
                                <i className="fa-solid fa-copy me-2"></i>
                                Lấy đơn thuốc gần nhất
                            </button>
                            <button 
                                className='restore-button'
                                onClick={clearModal}
                            >
                                Làm mới
                            </button>
                        </div>
                    </div>
                    {prescriptionType === 1 && (
                        <p style={{fontStyle: 'italic', color: 'black'}}>*Lưu ý: Chỉ kê đơn thuốc đủ dùng trong ngày</p>
                    )}
                    <>
                        <div className="row p-2 padding gap">
                            {sortedPresDetails.length > 0 ? (
                                sortedPresDetails.map(detail => (
                                    <Presdetail
                                        key={detail.id}
                                        id={detail.id}
                                        options={medicineOptions}
                                        presdetailData={detail}
                                        onDelete={() => handleDeletePresdetail(detail.id)}
                                        onChange={handlePresdetailChange}
                                        isEditMode={true}
                                    />
                                ))
                            ) : (
                                <div className="empty-list-message">
                                    <p>Đơn thuốc trống</p>
                                </div>
                            )}
                        </div>
                    </>
                </div>
            </div>
        </Modal>
    );
};

export default PrescriptionChangeModal;