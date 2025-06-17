import { Card } from "antd"
import { HeartPulse, CreditCard, HandCoins, BadgeDollarSign } from "lucide-react"

const CardRevenue = ({ totalRevenue, totalBank, totalCash, totalInsurance }) => {


    const cardBaseStyle = "h-full bg-white rounded-2xl !shadow-table-admin hover:scale-[1.03] transition-all duration-200 [&_.ant-card-body]:px-4 [&_.ant-card-body]:py-4"

    const iconWrapper = (bgColor, Icon) => (
        <div className={`p-3 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}        >
            <Icon className="w-7 h-7 text-white" />
        </div>
    )

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 mt-6">
            {/* Tổng doanh thu */}
            <Card className={cardBaseStyle}>
                <div className="flex items-center gap-4 min-w-0">
                    {iconWrapper("bg-primary-tw", BadgeDollarSign)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Tổng doanh thu</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{totalRevenue.toLocaleString()}</h3>
                            <span className="text-sm font-medium text-gray-500">VNĐ</span>
                        </div>
                    </div>
                </div>
            </Card>
            {/* Doanh thu tiền mặt */}
            <Card className={cardBaseStyle}>
                <div className="flex items-center gap-4 min-w-0">
                    {iconWrapper("bg-green-400", HandCoins)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Tiền mặt</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{totalCash.toLocaleString()}</h3>
                            <span className="text-sm font-medium text-gray-500">VNĐ</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Doanh thu chuyển khoản */}
            <Card className={cardBaseStyle}>
                <div className="flex items-center gap-4 min-w-0">
                    {iconWrapper("bg-pink-400", CreditCard)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Chuyển khoản</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{totalBank.toLocaleString()}</h3>
                            <span className="text-sm font-medium text-gray-500">VNĐ</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Doanh thu bảo hiểm */}
            <Card className={cardBaseStyle}>
                <div className="flex items-center gap-4 min-w-0">
                    {iconWrapper("bg-yellow-400", HeartPulse)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Bảo hiểm y tế</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{totalInsurance.toLocaleString()}</h3>
                            <span className="text-sm font-medium text-gray-500">VNĐ</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CardRevenue;
