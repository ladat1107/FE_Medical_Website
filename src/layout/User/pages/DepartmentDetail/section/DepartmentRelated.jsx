

import React from 'react'
import { ROLE } from '@/constant/role';
import { DoctorSwiper } from '@/components/Swiper';

const DepartmentRelated = (props) => {
  let { listStaff } = props;
  listStaff = listStaff?.filter((item) => item?.staffUserData.roleId === ROLE.DOCTOR);
  return (
    <div className="flex flex-col items-center justify-center">
      {listStaff?.length > 0 && (
        <>
          <div className='text-2xl font-bold mb-4 text-secondaryText-tw' >BÁC SĨ CÙNG KHOA</div>
          <DoctorSwiper doctorList={listStaff} />
        </>
      )}
    </div>
  )
}

export default DepartmentRelated;