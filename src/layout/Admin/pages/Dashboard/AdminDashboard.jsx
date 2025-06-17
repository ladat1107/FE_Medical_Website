
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import HeaderDashboard from "./Section/HeaderDasboard";
import CardRevenue from "./Section/CardRevenue";
import { useQuery } from "@tanstack/react-query";
import { getPaymentAdmin } from "@/services/adminService";
import { MEDICAL_TREATMENT_TIER, PAYMENT_METHOD, PAYMENT_STATUS, STATUS_BE } from "@/constant/value";
import ExamCard from "./Section/ExamCard";
import { useGetExamination } from "@/hooks";
import ExamTable from "./Section/ExamTable";
import PrescriptionUsed from "./Section/PrescriptionUsed";
import CommonDisease from "./Section/CommonDisease";
import { diffDate } from "@/utils/formatDate";

const AdminDashboard = () => {
    const [dateRange, setDateRange] = useState([dayjs().subtract(1, "month"), dayjs()]);
    const [cardRevenue, setCardRevenue] = useState({ totalRevenue: 0, totalBank: 0, totalCash: 0, totalInsurance: 0 })
    const [inPatientData, setInPatientData] = useState([]);
    const [outPatientData, setOutPatientData] = useState([]);
    const [cardExam, setCardExam] = useState({
        inPatient: { import: 0, export: 0, examming: 0, emergency: 0 },
        outPatient: { total: 0, success: 0, processing: 0, pending: 0, cancel: 0 }
    })
    const [timeFrame, setTimeFrame] = useState("month");
    const { data: examinationData, refetch: refetchExamination } = useGetExamination(dateRange ? { startDate: dateRange[0].format("YYYY-MM-DD 00:00:00"), endDate: dateRange[1].format("YYYY-MM-DD 23:59:59") } : null)
    const { data: paymentData, refetch: refetchPayment } = useQuery({
        queryKey: ["payment", dateRange],
        queryFn: () => getPaymentAdmin(dateRange ? { startDate: dateRange[0].format("YYYY-MM-DD 00:00:00"), endDate: dateRange[1].format("YYYY-MM-DD 23:59:59") } : null)
    })

    useEffect(() => {
        if (paymentData?.EC === 0 && paymentData?.DT) {
            const payments = paymentData?.DT;
            let totalRevenue = 0;
            let totalBank = 0;
            let totalCash = 0;
            let totalInsurance = 0;
            payments.forEach(payment => {
                if (payment.status === PAYMENT_STATUS.REFUNDED) {
                    totalRevenue += payment.amount;
                    payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment.amount : totalBank += payment.amount;
                }
                else if (payment.status === PAYMENT_STATUS.PAID) {
                    if (payment?.examinationData) {
                        const examination = payment?.examinationData;
                        const medicalTreatmentTier = examination?.medicalTreatmentTier || 0;
                        const type = (medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT || medicalTreatmentTier === MEDICAL_TREATMENT_TIER.EMERGENCY) ? 1 : 2;
                        if (type === 1) {
                            totalInsurance += examination?.insuranceCovered || 0;
                            examination?.examinationResultParaclincalData?.forEach(paraclinical => {
                                totalInsurance += paraclinical?.insuranceCovered || 0;
                            })
                            examination.prescriptionExamData.forEach(prescription => {
                                totalInsurance += prescription?.insuranceCovered || 0;
                            })
                        } else if (type === 2) {
                            totalRevenue += examination.price;
                            let coveredPriceOutpatient = examination?.coveredPrice || examination.price;
                            payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += coveredPriceOutpatient : totalBank += coveredPriceOutpatient;
                            totalInsurance += examination?.insuranceCovered || 0;
                        }
                    } else if (payment?.paraclinicalData?.length > 0) {
                        const paraclinical = payment?.paraclinicalData;
                        paraclinical.forEach(item => {
                            let coveredPriceParaclinicalOutpatient = item?.coveredPrice || item.price;
                            totalRevenue += item.price;
                            payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += coveredPriceParaclinicalOutpatient : totalBank += coveredPriceParaclinicalOutpatient;
                            totalInsurance += item?.insuranceCovered || 0;
                        })
                    } else if (payment?.prescriptionData) {
                        let diffDatePrescription = diffDate(payment?.prescriptionData?.createdAt, payment?.prescriptionData?.endDate || payment?.prescriptionData?.dischargedAt || dayjs()) + 1;
                        const prescription = payment?.prescriptionData;
                        let coveredPricePrescriptionOutpatient = prescription?.coveredPrice || prescription.totalMoney;
                        totalRevenue += prescription.totalMoney * diffDatePrescription;
                        payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += coveredPricePrescriptionOutpatient * diffDatePrescription : totalBank += coveredPricePrescriptionOutpatient * diffDatePrescription;
                        totalInsurance += prescription?.insuranceCovered * diffDatePrescription || 0;
                    } else if (payment?.advanceMoneyData) {
                        totalRevenue += payment?.advanceMoneyData?.amount;
                        payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment?.advanceMoneyData?.amount : totalBank += payment?.advanceMoneyData?.amount;
                    }
                }
            })
            setCardRevenue({
                ...cardRevenue,
                totalRevenue,
                totalBank,
                totalCash,
                totalInsurance
            });
        }
    }, [paymentData])

    useEffect(() => {
        if (examinationData?.EC === 0 && examinationData?.DT) {
            const examinations = examinationData?.DT;
            let _inPatient = { import: 0, export: 0, examming: 0, emergency: 0 }
            let _outPatient = { total: 0, success: 0, processing: 0, pending: 0, cancel: 0 }
            let _inPatientData = [];
            let _outPatientData = [];
            examinations.forEach(examination => {
                if (examination.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {
                    _outPatientData.push(examination);
                    _outPatient.total += 1;
                    if (examination.status === STATUS_BE.DONE) {
                        _outPatient.success += 1;
                    } else if (examination.status === STATUS_BE.WAITING || examination.status === STATUS_BE.PAID || examination.status === STATUS_BE.EXAMINING) {
                        _outPatient.processing += 1;
                    } else if (examination.status === STATUS_BE.PENDING || examination.status === STATUS_BE.ACTIVE) {
                        _outPatient.pending += 1;
                    } else if (examination.status === STATUS_BE.INACTIVE) {
                        _outPatient.cancel += 1;
                    }
                } else {
                    _inPatientData.push(examination);
                    if (examination?.status === STATUS_BE.DONE_INPATIENT) _inPatient.export += 1;
                    else {
                        _inPatient.examming += 1;
                        if (examination.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT) {
                            _inPatient.import += 1;
                        } else if (examination.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.EMERGENCY) {
                            _inPatient.emergency += 1;
                        }
                    }
                }
            })
            setCardExam({ ...cardExam, inPatient: _inPatient, outPatient: _outPatient })
            setInPatientData(_inPatientData);
            setOutPatientData(_outPatientData);
        }
    }, [examinationData])

    useEffect(() => {
        handleRefetch();
    }, [dateRange])

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    }
    const handleTimeFrameChange = (value) => {
        if (value === "today") {
            setDateRange([dayjs(), dayjs()])
        } else if (value === "yesterday") {
            setDateRange([dayjs().subtract(1, "day"), dayjs().subtract(1, "day")])
        } else if (value === "week") {
            setDateRange([dayjs().startOf("week"), dayjs().endOf("week")])
        } else if (value === "month") {
            setDateRange([dayjs().startOf("month"), dayjs().endOf("month")])
        }
        setTimeFrame(value)
    }

    const handleRefetch = () => {
        refetchExamination();
        refetchPayment();
    }

    return (
        <div className="p-4 bg-bgAdmin min-h-screen">
            <HeaderDashboard handleRefetch={handleRefetch} handleDateRangeChange={handleDateRangeChange} handleTimeFrameChange={handleTimeFrameChange} dateRange={dateRange} timeFrame={timeFrame} />
            <CardRevenue {...cardRevenue} />
            <ExamCard {...cardExam} />
            <ExamTable inPatientData={inPatientData} outPatientData={outPatientData} />
            <PrescriptionUsed startDate={dateRange[0].format("YYYY-MM-DD 00:00:00")} endDate={dateRange[1].format("YYYY-MM-DD 23:59:59")} />
            <CommonDisease examinationList={examinationData} doneExaminations={cardExam.inPatient.export + cardExam.outPatient.success} dateRange={dateRange} />
        </div>
    );
}

export default AdminDashboard;