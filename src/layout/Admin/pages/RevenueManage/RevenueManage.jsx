
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import HeaderDashboard from "./Section/HeaderDasboard";
import CardRevenue from "./Section/CardRevenue";
import { useQuery } from "@tanstack/react-query";
import { getPaymentAdmin } from "@/services/adminService";
import { MEDICAL_TREATMENT_TIER, PAYMENT_METHOD, PAYMENT_STATUS } from "@/constant/value";
import ChartRevenue from "./Section/ChartRevenue";
import TableRevenue from "./Section/TableRevenue";
import { diffDate } from "@/utils/formatDate";

const RevenueManage = () => {
    const [dateRange, setDateRange] = useState([dayjs().subtract(1, "month"), dayjs()]);
    const [cardRevenue, setCardRevenue] = useState({
        totalRevenue: 0,
        totalBank: 0,
        totalCash: 0,
        totalInsurance: 0,
    })
    const [chartRevenue, setChartRevenue] = useState([])
    const [timeFrame, setTimeFrame] = useState("month");
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
            let _chartRevenue = [];
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
                    } if (payment?.paraclinicalData?.length > 0) {
                        const paraclinical = payment?.paraclinicalData;
                        paraclinical.forEach(item => {
                            let coveredPriceParaclinicalOutpatient = item?.coveredPrice || item.price;
                            totalRevenue += item.price;
                            payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += coveredPriceParaclinicalOutpatient : totalBank += coveredPriceParaclinicalOutpatient;
                            totalInsurance += item?.insuranceCovered || 0;
                        })
                    } if (payment?.prescriptionData) {
                        let diffDatePrescription = diffDate(payment?.prescriptionData?.createdAt, payment?.prescriptionData?.endDate || payment?.prescriptionData?.dischargedAt || dayjs()) + 1;
                        const prescription = payment?.prescriptionData;
                        let coveredPricePrescriptionOutpatient = prescription?.coveredPrice || prescription.totalMoney;
                        totalRevenue += prescription.totalMoney * diffDatePrescription;
                        payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += coveredPricePrescriptionOutpatient * diffDatePrescription : totalBank += coveredPricePrescriptionOutpatient * diffDatePrescription;
                        totalInsurance += prescription?.insuranceCovered * diffDatePrescription || 0;
                    } if (payment?.advanceMoneyData) {
                        totalRevenue += payment?.advanceMoneyData?.amount || 0;
                        payment.paymentMethod === PAYMENT_METHOD.CASH ? totalCash += (payment?.advanceMoneyData?.amount || 0) : totalBank += (payment?.advanceMoneyData?.amount || 0);
                    }
                }
            })
            if (dateRange[0].diff(dateRange[1], "day") === 0) {
                const hours = Array.from({ length: 24 }, (_, i) => ({
                    time: `${String(i).padStart(2, '0')}:00`,
                    cash: 0,
                    bank: 0
                }));
                payments.forEach(payment => {
                    if (payment.status === PAYMENT_STATUS.PAID) {
                        const hourIndex = Number(dayjs(payment.createdAt).format('H'));
                        payment.paymentMethod === PAYMENT_METHOD.CASH ? hours[hourIndex].cash += payment.amount : hours[hourIndex].bank += payment.amount;
                    }
                })
                _chartRevenue = hours.map(item => ({ ...item }));
            } else {
                let grouped = payments.reduce((acc, curr) => {
                    if (curr.status === PAYMENT_STATUS.PAID) {
                        const time = dayjs(curr.createdAt).format("DD/MM/YYYY");
                        if (!acc[time]) {
                            acc[time] = {
                                time,
                                cash: 0,
                                bank: 0,
                            }
                        }
                        curr.paymentMethod === PAYMENT_METHOD.CASH ? acc[time].cash += curr.amount : acc[time].bank += curr.amount;
                    }
                    return acc;
                }, [])
                _chartRevenue = Object.values(grouped).map(item => ({
                    time: item.time,
                    cash: item.cash,
                    bank: item.bank,
                }))
            }
            setCardRevenue({
                ...cardRevenue,
                totalRevenue,
                totalBank,
                totalCash,
                totalInsurance
            });
            setChartRevenue(_chartRevenue)
        }
    }, [paymentData])

    useEffect(() => {
        refetchPayment();
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
            <ChartRevenue chartRevenue={chartRevenue} />
            <TableRevenue tableRevenue={paymentData?.DT?.filter(item => item.amount !== 0) || []} isLoading={isLoadingPayment || isFetchingPayment} />
        </div>
    );
}

export default RevenueManage;