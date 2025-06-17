

import React from 'react'
import { DoctorSwiper } from '@/components/Swiper';
const DepartmentRelated = (props) => {
  const { doctorList, doctorListLoading } = props;

  return (
    <div>
      <div className='text-2xl font-bold mb-4 text-primary-tw' >Bác sĩ cùng chuyên khoa</div>
      <DoctorSwiper doctorList={doctorList} loading={doctorListLoading} />
    </div>
  )
}

export default DepartmentRelated;