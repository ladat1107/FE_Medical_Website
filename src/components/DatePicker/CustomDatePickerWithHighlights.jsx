import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import './DatePicker.scss'; // Để thêm style nếu cần

const CustomDatePickerWithHighlights = ({ 
  selectedDate, 
  onDateChange, 
  placeholder, 
  disabled, 
  highlightDates = [] // Mảng các ngày cần highlight
}) => {
  const [formattedHighlightDates, setFormattedHighlightDates] = useState([]);

  // Chuyển đổi chuỗi ngày thành đối tượng Date
  useEffect(() => {
    if (highlightDates && highlightDates.length > 0) {
      const dates = highlightDates.map(item => new Date(item.date));
      setFormattedHighlightDates(dates);
    }
  }, [highlightDates]);

  // Hàm kiểm tra xem một ngày có nằm trong danh sách ngày highlight hay không
  const isHighlightedDate = (date) => {
    return formattedHighlightDates.some(highlightDate => 
      date.getDate() === highlightDate.getDate() && 
      date.getMonth() === highlightDate.getMonth() && 
      date.getFullYear() === highlightDate.getFullYear()
    );
  };

  // Hàm tạo class cho ngày trong calendar
  const getDayClassName = (date) => {
    return isHighlightedDate(date) ? "highlighted-date" : undefined;
  };

  return (
    <div className="date-picker">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        placeholderText={placeholder}
        className="input-date"
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        dayClassName={getDayClassName}
        // Có thể thêm thuộc tính này để ngay lập tức hiển thị các ngày được highlight
        highlightDates={formattedHighlightDates}
      />
    </div>
  );
};

CustomDatePickerWithHighlights.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  highlightDates: PropTypes.arrayOf(
    PropTypes.shape({
      roomId: PropTypes.number,
      date: PropTypes.string
    })
  )
};

export default CustomDatePickerWithHighlights;