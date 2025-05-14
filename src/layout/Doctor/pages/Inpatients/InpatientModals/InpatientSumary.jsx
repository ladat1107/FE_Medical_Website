import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Spin, message } from "antd";
import { COVERED, PAYMENT_METHOD, STATUS_BE } from "@/constant/value";
import { insuranceCovered, medicineCovered } from "@/utils/coveredPrice";
import { convertDateTime, formatDate } from "@/utils/formatDate";
import "./PrescriptionChangeModal.scss";
import { getExaminationById, updateExamination } from "@/services/doctorService";
import { useMutation } from "@tanstack/react-query";
import { DISCHARGE_OPTIONS } from "@/constant/options";

const columns = [
    {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        width: 65,
    },
    {
        title: "Nội dung chi phí",
        dataIndex: "content",
        key: "content",
        width: 350,
    },
    {
        title: "Đơn vị tính",
        dataIndex: "unit",
        key: "unit",
        width: 110,
    },
    {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 100,
    },
    {
        title: "Đơn giá (đ)",
        dataIndex: "unitPrice",
        key: "unitPrice",
        render: (text) => text.toLocaleString(),
        width: 140,
    },
    {
        title: "Thành tiền (đ)",
        dataIndex: "total",
        key: "total",
        render: (text) => text.toLocaleString(),
        width: 140,
    },
    {
        title: "Tỷ lệ BHYT (%)",
        dataIndex: "insuranceRate",
        key: "insuranceRate",
        width: 140,
    },
    {
        title: "BHYT chi trả (đ)",
        dataIndex: "insurancePaid",
        key: "insurancePaid",
        render: (text) => text.toLocaleString(),
    },
    {
        title: "Người bệnh trả (đ)",
        dataIndex: "patientPaid",
        key: "patientPaid",
        render: (text) => text.toLocaleString(),
    },
];

