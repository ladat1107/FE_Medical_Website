import React from 'react';
import PropTypes from 'prop-types';
import { cutSuffix } from '@/utils/numberSeries';
import { updateExamination } from '@/services/doctorService';
import { message } from 'antd';
import './PatientItem.scss'
import { SOS } from '@/components/TypeFile/typefile';

const PatientItem = ({ index, id, name, symptom, special, doctor = '', room, visit_status, downItem, onClickItem, sort, status = 0, doctorHeader = 'Bác sĩ', isEmergency =false }) => {

  const handleDownItem = async (event) => {
    event.stopPropagation();
    try {
      const data = {
        id: id,
        visit_status: 1,
      }
      const response = await updateExamination(data);

      if (response.EC === 0 && response.DT.includes(1)) {
        message.success('Chuyển bệnh nhân thành công');
        downItem();
      } else {
        message.error('Chuyển bệnh nhân thất bại');
      }
    } catch (error) {
      console.error("Error:", error);
      message.error('Chuyển bệnh nhân thất bại');
    }
  }

  const SpecialText = ({ special }) => {
    // Xác định className dựa trên giá trị của special
    let specialClass = '';
    let specialText = '';

    switch (special) {
      case 'normal':
        specialClass = 'special';
        specialText = '';
        break;
      case 'old':
        specialClass = 'special-old';
        specialText = 'Người già';
        break;
      case 'children':
        specialClass = 'special-children';
        specialText = 'Trẻ em';
        break;
      case 'disabled':
        specialClass = 'special-disabled';
        specialText = 'Người tàn tật';
        break;
      case 'pregnant':
        specialClass = 'special-pregnant';
        specialText = 'P.nữ mang thai';
        break;
      default:
        specialClass = 'special'; // Nếu không có giá trị match, dùng class mặc định
    }

    return <p className={`special ${specialClass}`}>{specialText}</p>;
  };

  const handleClickItem = () => {
    onClickItem(id);
  }

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="patient-item mt-2 row text-start" style={{ paddingRight: 0 }} onClick={handleClickItem}>
      {/* <div className="col-1">
                <p>{index}</p>
            </div> */}
      <div className="col-5 row">
        <div className='col-2'>
          <p>{index}</p>
        </div>
        <div className='col-10'>
          <p className="bold-text">{name}</p>
          <p className="sub-text">
            {truncateText(
              symptom === 'examination'
                ? 'Dịch vụ: Khám bệnh'
                : symptom === 'paraclinical'
                  ? 'Dịch vụ: Cận lâm sàng'
                  : `${symptom}`,
              42 // Giới hạn ký tự tối đa
            )}
          </p>
        </div>
      </div>
      <div className="col-2 d-flex justify-content-center">
        {SpecialText({ special })}
      </div>
      <div className="col-2">
        {status === 0 ? 
          <>
            <p className="bold-text">{doctorHeader}</p>
            <p className="sub-text"> {doctor}  </p>
          </> : <>
            <p className="sub-text">
                { status === 4 ? "Đang thanh toán" 
                : status === 5 ? `Đang chờ khám` 
                : status === 6 ? `Đang khám bệnh`
                : `Đang ở đâu đó`}
            </p>
          </>
        }
      </div>
      <div className="col-3 row">
        <div className='col-10'>
          <p className="bold-text">{symptom === "paraclinical" ? "" : "Phòng khám bệnh"}</p>
          <p className="sub-text">{cutSuffix(room)}</p>
        </div>
        <div className="col-2 d-flex justify-content-end">
          {/* {visit_status === 0 && (
            <i className="fa-solid fa-forward-fast fa-rotate-90 color-down" onClick={(event) => handleDownItem(event)}></i>
          )} */}
          {isEmergency && (
            <div className="emergency-icon">
              <SOS/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
PatientItem.propTypes = {
  index: PropTypes.number,
  id: PropTypes.number,
  name: PropTypes.string,
  symptom: PropTypes.string,
  special: PropTypes.string,
  doctor: PropTypes.string,
  room: PropTypes.string,
  visit_status: PropTypes.number,
  downItem: PropTypes.func,
  onClickItem: PropTypes.func,
  sort: PropTypes.bool,
  status: PropTypes.number,
  doctorHeader: PropTypes.string,
  isEmergency: PropTypes.bool,
};
export default PatientItem;