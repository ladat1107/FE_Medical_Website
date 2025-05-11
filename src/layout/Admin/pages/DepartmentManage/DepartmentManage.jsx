import "./DepartmentManage.scss";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRotateRight, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Input } from "antd";
import { useMutation } from "@/hooks/useMutation";
import { getDepartment, getDepartmentById } from "@/services/adminService";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { TABLE } from "@/constant/value";
import DropdownPaginate from "../../components/Dropdown/DropdownPaginate";
import PaginateCustom from "../../components/Paginate/PaginateCustom";
import InsertDepartment from "./InsertDepartment";
import Status from "../../components/Status";
import DropdownAction from "../../components/Dropdown/DropdownAction";
import SkeletonDepartment from "./SkeletonDepartment";

const DepartmentManage = () => {
    let [showInsert, setShowInsert] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(10);
    let [totalPages, setTotalPage] = useState(0);
    let [listDepartment, setListDepartment] = useState([]);
    let [checkAll, setCheckAll] = useState(false);
    let [search, setSearch] = useState("");
    let [obUpdate, setObUpdate] = useState({});
    let searchDebounce = "";
    let {
        data: dataDepartment,
        loading: loadingDepartment,
        execute: fetchDepartments,
    } = useMutation((query) => getDepartment(currentPage, rowsPerPage, searchDebounce))
    useEffect(() => {
        if (dataDepartment && dataDepartment.DT && dataDepartment.DT.rows && dataDepartment.DT) {
            let _listDepartment = [...dataDepartment.DT.rows];
            for (let i = 0; i < _listDepartment.length; i++) {
                _listDepartment[i].checked = false;
                _listDepartment[i].roomQuantity = _listDepartment[i]?.roomData?.length || 0;
                _listDepartment[i].staffQuantity = _listDepartment[i]?.staffDepartmentData?.length || 0;
            }
            setListDepartment(_listDepartment);
            setTotalPage(dataDepartment.DT.count / rowsPerPage);
        }
    }, [dataDepartment])

    useEffect(() => {
        fetchDepartments();
    }, [currentPage, useDebounce(search, 500), rowsPerPage]);
    const handleChange = (item) => {
        let _listDepartment = [...listDepartment];
        _listDepartment = _listDepartment.map(obj =>
            obj.id === item.id ? { ...obj, checked: !item.checked } : obj
        );
        setCheckAll(false);
        setListDepartment(_listDepartment);
    };
    const handleChangeSelectedAll = () => {
        let _listDepartment = [...listDepartment];
        setCheckAll(!checkAll);
        _listDepartment = _listDepartment.map(obj =>
            checkAll === true ? { ...obj, checked: false } : { ...obj, checked: true }
        );
        setListDepartment(_listDepartment);
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
        setSearch("");
        setCheckAll(false);
        setObUpdate(null);
        setShowInsert(false);
        setCurrentPage(1);
        fetchDepartments();
    }
    const handleUpdate = async (item) => {
        setShowInsert(false)
        let response = await getDepartmentById(item.id);
        if (response?.EC == 0) {
            let value = response?.DT;
            setObUpdate(value)
            setShowInsert(true)
        } else {
            message.error(response?.EM || "Không thể chọn phòng ban")
            refresh();
        }
    }
    let handleShowInsert = (value) => {
        setObUpdate(null)
        setShowInsert(value)
    }
    return (
        <div className="department-content">
            <div className="container">
                <div className='first d-flex align-items-center justify-content-between py-3'>
                    <div className="text">QUẢN LÝ KHOA</div>
                    <div className="d-flex justify-content-end">
                        {!showInsert &&
                            <button className=' py-1 px-2 btn-add-department' onClick={() => { setShowInsert(true) }}>
                                <FontAwesomeIcon
                                    className='me-1 icon' icon={faPlus} style={{ color: "#0A8FDC", }} /> Thêm mới</button>
                        }
                        <button className='py-1 px-2 btn-refresh-department ms-3' onClick={() => { refresh() }}>
                            <FontAwesomeIcon
                                className='me-1 icon' icon={faRotateRight} style={{ color: "#04a9f3", }} /> Tải lại</button>
                    </div>
                </div>
                <div className={`p-1 animated-div ${showInsert ? 'show' : ''}`}>
                    {showInsert && <InsertDepartment
                        obUpdate={obUpdate || {}}
                        handleShowInsert={handleShowInsert}
                        refresh={refresh} />}
                </div>

                <div className="department bg-white ">
                    <div className="head">
                        <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} className="ms-4 my-3 w-25"
                            value={search}
                            onChange={(event) => { handleChangeSearch(event) }} />
                    </div>
                    <div className="px-4">
                        <table className="w-100">
                            <thead className="header">
                                <tr>
                                    <th scope="col" className="rounded-top-left">
                                        <div className="p-2">
                                            <Checkbox
                                                checked={checkAll}
                                                onChange={() => { handleChangeSelectedAll() }}
                                                size="small"
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" className=" px-1">Khoa</th>
                                    <th scope="col" className=" px-1">Trưởng khoa</th>
                                    <th scope="col" className=" text-center px-1 ">Nhân viên</th>
                                    <th scope="col" className=" px-1 ">Số phòng</th>
                                    <th scope="col" className=" px-1 d-none d-lg-table-cell">Vị trí</th>
                                    <th scope="col" className=" text-center px-1 d-none d-lg-table-cell">Trạng thái</th>
                                    <th scope="col" className="rounded-top-right px-1"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {
                                    loadingDepartment ? <SkeletonDepartment /> :
                                        +listDepartment.length > 0 && +totalPages != 0 ?
                                            <>
                                                {
                                                    listDepartment.map((item, index) => {
                                                        return (
                                                            <tr key={index} className="text-start">
                                                                <td className="p-2">
                                                                    <div className="d-flex align-items-center">
                                                                        <Checkbox
                                                                            checked={item.checked}
                                                                            onChange={() => { handleChange(item, index) }}
                                                                            size="small"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="text-start px-1 py-2 name">
                                                                    <div className="text"> {item?.name || "Khác"}</div>
                                                                </td>
                                                                <td scope="row" className="px-1 py-2 ps-1">
                                                                    {item?.deanDepartmentData?.staffUserData.lastName ?
                                                                        <div className="depar">
                                                                            <div className="text-up">{item?.deanDepartmentData?.staffUserData?.lastName + " " + item?.deanDepartmentData?.staffUserData?.firstName}</div>
                                                                            <div className="text-down">{item?.deanDepartmentData?.staffUserData?.email}</div>
                                                                        </div>
                                                                        :
                                                                        <div><span>_</span></div>
                                                                    }
                                                                </td>
                                                                <td className="text-center px-1 py-2">
                                                                    <div className="fw-normal"><b>{item?.staffQuantity || "0"}</b></div>
                                                                </td>
                                                                <td className="text-start px-1 py-2">
                                                                    <div className="fw-normal">{item?.roomQuantity || "0"}<span className="ms-1 d-none d-lg-inline">phòng</span></div>
                                                                </td>
                                                                <td className="text-start px-1 py-2 d-none d-lg-table-cell">
                                                                    <div>
                                                                        {item?.address || "Khác"}
                                                                    </div>
                                                                </td>
                                                                <td className="text-center px-1 py-2 d-none d-lg-table-cell">
                                                                    <Status data={item?.status} />
                                                                </td>
                                                                <td className="px-1 py-2">
                                                                    <div className='iconDetail'>
                                                                        <DropdownAction
                                                                            data={item}
                                                                            action={handleUpdate}
                                                                            refresh={refresh}
                                                                            table={TABLE.DEPARTMENT}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
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
                        <div className='footer-table d-flex justify-content-end mx-2'>
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
    )
}

export default DepartmentManage;