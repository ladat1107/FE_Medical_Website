import EmptyChartFallback from '@/components/Empty/EmptyChartFallback';
import { Card } from 'antd';
import { DollarSign } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const ChartRevenue = ({ chartRevenue }) => {
    return (
        <Card
            title={
                <div className="flex items-center text-primary-tw">
                    <DollarSign size={18} className="mr-2" />
                    <span className="font-bold">Thống kê doanh thu theo thời gian</span>
                </div>
            }
            className="!shadow-table-admin hover:shadow-md h-full rounded-xl [&_.ant-card-body]:p-0"
        >
            <div className="h-[420px]">
                {chartRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={2} barCategoryGap="20%"  >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
                            <Legend />
                            <Bar dataKey="cash" fill="#4ADE80" name="Tiền mặt" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="bank" fill="#F472B6" name="Chuyển khoản" radius={[6, 6, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <EmptyChartFallback message="Không có doanh thu nào trong khoảng thời gian này" />
                )}
            </div>
        </Card>
    )
}

export default ChartRevenue;
