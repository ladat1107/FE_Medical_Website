import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import './SelectBox.scss';

const SelectBox2 = ({ placeholder, options, value, onChange, disabled }) => (
  <Select
    showSearch
    style={{
      width: '100%',
    }}
    placeholder={placeholder}
    optionFilterProp="label"
    // Bỏ thuộc tính filterSort để không tự động sắp xếp kết quả tìm kiếm
    options={options} // Sử dụng trực tiếp mảng options ban đầu
    value={value}
    onChange={onChange} 
    disabled={disabled}
    allowClear 
  />
);

SelectBox2.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired, 
    value: PropTypes.any.isRequired, 
    price: PropTypes.number,       
    unit: PropTypes.string,         
  })).isRequired, 
  value: PropTypes.any,
  onChange: PropTypes.func,  
  disabled: PropTypes.bool,
};

export default SelectBox2;