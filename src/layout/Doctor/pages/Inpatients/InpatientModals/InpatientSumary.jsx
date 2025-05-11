import React from "react";
import { Modal, Table } from "antd";
import { COVERED } from "@/constant/value";
import { insuranceCovered, medicineCovered } from "@/utils/coveredPrice";
import { convertDateTime } from "@/utils/formatDate";
import "./PrescriptionChangeModal.scss";

const columns = [
    {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        width: 60,
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

const SummaryModal = ({ open, onCancel, examinationData }) => {
    const data = [];
    let stt = 1;

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

    const admission = examinationData?.admissionDate;
    const discharge = examinationData?.dischargeDate || new Date();
    const unitPrice = examinationData?.examinationRoomData?.serviceData[0]?.price || 0;
    const quantity = calculateDays(admission, discharge);
    const insuranceRate = (COVERED[+examinationData?.insuranceCoverage] * 100 || 0) + '%';

    data.push({
        stt: stt++,
        content: "Phòng điều trị - " + examinationData?.examinationRoomData?.name 
                + (examinationData?.examinationRoomData?.serviceData[0]?.RoomServiceTypes?.serviceId === 4 ? " (VIP)" : ""),
        unit: "Ngày",
        quantity,
        unitPrice,
        total: quantity * unitPrice,
        insuranceRate,
        insurancePaid: insuranceCovered(quantity * unitPrice, examinationData?.insuranceCoverage),
        patientPaid: quantity * unitPrice - insuranceCovered(quantity * unitPrice, examinationData?.insuranceCoverage),
    });

    // Chi phí cận lâm sàng
    const paraclinicalGroups = {};

    examinationData?.examinationResultParaclincalData?.forEach((item) => {
    const paracId = item.paraclinical;
    
    if (!paraclinicalGroups[paracId]) {
        paraclinicalGroups[paracId] = {
            paracName: item.paracName,
            unitPrice: item?.paraclinicalData?.price || 0,
            quantity: 1,
            totalInsurancePaid:  item?.insuranceCovered || 0,
            items: [item] 
        };
    } else {
        paraclinicalGroups[paracId].quantity += 1;
        paraclinicalGroups[paracId].totalInsurancePaid +=  item?.insuranceCovered || 0;
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

    const medicineGroups = {};
    examinationData?.prescriptionExamData?.forEach((prescription) => {
        prescription.prescriptionDetails.forEach((item) => {
            const medicineId = item.id;
            const detail = item.PrescriptionDetail;
            const dayOfUse = calculateDays(
                                prescription?.createdAt, 
                                prescription?.endDate || examinationData?.dischargeDate || new Date()
                            ) || 1; 
                            
            if (!medicineGroups[medicineId]) {
                medicineGroups[medicineId] = {
                    name: item.name,
                    unit: detail.unit,
                    quantity: detail.quantity * dayOfUse || 1,
                    unitPrice: detail.price || 0,
                    totalInsurancePaid: medicineCovered(
                                            detail.quantity * detail?.price,
                                            +examinationData?.insuranceCoverage,
                                            Number(item.insuranceCovered),
                                            examinationData.isWrongTreatment, examinationData.medicalTreatmentTier
                                        ) * dayOfUse || 0,
                    insuranceCovered: item.insuranceCovered || 0,
                    items: [{ item, detail }] 
                };
                } else {
                    medicineGroups[medicineId].quantity += (detail.quantity * dayOfUse || 1);
                    medicineGroups[medicineId].totalInsurancePaid += (detail.insuranceCovered || 0);
                    medicineGroups[medicineId].items.push({ item, detail });
                }
            });
        });

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

    return (
        <Modal
            open={open}
            title="Tổng hợp chi phí khám chữa bệnh"
            onCancel={onCancel}
            footer={null}
            width="90%"
            style={{ top: 20 }}
            bodyStyle={{ overflow: 'hidden', maxHeight: 'none' }}
        >
            <div className="custom-summary-container">
                <div className="custom-scroll-area">
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
                                    {examinationData?.insuranceCode || "Chưa có"}
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
                    <p className="flex justify-content-center" style={{color: "#0077F9", fontSize: "20px"}}>
                        <span style={{fontWeight: "600"}}>BẢNG KÊ CHI PHÍ KHÁM BỆNH</span>
                    </p>
                    <Table
                        className="custom-summary-table mt-2"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowKey={(record) => `${record.stt}-${record.content}`}
                        scroll={{ y: 395 }}
                    />
                </div>
                <div className="summary-fixed-total">
                    <p style={{color: "#000"}}>
                        <span style={{fontWeight: "600"}}>Tổng chi phí KCB:</span>&nbsp;
                        {data.reduce((sum, item) => sum + (item.total || 0), 0).toLocaleString()} đ
                    </p>
                    <p style={{color: "#000"}}>
                        <span style={{fontWeight: "600"}}>Tổng BHYT chi trả:</span>&nbsp;
                        {data.reduce((sum, item) => sum + (item.insurancePaid || 0), 0).toLocaleString()} đ
                    </p>
                    <p style={{color: "#000"}}>
                        <span style={{fontWeight: "600"}}>Tổng tạm ứng:</span>&nbsp;
                        {(examinationData?.advanceMoneyExaminationData?.reduce(
                                    (sum, item) => sum + (item.amount || 0), 
                                    0
                                ) || 0).toLocaleString()} đ
                    </p>
                    <p style={{ color: "#0077F9", fontWeight: "600" }}>
                        {(() => {
                            const totalAdvance = (examinationData?.advanceMoneyExaminationData?.reduce(
                            (sum, item) => sum + (item.amount || 0), 0) || 0);
                            const totalPaid = (data?.reduce((sum, item) => sum + (item.patientPaid || 0), 0) || 0);
                            const difference = totalAdvance - totalPaid;

                            if (difference > 0) {
                            return `Tiền trả lại: ${difference.toLocaleString()} đ`;
                            } else if (difference < 0) {
                            return `Tiền còn phải đóng: ${Math.abs(difference).toLocaleString()} đ`;
                            } else {
                            return `Không cần đóng thêm hay trả lại`;
                            }
                        })()}
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default SummaryModal;