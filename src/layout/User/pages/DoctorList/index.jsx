import React from "react";
import Container from "@/components/Container";
import Banner from "./Banner";
import DoctorInfo from "./DoctorInfo";

const DoctorList = () => {
  return (
    <div>
      <Banner />
      <div className="bg-bgHomePage py-8">
        <Container>
          <DoctorInfo />
        </Container>
      </div>
    </div>
  );
};

export default DoctorList;