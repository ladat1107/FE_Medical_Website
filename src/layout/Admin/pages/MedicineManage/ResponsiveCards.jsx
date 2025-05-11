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
    return (
        <div className="flex flex-wrap gap-4 mb-12 mt-6">
            {/* Card 1 - Total Medicines */}
            <div className="flex-1 min-w-[280px] max-w-[calc(100%/4-0.75rem)]">
                <Card
                    bordered={false}
                    className="h-full bg-white rounded-2xl !shadow-table-admin hover:scale-105 transition-all [&_.ant-card-body]:px-4 [&_.ant-card-body]:py-4"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 bg-primary-tw rounded-full flex items-center justify-center flex-shrink-0">
                            <Package className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 mb-1 truncate">Tổng số thuốc</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl font-bold text-gray-900 m-0">{totalMedicines}</h3>
                                <span className="text-sm font-medium text-gray-500">loại</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Card 2 - Expiring Medicines */}
            <div className="flex-1 min-w-[280px] max-w-[calc(100%/4-0.75rem)]">
                <Card
                    bordered={false}
                    className="h-full bg-white rounded-2xl !shadow-table-admin hover:scale-105 transition-all [&_.ant-card-body]:px-4 [&_.ant-card-body]:py-4"
                >
                    <div className="flex items-center gap-4 min-w-0 cursor-pointer" onClick={handleClickExpiring}>
                        <div className="p-3 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 mb-1 truncate">Thuốc sắp hết hạn</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl font-bold text-gray-900 m-0">{expiringMedicines.length}</h3>
                                <span className="text-sm font-medium text-gray-500">loại</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Card 3 - Low Stock Medicines */}
            <div className="flex-1 min-w-[280px] max-w-[calc(100%/4-0.75rem)]">
                <Card
                    bordered={false}
                    className="h-full bg-white rounded-2xl !shadow-table-admin hover:scale-105 transition-all [&_.ant-card-body]:px-4 [&_.ant-card-body]:py-4"
                >
                    <div className="flex items-center gap-4 min-w-0 cursor-pointer" onClick={handleClickLowStock}>
                        <div className="p-3 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <TrendingDown className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 mb-1 truncate">Thuốc sắp hết hàng</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl font-bold text-gray-900 m-0">{lowStockMedicines.length}</h3>
                                <span className="text-sm font-medium text-gray-500">loại</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Card 4 - New Medicines */}
            <div className="flex-1 min-w-[280px] max-w-[calc(100%/4-0.75rem)]">
                <Card
                    bordered={false}
                    className="h-full bg-white rounded-2xl !shadow-table-admin hover:scale-105 transition-all [&_.ant-card-body]:px-4 [&_.ant-card-body]:py-4"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 bg-[#00C48C] rounded-full flex items-center justify-center flex-shrink-0">
                            <Package className="w-7 h-7 text-white" />
                        </div>
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
        </div>
    )
}

export default ResponsiveCards
