import { useEffect, useState } from "react";
import DropdownPaginate from "@/layout/Admin/components/Dropdown/DropdownPaginate";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getUser, getUserById } from "@/services/adminService";
import Checkbox from '@mui/material/Checkbox';
import PaginateCustom from "@/layout/Admin/components/Paginate/PaginateCustom";
import DropdownAction from "@/layout/Admin/components/Dropdown/DropdownAction";
import CreateUserModal from "@/layout/Admin/components/Modal/CreateUserModal";
import "./PatientManage.scss";
import { useMutation } from "@/hooks/useMutation";
import useDebounce from "@/hooks/useDebounce";
import { LINK, TABLE } from "@/constant/value";
import { Input, message } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Status from "@/layout/Admin/components/Status";
import HistoryModal from "@/layout/Doctor/components/HistoryModal/HistoryModal";
import SkeletonTable from "./SkeletonTable";


const PatientManage = () => {
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(10);
    let [listUser, setListUser] = useState([]);
    let [totalPages, setTotalPage] = useState(0);
    let [checkAll, setCheckAll] = useState(false);
    let [search, setSearch] = useState("");
    let [obUpdate, setObUpdate] = useState(null);
    let [showCreateUserModal, setShowCreateUserModal] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalId, setModalId] = useState(null);

    let arr = [2]
    let searchDebounce = "";
    let { data: dataUser, loading: loadingUser, execute: fetchUsers, } = useMutation(() => getUser(currentPage, rowsPerPage, searchDebounce, arr))

    useEffect(() => {
        if (dataUser && dataUser.DT && dataUser.DT.rows && dataUser.DT.count) {
            let _listUser = [...dataUser.DT.rows];
            for (let i = 0; i < _listUser.length; i++) {
                _listUser[i].checked = false;
            }
            setListUser(_listUser);
            setTotalPage(dataUser.DT.count / rowsPerPage);
        }
    }, [dataUser])
    useEffect(() => {
        if (obUpdate) {
            setShowCreateUserModal(true)
        }
    }, [obUpdate])
    useEffect(() => {
        fetchUsers();
    }, [currentPage, useDebounce(search, 500), rowsPerPage]);
    searchDebounce = useDebounce(search, 500);
    const handleChange = (item) => {
        let _listUser = [...listUser];
        _listUser = _listUser.map(obj =>
            obj.id === item.id ? { ...obj, checked: !item.checked } : obj
        );
        setCheckAll(false);
        setListUser(_listUser);
    };

    const handleChangeSelectedAll = () => {
        let _listUser = [...listUser];
        setCheckAll(!checkAll);
        _listUser = _listUser.map(obj =>
            checkAll === true ? { ...obj, checked: false } : { ...obj, checked: true }
        );
        setListUser(_listUser);
    }
    const handleChangePaginate = (item) => {
        setRowPaper(item);
        setCurrentPage(1);
    }
    const refresh = () => {
        setCheckAll(false);
        setShowCreateUserModal(false);
        setObUpdate(null);
        setSearch("");
        setCurrentPage(1);
        fetchUsers();
    }

    const handleShow = (value) => {
        setShowCreateUserModal(value)
    }
    const hanldeCreateUser = () => {
        setObUpdate(null)
        setShowCreateUserModal(true)
    }
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1)
    }
    const handleUpdate = async (item) => {
        let response = await getUserById(item.id);
        if (response?.EC == 0) {
            let value = response?.DT;
            setObUpdate(value)
        } else {
            message.error(response?.EM || "Không thể chọn bệnh nhân")
            refresh();
        }
    }

    const handelPatientClick = (item) => {
        setModalId(item.id);
        showModal();
    }
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='patient-manage'>
            <div className='container'>
                <div className='first d-flex align-items-center justify-content-between py-3'>
                    <div className="text">BỆNH NHÂN</div>
                    <button className=' py-1 px-2 btn-add-user' onClick={() => { hanldeCreateUser() }}>
                        <FontAwesomeIcon className='me-1 icon' icon={faPlus} style={{ color: "#0A8FDC", }} />
                        Thêm mới
                    </button>
                </div>
                <div className='table-responsive bg-white'>
                    <div className='table-head d-flex align-items-center'>
                        <Input className='w-25 my-3 ms-4' size="large" placeholder="Tìm bệnh nhân" prefix={<SearchOutlined />}
                            value={search}
                            onChange={(event) => { handleChangeSearch(event) }} />
                    </div>
                    <div className="px-4">
                        <table className="w-100">
                            <thead className="header">
                                <tr>
                                    <th scope="col" className="rounded-top-left">
                                        <div className="">
                                            <Checkbox
                                                checked={checkAll}
                                                onChange={() => { handleChangeSelectedAll() }}
                                                size="small"
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" className="text-center ps-2 py-0 name">
                                        Họ và tên
                                    </th>
                                    <th scope="col" className="text-center px-2 py-0">
                                        Chức vụ
                                    </th>
                                    <th scope="col" className="text-center px-1 py-0">
                                        Số điện thoại
                                    </th>
                                    <th scope="col" className="text-center px-1 py-0">
                                        CCCD
                                    </th>
                                    <th scope="col" className="text-center px-1 py-0">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="rounded-top-right px-1 py-0">                                    </th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {loadingUser ?
                                    <SkeletonTable />
                                    :
                                    +listUser.length > 0 && +totalPages != 0 ?
                                        <>
                                            {
                                                listUser.map((item, index) => {
                                                    return (
                                                        <tr key={index} className="bg-white border-b">
                                                            <td>
                                                                <div className="">
                                                                    <Checkbox
                                                                        checked={item.checked}
                                                                        onChange={() => { handleChange(item, index) }}
                                                                        size="small"
                                                                    /></div>
                                                            </td>
                                                            <th scope="row" className="ps-2 py-3 min-content-width g-0" onClick={() => handelPatientClick(item)}>
                                                                <img className="image" src={item.avatar || LINK.AVATAR_NULL} alt="Jese image" />
                                                                <div className="ps-2 email ">
                                                                    <div className="fw-semibold">{item.lastName + " " + item.firstName}</div>
                                                                    <div className="fw-normal">{item.email}</div>
                                                                </div>
                                                            </th>
                                                            <td className="text-center px-2 py-3" >
                                                                {item?.userRoleData?.name || "Khác"}
                                                            </td>
                                                            <td className="text-center px-1 py-3">
                                                                {item?.phoneNumber || "Không có"}
                                                            </td>
                                                            <td className="text-center px-1 py-3">
                                                                {item?.cid || "Không có"}
                                                            </td>
                                                            <td className="text-center px-1 py-3">
                                                                <Status data={item?.status} />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className='iconDetail'>
                                                                    <DropdownAction
                                                                        data={item}
                                                                        action={handleUpdate}
                                                                        refresh={refresh}
                                                                        table={TABLE.USER}
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
                    </div>
                    <div className='footer-table d-flex justify-content-end mx-2'>
                        <div className='select-page'>
                            <DropdownPaginate page={rowsPerPage}
                                setPage={handleChangePaginate} />
                        </div>
                        <PaginateCustom totalPageCount={totalPages}
                            setPage={setCurrentPage} />
                    </div>
                </div>
                <CreateUserModal
                    show={showCreateUserModal}
                    isShow={handleShow}
                    obUpdate={obUpdate}
                    refresh={refresh}
                    table={TABLE.USER}
                    key={obUpdate ? obUpdate.id : "modal-closed"} />
                <div className="modal-history-content">
                    <HistoryModal
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                        userId={modalId}
                    />
                </div>
            </div>

        </div>
    );
}

export default PatientManage;