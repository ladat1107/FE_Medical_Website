import React from "react";
import Container from "@/components/Container";
import Banner from "./Banner";
import DepartmentInfo from "./DepartmentInfo";
import userService from "@/services/userService";
import useQuery from "@/hooks/useQuery";

const DepartmentList = () => {
  const {
    data: departmentData,
    loading: departmentLoading,
  } = useQuery(() => userService.getDepartment());
  const departmentList = departmentData?.DT || [];
  return (
    <div>
      <Banner />
      <div className="bg-bgHomePage" >
        <Container>
          <DepartmentInfo departmentLoading={departmentLoading} departmentList={departmentList} />
        </Container>
      </div>
    </div>
  );
};

export default DepartmentList;