const SummaryModal = ({ open, onCancel, examData = null, examinationId = null, onPaySusscess }) => {
    const [examinationData, setExamData] = useState(examData || {});
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);

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

    let {
        data: dataExamination,
        isLoading: examinationLoading,
        error: examinationError,
        mutate: fetchExaminationData,
    } = useMutation({
        mutationFn: (id) => getExaminationById(+id),
        onMutate: () => {
            setIsLoading(true);
        },
        onSuccess: (response) => {
            if (response && response.DT) {
                setExamData(response.DT);
            } else {
                console.error("Failed to fetch examination data:", response?.EM || "Unknown error");
            }
            setIsLoading(false);
        },
        onError: (error) => {
            console.error("Error fetching examination data:", error);
            setIsLoading(false);
        }
    });

    useEffect(() => {
        // Nếu có examData từ props, sử dụng nó
        if (examData) {
            setExamData(examData);
        } 
        // Nếu không có examData nhưng có examinationId, fetch dữ liệu
        else if (examinationId && open) {
            fetchExaminationData(examinationId);
        }
    }, [examinationId, examData, open]);

    function calculateDays(startDateStr, endDateStr) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
      
        // Đặt giờ về 00:00:00 để tránh sai lệch do giờ
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
      
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const diffDays = (end - start) / millisecondsPerDay + 1; // +1 để tính đủ cả 2 ngày
      
        return diffDays;
    }

    const [isPayLoading, setIsPayLoading] = useState(false);
    const handleTotalPay = async () => {
        try {
            setIsPayLoading(true);
            const datapay = {
                id: examinationData?.id,
                status: 8,
                price: [...dataExam].reduce((sum, item) => sum + (item.total || 0), 0),
                insuranceCovered: [...dataExam].reduce((sum, item) => sum + (item.insurancePaid || 0), 0),
                coveredPrice: [...dataExam].reduce((sum, item) => sum + (item.patientPaid || 0), 0),
                payment: paymentMethod,
                amount: [...data, ...dischargePresData].reduce((sum, item) => sum + (item.patientPaid || 0), 0)
            }
            if (paymentMethod === PAYMENT_METHOD.CASH) {
                const response = await updateExamination(datapay)
                if (response.EC === 0 && response.DT.includes(1)) {
                    message.success('thành công!');
                    onPaySusscess();
                } else {
                    message.error('Cập nhật bệnh nhân thất bại!');
                }
            } else {

            }
        } catch (error) {
            console.error("Error handling total payment:", error);
        } finally {
            setIsPayLoading(false);
        }
    }

    // Kiểm tra nếu đang loading hoặc không có dữ liệu, hiển thị trạng thái loading
    if (isLoading || examinationLoading) {
        return (
            <Modal
                open={open}
                title="Tổng hợp chi phí khám chữa bệnh"
                onCancel={onCancel}
                footer={null}
                width="90%"
                style={{ top: 20 }}
            >
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
                </div>
            </Modal>
        );
    }

    // Nếu có lỗi, hiển thị thông báo
    if (examinationError) {
        return (
            <Modal
                open={open}
                title="Tổng hợp chi phí khám chữa bệnh"
                onCancel={onCancel}
                footer={null}
                width="90%"
                style={{ top: 20 }}
            >
                <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
                    <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
                </div>
            </Modal>
        );
    }

    const data = [];
    let dataExam = [];
    let stt = 1;

    const dischargePresData = [];
    let discharge_stt = 1;

    examinationData?.inpatientRoomExaminationData?.forEach((item) => {
        if (!item) return;
        
        const admission = item?.startDate;
        const discharge = item?.endDate || new Date();
        const unitPrice = item?.inpatientRoomRoomData?.serviceData?.[0]?.price || 0;
        const quantity = admission && discharge ? calculateDays(admission, discharge) : 0;
        const insuranceRate = (COVERED[+examinationData?.insuranceCoverage] * 100 || 0) + '%';

        if (admission && unitPrice) {
            data.push({
                stt: stt++,
                content: "Phòng điều trị - " + (item?.roomName || "") 
                        + (item?.inpatientRoomRoomData?.serviceData?.[0]?.RoomServiceTypes?.serviceId === 4 ? " (VIP)" : ""),
                unit: "Ngày",
                quantity,
                unitPrice,
                total: quantity * unitPrice,
                insuranceRate,
                insurancePaid: insuranceCovered(quantity * unitPrice, examinationData?.insuranceCoverage),
                patientPaid: quantity * unitPrice - insuranceCovered(quantity * unitPrice, examinationData?.insuranceCoverage),
            });

            dataExam.push({
                content: "Phòng điều trị - " + (item?.roomName || "")
                        + (item?.inpatientRoomRoomData?.serviceData?.[0]?.RoomServiceTypes?.serviceId === 4 ? " (VIP)" : ""),
                unit: "Ngày",
                quantity,
                unitPrice,
                total: quantity * unitPrice,
                insuranceRate,
                insurancePaid: insuranceCovered(quantity * unitPrice, examinationData?.insuranceCoverage),
                patientPaid: quantity * unitPrice - insuranceCovered(quantity * unitPrice, examinationData?.insuranceCoverage),
            })
        }
    })

    // Chi phí cận lâm sàng
    const paraclinicalGroups = {};

    examinationData?.examinationResultParaclincalData?.forEach((item) => {
        if (!item) return;
        
        const paracId = item.paraclinical;
        
        if (!paraclinicalGroups[paracId]) {
            paraclinicalGroups[paracId] = {
                paracName: item.paracName,
                unitPrice: item?.paraclinicalData?.price || 0,
                quantity: 1,
                totalInsurancePaid: item?.insuranceCovered || 0,
                items: [item] 
            };
        } else {
            paraclinicalGroups[paracId].quantity += 1;
            paraclinicalGroups[paracId].totalInsurancePaid += item?.insuranceCovered || 0;
            paraclinicalGroups[paracId].items.push(item);
        }
    });

    Object.values(paraclinicalGroups).forEach((group) => {
        const unitPrice = group.unitPrice;
        const quantity = group.quantity;
        const total = unitPrice * quantity;
       
        const insuranceRate = (COVERED[+examinationData?.insuranceCoverage] * 100 || 0) + '%';
        const insurancePaid = group.totalInsurancePaid;
        const patientPaid = total - insurancePaid;

        data.push({
            stt: stt++,
            content: group.paracName,
            unit: "Lần",
            quantity,
            unitPrice,
            total,
            insuranceRate,
            insurancePaid,
            patientPaid,
        });
    });

    // Tạo hai đối tượng riêng để lưu trữ medicineGroups cho mỗi loại
    const medicineGroups = {}; // Cho status = 2
    const dischargeMedicineGroups = {}; // Cho status = 3

    examinationData?.prescriptionExamData?.forEach((prescription) => {
        if (!prescription) return;
        
        // Xác định đối tượng medicineGroups cần sử dụng dựa trên status
        const targetGroups = prescription.status === 2 ? medicineGroups : 
                            prescription.status === 3 ? dischargeMedicineGroups : null;
        
        // Nếu status không phải 2 hoặc 3, bỏ qua
        if (!targetGroups) return;
        
        prescription.prescriptionDetails?.forEach((item) => {
            if (!item) return;
            
            const medicineId = item.id;
            const detail = item.PrescriptionDetail;
            if (!detail) return;
            
            const dayOfUse = calculateDays(
                prescription?.createdAt, 
                prescription?.endDate || examinationData?.dischargeDate || new Date()
            ) || 1; 
                            
            if (!targetGroups[medicineId]) {
                targetGroups[medicineId] = {
                    name: item.name,
                    unit: detail.unit,
                    quantity: detail.quantity * dayOfUse || 1,
                    unitPrice: detail.price || 0,
                    totalInsurancePaid: medicineCovered(
                        detail.quantity * detail?.price,
                        +examinationData?.insuranceCoverage,
                        Number(item.insuranceCovered),
                        examinationData.isWrongTreatment, 
                        examinationData.medicalTreatmentTier
                    ) * dayOfUse || 0,
                    insuranceCovered: item.insuranceCovered || 0,
                    items: [{ item, detail }] 
                };
            } else {
                targetGroups[medicineId].quantity += (detail.quantity * dayOfUse || 1);
                targetGroups[medicineId].totalInsurancePaid += (detail.insuranceCovered || 0);
                targetGroups[medicineId].items.push({ item, detail });
            }
        });
    });

    // Xử lý dữ liệu cho status = 2 và thêm vào 'data'
    Object.values(medicineGroups).forEach((group) => {
        const unitPrice = group.unitPrice;
        const quantity = group.quantity;
        const total = unitPrice * quantity;
        const insurancePaid = group.totalInsurancePaid;
        const insuranceRate = (COVERED[+examinationData?.insuranceCoverage] * 100 || 0) + '% x ' + group.insuranceCovered * 100 + '%';
        const patientPaid = total - insurancePaid;

        data.push({
            stt: stt++,
            content: "Thuốc " + group.name,
            unit: group.unit,
            quantity,
            unitPrice,
            total,
            insuranceRate: insuranceRate, 
            insurancePaid,
            patientPaid,
        });
    });

    // Xử lý dữ liệu cho status = 3 và thêm vào 'dischargePresData'
    Object.values(dischargeMedicineGroups).forEach((group) => {
        const unitPrice = group.unitPrice;
        const quantity = group.quantity;
        const total = unitPrice * quantity;
        const insurancePaid = group.totalInsurancePaid;
        const insuranceRate = (COVERED[+examinationData?.insuranceCoverage] * 100 || 0) + '% x ' + group.insuranceCovered * 100 + '%';
        const patientPaid = total - insurancePaid;

        dischargePresData.push({
            stt: discharge_stt++,
            content: "Thuốc " + group.name,
            unit: group.unit,
            quantity,
            unitPrice,
            total,
            insuranceRate: insuranceRate, 
            insurancePaid,
            patientPaid,
        });
    });


    // Tính toán các giá trị
    const totalCost = [...data, ...dischargePresData].reduce((sum, item) => sum + (item.total || 0), 0);
    const insurancePaid = [...data, ...dischargePresData].reduce((sum, item) => sum + (item.insurancePaid || 0), 0);
    const patientPaid = [...data, ...dischargePresData].reduce((sum, item) => sum + (item.patientPaid || 0), 0);
    const totalAdvance = (examinationData?.advanceMoneyExaminationData?.reduce(
        (sum, item) => sum + (item.amount || 0), 0) || 0);
    
    const difference = totalAdvance - patientPaid;
    
    // Định dạng tiền tệ
    const formatCurrency = (amount) => amount.toLocaleString() + ' đ';
    
    const handlePayment = () => {
        setIsPayLoading(true);
        handleTotalPay();
    };
    
    // Xác định trạng thái thanh toán
    const getPaymentStatus = () => {
        if (difference > 0) {
            return { text: `Trả lại: ${formatCurrency(difference)}`, color: 'text-green-600' };
        } else if (difference < 0) {
            return { text: `Thu thêm: ${formatCurrency(Math.abs(difference))}`, color: 'text-red-600' };
        } else {
            return { text: 'Không cần đóng thêm hay trả lại', color: 'text-blue-600' };
        }
    };
  
    const paymentStatus = getPaymentStatus();

    if (data.length > 0) {
        data.push({
            stt: '',
            content: "Tổng cộng",
            unit: "",
            quantity: "",
            unitPrice: "",
            total: (data.reduce((sum, item) => sum + (item.total || 0), 0)),
            insuranceRate: "", 
            insurancePaid: (data.reduce((sum, item) => sum + (item.insurancePaid || 0), 0)),
            patientPaid: (data.reduce((sum, item) => sum + (item.patientPaid || 0), 0)),
        });
    }

    if (dischargePresData.length > 0) {
        dischargePresData.push({
            stt: '',
            content: "Tổng cộng",
            unit: "",
            quantity: "",
            unitPrice: "",
            total: (dischargePresData.reduce((sum, item) => sum + (item.total || 0), 0)),
            insuranceRate: "", 
            insurancePaid: (dischargePresData.reduce((sum, item) => sum + (item.insurancePaid || 0), 0)),
            patientPaid: (dischargePresData.reduce((sum, item) => sum + (item.patientPaid || 0), 0)),
        });
    }

    return (
        <Modal
            open={open}
            title="Tổng hợp chi phí khám chữa bệnh"
            onCancel={onCancel}
            footer={null}
            width="93%"
            style={{ top: 20 }}
            styles={{ overflow: 'hidden', maxHeight: 'none' }}
        >
            <div className="custom-summary-container">
                <div className="custom-scroll-area">
                    {examinationId && (
                        <>
                            <div className="">
                                <p className="flex justify-content-center" style={{color: "#0077F9", fontSize: "20px"}}>
                                    <span style={{fontWeight: "600"}}>HỒ SƠ BỆNH ÁN</span>
                                </p>
                                <div style={{ color: "#000" }}>
                                    <p style={{ fontWeight: "600", color: "#0077F9" }}>
                                        Thông tin bệnh nhân:
                                    </p>
                                    <div className="col-flex">
                                        <div className="row">
                                            <p className="col-6">
                                                Họ và tên:&nbsp;
                                                {examinationData?.userExaminationData?.lastName + ' ' + examinationData?.userExaminationData?.firstName || ""}
                                            </p>
                                            <p className="col-3">
                                                Ngày sinh:&nbsp;
                                                {convertDateTime(examinationData?.userExaminationData?.dob) || ""}
                                            </p>
                                            <p className="col-3">
                                                Giới tính:&nbsp;
                                                {examinationData?.userExaminationData?.gender == 0 ? 'Nam'
                                                    : examinationData?.userExaminationData?.gender == 1 ? 'Nữ'
                                                    : ''}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <p className="col-9">
                                                Địa chỉ hiện tại:&nbsp;
                                                {examinationData?.userExaminationData?.currentResident || ""}
                                            </p>
                                            <p className="col-3">
                                                Địa chỉ hiện tại:&nbsp;
                                                {examinationData?.userExaminationData?.currentResident || ""}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <p className="col-6">
                                                Bảo hiểm y tế:&nbsp;
                                                {examinationData?.insuranceCode || ""}
                                            </p>
                                            <p className="col-6">
                                                Giá trị từ:&nbsp;
                                                {examinationData?.insuranceCode || ""}
                                            </p>
                                            <p className="col-9">
                                                Nơi ĐKKCB ban đầu:&nbsp;
                                                {examinationData?.userExaminationData?.cid || ""}
                                            </p>
                                            <p className="col-3">
                                                Mã:&nbsp;
                                                {examinationData?.userExaminationData?.phoneNumber || ""}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <p className="me-5">
                                                Đối tượng ưu tiên:&nbsp;
                                                {SpecialText(examinationData?.special)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div style={{ color: "#000" }}>
                                    <p style={{ fontWeight: "600", color: "#0077F9" }}>
                                        Thông tin khám bệnh:
                                    </p>
                                    <div className="col-flex">
                                        <div className="row">
                                            <p className="col-6">
                                                Ngày nhập viện:&nbsp;
                                                {formatDate(examinationData?.admissionDate) || ""}
                                            </p>
                                            <p className="col-3">
                                                Tuyến điều trị:&nbsp;
                                                {examinationData?.isWrongTreatment === 1 ? "Trái tuyến" : "Đúng tuyến" || ""}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <p className="col-6">
                                                Ngày ra viện:&nbsp;
                                                {formatDate(examinationData?.dischargeDate) || ""}
                                            </p>
                                            <p className="col-3">
                                                Tổng số ngày điều trị:&nbsp;
                                                { examinationData?.admissionDate && examinationData?.dischargeDate ? calculateDays(examinationData?.admissionDate, examinationData?.dischargeDate) : "" || ""}
                                            </p>
                                            <p className="col-3">
                                                Tình trạng ra viện:&nbsp;
                                                {DISCHARGE_OPTIONS.find(option => option.value === examinationData.dischargeStatus)?.label || ''}
                                            </p>
                                        </div>
                                        <div className="row">
                                            <p className="col-6">
                                                Lý do vào viện:&nbsp;
                                                {examinationData?.reason || ""}
                                            </p>
                                            <p className="col-6">
                                                Triệu chứng:&nbsp;
                                                {examinationData?.symptom || ""}
                                            </p>
                                            <p className="col-12">
                                                Tên bệnh chính:&nbsp;
                                                {examinationData?.diseaseName || ""}
                                            </p>
                                            <div className="d-flex align-items-top">
                                                <div className="col-1">Bệnh đi kèm: </div>
                                                <div className="col-11 row">
                                                    {examinationData?.comorbiditiesDetails && examinationData?.comorbiditiesDetails.length > 0 ? (
                                                        examinationData.comorbiditiesDetails.map((item, index) => (
                                                            <span key={index} className="me-2">
                                                                {item.code + ' - ' + item.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span />
                                                    )}
                                                </div>
                                            </div>
                                            <p className="col-6">
                                                Kết quả điều trị:&nbsp;
                                                {examinationData?.treatmentResult || ""}
                                            </p>
                                            <p className="col-3">
                                                Phòng bệnh:&nbsp;
                                                {examinationData?.examinationRoomData?.name || ""}
                                            </p>
                                            <p className="col-3">
                                                Khoa:&nbsp;
                                                {examinationData?.examinationRoomData?.roomDepartmentData?.name || ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    <p className="flex justify-content-center mt-3" style={{color: "#0077F9", fontSize: "20px"}}>
                        <span style={{fontWeight: "600"}}>BẢNG KÊ CHI PHÍ KHÁM BỆNH</span>
                    </p>
                    <div className="flex justify-content-between">
                        <div style={{ color: "#000" }}>
                            <p style={{ fontWeight: "600", color: "#0077F9" }}>
                                Từ ngày:&nbsp;
                                {convertDateTime(examinationData?.admissionDate)}&nbsp;-&nbsp;
                                Đến ngày:&nbsp;
                                {convertDateTime(examinationData?.dischargeDate || new Date())}
                            </p>
                            <div className="flex">
                                <p className="me-5">
                                    Mã thẻ BHYT:&nbsp;
                                    {examinationData?.userExaminationData?.userInsuranceData?.insuranceCode || "Chưa có"}
                                </p>
                                <p>
                                    Mức hưởng:&nbsp;
                                    {COVERED[examinationData?.insuranceCoverage] * 100 + '%' || "Chưa có"}
                                </p>
                            </div>
                        </div>
                        <div style={{ color: "#000" }}>
                            <p style={{ fontWeight: "600", color: "#0077F9" }}>
                                Tiền đã tạm ứng:&nbsp;
                                {(examinationData?.advanceMoneyExaminationData?.reduce(
                                    (sum, item) => sum + (item.amount || 0), 
                                    0
                                ) || 0).toLocaleString()} đ
                            </p>
                            {examinationData?.advanceMoneyExaminationData?.length > 0 ? (
                                examinationData.advanceMoneyExaminationData.map((item, index) => (
                                    <div className="flex" key={index}>
                                        <p className="me-1">Ngày: {convertDateTime(item?.date)} -</p>
                                        <p>Tạm ứng: {item.amount?.toLocaleString()} đ</p>
                                    </div>
                                ))
                            ) : (
                                <div>0 đ</div>
                            )}
                        </div>
                    </div>
                    <Table
                        className="custom-summary-table mt-2"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowKey={(record) => `${record.stt}-${record.content}`}
                        scroll={{ y: 395 }}
                        rowClassName={(record) => record.content === "Tổng cộng" ? "summary-row" : ""}
                    />
                    {dischargePresData.length > 0 && (
                        <>  
                            <p className="flex justify-content-center mt-3" style={{color: "#0077F9", fontSize: "20px"}}>
                                <span style={{fontWeight: "600"}}>ĐƠN THUỐC RA VIỆN</span>
                            </p>
                            <Table
                                className="custom-summary-table mt-2"
                                columns={columns}
                                dataSource={dischargePresData}
                                pagination={false}
                                rowKey={(record) => `${record.stt}-${record.content}`}
                                scroll={{ y: 395 }}
                                rowClassName={(record) => record.content === "Tổng cộng" ? "summary-row" : ""}
                            />
                        </>
                    )}
                    <div className="p-2 bg-blue-50 rounded-t-lg border-b border-gray-200 mt-4">
                        <h3 className="font-bold text-lg text-blue-800">Thông tin thanh toán</h3>
                    </div>
                    <div className="mt-1 flex justify-between items-center">
                        <span className="font-medium text-gray-700">Tổng chi phí KCB:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(totalCost)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Tổng BHYT chi trả:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(insurancePaid)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Người bệnh chi trả:</span>
                        <span className="font-semibold text-indigo-600">{formatCurrency(patientPaid)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Tổng tạm ứng:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(totalAdvance)}</span>
                    </div>
                </div>
                <div className="bg-white shadow-md">
                    <div className="p-3 pt-0 pb-2 space-y-2">
                        <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">Thanh toán:</span>
                                <span className={`font-bold text-lg ${paymentStatus.color}`}>{paymentStatus.text}</span>
                            </div>
                        </div>
                    </div>
                    
                    {examinationId && examinationData.status === STATUS_BE.DONE && (
                        <div className="p-2 bg-gray-50 rounded-b-lg">
                            <div className="flex items-center justify-between">
                                <div className="space-x-4">
                                    <div className="radio-button-container ms-2">
                                        <div className="radio-button">
                                            <input type="radio" className="radio-button__input" id="radio1" name="radio-group"
                                                value={PAYMENT_METHOD.CASH}
                                                checked={paymentMethod === PAYMENT_METHOD.CASH}
                                                onChange={() => setPaymentMethod(PAYMENT_METHOD.CASH)}
                                            />
                                            <label className="radio-button__label" htmlFor="radio1">
                                                <span className="radio-button__custom"></span>
                                                Tiền mặt
                                            </label>
                                        </div>
                                        <div className="radio-button">
                                            <input type="radio" className="radio-button__input" id="radio2" name="radio-group"
                                                value={PAYMENT_METHOD.MOMO}
                                                checked={paymentMethod === PAYMENT_METHOD.MOMO}
                                                onChange={() => setPaymentMethod(PAYMENT_METHOD.MOMO)}
                                            />
                                            <label className="radio-button__label" htmlFor="radio2">
                                                <span className="radio-button__custom"></span>
                                                Chuyển khoản
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handlePayment}
                                    className="save-button"
                                >
                                    {isPayLoading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        'Hoàn tất viện phí'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
        </Modal>
    );
};
SummaryModal.propTypes = {
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    examData: PropTypes.object,
    examinationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onPaySusscess: PropTypes.func,
};

export default SummaryModal;