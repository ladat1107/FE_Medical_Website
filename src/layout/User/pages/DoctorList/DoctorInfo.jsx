import React, { useEffect, useRef, useState } from "react";
import DoctorCard from "./Component";
import { formatCurrency } from "@/utils/formatCurrency";
import { useLocation, useNavigate } from "react-router-dom";
import PaginationUser from "@/components/Pagination/Pagination";
import userService from "@/services/userService";
import { useMutation } from "@/hooks/useMutation";
import useDebounce from "@/hooks/useDebounce";
import DoctorCardSkeleton from "./Component/DoctorCardSkeleton";
import useQuery from "@/hooks/useQuery";
import { Input, Select } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import "./doctorList.css";
const DoctorInfo = () => {
  let [pageSize, setPageSize] = useState({ currentPage: 1, pageSize: 12 });
  let [total, setTotal] = useState(0);
  let [doctorList, setDoctorList] = useState([]);
  let [search, setSearch] = useState('');
  let searchDebounce = useDebounce(search || "", 500);
  let [departmentId, setDepartmentId] = useState(null);
  let [specialtyId, setSpecialtyId] = useState(null);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const departmentIdUrl = params.get("departmentId");
  const specialtyIdUrl = params.get("specialtyId");
  const searchRef = useRef(null);
  const {
    data: doctorData,
    loading: doctorLoading,
    execute: getDoctor,
  } = useMutation(() => userService.getDoctor({ limit: pageSize.pageSize, page: pageSize.currentPage, search: searchDebounce, departmentId: departmentId, specialtyId: specialtyId }));
  const { data: listDepartment, loading: departmentLoading } = useQuery(() => userService.getDepartment());
  const { data: listSpecialty, loading: specialtyLoading } = useQuery(() => userService.getSpecialty());

  useEffect(() => {
    if (departmentIdUrl) {
      setDepartmentId(departmentIdUrl);
    }
    if (specialtyIdUrl) { setSpecialtyId(specialtyIdUrl); }
  }, [departmentIdUrl, specialtyIdUrl]);

  useEffect(() => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    getDoctor();
  }, [searchDebounce, pageSize.currentPage, pageSize.pageSize, departmentId, specialtyId]);

  useEffect(() => {
    if (doctorData?.EC === 0) {
      setDoctorList(doctorData?.DT?.rows || []);
      setTotal(doctorData?.DT?.count || 0);
    }
  }, [doctorData]);

  return (
    <div className="doctor-info">
      <div className="head-section">
        {!departmentLoading && !specialtyLoading &&
          <div className="flex flex-wrap justify-evenly w-full">
            <Input
              className="w-full sm:w-1/3 sm:mb-0 px-3 mb-3 py-1 rounded-full shadow-md border-none outline-none
              [&.ant-input-affix-wrapper]:h-[50px] "
              onChange={(e) => { setSearch(e.target.value), setPageSize({ ...pageSize, currentPage: 1 }) }}
              value={search}
              inputRef={searchRef}
              placeholder="Tìm kiếm bác sĩ" prefix={<SearchOutlined className="text-gray-400" />} />
            <div className="px-2 w-1/2 sm:w-1/3" >
              <div className="w-full flex justify-center items-center bg-white rounded-[30px] shadow-md h-[50px] ">
                <Select
                  className="w-full custom-antd-select ps-[12px]"
                  value={listDepartment?.DT?.find((item) => +item.id === +departmentId)?.name || undefined}
                  onChange={(value) => setDepartmentId(value)}
                  placeholder="Khoa"
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={listDepartment?.DT?.map((item) => ({ value: item.id, label: item.name, }))}
                />
              </div>
            </div>

            <div className="flex justify-center items-center w-1/2 sm:w-1/3 bg-white rounded-[30px] shadow-md sm:px-3 h-[50px] ">
              <Select
                className="w-full custom-antd-select"
                value={listSpecialty?.DT?.find((item) => +item.id === +specialtyId)?.name || undefined}
                onChange={(value) => setSpecialtyId(value)}
                placeholder="Chuyên khoa"
                showSearch
                allowClear
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={listSpecialty?.DT?.map((item) => ({ value: item.id, label: item.name, }))}
              />
            </div>
          </div>}
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {doctorLoading ?
          Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              <DoctorCardSkeleton />
            </div>))
          :
          doctorList?.length > 0 ? doctorList.map((item, index) => (
            <div key={index}>
              <DoctorCard
                id={item?.staffUserData?.id}
                avatar={item?.staffUserData?.avatar}
                name={(item?.staffUserData?.lastName.length + item?.staffUserData?.firstName.length) < 15 ? item?.staffUserData?.lastName + " " + item?.staffUserData?.firstName : item?.staffUserData?.firstName}
                specialty={item?.staffDepartmentData?.name}
                price={formatCurrency(item?.price || 0)}
                visits={item?.examinationStaffData?.length || 0}
                rating="4.8" />
            </div>
          )) : <div>Không tìm thấy bác sĩ</div>}
      </div>
      <div>
        <PaginationUser
          currentPage={pageSize.currentPage}
          pageSize={pageSize.pageSize}
          total={total}
          handlePageChange={(page, size) => setPageSize({ currentPage: page, pageSize: size })}
        />
      </div>
    </div>
  );
};

export default DoctorInfo;