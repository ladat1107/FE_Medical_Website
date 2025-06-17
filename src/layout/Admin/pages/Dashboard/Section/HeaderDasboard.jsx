
import { Button, Select, DatePicker } from "antd";
import { SquareMenu } from "lucide-react";

const { RangePicker } = DatePicker
const { Option } = Select
const HeaderDashboard = ({ handleRefetch, handleDateRangeChange, handleTimeFrameChange, dateRange, timeFrame }) => {

    return (
        <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
                <SquareMenu className="text-secondaryText-tw" />
                <span className="text-secondaryText-tw text-[18px] uppercase">Tổng quan</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button type="default" onClick={handleRefetch}>Làm mới</Button>
                <RangePicker
                    allowClear={false}
                    value={dateRange}
                    format="DD/MM/YYYY"
                    onChange={handleDateRangeChange} />
                <Select defaultValue={timeFrame} style={{ width: 120 }} onChange={handleTimeFrameChange}>
                    <Option value="today">Hôm nay</Option>
                    <Option value="yesterday">Hôm qua</Option>
                    <Option value="week">Theo tuần</Option>
                    <Option value="month">Theo tháng</Option>
                </Select>
            </div>
        </div>
    )
}

export default HeaderDashboard;
