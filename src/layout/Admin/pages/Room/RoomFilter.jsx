import { SearchOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { STATUS_BE } from "@/constant/value";

const RoomFilter = ({
    search,
    handleChangeSearch,
    filter,
    departments,
    typeRoom,
    handleChangeDepartment,
    handleChangeTypeRoom,
    handleChangeStatus
}) => {
    return (
        <div className="px-4 pt-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="w-full md:w-64 lg:flex-1">
                    <Input
                        placeholder="Tìm kiếm theo tên phòng"
                        value={search}
                        onChange={handleChangeSearch}
                        prefix={<SearchOutlined className="site-form-item-icon" />}
                        className="w-full"
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select
                        placeholder="Chọn khoa"
                        className="w-full"
                        value={filter.departmentId}
                        onChange={handleChangeDepartment}
                        allowClear
                        options={departments}
                        showSearch
                        optionFilterProp="label" // quan trọng khi dùng options dạng object
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select
                        placeholder="Chọn loại phòng"
                        className="w-full"
                        value={filter.typeRoom}
                        onChange={handleChangeTypeRoom}
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={typeRoom}

                    />
                </div>
                <div className="w-full md:w-32">
                    <Select
                        placeholder="Trạng thái"
                        className="w-full"
                        value={filter.status}
                        onChange={handleChangeStatus}
                        allowClear
                        options={[{ value: STATUS_BE.ACTIVE + "", label: "Hoạt động" }, { value: STATUS_BE.INACTIVE + "", label: "Khóa" }]}
                    />
                </div>
            </div>
        </div>
    )
}

export default RoomFilter;