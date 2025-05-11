import { useEffect, useState } from "react";
import DropdownPaginate from "../../components/Dropdown/DropdownPaginate";
import PaginateCustom from "../../components/Paginate/PaginateCustom";
import { CirclePlus, Upload as UploadIcon, ChevronUp, ChevronDown, Filter } from "lucide-react";
import { SearchOutlined } from "@mui/icons-material";
import { Button, Input, Badge, Select, Tooltip, Dropdown, DatePicker, message } from "antd";
import Status from "../../components/Status";
import { formatCurrency } from "@/utils/formatCurrency";
import MedicineManageSkeleton from "./MedicineManageSkeleton";
import { convertDateTime } from "@/utils/formatDate";
import MedicineInsertModal from "./MedicineInsertModal";
import MedicineUpdateModal from "./MedicineUpdateModal";
import ImportMedicineModal from "./ImportMedicineModal";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const MedicineTable = ({ medicines, refetch, isRefetchingMedicineData, isLoadingMedicineData }) => {
    const [openInsertModal, setOpenInsertModal] = useState(false);
    const [openImportModal, setOpenImportModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        status: null,
        insuranceCovered: null,
        expiryDate: null
    });
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null
    });

    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [importedRows, setImportedRows] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    // Xử lý tất cả các thay đổi và cập nhật searchList trong một useEffect duy nhất
    useEffect(() => {
        // Tạo một mảng mới chỉ khi medicines có dữ liệu
        let filteredMedicines = medicines?.length > 0 ? [...medicines] : [];

        if (filteredMedicines.length === 0) {
            setSearchList([]);
            setTotalPages(0);
            return;
        }

        // Áp dụng tìm kiếm
        if (search) {
            filteredMedicines = filteredMedicines.filter(medicine =>
                medicine.name?.toLowerCase().includes(search.toLowerCase()) ||
                medicine.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
                medicine.batchNumber?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Áp dụng các bộ lọc
        if (filters.status) {
            filteredMedicines = filteredMedicines.filter(medicine => medicine.status === +filters.status);
        }

        if (filters.insuranceCovered !== null) {
            if (filters.insuranceCovered === 'covered') {
                filteredMedicines = filteredMedicines.filter(medicine => medicine.insuranceCovered && Number(medicine.insuranceCovered));
            } else if (filters.insuranceCovered === 'notCovered') {
                filteredMedicines = filteredMedicines.filter(medicine => !medicine.insuranceCovered || isNaN(Number(medicine.insuranceCovered)) || Number(medicine.insuranceCovered) === 0);
            }
        }

        if (filters.expiryDate) {
            const [startDate, endDate] = filters.expiryDate;
            filteredMedicines = filteredMedicines.filter(medicine => {
                const expDate = dayjs(medicine?.exp);
                return expDate.isAfter(startDate) && expDate.isBefore(endDate);
            });
        }

        // Áp dụng sắp xếp
        if (sortConfig.key) {
            filteredMedicines.sort((a, b) => {
                if (sortConfig.key.includes('name')) {
                    return sortConfig.direction === 'ascending' ? a.name.toLowerCase().localeCompare(b.name.toLowerCase()) : b.name.toLowerCase().localeCompare(a.name.toLowerCase());
                }

                if (a?.[sortConfig.key] < b?.[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a?.[sortConfig.key] > b?.[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }

                return 0;
            });
        }

        setSearchList(filteredMedicines);
        setTotalPages(filteredMedicines.length);
    }, [medicines, search, filters, sortConfig]);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = null;
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const handleChangePaginate = (item) => {
        setRowsPerPage(item);
        setCurrentPage(1);
    }

    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    }

    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    }

    const clearFilters = () => {
        setFilters({
            status: null,
            insuranceCovered: null,
            expiryDate: null
        });
        setSortConfig({
            key: null,
            direction: null
        });
    }

    const handleSubmit = () => {
        refetch();
        setSelectedMedicine(null);
    }

    const handleImportSuccess = (rows) => {
        if (rows && Array.isArray(rows)) {
            setImportedRows(rows);
            setOpenInsertModal(true);
        }
    }

    const handleCloseInsertModal = () => {
        setOpenInsertModal(false);
        setImportedRows([]);
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ChevronUp size={16} className="text-textHeadTable ms-1" /> : <ChevronDown size={16} className="text-textHeadTable ms-1" />;
    };

    const formatInsuranceCovered = (value) => {
        const num = Number(value);
        if (!value || isNaN(num) || num === 0) return <span className="text-gray-400">_</span>;
        return `${(num * 100).toFixed(2)}%`;
    };

    return (
        <>
            <div className="bg-white rounded-bg-admin shadow-table-admin p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto mb-2 sm:mb-0">
                        <Input
                            placeholder="Tìm kiếm thuốc"
                            prefix={<SearchOutlined />}
                            className="w-full sm:w-64 border-gray-300"
                            value={search}
                            onChange={handleChangeSearch}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-between">
                        <Button type="default" onClick={refetch}>Làm mới</Button>
                        <Button
                            type="default"
                            icon={<Filter size={14} />}
                            onClick={() => setShowFilters(!showFilters)}
                            className={"border-primary-tw text-primary-tw"}
                        >
                            Bộ lọc
                        </Button>
                        <Button
                            type="default"
                            className="border-primary-tw text-primary-tw"
                            icon={<UploadIcon size={18} />}
                            onClick={() => setOpenImportModal(true)}
                        >
                            Import
                        </Button>
                        <Button
                            type="primary"
                            className="bg-primary-tw py-1"
                            icon={<CirclePlus size={18} />}
                            onClick={() => {
                                setImportedRows([]);
                                setOpenInsertModal(true);
                            }}
                        >
                            Thêm thuốc
                        </Button>
                    </div>
                </div>

                {showFilters && (
                    <div className="bg-gray-50 rounded-md mb-3 flex flex-wrap gap-2">
                        <div className="w-full sm:w-auto">
                            <div className="text-xs mb-1 font-medium">Trạng thái</div>
                            <Select
                                placeholder="Trạng thái"
                                style={{ width: '100%', minWidth: 160 }}
                                value={filters.status}
                                onChange={(value) => handleFilterChange('status', value)}
                                allowClear
                                options={[
                                    { value: "1", label: 'Đang sử dụng' },
                                    { value: "0", label: 'Ngừng sử dụng' }
                                ]}
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                            <div className="text-xs mb-1 font-medium">Bảo hiểm</div>
                            <Select
                                placeholder="Bảo hiểm"
                                style={{ width: '100%', minWidth: 160 }}
                                value={filters.insuranceCovered}
                                onChange={(value) => handleFilterChange('insuranceCovered', value)}
                                allowClear
                                options={[
                                    { value: 'covered', label: 'Có hỗ trợ' },
                                    { value: 'notCovered', label: 'Không hỗ trợ' }
                                ]}
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                            <div className="text-xs mb-1 font-medium">Hạn sử dụng</div>
                            <RangePicker
                                format="DD/MM/YYYY"
                                onChange={(dates) => handleFilterChange('expiryDate', dates)}
                                value={filters.expiryDate}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="flex items-end w-full sm:w-auto mt-2 sm:mt-0">
                            <Button onClick={clearFilters} type="default" size="middle">
                                Xóa bộ lọc
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-bgTableHead text-textHeadTable h-[50px]">
                            <tr>
                                <th className="text-left px-2 rounded-tl-table-admin whitespace-nowrap">
                                    <div className="flex items-center cursor-pointer " onClick={() => handleSort('registrationNumber')}>
                                        Số đăng ký <span>{renderSortIcon('registrationNumber')}</span>
                                    </div>
                                </th>
                                <th className="text-left px-2 whitespace-nowrap">
                                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                                        Tên thuốc {renderSortIcon('name')}
                                    </div>
                                </th>
                                <th className="text-left px-2 whitespace-nowrap">
                                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('batchNumber')}>
                                        Số lô {renderSortIcon('batchNumber')}
                                    </div>
                                </th>
                                <th className="text-left px-2 whitespace-nowrap">
                                    <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('insuranceCovered')}>
                                        Bảo hiểm {renderSortIcon('insuranceCovered')}
                                    </div>
                                </th>
                                <th className="text-left px-2 whitespace-nowrap">
                                    <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('exp')}>
                                        Hạn sử dụng {renderSortIcon('exp')}
                                    </div>
                                </th>

                                <th className="text-left px-2 whitespace-nowrap">
                                    <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('inventory')}>
                                        Số lượng {renderSortIcon('inventory')}
                                    </div>
                                </th>
                                <th className="text-right px-2 whitespace-nowrap rounded-tr-table-admin ">
                                    <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('price')}>
                                        Giá {renderSortIcon('price')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingMedicineData || isRefetchingMedicineData ? <MedicineManageSkeleton /> :
                                searchList.length > 0 ? searchList.slice(startIndex, endIndex).map((medicine) => (
                                    <tr key={medicine.id} className="border-b border-gray-200 hover:bg-hoverTable hover:cursor-pointer" onClick={() => setSelectedMedicine(medicine)}>
                                        <td className="py-2 px-2 whitespace-nowrap">
                                            <div className="flex items-center justify-start gap-2">
                                                <Badge size={18} status={medicine.status === 1 ? "success" : "error"} />
                                                <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{medicine.registrationNumber}</span>
                                            </div>
                                        </td>
                                        <td className="text-left py-2 px-2 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            <Tooltip title={medicine.name}>
                                                <span>{medicine.name}</span>
                                            </Tooltip>
                                        </td>
                                        <td className="text-left py-2 px-2 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span>{medicine?.batchNumber || "_"}</span>
                                        </td>
                                        <td className="text-center py-2 px-2 whitespace-nowrap">{formatInsuranceCovered(medicine.insuranceCovered)}</td>
                                        <td className={`text-center py-2 px-2 whitespace-nowrap ${new Date(medicine.exp) < new Date(new Date().setMonth(new Date().getMonth() + 2)) ? "text-blue-300" : ""}`}>{convertDateTime(medicine.exp)}</td>
                                        <td className="text-left py-2 px-2 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-right w-[70%]">{medicine.inventory}</span>
                                                <span className="capitalize text-left w-[30%]">{medicine.unit}</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-2 px-2 text-secondaryText-tw whitespace-nowrap font-bold">{formatCurrency(medicine.price)}</td>

                                    </tr>
                                )) :
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            <span className="text-gray-500">Không có dữ liệu</span>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-end items-center gap-2 mx-2 mt-3 w-full'>
                    <div className='flex'>
                        <DropdownPaginate page={rowsPerPage || 10}
                            setPage={handleChangePaginate} />
                    </div>
                    <PaginateCustom totalPageCount={Math.ceil(totalPages / rowsPerPage)}
                        setPage={setCurrentPage} />
                </div>
            </div>
            {selectedMedicine && <MedicineUpdateModal
                open={selectedMedicine}
                onClose={() => setSelectedMedicine(null)}
                data={selectedMedicine}
                onSubmit={handleSubmit}
            />}

            <MedicineInsertModal
                open={openInsertModal}
                onClose={handleCloseInsertModal}
                initialRows={importedRows || []}
            />

            <ImportMedicineModal
                open={openImportModal}
                onClose={() => setOpenImportModal(false)}
                onImportSuccess={handleImportSuccess}
            />
        </>
    )
}

export default MedicineTable;
