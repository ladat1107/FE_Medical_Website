import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import "./VitalSign.scss";
import { message, notification } from 'antd';
import { createOrUpdateVitalSign } from "@/services/doctorService";

const VitalSign = ({ vitalSignData, examId, refresh, isEditMode }) => {

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        height: vitalSignData?.height || null,
        weight: vitalSignData?.weight || null,
        fetalWeight: vitalSignData?.fetalWeight || null,
        pulse: vitalSignData?.pulse || null,
        hightBloodPressure: vitalSignData?.hightBloodPressure || null,
        lowBloodPressure: vitalSignData?.lowBloodPressure || null,
        temperature: vitalSignData?.temperature || null,
        breathingRate: vitalSignData?.breathingRate || null,
        glycemicIndex: vitalSignData?.glycemicIndex || null,
    });

    const [initialVitalSign, setInitialVitalSign] = useState(formData);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const isDataChanged = JSON.stringify(formData) !== JSON.stringify(initialVitalSign);
        setIsChanged(isDataChanged);
    }, [formData, initialVitalSign]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        
        // Chỉ cho phép nhập số hoặc số thập phân (với dấu chấm)
        if (value === '' || /^[0-9]*[.]?[0-9]*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // Hàm xử lý khi nhấn phím để ngăn các ký tự không phải số
    const handleKeyPress = (event) => {
        const keyCode = event.which || event.keyCode;
        const keyValue = String.fromCharCode(keyCode);
        
        // Chỉ cho phép nhập số hoặc dấu chấm
        if (!/^[0-9.]$/.test(keyValue) && keyCode !== 8 && keyCode !== 46) {
            event.preventDefault();
        }
        
        // Chỉ cho phép một dấu chấm
        if (keyValue === '.' && event.target.value.includes('.')) {
            event.preventDefault();
        }
    };

    //notification
    const [api, contextHolder] = notification.useNotification();

    //save button
    const handleSaveButton = async () => {
        if (!formData.height || !formData.weight || !formData.pulse || !formData.hightBloodPressure ||
            !formData.lowBloodPressure || !formData.temperature || !formData.breathingRate) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const data = {
            examinationId: examId,
            height: formData.height,
            weight: formData.weight,
            fetalWeight: formData.fetalWeight || null,
            pulse: formData.pulse,
            hightBloodPressure: formData.hightBloodPressure,
            lowBloodPressure: formData.lowBloodPressure,
            temperature: formData.temperature,
            breathingRate: formData.breathingRate,
            glycemicIndex: formData.glycemicIndex || null,
        }

        setIsLoading(true);

        try {
            const response = await createOrUpdateVitalSign(data);
            if (response && response.DT) {
                message.success('Lưu sinh hiệu thành công!');
                setInitialVitalSign(data);
                refresh();
            } else {
                message.error('Có lỗi trong quá trình lưu sinh hiệu.');
            }
        } catch (error) {
            console.error("Error creating examination:", error.response || error.message);
            message.error('Lưu sinh hiệu thất bại.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleRestoreButton = () => {
        setFormData(initialVitalSign);
    };

    return (
        <>
            {contextHolder}
            <div className="vital-container">
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Chiều cao:</p>
                    </div>
                    <div className={`col-7 mt-3 col-lg-3`}>
                        <input type="text"
                            value={formData.height}
                            onChange={handleInputChange('height')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: cm" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.height && (<p>Cm</p>)}
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Cân nặng:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.weight}
                            onChange={handleInputChange('weight')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: kg" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.weight && (<p>Kg</p>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Cân nặng con:</p>
                    </div>
                    <div className={`col-8 mt-3 col-lg-3`}>
                        <input type="text"
                            value={formData.fetalWeight}
                            onChange={handleInputChange('fetalWeight')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: g" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.fetalWeight && (<p>G</p>)}
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Mạch:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.pulse}
                            onChange={handleInputChange('pulse')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: Lần/phút" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.pulse && (<p>Lần/phút</p>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Huyết áp trên:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.hightBloodPressure}
                            onChange={handleInputChange('hightBloodPressure')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: mmHg" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.hightBloodPressure && (<p>mmHg</p>)}
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Huyết áp dưới:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.lowBloodPressure}
                            onChange={handleInputChange('lowBloodPressure')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: mmHg" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.lowBloodPressure && (<p>mmHg</p>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Nhiệt độ:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.temperature}
                            onChange={handleInputChange('temperature')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: °C" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.temperature && (<p>°C</p>)}
                    </div>
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Nhịp thở:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.breathingRate}
                            onChange={handleInputChange('breathingRate')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: Lần/phút" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.breathingRate && (<p>Lần/phút</p>)}
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mt-3 col-lg-2">
                        <p>Chỉ số đường huyết:</p>
                    </div>
                    <div className="col-8 mt-3 col-lg-3">
                        <input type="text"
                            value={formData.glycemicIndex}
                            onChange={handleInputChange('glycemicIndex')}
                            onKeyPress={handleKeyPress}
                            readOnly={!isEditMode}
                            className="input"
                            placeholder="Đơn vị: mg/dl" />
                    </div>
                    <div className="col-1 mt-3 col-lg-1" style={{ color: 'gray'}}>
                        {formData.glycemicIndex && (<p>mg/dl</p>)}
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-4 col-lg-9"></div>
                    <div className="col-8 col-lg-3 text-end">
                        <button
                            className={`restore-button ${!isChanged ? 'disabled' : ''}`}
                            onClick={handleRestoreButton}
                            disabled={!isChanged}>
                            Hoàn tác
                        </button>
                        <button
                            className={`save-button ${!isChanged ? 'disabled' : ''}`}
                            onClick={handleSaveButton}
                            disabled={!isChanged}>
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
        </>
    )
}
VitalSign.propTypes = {
    examId: PropTypes.number.isRequired,
    vitalSignData: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
};

export default VitalSign;