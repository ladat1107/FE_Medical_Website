import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchOutlined } from "@ant-design/icons";
import "./Room.scss";
import { primaryColorAdmin } from "@/styles//variables";
import { faPlus, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import InsertRoom from "./InsertRoom";
import { useEffect, useState } from "react";
import { useMutation } from "@/hooks/useMutation";
import { getAllRoom, getNameDepartment, getRoomById, getServiceSearch, getSpecialtySelect } from "@/services/adminService";
import { Checkbox, Input, Popover } from "antd";
import DropdownPaginate from "../../components/Dropdown/DropdownPaginate";
import PaginateCustom from "../../components/Paginate/PaginateCustom";
import { TABLE } from "@/constant/value";
import useDebounce from "@/hooks/useDebounce";
import DropdownDepartment from "./DropdownDepartment";
import useQuery from "@/hooks/useQuery";
import Status from "../../components/Status";
import DropdownAction from "../../components/Dropdown/DropdownAction";
import SkeletonRoom from "./SkeletonRoom";
const Room = () => {
    let [showInsert, setShowInsert] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(10);
    let [totalPages, setTotalPage] = useState(0);
    let [listRoom, setListRoom] = useState([]);
    let [checkAll, setCheckAll] = useState(false);
    let [search, setSearch] = useState("");
    let [obUpdate, setObUpdate] = useState({});
    let searchDebounce = "";
    let [departments, setDepartments] = useState([]);
    let { data: departmentData } = useQuery(() => getNameDepartment())
    let [specialty, setSpecailty] = useState([]);
    let { data: specialtyData } = useQuery(() => getSpecialtySelect())
    let [services, setServices] = useState([]);
    let { data: serviceData } = useQuery(() => getServiceSearch())
    let [searchDepartment, setSearchDepartment] = useState(0);
    useEffect(() => {
        if (departmentData && departmentData?.DT?.length > 0) {
            setDepartments(departmentData.DT);
        }
    }, [departmentData])
    let {
        data: dataRoom,
        loading: loadingRoom,
        execute: fetchRooms,
    } = useMutation((query) => getAllRoom(currentPage, rowsPerPage, searchDebounce, searchDepartment))
    useEffect(() => {
        if (dataRoom && dataRoom.DT && dataRoom.DT.rows && dataRoom.DT) {
            let _listRoom = [...dataRoom.DT.rows];
            for (let i = 0; i < _listRoom.length; i++) {
                let bedFree = 0;
                let bedBusy = 0;
                _listRoom[i].checked = false;
                _listRoom[i].bedQuantity = _listRoom[i].bedRoomData.length;
                for (let j = 0; j < _listRoom[i].bedQuantity; j++) {
                    if (_listRoom[i].bedRoomData[j].status === 1) {
                        bedBusy++;
                    } else {
                        bedFree++;
                    }
                }
                _listRoom[i].bedFree = bedFree;
                _listRoom[i].bedBusy = bedBusy;
            }
            setListRoom(_listRoom);
            setTotalPage(dataRoom.DT.count / rowsPerPage);
        }
    }, [dataRoom])
    useEffect(() => {
        fetchRooms();
    }, [currentPage, useDebounce(search, 500), rowsPerPage, searchDepartment]);
    useEffect(() => {
        if (specialtyData && specialtyData?.DT?.length > 0) {
            setSpecailty(specialtyData.DT);
        }
    }, [specialtyData])
    useEffect(() => {
        if (serviceData && serviceData?.DT?.length > 0) {
            setServices(serviceData.DT);
        }
    }, [serviceData])

    const handleChange = (item) => {
        let _listRoom = [...listRoom];
        _listRoom = _listRoom.map(obj =>
            obj.id === item.id ? { ...obj, checked: !item.checked } : obj
        );
        setCheckAll(false);
        setListRoom(_listRoom);
    };
    const handleChangeSelectedAll = () => {
        let _listRoom = [...listRoom];
        setCheckAll(!checkAll);
        _listRoom = _listRoom.map(obj =>
            checkAll === true ? { ...obj, checked: false } : { ...obj, checked: true }
        );
        setListRoom(_listRoom);
    }
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
        setCheckAll(false)
        handleShow(false)
        setCurrentPage(1);
        setSearch("");
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
            message.error(response?.EM || "Không thể chọn phòng ban")
            refresh();
        }
    }
    const handleShowInsert = (value) => {
        setObUpdate(null)
        setShowInsert(value)
    }
    const handleChangeDepartment = (value) => {
        setSearchDepartment(value);
        setCurrentPage(1);
        setSearch("");
    }
    return (
        <div className="room-content">
            <div className="container">
                <div className="room-of-room-content-header d-flex align-items-center justify-content-between py-3">
                    <div className="text">QUẢN LÝ PHÒNG</div>
                    <div>
                        {!showInsert &&
                            <button className=' py-1 px-2 btn-add-room' onClick={() => { setObUpdate(null), setShowInsert(true) }}>
                                <FontAwesomeIcon
                                    className='me-1 icon' icon={faPlus} style={{ color: "#0A8FDC", }} /> Thêm mới</button>
                        }
                        <button className='py-1 px-2 btn-refresh-room ms-3' onClick={() => refresh()}>
                            <FontAwesomeIcon
                                className='me-1 icon' icon={faRotateRight} style={{ color: "#04a9f3", }} /> Tải lại</button>
                    </div>
                </div>
                <div className={`p-1 animated-div ${showInsert ? 'show' : ''}`}>
                    {showInsert && specialty?.length > 0 && services?.length > 0 && <InsertRoom
                        specialty={specialty}
                        services={services}
                        obUpdate={obUpdate}
                        departments={departments}
                        handleShowInsert={handleShowInsert}
                        refresh={refresh}
                    />}
                </div>
                <div className="table-room bg-white ">
                    <div>
                        <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} className="ms-4 my-3 w-25"
                            value={search}
                            onChange={(event) => { handleChangeSearch(event) }} />
                    </div>
                    <div className="px-4">
                        <table className="w-100">
                            <thead className="header">
                                <tr>
                                    <th scope="col" className="rounded-top-left p-2">
                                        <div>
                                            <Checkbox
                                                checked={checkAll}
                                                onChange={() => { handleChangeSelectedAll() }}
                                                size="small"
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" className=" px-1">Tên phòng</th>
                                    <th scope="col" className=" px-1"><div>Khoa  <DropdownDepartment
                                        departments={departments}
                                        change={handleChangeDepartment} />
                                    </div></th>
                                    <th scope="col" className=" px-1 text-center">Giường trống</th>
                                    <th scope="col" className="text-center ps-5">Trạng thái</th>
                                    <th scope="col" className="rounded-top-right px-1"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body ">
                                {
                                    loadingRoom ? <SkeletonRoom /> :
                                        +listRoom.length > 0 && +totalPages != 0 ?
                                            <>
                                                {
                                                    listRoom.map((item, index) => {
                                                        return (
                                                            <Popover
                                                                key={index}
                                                                placement="topLeft"
                                                                content={
                                                                    item?.serviceData.map((service, index) => (
                                                                        <span key={index}>{service.name}<br /></span>
                                                                    ))}
                                                                title="Dịch vụ"
                                                            >
                                                                <tr>
                                                                    <td className="p-2">
                                                                        <div>
                                                                            <Checkbox
                                                                                checked={item.checked}
                                                                                onChange={() => { handleChange(item, index) }}
                                                                                size="small"
                                                                            /></div>
                                                                    </td>
                                                                    <td className="text-start px-1 py-2 text-uppercase">
                                                                        <div> {item?.name || "Khác"}</div>
                                                                    </td>
                                                                    <td className="text-start px-1 py-2">
                                                                        <div className="fw-normal">{item?.roomDepartmentData?.name || "_"}</div>
                                                                    </td>
                                                                    <td className="text-center px-1 py-2">
                                                                        {item.bedQuantity > 0 ?
                                                                            <div className="fw-normal"><b style={{ color: primaryColorAdmin }}>{item?.bedFree || 0}</b> / {item?.bedQuantity || 0}</div>
                                                                            :
                                                                            <div>
                                                                                -
                                                                            </div>}
                                                                    </td>
                                                                    <td className="text-center ps-5 py-2">
                                                                        <Status data={item?.status} />
                                                                    </td>
                                                                    <td className="px-1 py-2 d-flex justify-content-end">
                                                                        <div className='iconDetail'>
                                                                            <DropdownAction
                                                                                data={item}
                                                                                action={handleUpdate}
                                                                                refresh={refresh}
                                                                                table={TABLE.ROOM}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </Popover>
                                                        )

                                                    })
                                                }
                                            </> :
                                            <tr>
                                                <td colSpan="7" className="text-center">
                                                    <span className="text-gray-500">Không có dữ liệu</span>
                                                </td>
                                            </tr>
                                }

                            </tbody>
                        </table>
                        <div className='footer-table d-flex justify-content-end mx-2 mt-3'>
                            <div className='select-page'>
                                <DropdownPaginate page={rowsPerPage}
                                    setPage={handleChangePaginate} />
                            </div>
                            <PaginateCustom totalPageCount={totalPages}
                                setPage={setCurrentPage} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;