import { MEDICAL_TREATMENT_TIER, PAYMENT_METHOD, PAYMENT_STATUS } from "@/constant/value";
import DropdownPaginate from "@/layout/Admin/components/Dropdown/DropdownPaginate";
import PaginateCustom from "@/layout/Admin/components/Paginate/PaginateCustom";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, Input, Select, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

const getStatus = (status) => {
    if (status === PAYMENT_STATUS.PAID) return <Tag color="success" >Đã thanh toán</Tag>;
    if (status === PAYMENT_STATUS.UNPAID) return <Tag color="error" >Chưa thanh toán</Tag>;
    if (status === PAYMENT_STATUS.PENDING) return <Tag color="warning" >Đang chờ</Tag>;
    if (status === PAYMENT_STATUS.REFUNDED) return <Tag color="error" >Hoàn tiền</Tag>;
    return <Tag color="default" >Không xác định</Tag>;
}
const getPaymentMethod = (paymentMethod) => {
    if (paymentMethod === PAYMENT_METHOD.CASH) return <Tag color="green" >Tiền mặt</Tag>;
    return <Tag color="pink" >Chuyển khoản</Tag>;
}
const TYPE_PAYMENT = {
    EXAMINATION: "1",
    PARACLINICAL: "2",
    PRESCRIPTION: "3",
    ADVANCE_MONEY: "4",
}
const TableRevenue = ({ tableRevenue, isLoading }) => {
    const [search, setSearch] = useState("");
    const [paymentData, setPaymentData] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filter, setFilter] = useState({
        paymentMethod: null,
        status: null,
        type: null
    });
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    useEffect(() => {
        let paymentFilter = tableRevenue?.length > 0 ? tableRevenue.map(item => ({ ...item })) : [];
        paymentFilter.map(item => {
            let details = JSON.parse(item?.detail || "{}");
            let type = { id: 0, name: "Không xác định" }
            if (item?.examinationData?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) type = { ...type, id: TYPE_PAYMENT.EXAMINATION, name: "Phí khám bệnh" }
            else if (item?.prescriptionData) type = { ...type, id: TYPE_PAYMENT.PRESCRIPTION, name: "Phí đơn thuốc" }
            else if (item?.advanceMoneyData) type = { ...type, id: TYPE_PAYMENT.ADVANCE_MONEY, name: `Tạm ứng nhập viện đơn ${item?.advanceMoneyData?.exam_id}` }
            else if (item?.paraclinicalData?.length > 0) type = { ...type, id: TYPE_PAYMENT.PARACLINICAL, name: "Phí xét nghiệm" }

            item.orderId = item.orderId?.split("Z")[1] || item.orderId
            item.time = dayjs(details?.responseTime || item?.createdAt).format("DD/MM/YYYY HH:mm:ss")
            item.amount = item.amount
            item.paymentMethod = item.paymentMethod
            item.receiver = details.receiver ? (details.receiver?.lastName || "") + " " + (details.receiver?.firstName || "") : "Momo"
            item.details = details
            item.status = item.status
            item.type = type
        })
        if (filter.type) {
            paymentFilter = paymentFilter.filter(item => item.type.id === filter.type)
        }
        if (filter.paymentMethod) {
            paymentFilter = paymentFilter.filter(item => item.paymentMethod === +filter.paymentMethod)
        }
        if (filter.status) {
            paymentFilter = paymentFilter.filter(item => item.status === +filter.status);
        }
        if (search) {
            paymentFilter = paymentFilter.filter(item => item.orderId.includes(search) || item.receiver.includes(search))
        }
        setPaymentData(paymentFilter);
    }, [tableRevenue, filter, search]);

    useEffect(() => {

        if (selectedPayment) {
            let type = null;
            // if (selectedPayment?.examinationData) {
            //     if (selectedPayment?.examinationData?.medicalTreatmentTier === MEDICAL_TREATMENT_TIER.OUTPATIENT) {

            //     }
            // }
        }
    }, [selectedPayment])
    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };
    const handleChangeFilter = (key, value) => {
        if (!value) {
            setFilter({ ...filter, [key]: null });
        } else {
            setFilter({ ...filter, [key]: value });
        }
        setCurrentPage(1);
    }
    const handleChangePaginate = (item) => {
        setRowsPerPage(item);
        setCurrentPage(1);
    }
    return (
        <Card
            title="Bảng chi tiết doanh thu"
            className="!shadow-table-admin hover:shadow-md h-full rounded-xl [&_.ant-card-body]:p-0 mt-4"
        >
            <div className="flex flex-col gap-4 px-6 py-2">
                <div className="flex flex-wrap gap-2">
                    <Input
                        placeholder="Tìm kiếm chi tiết"
                        prefix={<Search size={16} color="gray" />}
                        className="w-full sm:w-64 border-gray-300"
                        value={search}
                        onChange={handleChangeSearch}
                    />
                    <Select
                        placeholder="Phương thức thanh toán"
                        allowClear
                        className="sm:w-52 border-gray-300 "
                        value={filter.paymentMethod}
                        onChange={(value) => handleChangeFilter('paymentMethod', value)}
                        options={[{ label: "Tiền mặt", value: PAYMENT_METHOD.CASH + "" }, { label: "Chuyển khoản", value: PAYMENT_METHOD.MOMO + "" }]}
                    />
                    <Select
                        placeholder="Phân loại"
                        allowClear
                        className="sm:w-48 border-gray-300 "
                        value={filter.type}
                        onChange={(value) => handleChangeFilter('type', value)}
                        options={[{ label: "Phí khám", value: TYPE_PAYMENT.EXAMINATION + "" }, { label: "Phí đơn thuốc", value: TYPE_PAYMENT.PRESCRIPTION + "" }, { label: "Tạm ứng đơn thuốc", value: TYPE_PAYMENT.ADVANCE_MONEY + "" }, { label: "Phí xét nghiệm", value: TYPE_PAYMENT.PARACLINICAL + "" }]}
                    />
                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        className="sm:w-40 border-gray-300 "
                        value={filter.status}
                        onChange={(value) => handleChangeFilter('status', value)}
                        options={[{ label: "Đã thanh toán", value: PAYMENT_STATUS.PAID + "" }, { label: "Chưa thanh toán", value: PAYMENT_STATUS.UNPAID + "" }, { label: "Đang chờ", value: PAYMENT_STATUS.PENDING + "" }, { label: "Hoàn tiền", value: PAYMENT_STATUS.REFUNDED + "" }]}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <table className="w-full min-w-[800px] overflow-x-auto min-h-[500px]">
                        <thead className="bg-bgTableHead text-textHeadTable h-[50px]">
                            <tr>
                                <th className="text-center px-2 rounded-tl-table-admin whitespace-nowrap">
                                    Mã thanh toán
                                </th>
                                <th className="text-left px-2 whitespace-nowrap">
                                    Thời gian thanh toán
                                </th>
                                <th className="text-end px-2 whitespace-nowrap">
                                    Số tiền
                                </th>
                                <th className="text-center px-2 whitespace-nowrap">
                                    Phân loại
                                </th>
                                <th className="text-center px-2 whitespace-nowrap">
                                    Phương thức thanh toán
                                </th>
                                <th className="text-center px-2 whitespace-nowrap">
                                    Nhân viên thu
                                </th>
                                <th className="text-center px-2 whitespace-nowrap rounded-tr-table-admin">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <div>Đang load...</div> :
                                paymentData.length > 0 ? paymentData.slice(startIndex, endIndex).map((payment) => (
                                    <tr key={payment.id} className={`border-b border-gray-200 hover:bg-hoverTable hover:cursor-pointer `} onClick={() => setSelectedPayment(payment)}>
                                        <td className="py-2 px-2 whitespace-nowrap">
                                            <div className="flex items-center justify-start gap-2">
                                                <span title={payment.orderId} className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{payment.orderId}</span>
                                            </div>
                                        </td>
                                        <td className="text-left py-2 px-2 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span>{payment.time}</span>
                                        </td>
                                        <td className="text-end py-2 px-2 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span className={`font-bold ${payment.amount > 0 ? "text-green-500" : "text-red-500"}`}>{formatCurrency(payment.amount)}</span>
                                        </td>
                                        <td className={`text-center py-2 px-2 whitespace-nowrap text-[11px]`}>{payment.amount < 0 && "Trả"} {payment.type.name}</td>
                                        <td className="text-center py-2 px-2 whitespace-nowrap">{getPaymentMethod(payment.paymentMethod)}</td>
                                        <td className="text-center py-2 px-2 whitespace-nowrap">
                                            {payment?.details?.receiver?.id ?
                                                <Tooltip title={<div className="max-w-[200px] rounded-md">
                                                    <p>Mã nhân viên: {payment?.details?.receiver?.id}</p>
                                                    <p>Tên nhân viên: {payment.receiver}</p>
                                                    <p>Số điện thoại: {payment?.details?.receiver?.phoneNumber}</p>
                                                    <p>Email: {payment?.details?.receiver?.email}</p>
                                                    <p>CCCD: {payment?.details?.receiver?.cid}</p>
                                                </div>}>
                                                    <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{payment.receiver}</span>
                                                </Tooltip>
                                                :
                                                <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{payment.receiver}</span>}
                                        </td>
                                        <td className="text-center py-2 px-2 whitespace-nowrap">
                                            <span>{getStatus(payment.status)}</span>
                                        </td>
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
                <div className='flex flex-wrap justify-end items-center gap-2 mx-2 w-full'>
                    <DropdownPaginate page={rowsPerPage || 10}
                        setPage={handleChangePaginate} />
                    <PaginateCustom totalPageCount={Math.ceil(paymentData.length / rowsPerPage)}
                        setPage={setCurrentPage} />
                </div>
            </div>
        </Card>
    )
}

export default TableRevenue;
