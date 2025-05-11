

import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
import { Search } from 'lucide-react';
import PaginationUser from '@/components/Pagination/Pagination';
import HandbookCard from '@/components/HandbookItem/HandbookCard/HandbookCard';
const BodyBlogList = (props) => {
  let { listHandbook } = props;
  const [handbooks, setHandbooks] = useState(listHandbook || []);
  const [pageSize, setPageSize] = useState({ currentPage: 1, pageSize: 12 });

  const [search, setSearch] = useState('');
  useEffect(() => {
    let _handbooks = listHandbook;

    if (search) {
      _handbooks = _handbooks.filter((item) => {
        const fullName = item?.handbookStaffData?.staffUserData?.lastName + " " + item?.handbookStaffData?.staffUserData?.firstName;
        return (
          item.title.toLowerCase().includes(search.toLowerCase())
          || item.htmlDescription.toLowerCase().includes(search.toLowerCase())
          || item.tags.toLowerCase().includes(search.toLowerCase())
          || item.shortDescription.toLowerCase().includes(search.toLowerCase())
          || fullName.toLowerCase().includes(search.toLowerCase())
        )
      })
    }
    const startIndex = (pageSize.currentPage - 1) * pageSize.pageSize;
    const endIndex = startIndex + pageSize.pageSize;
    setHandbooks(_handbooks.slice(startIndex, endIndex));
  }, [search, pageSize.currentPage, pageSize.pageSize, listHandbook]);

  useEffect(() => {
    setPageSize({ ...pageSize, currentPage: 1 });
  }, [listHandbook]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageSize({ ...pageSize, currentPage: 1 });
  }
  return (
    <div className="my-16"  >
      <div className="flex justify-between items-center gap-3" >
        <span className="w-full block h-[2px] bg-primary-tw"></span>
        <h3 className="text-2xl font-bold whitespace-nowrap">DINH DƯỠNG HỢP LÝ</h3>
        <span className="w-full block h-[2px] bg-primary-tw"></span>
      </div>
      <div className="my-3">
        <Input
          onChange={handleSearch}
          prefix={<Search size={20} className='text-gray-400' />}
          placeholder="Tìm kiếm bài viết"
          className="w-full md:w-1/2 lg:w-1/3 rounded-full py-2"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {handbooks.map((item, index) => (
          <HandbookCard data={item} key={index} />
        ))}
      </div>
      <div>
        <PaginationUser
          currentPage={pageSize.currentPage}
          pageSize={pageSize.pageSize}
          total={listHandbook.length}
          handlePageChange={(page, size) => setPageSize({ currentPage: page, pageSize: size })}
        />
      </div>
    </div>
  )
}

export default BodyBlogList