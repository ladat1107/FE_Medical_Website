import React, { useState } from 'react';
import './RadioButton.scss';
import PropTypes from 'prop-types';

const RadioButtonList = ({value, handleChangePrioritize}) => {
    //console.log('Initial value:', value);
    const [selectedOption, setSelectedOption] = useState(value);

    const handleChange = (event) => {
        const newValue = event.target.value;
        setSelectedOption(newValue);
        handleChangePrioritize(newValue);
    };

    return (
        <div className='radio-add-exam'>
            <div className="radio-inputs" style={{padding: '2px'}}>
                <label className="radio me-1">
                    <input
                        type="radio"
                        name="radio"
                        value="normal"
                        checked={selectedOption === 'normal'}
                        onChange={handleChange}
                    />
                    <span className="name" style={{height: '35px'}}>Không</span>
                </label>
                <label className="radio me-1">
                    <input
                        type="radio"
                        name="radio"
                        value="old"
                        checked={selectedOption === 'old'}
                        onChange={handleChange}
                    />
                    <span className="name" style={{height: '35px'}}>Người già</span>
                </label>

                <label className="radio me-1">
                    <input
                        type="radio"
                        name="radio"
                        value="children"
                        checked={selectedOption === 'children'}
                        onChange={handleChange}
                    />
                    <span className="name" style={{height: '35px'}}>Trẻ em</span>
                </label>

                <label className="radio me-1">
                    <input
                        type="radio"
                        name="radio"
                        value="disabled"
                        checked={selectedOption === 'disabled'}
                        onChange={handleChange}
                    />
                    <span className="name" style={{height: '35px'}}>Người khuyết tật</span>
                </label>

                <label className="radio me-1">
                    <input
                        type="radio"
                        name="radio"
                        value="pregnant"
                        checked={selectedOption === 'pregnant'}
                        onChange={handleChange}
                    />
                    <span className="name" style={{height: '35px'}}>Phụ nữ có thai</span>
                </label>
            </div>
        </div>
    );
};
RadioButtonList.propTypes = {
  value: PropTypes.string.isRequired,
  handleChangePrioritize: PropTypes.func.isRequired,
};

export default RadioButtonList;
