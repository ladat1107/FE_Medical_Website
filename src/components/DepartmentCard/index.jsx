

import React from 'react'
import "./department.scss";
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constant/path';

const DepartmentCard = ({ id, image, address, name, shortDescription }) => {
  let navigate = useNavigate()
  return (
    <div className='departmentCard'  >
      <div className='wrapper' >
        <div className='img' >
          <img src={image || "https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%3A5000%2Fstatic%2Fimages%2Fbinhthanhhcm%2Fweb%2Flogo.png%3Ft%3DTue%2520Sep%252013%25202022%252010%3A08%3A08%2520GMT%2B0700%2520(Indochina%2520Time)&w=256&q=75"} alt="" />

        </div>
        <h4 className='departmentCard-title' >{name}</h4>
        <p className='short-department'>{shortDescription || "Eum qui, provident ut deleniti obcaecati expedita, ipsam repellat repellendus culpa"} </p>
      </div>
      <div className='departmentCard-btn' onClick={() => { navigate(PATHS.HOME.DEPARTMENT_DETAIL + "/" + id) }} >Tìm hiểu thêm</div>
    </div>
  )
}

export default DepartmentCard