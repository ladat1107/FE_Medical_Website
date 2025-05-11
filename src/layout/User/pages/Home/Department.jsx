


import React from 'react'

import useQuery from '@/hooks/useQuery';
import userService from '@/services/userService';
import { DepartmentSwiper } from '@/components/Swiper';


const Department = () => {
  const {
    data: departmentData,
    loading: departmentLoading,
  } = useQuery(() => userService.getDepartment())

  const listDepartment = departmentData?.DT || []

  return (
    <div className="flex flex-col items-center justify-center mt-6" >
      <h3 className="text-3xl font-bold my-10 uppercase text-secondaryText-tw text-center" >DANH SÁCH CÁC KHOA CỦA CHÚNG TÔI</h3>
      <DepartmentSwiper departmentList={listDepartment} loading={departmentLoading} />
    </div>
  )
}

export default Department