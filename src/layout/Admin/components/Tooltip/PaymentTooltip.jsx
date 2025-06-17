import React from 'react';
import { Tooltip, Typography } from 'antd';
import { Calendar, CreditCard, DollarSign } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
const { Text } = Typography;
const getPaymentMethodText = (method) => {
    const methodMap = {
        1: { text: "MoMo", icon: <DollarSign size={14} className="mr-1" /> },
        2: { text: "VNPay", icon: <CreditCard size={14} className="mr-1" /> },
        3: { text: "Tiền mặt", icon: <CreditCard size={14} className="mr-1" /> },
    }

    const methodInfo = methodMap[method] || { text: "Không xác định", icon: <Info size={14} className="mr-1" /> }
    return (
        <div className="flex items-center text-black">
            {methodInfo.icon}
            {methodInfo.text}
        </div>
    )
}
const getPaymentStatusText = (status) => {
    if (status === 1) return <Text className="text-yellow-500">Chưa thanh toán</Text>
    if (status === 2) return <Text className="text-green-500">Đã thanh toán</Text>
    if (status === 0) return <Text className="text-red-500">Đã hủy</Text>
}
const PaymentTooltip = ({ paymentData, children }) => {
    if (!paymentData) return children || null;

    return (
        <Tooltip
            title={
                <div className="space-y-3 p-2">
                    <div className="flex justify-between">
                        <Text type="secondary">Mã thanh toán:</Text>
                        <Text>#{paymentData?.id}</Text>
                    </div>
                    <div className="flex justify-between">
                        <Text type="secondary">Phương thức thanh toán:</Text>
                        <div>{getPaymentMethodText(paymentData?.paymentMethod || 1)}</div>
                    </div>
                    <div className="flex justify-between">
                        <Text type="secondary">Ngày thanh toán:</Text>
                        <div className="flex items-center">
                            <Calendar size={14} className="mr-1 text-gray-500" />
                            <Text>{formatDate(paymentData?.updatedAt)}</Text>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Text type="secondary">Số tiền thanh toán:</Text>
                        <Text className="text-red-500 font-medium">
                            {formatCurrency(paymentData?.amount)}
                        </Text>
                    </div>
                    <div className="flex justify-between">
                        <Text type="secondary">Trạng thái:</Text>
                        <div>{getPaymentStatusText(paymentData?.status)}</div>
                    </div>
                </div>
            }
            overlayInnerStyle={{
                backgroundColor: '#fff',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                width: 300,
            }}
            placement="left"
            arrow={false}
        >
            {children || <Text className="text-blue-500 cursor-pointer underline">Xem chi tiết thanh toán</Text>}
        </Tooltip>
    );
};

export default PaymentTooltip;
