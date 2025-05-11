import React, { useEffect } from "react";
import Container from "@/components/Container";
import DoctorDetailHeader from "./DoctorDetailHeader";
import DoctorDetailBody from "./DoctorDetailBody";
import DoctorRelated from "./DoctorRelated";
import { useLocation, useParams } from "react-router-dom";
import userService from "@/services/userService";
import { useMutation } from "@/hooks/useMutation";
import DoctorDetailSkeleton from "./DoctorDetailSkeleton";

const DoctorDetail = () => {
  let { id } = useParams();
  let location = useLocation();
  const {
    data: doctorData,
    loading: doctorLoading,
    execute: getDoctorDetail,
  } = useMutation(() => userService.getDoctorDetail({ id }));
  const doctor = doctorData?.DT || null;
  const {
    data: handbookData,
    loading: handbookLoading,
    execute: getHandbook,
  } = useMutation(() => userService.getHandbook({ departmentId: doctor?.staffUserData?.departmentId }));
  const {
    data: doctorListData,
    loading: doctorListLoading,
    execute: getDoctorList,
  } = useMutation(() => userService.getDoctor({ departmentId: doctor?.staffUserData?.departmentId }));
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (doctor?.staffUserData?.departmentId) {
      getHandbook();
      getDoctorList();
    }
  }, [doctor])
  useEffect(() => {
    if (id) {
      getDoctorDetail();
    }
  }, [location]);
  const handbook = handbookData?.DT?.length > 0 ? handbookData.DT : [{}];
  const doctorList = doctorListData?.DT?.length > 0 ? doctorListData.DT : [{}];
  return (
    <div className="bg-bgHomePage py-10" >
      {doctorLoading || !doctor ? <DoctorDetailSkeleton /> :
        doctor && handbook.length > 0 && doctorList.length > 0 &&
        <Container>
          <DoctorDetailHeader data={doctor} />
          <DoctorDetailBody data={doctor} handbook={handbook} />
          <div className="mt-5"></div>
          {doctorList.length > 0 &&
            <DoctorRelated doctorList={doctorList} />}
        </Container>
      }
    </div>
  );
};

export default DoctorDetail;
