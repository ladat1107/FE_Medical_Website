import React, { memo, useMemo } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import './EnhancedSelectBox.scss';

const EnhancedSelectBox = memo(({
  placeholder,
  options,
  value,
  onChange,
  disabled,
  className
}) => {

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const customOptionRender = (option) => {
    const optionData = option.data || option;
    
    return (
      <div className="enhanced-option">
        <div className="option-label">{optionData.label}</div>
        <div className="option-details">
            <span className="batch">Lô: {optionData.batchNumber || "N/A"}</span>
            <span className="inventory">Số lượng: {optionData.inventory || 0}</span>
            <span className="expiry">HSD: {formatDate(optionData.exp)}</span>
        </div>
      </div>
    );
  };

  // Find the selected option object based on value
  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value);
  }, [options, value]);

  return (
    <Select
      className={`enhanced-select ${className || ''}`}
      placeholder={placeholder}
      showSearch
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      optionRender={customOptionRender}
      listHeight={250}
      virtual={true}
    />
  );
});

EnhancedSelectBox.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

EnhancedSelectBox.displayName = 'EnhancedSelectBox';

export default EnhancedSelectBox;