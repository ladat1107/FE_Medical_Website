
import { PropTypes } from 'prop-types';
import { Form, message, Progress } from 'antd';
import { useEffect, useState } from 'react';
import { updateParaclinical } from '@/services/doctorService';
import '../../../components/PayModal/PayModal.scss';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';
import { CLOUDINARY_FOLDER } from '@/constant/value';
import { CloudUploadOutlined } from '@mui/icons-material';

const ParacModal = ({ isOpen, onClose, onSusscess, paracId, patientData }) => {

    const [special, setSpecial] = useState('normal');

    const [description, setDescription] = useState('');
    const [result, setResult] = useState('');
    const [image, setImage] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    const [data, setData] = useState({
        infouser: { firstName: '', lastName: '', cid: '' },
        infostaff: { firstName: '', lastName: '', position: '' },
        price: 0,
        paracName: ''
    });

    useEffect(() => {
        // Thêm logic ngăn cuộn trang khi modal mở
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup effect khi component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !patientData || !paracId) return;

        resetForm();

        let newSpecial = 'normal';
        let newData = {};

        
        newSpecial = patientData?.examinationResultParaclincalData?.special || 'normal';
        newData = {
            infouser: {
                firstName: patientData?.examinationResultParaclincalData?.userExaminationData?.firstName,
                lastName: patientData?.examinationResultParaclincalData?.userExaminationData?.lastName,
                cid: patientData?.examinationResultParaclincalData?.userExaminationData?.cid,
            },
            infostaff: {
                firstName: patientData?.doctorParaclinicalData?.staffUserData?.firstName,
                lastName: patientData?.doctorParaclinicalData?.staffUserData?.lastName,
                position: patientData?.doctorParaclinicalData?.position,
            },
            price: patientData?.price,
            paracName: patientData?.paraclinicalData?.name,
        };
        
        setImage(patientData.image || null);
        setDescription(patientData.description || '');
        setResult(patientData.result || '');

        setSpecial(newSpecial);
        setData(newData);

    }, [isOpen, patientData]);

    const handlePay = async () => {
        setIsLoading(true);
        if (isLoading) return; // Ngăn chặn nhiều lần nhấn nút
        try {
            if(result === '') {
                message.error('Vui lòng nhập kết quả cận lâm sàng!');
                return;
            }

            let paracData = {
                id: paracId,
                description: description,
                result: result,
                image: image,
                status: 7
            };

            const response = await updateParaclinical(paracData);

            if (response.EC === 0 && response.DT.includes(1)) {
                message.success('Cập nhật bệnh nhân thành công!');
                onSusscess();
                onClose();
            } else {
                message.error('Cập nhật bệnh nhân thất bại!');
            }
        
        } catch (error) {
            console.log(error);
            message.error('Cập nhật bệnh nhân thất bại!');
        } finally {
            setIsLoading(false); // Đặt lại trạng thái loading
        }
    };

    const resetForm = () => {
        setSpecial('normal');
        setDescription('');
        setResult('');
        setImage(null);
    };

    const SpecialText = ({ special }) => {
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
                specialClass = 'special';
        }
      
        return <p className={`special ${specialClass}`}>{specialText}</p>;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình
            const url = await uploadToCloudinary(file, CLOUDINARY_FOLDER.DEPARTMENT, (progress) => {
                setUploadProgress(progress);
            });
            setImage(url); // Cập nhật ảnh
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
        }
    };

    if (!isOpen) return null;

    return (
        <div className="payment-container">
            <div className="payment-content">
                <div className='payment-header'>
                    Cận lâm sàng
                </div>

                <div className='row'>
                    <div className='col-12 d-flex flex-row'>
                        <div className='col-3'>
                            <p style={{fontWeight: "400"}}>Bệnh nhân:</p>
                        </div>
                        <div className='col-8'>
                            <p>{data.infouser.lastName + ' ' + data.infouser.firstName}</p>
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{fontWeight: "400"}}>CCCD/CMND:</p>
                        </div>
                        <div className='col-3'>
                            <p>{data.infouser.cid}</p>
                        </div>
                        <div className='col-1'/>
                        <div className='col-2 d-flex align-items-center'>
                            <p style={{fontWeight: "400"}}>Ưu tiên:</p>
                        </div>
                        <div className='col-3'>
                            {SpecialText({ special })}
                        </div>
                    </div>
                    <hr className='mt-4'/>
                    <div className='col-12 d-flex flex-row mt-2'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{fontWeight: "400"}}>Tên cận lâm sàng:</p>
                        </div>
                        <div className='col-8' style={{color: "#008EFF", fontWeight: '600'}}>
                            <p>{data.paracName}</p>
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3 mb-2'>
                        <div className='col-3 d-flex align-items-center'>
                            <p style={{fontWeight: "400"}}>Kết quả:</p>
                        </div>
                        <div className='col-9'>
                            <input className='input-add-exam' style={{width: "100%"}} maxLength={50}
                                type='text' value={result} onChange={(e) => setResult(e.target.value)}
                                placeholder='Nhập kết quả cận lâm sàng...' />
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3 mb-2'>
                        <div className='col-3 d-flex align-items-start'>
                            <p style={{fontWeight: "400"}}>Chi tiết:</p>
                        </div>
                        <div className='col-9'>
                            <textarea className='input-add-exam' style={{width: "100%" ,minHeight: "80px"}} 
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder='Nhập chi tiết cận lâm sàng...' />
                        </div>
                    </div>
                    <div className='col-12 d-flex flex-row mt-3'>
                        <div className='col-3 d-flex align-items-start'>
                            <p style={{fontWeight: "400"}}>Hình ảnh:</p>
                        </div>
                        <div className='col-9'>
                        <Form.Item>
                            <div className='image-upload'>
                                <div className='container'>
                                    <span className='image-cloud'><CloudUploadOutlined/></span>
                                    <div style={{ cursor: 'pointer' }} onClick={() => document.getElementById(`input-upload-${paracId}`).click()}>
                                        <span htmlFor={`input-upload-${paracId}`} className='input-upload'>
                                            Chọn ảnh
                                        </span> đăng tải.
                                    </div>
                                    {uploading && (
                                        <div style={{ marginTop: '20px', width: '100%' }}>
                                            <Progress percent={uploadProgress} status="active" />
                                        </div>
                                    )}
                                    {image && (
                                        <div>
                                            <img src={image} alt="Uploaded" style={{ width: "100%"}} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input type="file" accept="image/*" id={`input-upload-${paracId}`} hidden={true} onChange={handleImageChange} />
                        </Form.Item>
                        </div>
                    </div>
                </div>
                <div className='payment-footer mt-2'>
                    <button className="close-user-btn" onClick={onClose}>Đóng</button>
                    <button className='payment-btn' onClick={handlePay}>
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                Đang xử lý...
                            </>
                        ) : 'Hoàn tất'}
                    </button>
                </div>
            </div>
        </div>
    )
}

ParacModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSusscess: PropTypes.func.isRequired,
    special: PropTypes.string,
    paracId: PropTypes.number,
    patientData: PropTypes.object
}

export default ParacModal;