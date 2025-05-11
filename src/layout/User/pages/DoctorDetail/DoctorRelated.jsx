

import React from 'react'
import { DoctorSwiper } from '@/components/Swiper';
const DepartmentRelated = (props) => {
  const { doctorList } = props;

  return (
    <div>
      <div className='text-2xl font-bold mb-4 text-primary-tw' >Bác sĩ cùng chuyên khoa</div>
      <DoctorSwiper doctorList={doctorList} />
    </div>
  )
}

export default DepartmentRelated;