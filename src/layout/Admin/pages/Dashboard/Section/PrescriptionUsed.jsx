import { useGetPrescriptionUsed } from "@/hooks";
import { Card } from "antd";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { DollarSign } from "lucide-react";
import dayjs from "dayjs";
import EmptyChartFallback from "@/components/Empty/EmptyChartFallback";

const PrescriptionUsed = ({ startDate, endDate }) => {

    const { data: prescriptionUsed, refetch: refetchPrescriptionUsed } = useGetPrescriptionUsed({ startDate: startDate, endDate: endDate })
    const [prescriptionUsedData, setPrescriptionUsedData] = useState([])
    useEffect(() => {
        if (prescriptionUsed?.EC === 0) {
            const data = prescriptionUsed?.DT?.flatMap((prescription) =>
                prescription?.prescriptionDetails?.map((item) => ({
                    name: item?.name || "",
                    quantityUsed: item?.PrescriptionDetail?.quantity || 0,
                    unit: item?.unit || "",
                    expirationDate: dayjs(item?.exp || "").format("DD/MM/YYYY"),
                    inventory: item?.inventory || 0,
                }))
            ) || [];
            setPrescriptionUsedData(data);
        }
    }, [prescriptionUsed])

    useEffect(() => {
        refetchPrescriptionUsed();
    }, [startDate, endDate])
    
    return (
        <Card
            title={
                <div className="flex items-center">
                    <DollarSign size={18} className="mr-2 text-primary-tw" />
                    <span className="font-bold">Thống kê thuốc đã sử dụng <span className="font-normal">{dayjs(startDate).format("DD/MM/YYYY")} - {dayjs(endDate).format("DD/MM/YYYY")} </span></span>
                </div>
            }
            className="!shadow-table-admin hover:shadow-md h-full rounded-xl [&_.ant-card-body]:p-0 md:[&_.ant-card-body]:p-3 mt-5"
        >
            <div className="h-[300px] mt-3">
                {prescriptionUsedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prescriptionUsedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const { name, quantityUsed, unit, expirationDate, inventory } = payload[0].payload;
                                        return (
                                            <div className="bg-white p-2 border rounded shadow text-sm">
                                                <p><strong>{name}</strong></p>
                                                <p>SL đã dùng: {quantityUsed} {unit}</p>
                                                <p>HSD: {expirationDate}</p>
                                                <p>Tồn kho: {inventory}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="quantityUsed" fill="#00B5F1" radius={[5, 5, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChartFallback message="Không có đơn thuốc nào được sử dụng trong khoảng thời gian này" />
                )}
            </div>
        </Card>
    )
}

export default PrescriptionUsed;
