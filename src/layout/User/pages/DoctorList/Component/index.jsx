import React from 'react';
import { FaDollarSign, FaUserCheck, FaStar, FaStethoscope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constant/path';
import { primaryColorHome } from '@/styles/variables';

const DoctorCard = ({ id, avatar, name, specialty, price, visits, rating }) => {
  let navigate = useNavigate();
  const avtTest = avatar || 'https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fmedpro-production%2Fdigimed%2Fdoctors%2F1712976261086-BS_THUY_VAN.png&w=1920&q=75'
  return (
    <div className="flex bg-white flex-col items-center justify-center h-[450px] w-[270px] rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <img src={avtTest} alt={`${name}'s avatar`} className="w-[170px] h-[170px] m-4 object-cover rounded-full transition-transform duration-300 hover:scale-105" />
      <h4 className="text-lg font-semibold text-gray-800 m-0">{name}</h4>
      <div className="pt-3 px-3 pb-2 w-[80%] ">
        <p className="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <FaStethoscope color={primaryColorHome} /> Khoa: <span title={specialty || "Đa khoa"}
            className='overflow-hidden whitespace-nowrap text-ellipsis'>{specialty || "Đa khoa"}</span>
        </p>
        <div className="text-base text-gray-600">
          <p className="flex items-center gap-2 mb-1">
            <FaDollarSign color={primaryColorHome} /> Giá khám: {price}
          </p>
          <p className="flex items-center gap-2 mb-1">
            <FaUserCheck color={primaryColorHome} /> Lượt khám: {visits}
          </p>
          <p className="flex items-center gap-2 mb-1">
            <FaStar color={primaryColorHome} /> Đánh giá: {rating} ⭐
          </p>
        </div>
      </div>
      <div className='w-[80%] bg-primary-tw text-white text-center py-2 rounded-lg cursor-pointer hover:bg-primary-tw/80 transition-all duration-300' onClick={() => { navigate(PATHS.HOME.DOCTOR_DETAIL + "/" + id) }}>Xem chi tiết</div>
    </div>
  );
};

export default DoctorCard;
