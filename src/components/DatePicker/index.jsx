import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS cho DatePicker
import PropTypes from 'prop-types';
import './DatePicker.scss'; // Để thêm style nếu cần

const CustomDatePicker = ({ selectedDate, onDateChange, placeholder, disabled, isClearable = true }) => {
  return (
    <div className="date-picker">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        placeholderText={placeholder}
        className="input-date"
        dateFormat="dd/MM/yyyy" // Định dạng hiển thị ngày
        disabled={disabled} // Chặn chọn nếu disabled = true
        isClearable={isClearable}
      />
    </div>
  );
};

CustomDatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Ngày được chọn
  onDateChange: PropTypes.func,              // Hàm gọi khi ngày thay đổi
  placeholder: PropTypes.string,                          // Placeholder cho DatePicker
  disabled: PropTypes.bool,                                // Chặn chọn nếu disabled = true
  isClearable: PropTypes.bool,                             // Cho phép xóa ngày đã chọn
};

export default CustomDatePicker;
