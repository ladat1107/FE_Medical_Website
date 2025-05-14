import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import DropdownPaginate from '@/layout/Admin/components/Dropdown/DropdownPaginate';
import DropdownAction from '@/layout/Admin/components/Dropdown/DropdownAction';
import DropdownPosition from './DropDownPosition';
import useDebounce from '@/hooks/useDebounce';
import CreateUserModal from '@/layout/Admin/components/Modal/CreateUserModal';
import PaginateCustom from '@/layout/Admin/components/Paginate/PaginateCustom';
import { getUser, getUserById } from "@/services/adminService";
import { useMutation } from '@/hooks/useMutation';
import { LINK, TABLE } from '@/constant/value';
import "./StaffManage.scss";
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Status from '@/layout/Admin/components/Status';
import { SkeletonTable } from '@/layout/Admin/pages/UserManage/Staff/SkeletonTable';

const StaffManage = () => {
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(10);
    let [listUser, setListUser] = useState([]);
    let [totalPages, setTotalPage] = useState(0);
    let [search, setSearch] = useState("");
    let [positionArr, setPositionArr] = useState([1, 3, 4, 5, 6, 7]);
    let [showCreateUserModal, setShowCreateUserModal] = useState(false);
    let [obUpdate, setObUpdate] = useState(null);
    let searchDebounce = "";
    let {
        data: dataUser,
        loading: loadingUser,
        execute: fetchUsers,
    } = useMutation((query) =>
        getUser(currentPage, rowsPerPage, searchDebounce, positionArr)
    )
    let refresh = () => {
        setShowCreateUserModal(false);
        setObUpdate(null);
        setSearch("");
        setCurrentPage(1);
        fetchUsers();
    }
    useEffect(() => {
        if (dataUser && dataUser.DT && dataUser.DT.rows && dataUser.DT) {
            let _listUser = [...dataUser.DT.rows];
            for (let i = 0; i < _listUser.length; i++) {
                _listUser[i].checked = false;
            }
            setListUser(_listUser);
            setTotalPage(dataUser.DT.count / rowsPerPage);
        }
    }, [dataUser])

    useEffect(() => {
        fetchUsers();
    }, [currentPage, useDebounce(search, 500), positionArr, rowsPerPage]);

    let handleChangePosition = (newArr) => {
        setPositionArr(newArr);
        setCurrentPage(1);
    }
    let handleChangePaginate = (item) => {
        setRowPaper(item);
        setCurrentPage(1);
    }
    searchDebounce = useDebounce(search, 500);
    let handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1)
    }
    const handleShow = (value) => {
        setShowCreateUserModal(value)
    }
    const hanldeCreateUser = () => {
        setObUpdate(null)
        setShowCreateUserModal(true)
    }
    const handleUpdate = async (item) => {
        let response = await getUserById(item.id);
        if (response?.EC == 0) {
            let value = response?.DT;
            setObUpdate(value)
            setShowCreateUserModal(true)
        } else {
            message.error(response?.EM || "Không thể chọn bệnh nhân")
            refresh();
        }
    }
    return (
        <>
            <div className='staff-manage'>
                <div className='container'>
                    <div className='first d-flex align-items-center justify-content-between py-3'>
                        <div className='text'>NHÂN VIÊN</div>
                        <button className=' py-1 px-2 btn-add-user' onClick={() => { hanldeCreateUser() }}>
                            <FontAwesomeIcon className='me-1 icon' icon={faPlus} style={{ color: "#0A8FDC", }} /> Thêm mới</button>
                    </div>

                    <div className='table-responsive bg-white '>
                        <div className='table-head d-flex align-items-center'>
                            <Input className='w-25 my-3 ms-4' size="large" placeholder="Tìm nhân viên" prefix={<SearchOutlined />}
                                value={search}
                                onChange={(event) => { handleChangeSearch(event) }} />
                        </div>
                        <div className='px-4'>
                            <table className='w-100'>
                                <thead>
                                    <tr className="header">
                                        <th scope="col" className="rounded-top-left text-center px-1 py-0">
                                            <div>#</div>
                                        </th>
                                        <th scope="col" className="text-center px-3 py-0 name">
                                            Họ và tên
                                        </th>
                                        <th scope="col" className="text-start px-3 py-0 ">
                                            Chức vụ <DropdownPosition onChange={handleChangePosition} />
                                        </th>
                                        <th scope="col" className="text-start px-1 py-0">
                                            Trình độ
                                        </th>
                                        <th scope="col" className="text-start px-1 py-0">
                                            Khoa
                                        </th>
                                        <th scope="col" className="text-center px-1 py-0 d-none d-lg-table-cell">
                                            Số điện thoại
                                        </th>
                                        <th scope="col" className="text-center px-1 py-0 d-none d-lg-table-cell">
                                            CCCD
                                        </th>
                                        <th scope="col" className="text-center px-1 py-0 d-none d-lg-table-cell">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="rounded-top-right px-1 py-0">
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='table-body text-secondary'>
                                    {loadingUser ? (
                                        // Hiệu ứng Skeleton cho danh sách loading
                                        <SkeletonTable />
                                    ) : listUser.length > 0 && totalPages !== 0 ? (
                                        listUser.map((item, index) => (
                                            <tr key={index} className="bg-white border-b text-start">
                                                <td className="text-center px-1 py-3">
                                                    {item?.id || "_"}
                                                </td>
                                                <td className="px-1 py-3 min-content-width g-0">
                                                    <img className="image" src={item?.avatar || LINK.AVATAR_NULL} alt="Jese image" />
                                                    <div className="ps-2 email">
                                                        <div className="fw-semibold">{item.lastName + " " + item.firstName}</div>
                                                        <div className="fw-normal">{item.email}</div>
                                                    </div>
                                                </td>
                                                <td className="text-start px-3 py-3">
                                                    {item?.userRoleData?.name || "Khác"}
                                                </td>
                                                <td className="text-start px-1 py-3 text-truncate text-nowrap">
                                                    {item?.staffUserData?.position || "Khác"}
                                                </td>
                                                <td className="text-start px-1 py-3">
                                                    {item?.staffUserData?.staffDepartmentData?.name || "Khác"}
                                                </td>
                                                <td className="text-start line px-1 py-3 d-none d-lg-table-cell">
                                                    {item?.phoneNumber || "Không có"}
                                                </td>
                                                <td className="text-start line px-1 py-3 d-none d-lg-table-cell">
                                                    {item?.cid || "Không có"}
                                                </td>
                                                <td className="text-start px-1 py-3 d-none d-lg-table-cell">
                                                    <Status data={item?.status} />
                                                </td>
                                                <td className="px-1 py-3">
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <span className="text-gray-500">Không có dữ liệu</span>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                        <div className='footer-table d-flex justify-content-end mx-2'>
                            <div className='select-page'>
                                <DropdownPaginate
                                    page={rowsPerPage}
                                    setPage={handleChangePaginate} />
                            </div>
                            <PaginateCustom totalPageCount={totalPages}
                                setPage={setCurrentPage} />
                        </div>
                    </div>
                </div >
                <CreateUserModal
                    show={showCreateUserModal}
                    isShow={handleShow}
                    obUpdate={obUpdate}
                    refresh={refresh}
                    table={TABLE.USER}
                    key={obUpdate ? obUpdate.id + " " + Date.now() : "modal-closed"} />
            </div >
        </>


    )
}

export default StaffManage