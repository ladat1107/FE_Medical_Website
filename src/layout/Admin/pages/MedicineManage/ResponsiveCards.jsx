"use client"

import { Card } from "antd"
import { Package, Calendar, TrendingDown } from "lucide-react"

const ResponsiveCards = ({
    totalMedicines,
    expiringMedicines,
    lowStockMedicines,
    newMedicines,
    handleClickExpiring,
    handleClickLowStock,
}) => {
    const cardBaseStyle =
        "h-full bg-white rounded-2xl !shadow-table-admin hover:scale-[1.03] transition-all duration-200 [&_.ant-card-body]:px-4 [&_.ant-card-body]:py-4"

    const iconWrapper = (bgColor, Icon) => (
        <div
            className={`p-3 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-md`}
        >
            <Icon className="w-7 h-7 text-white" />
        </div>
    )

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 mt-6">
            {/* Tổng số thuốc */}
            <Card className={cardBaseStyle}>
                <div className="flex items-center gap-4 min-w-0">
                    {iconWrapper("bg-primary-tw", Package)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Tổng số thuốc</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{totalMedicines}</h3>
                            <span className="text-sm font-medium text-gray-500">loại</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Thuốc sắp hết hạn */}
            <Card className={cardBaseStyle}>
                <div
                    className="flex items-center gap-4 min-w-0 cursor-pointer"
                    onClick={handleClickExpiring}
                >
                    {iconWrapper("bg-orange-400", Calendar)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Thuốc sắp hết hạn</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{expiringMedicines.length}</h3>
                            <span className="text-sm font-medium text-gray-500">loại</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Thuốc sắp hết hàng */}
            <Card className={cardBaseStyle}>
                <div
                    className="flex items-center gap-4 min-w-0 cursor-pointer"
                    onClick={handleClickLowStock}
                >
                    {iconWrapper("bg-red-400", TrendingDown)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Thuốc sắp hết hàng</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{lowStockMedicines.length}</h3>
                            <span className="text-sm font-medium text-gray-500">loại</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Thuốc mới nhập */}
            <Card className={cardBaseStyle}>
                <div className="flex items-center gap-4 min-w-0">
                    {iconWrapper("bg-[#00C48C]", Package)}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-1 truncate">Thuốc mới nhập</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-xl font-bold text-gray-900 m-0">{newMedicines}</h3>
                            <span className="text-sm font-medium text-gray-500">loại</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ResponsiveCards
