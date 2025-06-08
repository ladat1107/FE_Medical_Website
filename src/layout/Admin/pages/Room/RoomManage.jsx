import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { SquareMenu } from "lucide-react";
import InsertRoom from "./InsertRoom";
import { useEffect, useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { getAllRoom, getNameDepartment, getRoomById, getServiceSearch, getSpecialtySelect } from "@/services/adminService";
import { message, Button, Tooltip } from "antd";
import DropdownPaginate from "../../components/Dropdown/DropdownPaginate";
import PaginateCustom from "../../components/Paginate/PaginateCustom";
import { TABLE, TYPE_ROOM } from "@/constant/value";
import useDebounce from "@/hooks/useDebounce";
import useQuery from "@/hooks/useQuery";
import Status from "../../components/Status";
import DropdownAction from "../../components/Dropdown/DropdownAction";
import SkeletonRoom from "./SkeletonRoom";
import RoomFilter from "./RoomFilter";
import RoomDetail from "./RoomDetail";

const Room = () => {
    let [showInsert, setShowInsert] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(10);
    let [totalPages, setTotalPage] = useState(0);
    let [listRoom, setListRoom] = useState([]);
    let [search, setSearch] = useState("");
    let [obUpdate, setObUpdate] = useState({});
    let searchDebounce = "";
    let [departments, setDepartments] = useState([]);
    let { data: departmentData } = useQuery(() => getNameDepartment())
    let [specialty, setSpecailty] = useState([]);
    let { data: specialtyData } = useQuery(() => getSpecialtySelect())
    let [typeRoom, setTypeRoom] = useState([]);
    let [paraclinical, setParaclinical] = useState([]);
    let { data: serviceData } = useQuery(() => getServiceSearch())
    let [filter, setFilter] = useState({
        departmentId: null,
        typeRoom: null,
        status: null
    });

    // State quản lý modal chi tiết phòng
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);

    useEffect(() => {
        if (departmentData && departmentData?.DT?.length > 0) {
            setDepartments(departmentData.DT);
        }
    }, [departmentData])

    let { data: dataRoom, loading: loadingRoom, execute: fetchRooms } = useMutation(() => getAllRoom({ page: currentPage, limit: rowsPerPage, search: searchDebounce, filter }))
    useEffect(() => {
        if (dataRoom?.EC === 0 && typeRoom?.length > 0) {
            let _listRoom = dataRoom.DT.rows.map(item => {
                let arrayService = item?.serviceData?.map(service => service.id)
                let _typeRoom = typeRoom.find(type => arrayService.includes(type.value)) || {}
                return {
                    ...item,
                    typeRoom: _typeRoom,
                }
            })
            setListRoom(_listRoom);
            setTotalPage(dataRoom.DT.count / rowsPerPage);
        }
    }, [dataRoom, typeRoom])

    useEffect(() => {
        fetchRooms();
    }, [currentPage, useDebounce(search, 500), rowsPerPage, filter]);

    useEffect(() => {
        if (specialtyData && specialtyData?.DT?.length > 0) {
            setSpecailty(specialtyData.DT);
        }
    }, [specialtyData])

    useEffect(() => {
        if (serviceData?.EC === 0 && serviceData?.DT?.length > 0) {
            let typeRoom = [];
            let paraclinical = [];
            serviceData.DT.forEach(service => {
                if (service?.isLaboratory === 1) {
                    typeRoom.push({ value: service.id, label: service.name })
                } else {
                    paraclinical.push({ value: service.id, label: service.name })
                }
            })
            setTypeRoom(typeRoom);
            setParaclinical(paraclinical);
        }
    }, [serviceData])

    const handleChangePaginate = (item) => {
        setRowPaper(item);
        setCurrentPage(1);
    }
    searchDebounce = useDebounce(search, 500);
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1)
    }

    const refresh = () => {
        handleShow(false)
        fetchRooms();
    }
    const handleShow = (value) => {
        setObUpdate(null)
    }

    const handleUpdate = async (item) => {
        setShowInsert(false)
        let response = await getRoomById(item.id);
        if (response?.EC == 0) {
            let value = response?.DT;
            setObUpdate(value)
            setShowInsert(true)
        } else {
            message.error(response?.EM)
            refresh();
        }
    }

    // Xử lý khi nhấn nút xem chi tiết
    const handleViewDetail = async (room) => {
        try {
            // Lấy thông tin chi tiết phòng từ API
            const response = await getRoomById(room.id);
            if (response?.EC === 0) {
                setSelectedRoomDetail({ ...response.DT, typeRoom: room.typeRoom, department: room.roomDepartmentData.name });
                setIsDetailModalVisible(true);
            } else {
                message.error(response?.EM || "Không thể tải thông tin phòng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết phòng:", error);
            message.error("Đã xảy ra lỗi khi tải thông tin chi tiết phòng");
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalVisible(false);
    };

    const handleShowInsert = (value) => {
        setObUpdate(null)
        setShowInsert(value)
    }
    const handleChangeDepartment = (value) => {
        setFilter({ ...filter, departmentId: value });
        setCurrentPage(1);
    }
    const handleChangeTypeRoom = (value) => {
        setFilter({ ...filter, typeRoom: value });
        setCurrentPage(1);
    }
    const handleChangeStatus = (value) => {
        setFilter({ ...filter, status: value });
        setCurrentPage(1);
    }

    return (
        <div className="p-4 bg-bgAdmin min-h-screen">
            <div className="mx-auto">
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                        <SquareMenu className="text-secondaryText-tw" />
                        <span className="text-secondaryText-tw text-[18px] uppercase">Quản lý phòng</span>
                    </div>
                    <div className="flex space-x-3">
                        {!showInsert &&
                            <button className="py-1 px-2 rounded-lg bg-primary-tw text-white hover:bg-primary-tw-light transition-colors"
                                onClick={() => { setObUpdate(null), setShowInsert(true) }}>
                                <FontAwesomeIcon className="mr-1" icon={faPlus} /> Thêm mới</button>
                        }
                        <Button className="py-1 px-2"
                            onClick={() => refresh()}>
                            <FontAwesomeIcon
                                className="mr-1" icon={faRotateRight} /> Tải lại
                        </Button>
                    </div>
                </div>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showInsert ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {showInsert && specialty?.length > 0 && <InsertRoom
                        specialty={specialty}
                        typeRoom={typeRoom}
                        paraclinical={paraclinical}
                        obUpdate={obUpdate}
                        departments={departments}
                        handleShowInsert={handleShowInsert}
                        refresh={refresh}
                    />}
                </div>
                <div className="bg-white rounded-bg-admin shadow-table-admin">
                    <RoomFilter
                        search={search}
                        handleChangeSearch={handleChangeSearch}
                        filter={filter}
                        departments={departments}
                        typeRoom={typeRoom}
                        handleChangeDepartment={handleChangeDepartment}
                        handleChangeTypeRoom={handleChangeTypeRoom}
                        handleChangeStatus={handleChangeStatus}
                    />
                    <div className="p-4">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-bgTableHead text-textHeadTable">
                                        <th className="p-2 text-center rounded-tl-lg">#</th>
                                        <th className="p-2">Tên phòng</th>
                                        <th className="p-2">Khoa</th>
                                        {filter.typeRoom === TYPE_ROOM.CLINIC && <th className="p-2">Chuyên khoa</th>}
                                        <th className="p-2">Loại phòng</th>
                                        <th className="p-2 text-center">Giường trống</th>
                                        <th className="p-2 text-center">Trạng thái</th>
                                        <th className="p-2 rounded-tr-lg"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loadingRoom ? <SkeletonRoom /> :
                                            +listRoom.length > 0 && +totalPages != 0 ?
                                                <>
                                                    {
                                                        listRoom.map((item, index) => {
                                                            return (
                                                                <tr key={index} className="border-b border-gray-200 hover:bg-hoverTable transition-colors">
                                                                    <td className="p-2 text-center">
                                                                        {item.id}
                                                                    </td>
                                                                    <td className="p-2 uppercase cursor-pointer" onClick={() => handleViewDetail(item)}>
                                                                        <Tooltip title="Xem chi tiết phòng">
                                                                            <div>{item?.name || "Khác"}</div>
                                                                        </Tooltip>
                                                                    </td>
                                                                    <td className="p-2">
                                                                        <div className="font-normal">{item?.roomDepartmentData?.name || "_"}</div>
                                                                    </td>
                                                                    {filter.typeRoom === TYPE_ROOM.CLINIC &&
                                                                        <td className="p-2">
                                                                            <div className="font-normal">{item?.specialtyData?.name || "_"}</div>
                                                                        </td>
                                                                    }
                                                                    <td className="p-2">
                                                                        <div className="font-normal">{item?.typeRoom?.label || "_"}</div>
                                                                    </td>
                                                                    <td className="p-2 text-center">
                                                                        {item.capacity > 0 ?
                                                                            <div className="font-normal"><b className="text-primary-tw">{Number(item?.capacity) - Number(item?.examinationRoomData?.length) || 0}</b> / {item?.capacity || 0}</div>
                                                                            :
                                                                            <div></div>
                                                                        }
                                                                    </td>
                                                                    <td className="p-2 text-center">
                                                                        <Status data={item?.status} />
                                                                    </td>
                                                                    <td className="p-2 flex justify-end items-center space-x-2">
                                                                        <DropdownAction
                                                                            data={item}
                                                                            action={handleUpdate}
                                                                            refresh={refresh}
                                                                            table={TABLE.ROOM}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )

                                                        })
                                                    }
                                                </> :
                                                <tr>
                                                    <td colSpan="7" className="text-center p-4">
                                                        <span className="text-gray-500">Không có dữ liệu</span>
                                                    </td>
                                                </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end items-center mt-4">
                            <div className="mr-4">
                                <DropdownPaginate page={rowsPerPage} setPage={handleChangePaginate} />
                            </div>
                            <PaginateCustom totalPageCount={totalPages} setPage={setCurrentPage} />
                        </div>
                    </div>
                </div>

                {/* Modal xem chi tiết phòng */}
                <RoomDetail
                    visible={isDetailModalVisible}
                    onClose={handleCloseDetailModal}
                    roomData={selectedRoomDetail}
                />
            </div>
        </div>
    );
}

export default Room;