import React, { useEffect, useState } from 'react';

const MoneyInput = ({value, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestedValue, setSuggestedValue] = useState('');

    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(value).replace(/₫/g, '')
            .trim();
    };

    useEffect(() => {
        setInputValue(value?.toString() || "");
    }, [value]);

    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
        setInputValue(rawValue);

        if (rawValue && rawValue.length <= 1) {
            const suggestion = `${rawValue}000000`;
            setSuggestedValue(formatCurrency(suggestion));
        } else if (rawValue && rawValue.length <= 2) {
            const suggestion = `${rawValue}00000`;
            setSuggestedValue(formatCurrency(suggestion));
        } else if (rawValue && rawValue.length <= 4) {
            const suggestion = `${rawValue}0000`;
            setSuggestedValue(formatCurrency(suggestion));
        } else if (rawValue && rawValue.length <= 5) {
            const suggestion = `${rawValue}000`;
            setSuggestedValue(formatCurrency(suggestion));
        } else if (rawValue && rawValue.length <= 6) {
            const suggestion = `${rawValue}00`;
            setSuggestedValue(formatCurrency(suggestion));
        } else {
            setSuggestedValue('');
        }

        if (onChange) {
            onChange(rawValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab' && suggestedValue) {
            e.preventDefault();
            // Lấy giá trị số thô từ suggestedValue
            const rawSuggestedValue = suggestedValue.replace(/\D/g, '');
            setInputValue(rawSuggestedValue);
            setSuggestedValue('');
            
            // Quan trọng: Gọi onChange để thông báo cho component cha
            if (onChange) {
                onChange(rawSuggestedValue);
            }
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
            <input
                type="text"
                value={formatCurrency(inputValue)}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Nhập số tiền..."
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    outline: 'none',
                }}
            />
            {suggestedValue && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        background: '#f9f9f9',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'gray',
                        fontStyle: 'italic',
                        fontWeight: '400',
                        zIndex: 1000,
                    }}
                >
                    {suggestedValue} VNĐ
                </div>
            )}
        </div>
    );
};

export default MoneyInput;

