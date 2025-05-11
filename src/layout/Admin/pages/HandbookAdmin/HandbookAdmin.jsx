import HandbookItem from "@/components/HandbookItem";
import "./HandbookAdmin.scss";
import { Input, Pagination, Select } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { STATUS_HOSPITAL, TAGS } from "@/constant/value";
import { useMutation } from "@/hooks/useMutation";
import useDebounce from "@/hooks/useDebounce";
import { getHandbookAdmin } from "@/services/adminService";
import HandbookItemSkeleton from "@/components/HandbookItem/HandbookItemSkeleton";
const statusArray = Object.values(STATUS_HOSPITAL);
statusArray.unshift({ value: "", label: "Tất cả" });
const HandbookAdmin = () => {
    let [currentPage, setCurrentPage] = useState(1);
    // let [rowsPerPage, setRowPaper] = useState(10);
    let [totalPages, setTotalPage] = useState(0);
    let [listHandbook, setListHandbook] = useState([]);
    let [search, setSearch] = useState("");
    let [status, setStatus] = useState(statusArray[3]);
    let searchDebounce = "";
    const [filter, setFilter] = useState([]);
    const [allTags, setAllTags] = useState(() => {
        let _tags = [...TAGS]
        for (let i = 0; i < _tags.length; i++) {
            _tags[i].checked = false;
        }
        return _tags;
    });
    let {
        data: dataHandbook,
        loading: listHandbookLoading,
        execute: fetchHandbooks,
    } = useMutation((query) => getHandbookAdmin(currentPage, 12, searchDebounce, status.value, filter.join(',')))
    useEffect(() => {
        if (dataHandbook && dataHandbook.DT && dataHandbook.DT.rows && dataHandbook.DT) {
            let handbook = dataHandbook.DT.rows;
            for (let i = 0; i < handbook.length; i++) {
                let status = statusArray.find((item) => item.value === handbook[i]?.status);
                handbook[i].statusLabel = status?.label;
            }
            setListHandbook(handbook);
            setTotalPage(dataHandbook.DT.count);
        }
    }, [dataHandbook])
    useEffect(() => {
        fetchHandbooks();
    }, [currentPage, useDebounce(search, 500), status, filter]);
    searchDebounce = useDebounce(search, 500);
    let handleChangeSearch = (event) => {
        setSearch(event.target.value);
        // setCurrentPage(1)
    }
    const handleTagClick = (item) => {
        setAllTags(prevTags =>
            prevTags.map(tag =>
                tag.value === item.value ? { ...tag, checked: !tag.checked } : tag
            )
        );
    };
    useEffect(() => {
        const selectedTags = allTags.filter(tag => tag.checked).map(tag => tag.label);
        setFilter(selectedTags); // Sử dụng setActiveTags thay vì push trực tiếp
    }, [allTags]);
    return (
        <div className="admin-hanbook-content">
            <div className="container">
                <div className="row d-flex flex-lg-row-reverse justify-content-between align-items-start mt-4">
                    <div className="ps-3 pb-3 col-12 col-lg-3">
                        <div className="filter p-3">
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

                        </div>
                    </div>
                    <div className="col-12 col-lg-9 left-hanbook-admin">
                        <div className="row">
                            {
                                listHandbookLoading ? (<HandbookItemSkeleton />) :
                                    listHandbook.length > 0 ? listHandbook.map((item, index) => (<HandbookItem
                                        data={item}
                                        index={index} />))
                                        : <div className="text-center w-100 mt-5">Không có dữ liệu</div>}
                        </div>
                        <div>
                            {totalPages > 1 && <Pagination align="center"
                                onChange={(page) => setCurrentPage(page)}
                                defaultCurrent={currentPage}
                                total={totalPages} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default HandbookAdmin;