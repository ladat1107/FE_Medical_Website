

import React from 'react'
import useQuery from '@/hooks/useQuery';
import userService from '@/services/userService';
import { DoctorSwiper } from '@/components/Swiper';

const OurTeam = () => {
  const {
    data: doctorData,
    loading: doctorLoading,
    error: doctorError
  } = useQuery(() => userService.getDoctor())

  const listDoctor = doctorData?.DT || [];
  return (
    <div className='flex flex-col items-center justify-center mt-6 md:mt-16 pb-16'>
      <h3 className=" text-2xl md:text-3xl px-4 md:px-0 font-bold my-6 md:my-10 text-secondaryText-tw" >
        ĐỘI NGŨ BÁC SĨ
      </h3>
      <DoctorSwiper doctorList={listDoctor} loading={doctorLoading} />
    </div>
  )
}

export default OurTeam