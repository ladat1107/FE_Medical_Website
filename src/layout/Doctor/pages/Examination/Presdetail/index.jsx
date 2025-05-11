import React, { useEffect, useState } from 'react';
import './Presdetail.scss';
import PropTypes from 'prop-types';
import MultiSelect from '@/layout/Doctor/components/MultiSelect';
import FreeTextInputWithSuggestions from '@/layout/Doctor/components/Selectbox/CustomSelectbox';

const Presdetail = ({ id, presdetailData, onDelete, isEditMode, onChange }) => {
    const [medicineId, setMedicineId] = useState(presdetailData.medicineId || 0);
    const [selectedPrice, setSelectedPrice] = useState(presdetailData.price || 0);
    const [medicineName, setMedicineName] = useState(presdetailData.name || '');
    const [medicineUnit, setMedicineUnit] = useState(presdetailData.unit || '');
    const [quantity, setQuantity] = useState(presdetailData.quantity || 0);
    const [dosage, setDosage] = useState(presdetailData.dosage || '');
    const [session, setSession] = useState(presdetailData.session || []);
    const [dose, setDose] = useState(presdetailData.dose || null);

    const SessionOptions = [{ value: '1', label: 'Sáng' }, { value: '2', label: 'Trưa' }, { value: '3', label: 'Chiều' }, { value: '4', label: 'Tối' }];

    const DoseOptions = [
        `1 lần 1 ${medicineUnit}`, 
        `1 lần 2 ${medicineUnit}`,
        `1 lần 3 ${medicineUnit}`,
        `1 lần 4 ${medicineUnit}`,
        `1 lần 5 ${medicineUnit}`,
        `1 lần 6 ${medicineUnit}`,
        `1 lần 7 ${medicineUnit}`,
        `1 lần 8 ${medicineUnit}`,
        `1 lần 9 ${medicineUnit}`
    ];
    
    const handleSessionChange = (value) => {
        setSession(value);
    }
    
    const handleDoseChange = (value) => {
        setDose(value);
    }

    useEffect(() => {
        updateDosage();
    }, [session, dose]);

    const updateDosage = () => {
        const selectedLabels = SessionOptions
            .filter(option => session.includes(option.value))
            .map(option => option.label)
            .join(', ');

        setDosage(`${selectedLabels} - ${dose}`);
    }

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    useEffect(() => {
        onChange(id, medicineId, quantity, medicineUnit, selectedPrice, dosage, session, dose);
    }, [id, medicineId, quantity, medicineUnit, selectedPrice, dosage, onChange]);

  const handleDosageChange = (value) => {
    setDosage(value);
  };

    return (
        <div className="presdetail-container">
        {/* Header row */}
        <div className="medicine-row">
            <div className="medicine-name">
                <p className="title">Tên thuốc</p>
            </div>
            <div className="medicine-info">
                <p className="title">Số lượng</p>
                <p className="title"></p>
                <p className="title">Đơn giá</p>
            </div>
            <div className="medicine-timing">
                <p className="title">Buổi dùng</p>
            </div>
            <div className="medicine-dosage">
                <p className="title">Liều dùng</p>
            </div>
        </div>
  
    {/* Content row */}
    <div className="medicine-row">
        <div className="medicine-name">
            <p className="suptext">{medicineName}</p>   
        </div>
        <div className="medicine-info">
            <div>
                <input
                    type="text"
                    className="input"
                    placeholder="SL"
                    readOnly={!isEditMode}
                    value={quantity}
                    onChange={(e) => {
                        // Kiểm tra nếu giá trị nhập vào chỉ chứa số
                        const value = e.target.value;
                        // Chấp nhận chuỗi rỗng hoặc chỉ chứa số
                        if (value === '' || /^[0-9]+$/.test(value)) {
                            handleQuantityChange(value);
                        }
                    }}
                    onKeyPress={(e) => {
                        // Ngăn người dùng nhập ký tự không phải số
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
            </div>
            <div>
                <p className="suptext">{medicineUnit}</p>
            </div>
            <div>
                <p className="suptext">{selectedPrice.toLocaleString()}</p>
            </div>
        </div>
        <div className="medicine-timing">
            <MultiSelect
                options={SessionOptions}
                value={session} 
                placeholder="Chọn buổi dùng"
                onChange={handleSessionChange}
                disabled={!isEditMode}
            />
        </div>
        <div className="medicine-dosage">    
            <FreeTextInputWithSuggestions
                options={DoseOptions}
                value={dose}
                onChange={handleDoseChange}
                placeholder="Nhập liều dùng..."
                disabled={!isEditMode}
                maxSuggestions={5}
            />
        </div>
        {isEditMode && (
            <i className="fa-solid fa-trash delete-btn" onClick={onDelete}></i>
        )}
        </div>
    </div>
    );
};

Presdetail.propTypes = {
    id: PropTypes.number.isRequired,
    presdetailData: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Presdetail;