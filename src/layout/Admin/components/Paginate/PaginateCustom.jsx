import React from 'react';
import { Pagination } from 'antd';
import './PaginateCustom.css'; // Tailwind can't override AntD deeply

const PaginateCustom = ({ currentPage, totalPageCount, setPage }) => {
    return (
        <div className="flex justify-center my-5">
            <Pagination
                current={currentPage}
                total={totalPageCount * 10}
                pageSize={10}
                showSizeChanger={false}
                onChange={(page) => setPage(page)}
                className="custom-ant-pagination"
            />
        </div>
    );
};

export default PaginateCustom;
