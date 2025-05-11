import React, { useEffect, useState } from "react";
import DepartmentCard from "@/components/DepartmentCard";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constant/path";
import DeparmentCardSkeleton from "@/components/DepartmentCard/DeparmentCardSkeleton";
import { Input } from "antd";
import { Search } from "lucide-react";

const DepartmentInfo = (props) => {
  let [departmentList, setListDepartment] = useState(props?.departmentList);
  useEffect(() => {
    if (props.departmentList?.length > 0) {
      setListDepartment(props.departmentList);
    }
  }, [props.departmentList, props.departmentLoading])
  let [search, setSearch] = useState("");
  let navigate = useNavigate();
  const handleChangrSearch = (e) => {
    let _listDepartment = [...props?.departmentList];
    setSearch(e.target.value);
    if (e.target.value === "") {
      setListDepartment(_listDepartment);
      return;
    }
    let list = _listDepartment.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
    setListDepartment(list);
  }
  return (
    <div className="w-full py-10" >
      <div className="flex flex-col gap-4 w-full px-3">
        <Input
          type="text"
          className="w-full border-none outline-none !shadow-card-doctor focus:border-none focus:outline-none focus:shadow-none
          rounded-full px-3 h-11"
          placeholder="Tìm kiếm khoa"
          value={search}
          prefix={<Search className="text-gray-500 me-3" />}
          onChange={(e) => handleChangrSearch(e)}
        />
        <div className="flex justify-center items-center
         w-full">
          <div className="flex justify-between items-center gap-4 mt-3 w-full  sm:w-[90%] lg:w-[70%]">
            <div className="flex justify-center items-center bg-[#00e0ff] text-white px-3 py-2 rounded-full shadow-card-doctor cursor-pointer w-[48%] h-11 text-center
            hover:bg-[#00e0ff]/60 hover:scale-105 transition-all duration-300">Tư Vấn Ngay</div>
            <div className="flex justify-center items-center bg-white text-primary-tw border-2 border-primary-tw px-3 py-2 rounded-full shadow-card-doctor cursor-pointer w-[48%]  h-11 text-center
            hover:scale-105 transition-all duration-300" onClick={() => { navigate(PATHS.HOME.BOOKING) }}>Đặt lịch hẹn</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 mt-4" >
        {
          props.departmentLoading ?
            Array.from({ length: 12 }).map((_, index) => (
              <div
                className="flex flex-wrap justify-center items-center"
                key={index}>
                <DeparmentCardSkeleton />
              </div>))
            :
            departmentList?.length > 0 ? departmentList.map((item, index) => (
              <div
                className="flex flex-wrap justify-center items-center"
                key={index}>
                <DepartmentCard
                  id={item?.id}
                  image={item?.image}
                  name={item?.name}
                  shortDescription={item?.shortDescription}
                />
              </div>
            )) : <div>Không tìm thấy khoa</div>}
      </div>
    </div >
  );
};

export default DepartmentInfo;
