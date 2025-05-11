import React from 'react';
import PropTypes from 'prop-types';
import './SelectBox.scss'; 

const SelectBox = ({ options, value, onChange, placeholder, disabled }) => {
  // Check if value is null, undefined, or should display placeholder
  const isPlaceholderVisible = value === null || value === undefined || value === '';
  
  return (
    <div className="select-box">
      <select 
        value={isPlaceholderVisible ? '' : value} 
        onChange={onChange} 
        className="select"
        disabled={disabled}
      >
        {placeholder && <option disabled value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

SelectBox.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.oneOf([null])
  ]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

// Default props to prevent errors when value is not provided
SelectBox.defaultProps = {
  disabled: false
};

export default SelectBox;