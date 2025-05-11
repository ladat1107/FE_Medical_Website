import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const FreeTextInputWithSuggestions = ({ 
  options = [], 
  placeholder = "Nhập văn bản...", 
  onChange, 
  value, 
  className = "",
  disabled,
  maxSuggestions = 5,
  optionLabelKey = null, // Trường để hiển thị nếu option là object
  optionValueKey = null  // Trường để lưu giá trị nếu option là object
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Hàm để lấy text từ option (xử lý cả trường hợp option là object hoặc chuỗi)
  const getOptionText = (option) => {
    if (option === null || option === undefined) return '';
    
    if (typeof option === 'string') {
      return option;
    } else if (typeof option === 'number') {
      return String(option);
    } else if (typeof option === 'object' && optionLabelKey) {
      return option[optionLabelKey] || '';
    }
    
    return String(option);
  };

  // Hàm để lấy giá trị từ option
  const getOptionValue = (option) => {
    if (option === null || option === undefined) return '';
    
    if (typeof option === 'object' && optionValueKey) {
      return option[optionValueKey];
    }
    
    return option;
  };

  // Lọc options dựa trên giá trị input
  useEffect(() => {
    if (inputValue) {
      const filtered = options
        .filter(option => {
          const optionText = getOptionText(option).toLowerCase();
          return optionText.includes(String(inputValue).toLowerCase());
        })
        .slice(0, maxSuggestions);
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options.slice(0, maxSuggestions));
    }
  }, [inputValue, options, maxSuggestions, optionLabelKey]);

  // Xử lý click ngoài dropdown để đóng nó
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    setShowSuggestions(true);
  };

  const handleOptionClick = (option) => {
    const optionText = getOptionText(option);
    const optionValue = getOptionValue(option);
    
    setInputValue(optionText);
    if (onChange) {
      // Trả về giá trị hoặc toàn bộ object tùy theo cách cài đặt
      onChange(optionValueKey ? optionValue : optionText, option);
    }
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`input w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        style={{ zIndex: 1 }}
      />
      
      {showSuggestions && filteredOptions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {getOptionText(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
FreeTextInputWithSuggestions.propTypes = {
    options: PropTypes.array,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    maxSuggestions: PropTypes.number,
    optionLabelKey: PropTypes.string,
    optionValueKey: PropTypes.string,
};

export default FreeTextInputWithSuggestions;