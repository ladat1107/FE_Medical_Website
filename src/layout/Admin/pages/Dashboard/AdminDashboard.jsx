
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import HeaderDashboard from "./Section/HeaderDasboard";
import CardRevenue from "./Section/CardRevenue";
import { useQuery } from "@tanstack/react-query";
import { getPaymentAdmin } from "@/services/adminService";
import { MEDICAL_TREATMENT_TIER, PAYMENT_METHOD, PAYMENT_STATUS, STATUS_BE } from "@/constant/value";
import ExamCard from "./Section/ExamCard";
import { useGetExamination } from "@/hooks";

const AdminDashboard = () => {
    const [dateRange, setDateRange] = useState([dayjs().subtract(1, "year"), dayjs()]);
    const [cardRevenue, setCardRevenue] = useState({ totalRevenue: 0, totalBank: 0, totalCash: 0, totalInsurance: 0 })
    const [cardExam, setCardExam] = useState({
        inPatient: { import: 0, export: 0, examming: 0, emergency: 0 },
        outPatient: { total: 0, success: 0, processing: 0, pending: 0, cancel: 0 }
    })
    const [timeFrame, setTimeFrame] = useState("month");
    const { data: examinationData, isLoading: isLoadingExamination, refetch: refetchExamination, isFetching: isFetchingExamination } = useGetExamination(dateRange ? { startDate: dateRange[0].format("YYYY-MM-DD 00:00:00"), endDate: dateRange[1].format("YYYY-MM-DD 23:59:59") } : null)
    const { data: paymentData, isLoading: isLoadingPayment, refetch: refetchPayment, isFetching: isFetchingPayment } = useQuery({
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
                    totalBank += payment.amount
                    payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment.amount : totalBank += payment.amount;
                }
                else if (payment.status === PAYMENT_STATUS.PAID) {
                    if (payment?.examinationData) {
                        const examination = payment?.examinationData;
                        const medicalTreatmentTier = examination?.medicalTreatmentTier || 0;
                        const type = (medicalTreatmentTier === MEDICAL_TREATMENT_TIER.INPATIENT || medicalTreatmentTier === MEDICAL_TREATMENT_TIER.EMERGENCY) ? 1 : 2;
                        if (type === 1) {
                            totalRevenue += examination.price;
                            payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment.amount : totalBank += payment.amount;
                            totalInsurance += examination.insuranceCovered
                            examination.examinationResultParaclincalData.forEach(paraclinical => {
                                totalInsurance += paraclinical.insuranceCovered;
                                totalRevenue += paraclinical.price;
                            })
                            examination.prescriptionExamData.forEach(prescription => {
                                totalInsurance += prescription.insuranceCovered;
                                totalRevenue += prescription.totalMoney;
                            })
                        } else if (type === 2) {
                            totalRevenue += examination.price;
                            payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment.amount : totalBank += payment.amount;
                            totalInsurance += examination.insuranceCovered;
                        }
                    } else if (payment?.paraclinicalData?.length > 0) {
                        const paraclinical = payment?.paraclinicalData;
                        paraclinical.forEach(item => {
                            totalRevenue += item.price;
                            payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment.amount : totalBank += payment.amount;
                            totalInsurance += item.insuranceCovered;
                        })
                    } else if (payment?.prescriptionData) {
                        const prescription = payment?.prescriptionData;
                        totalRevenue += prescription.totalMoney;
                        payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += payment.amount : totalBank += payment.amount;
                        totalInsurance += prescription.insuranceCovered;
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
            examinations.forEach(examination => {
                if (examination.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {
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
        }
    }, [examinationData])
    useEffect(() => {
        refetchPayment();
        refetchExamination();
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
        //refetchExamination();
    }
    return (
        <div className="p-4 bg-bgAdmin min-h-screen">
            <HeaderDashboard handleRefetch={handleRefetch} handleDateRangeChange={handleDateRangeChange} handleTimeFrameChange={handleTimeFrameChange} dateRange={dateRange} timeFrame={timeFrame} />
            <CardRevenue {...cardRevenue} />
            <ExamCard {...cardExam} />
        </div>
    );
}

export default AdminDashboard;