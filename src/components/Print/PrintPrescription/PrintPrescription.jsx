import { useEffect, useState } from "react";
import "./PrintPrescription.scss"
import { getExaminationById } from "@/services/doctorService";
import { message } from "antd";
import { convertDateTime, convertDateTimeToString, formatDate } from "@/utils/formatDate";
import { apiService } from "@/services/apiService";
import { useLocation, useParams } from "react-router-dom";
import Loading from "@/components/Loading/Loading";

const PrintPrescription = () => {
  let { id } = useParams();
  let location = useLocation();
  let [prescription, setPrescription] = useState(null);
  useEffect(() => {
    if (id) {
      fetchPrescription(id);
    }
  }, [location]);
  useEffect(() => {
    if (prescription?.id) {
      window.print();
    }
  }, [prescription])
  const fetchPrescription = async (id) => {
    const response = await getExaminationById(id);
    if (response && response.EC === 0) {
      let dataAddress = response.DT.userExaminationData?.currentResident?.split("%") || [];
      let address = dataAddress.length > 0 ? dataAddress[0] : "";
      if (dataAddress.length > 1) {
        let fullAddress = await apiService.getFullAddress(dataAddress[1]);
        if (fullAddress.error === 0) {
          address += ", " + fullAddress.data.full_name;
        }
      }
      let dataCustom = { ...response.DT, address: address };
      setPrescription(dataCustom);
    } else {
      message.error("Lỗi khi lấy dữ liệu đơn thuốc");
    }
  };

  return (
    <div className="print-prescription">
      {prescription ?
        <div className="prescription">

          <div className="prescription__header">
            <h1>BỆNH VIỆN HOA SEN</h1>
            <p>Cơ sở 215 Hồng Bàng, Phường 11, Quận 5, TP.HCM</p>
            <p>Điện thoại: 0353366459</p>
          </div>

          <h2 className="prescription__title">ĐƠN THUỐC</h2>

          <div className="prescription__info">
            <div className="prescription__row">
              <b>Họ tên: </b>
              <span className="label-name">{prescription?.userExaminationData?.lastName || "BỆNH NHÂN "} {prescription?.userExaminationData?.firstName || "A"}</span>
            </div>

            <div className="prescription__row prescription__row--multi">
              <div>
                <span className="prescription__label">Ngày sinh:</span>
                <span>{convertDateTime(prescription?.userExaminationData?.dob || "")}</span>
              </div>
              <div>
                <span className="prescription__label">Cân nặng:</span>
                <span>{prescription?.examinationVitalSignData?.weight || ""}</span>
              </div>
              <div>
                <span className="prescription__label">Giới tính:</span>
                <span>{prescription?.userExaminationData?.gender === 0 ? "Nam" : "Nữ"}</span>
              </div>
            </div>
            <div className="prescription__row">
              <span className="prescription__label">Số thẻ bảo hiểm y tế (nếu có):</span>
              <span>{prescription?.insuranceCode || ""}</span>
            </div>

            <div className="prescription__row">
              <span className="prescription__label">Địa chỉ liên hệ:</span>
              <span>{prescription?.address || ""}</span>
            </div>

            <div className="prescription__row">

              <span>
                <b>Chuẩn đoán: </b>
                {prescription?.diseaseName || ""}; {prescription?.comorbidities || ""}
              </span>
            </div>
          </div>

          <div className="prescription__medications">
            <div className="prescription__label">Thuốc điều trị:</div>
            <ol>
              {prescription?.prescriptionExamData[0]?.prescriptionDetails?.map((item, index) =>
                <li key={index}>
                  <div className="prescription__med-name">
                    {item?.name || "Tên thuốc"}
                  </div>
                  <div className="prescription__med-dosage">
                    {/* <span>Uống ngày 2 lần (Sáng, Chiều), mỗi lần 1 viên</span> */}
                    <span>{item?.PrescriptionDetail?.dosage || "Cách dùng"}</span>
                    <span>{item?.PrescriptionDetail?.quantity} {item?.PrescriptionDetail?.unit || "Viên"}</span>
                  </div>
                </li>
              )}
            </ol>
          </div>

          <div className="prescription__notes">
            <b>Lời dặn: </b>
            {prescription?.prescriptionExamData[0]?.note || ""}
          </div>

          <div className="prescription__footer">
            <div className="prescription__date">Ngày {convertDateTimeToString(prescription?.dischargeDate || "")}</div>
            <div className="prescription__signature">
              <p>Bác sĩ/Y sĩ khám bệnh</p>
              <p className="prescription__signature-note">(Ký, ghi rõ họ tên)</p>
              <div className="prescription__doctor">{prescription?.examinationStaffData?.position || "YS"}. {prescription?.examinationStaffData?.staffUserData?.lastName + " " + prescription?.examinationStaffData?.staffUserData?.firstName}</div>
            </div>
          </div>

          <div className="prescription__footnote">
            <p>- Khám lại xin mang theo đơn này.</p>
            <p>- Số điện thoại liên hệ:</p>
          </div>
        </div>
        :
        <Loading />}
    </div>
  )
}

export default PrintPrescription;

