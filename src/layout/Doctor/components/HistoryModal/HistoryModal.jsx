import PropTypes from 'prop-types';
import './HistoryModal.scss';
import HistoryItem from '../HistoryItem/HistoryItem';
import { useEffect, useState } from 'react';
import { message, Spin } from 'antd';
import { useMutation } from '@/hooks/useMutation';
import { getMedicalHistories } from '@/services/doctorService';
import { convertDateTime } from '@/utils/formatDate';
import { convertGender } from '@/utils/convertGender';

const HistoryModal = ({ isModalOpen, handleCancel, userId = '', onCopyPrescription }) => {

    const [historyData, setHistoryData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExaminationData();
    }, [userId]);

    let {
        data: dataHistory,
        loading: loadingHistory,
        error: errorHistory,
        execute: fetchExaminationData,
    } = useMutation((query) => {
        return getMedicalHistories(+userId);
    });

    useEffect(() => {
        if (dataHistory && dataHistory.DT) {
            setHistoryData(dataHistory.DT[0]);
            setIsLoading(false);
        }
    }, [dataHistory, loadingHistory, errorHistory]);

    const handleCopyPrescription = (prescriptionData) => {
        if (onCopyPrescription) {
            onCopyPrescription(prescriptionData);
            message.success('Đơn thuốc đã được sao chép thành công!');
            handleCancel(); // Close the modal after copying
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className='history-container'>
            <div className="history-content">
                <div className='row'>
                    <div className='col-6'>
                        <p className='history-header'>Lịch sử khám chữa bệnh</p>
                    </div>
                    <div className='col-6'>
                        <div className='history-footer'>
                            <button className='history-btn' onClick={handleCancel}>Đóng</button>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <div className="loading text-center">
                        <Spin />
                    </div>
                ) : (
                    <>
                        <div className="patient-history row">
                            <p style={{ fontWeight: '600', fontSize: '17px' }}>Thông tin bệnh nhân</p>
                            <div className="col-12 row mt-1">
                                <div className="col-2">
                                    Họ và tên:
                                </div>
                                <div className="col-2">
                                    {historyData?.lastName + ' ' + historyData?.firstName}
                                </div>
                                <div className="col-2">
                                    Ngày sinh:
                                </div>
                                <div className="col-2">
                                    {convertDateTime(historyData?.dob)}
                                </div>
                                <div className="col-1" />
                                <div className="col-1">
                                    Giới tính:
                                </div>
                                <div className="col-2">
                                    {convertGender(historyData?.gender)}
                                </div>
                            </div>
                            <div className="col-12 row mt-2">
                                <div className="col-2">
                                    Số điện thoại:
                                </div>
                                <div className="col-2">
                                    {historyData?.phoneNumber}
                                </div>
                                <div className="col-2">
                                    Căn cước công dân:
                                </div>
                                <div className="col-2">
                                    {historyData?.cid}
                                </div>
                                <div className="col-1" />
                                <div className="col-1">
                                    Email:
                                </div>
                                <div className="col-2">
                                    {historyData?.email}
                                </div>
                            </div>
                            <div className="col-12 row mt-2">
                                <div className="col-2">
                                    Dân tộc:
                                </div>
                                <div className="col-2">
                                    {historyData?.folkData?.name}
                                </div>
                                <div className="col-2">
                                    Địa chỉ:
                                </div>
                                <div className="col-6">
                                    {historyData?.address}
                                </div>
                            </div>
                        </div>
                        <div className="patient-history row">
                            <p style={{ fontWeight: '600', fontSize: '17px' }}>Thông tin thẻ bảo hiểm y tế</p>
                            <div className="col-12 row mt-1">
                                <div className="col-2">
                                    Mã bảo hiểm y tế:
                                </div>
                                <div className="col-2">
                                    {historyData?.userInsuranceData?.insuranceCode}
                                </div>
                                <div className="col-2">
                                    Nơi đăng ký KCB ban đầu:
                                </div>
                                <div className="col-6">
                                    {historyData?.userInsuranceData?.initialHealthcareRegistrationCode}
                                </div>
                            </div>
                            <div className="col-12 row mt-2">
                                <div className="col-2">
                                    Giá trị sử dụng:
                                </div>
                                <div className="col-2">
                                    {historyData?.userInsuranceData?.dateOfIssue && historyData?.userInsuranceData?.exp
                                        ? `${historyData.userInsuranceData.dateOfIssue} - ${historyData.userInsuranceData.exp}` : ''}
                                </div>
                                <div className="col-2">
                                    Thời hạn đủ 5 năm liên tục:
                                </div>
                                <div className="col-6">
                                    {historyData?.userInsuranceData?.continuousFiveYearPeriod}
                                </div>
                            </div>
                        </div>
                        <div className="patient-history row">
                            <p style={{ fontWeight: '600', fontSize: '17px' }}>Hồ sơ bệnh án</p>
                            <div className="col-12 mt-3 row">
                                {historyData?.userExaminationData && historyData?.userExaminationData.map((item, index) => (
                                    <HistoryItem 
                                        key={index} 
                                        id={index} 
                                        data={item} 
                                        onCopyPrescription={onCopyPrescription ? handleCopyPrescription : null}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

HistoryModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onCopyPrescription: PropTypes.func
};

export default HistoryModal;

