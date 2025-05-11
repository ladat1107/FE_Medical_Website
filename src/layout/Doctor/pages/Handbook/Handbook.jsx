import './Handbook.scss'
import { Input, Pagination, Select, Skeleton } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { act, useEffect, useState } from "react";
import { STATUS_HOSPITAL, TAGS } from "@/constant/value";
import { useMutation } from "@/hooks/useMutation";
import useDebounce from "@/hooks/useDebounce";
import HandbookItem from "@/components/HandbookItem";
import { getAllHandbooks } from '@/services/doctorService';
import CreateHandbook from './CreateHandbook/CreateHandbook';
import { useSelector } from 'react-redux';
import HandbookItemSkeleton from '@/components/HandbookItem/HandbookItemSkeleton';
const statusArray = Object.values(STATUS_HOSPITAL);
statusArray.unshift({ value: "", label: "Tất cả" });
const Handbook = () => {
    const [action, setAction] = useState(1);
    let { user } = useSelector(state => state.authen);
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(12);
    let [totalPages, setTotalPage] = useState(0);
    let [listHandbook, setListHandbook] = useState([]);
    let [search, setSearch] = useState("");
    let [status, setStatus] = useState(statusArray[0]);
    let searchDebounce = "";
    let [idUpdate, setIdUpdate] = useState(null);
    const [filter, setFilter] = useState([]);
    const [allTags, setAllTags] = useState([]);
    let {
        data: dataHandbook,
        loading: listHandbookLoading,
        execute: fetchHandbooks,
    } = useMutation((query) => getAllHandbooks(currentPage, rowsPerPage, searchDebounce,filter.join(','), status.value))
    
    useEffect(() => {
        if (dataHandbook && dataHandbook.EC === 0) {
            let handbook = dataHandbook.DT.handBooks;
            for (let i = 0; i < handbook.length; i++) {
                let status = statusArray.find((item) => item.value === handbook[i]?.status);
                handbook[i].statusLabel = status?.label;
            }
            setListHandbook(handbook);
            setTotalPage(dataHandbook.DT.totalItems);
        }
    }, [dataHandbook])
    useEffect(() => {
        if (action === 1) {
            fetchHandbooks();
        }
    }, [currentPage, useDebounce(search, 500), rowsPerPage, status, filter]);
    useEffect(() => {
        const selectedTags = allTags.filter(tag => tag.checked).map(tag => tag.label);
        setFilter(selectedTags); // Sử dụng setActiveTags thay vì push trực tiếp
    }, [allTags]);
    useEffect(() => {
        let _tags = [...TAGS]
        for (let i = 0; i < _tags.length; i++) {
            _tags[i].checked = false;
        }
        setAllTags(_tags);
    }, []);
    useEffect(() => {
        if (idUpdate) {
            setAction(2);
        } else {
            setAction(1);
        }
    }, [idUpdate]);
    searchDebounce = useDebounce(search, 500);
    let handleChangeSearch = (event) => {
        setSearch(event.target.value);
    }

    const handleTagClick = (item) => {
        setAllTags(prevTags =>
            prevTags.map(tag =>
                tag.value === item.value ? { ...tag, checked: !tag.checked } : tag
            )
        );
    };

    const refresh = () => {
        let _tags = [...TAGS]
        for (let i = 0; i < _tags.length; i++) {
            _tags[i].checked = false;
        }
        setAllTags(_tags);
        setSearch("");
        setStatus(statusArray[0]);
        setFilter([]);
        setIdUpdate(null);
        fetchHandbooks();
    }
    return (
        <>
            <div className="handbook-container">
                <div className='header-handbook'>
                    <div className="d-flex justify-content-between align-items-center">
                        {!listHandbookLoading && <div className='text'>Cẩm nang</div>}
                        {listHandbookLoading ? <Skeleton.Button style={{ width: '100%' }} active={true} /> :
                            <div>
                                {action === 1 ?
                                    <button className='button' onClick={() => { setAction(2), refresh() }}><i className="fa-solid fa-plus"></i>Thêm mới</button> :
                                    <button className='button' onClick={() => { setAction(1), refresh() }}> <i className="fa-solid fa-arrow-left"></i>Hủy bỏ</button>
                                }
                            </div>}
                    </div>
                    {listHandbookLoading ? <Skeleton style={{ width: '100%' }} active={true} /> :
                        <div className='my-3'> Cẩm nang sức khỏe cung cấp những thông tin hữu ích về các bệnh lý thường gặp, quy trình khám chữa bệnh, hướng dẫn chăm sóc sức khỏe hằng ngày, và những lưu ý quan trọng trong việc phòng ngừa bệnh, giúp người dùng tự tin và chủ động hơn trong việc bảo vệ sức khỏe bản thân và gia đình.</div>
                    }
                </div>
                <div className="row d-flex flex-lg-row-reverse justify-content-between align-items-start mt-4">
                    <div className="ps-3 pb-3 col-12 col-lg-3">
                        {listHandbookLoading ? <Skeleton style={{ width: '100%' }} active={true} /> :
                            <div className="filter p-3">
                                {action === 1 && <>
                                    <div>
                                        <div className=""> Trạng thái </div>
                                        <Select
                                            className="w-100 mt-3"
                                            placeholder="Chọn trạng thái"
                                            labelInValue
                                            options={statusArray}
                                            value={status}
                                            onChange={(selected) => setStatus({ value: selected.value, label: selected.label })}
                                        />
                                        <Input placeholder="Tìm kiếm cẩm nang" prefix={<SearchOutlined />} className="mt-3"
                                            value={search}
                                            onChange={(event) => { handleChangeSearch(event) }} />
                                    </div>
                                    <hr />
                                </>}
                                <div>
                                    <div>Tag</div>
                                    <div>
                                        <div className="list-tag tag-box mt-3">
                                            {allTags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className={`tag-item ${tag.checked ? 'active' : ''}`}
                                                    onClick={() => { handleTagClick(tag) }}>
                                                    <p>{tag?.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>
                    {action === 1 &&
                        <div className="col-12 col-lg-9">
                            <div className="row">
                                {
                                    listHandbookLoading ? (<HandbookItemSkeleton />) :
                                        listHandbook.length > 0 ? listHandbook.map((item, index) => (
                                            <HandbookItem
                                                key={index}
                                                data={item}
                                                index={index}
                                                handleUpdate={(id) => { setIdUpdate(id) }} />))
                                            : <div className="text-center w-100 mt-5">Không có dữ liệu</div>}
                            </div>
                        </div>}
                    {action === 2 && (
                        <div className="col-12 col-lg-9">
                            <CreateHandbook
                                handbookId={idUpdate}
                                allTags={allTags}
                                setAllTags={(tags) => setAllTags(tags)}
                                refresh={refresh}
                            // key={idUpdate ? idUpdate + " " + Date.now() : "modal-closed"}
                            />
                        </div>
                    )}
                </div>
                <div className='row'>
                    <Pagination align="center"
                        onChange={(page) => setCurrentPage(page)}
                        defaultCurrent={currentPage}
                        total={totalPages} />
                </div>
            </div>
        </>
    );
}

export default Handbook;