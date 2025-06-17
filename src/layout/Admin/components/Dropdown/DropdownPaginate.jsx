import React, { useState, useEffect } from 'react';
import { Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
const DropdownPaginate = (props) => {
    const [selectedLabel, setSelectedLabel] = useState(10);

    useEffect(() => {
        if (props.page) {
            setSelectedLabel(props.page);
        }
    }, [props.page]);

    let handleChange = (value) => {
        props.setPage(value);  // Trả về key
        setSelectedLabel(value); // Cập nhật label
    };

    let items = [
        {
            label: "10",
            key: '1',
            onClick: () => { handleChange(10) }
        },
        {
            label: "25",
            key: '2',
            onClick: () => { handleChange(25) }
        },
        {
            label: "50",
            key: '3',
            onClick: () => { handleChange(50) }
        },
        {
            label: "100",
            key: '4',
            onClick: () => { handleChange(100) }
        }
    ]

    return (
        <div className='me-3'>
            Hiển thị <span className='ms-2'><b> {selectedLabel}</b></span>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
                overlayClassName="dropdownPage"
                placement="bottomRight">
                <Space>
                    <FontAwesomeIcon className='ms-1' icon={faChevronDown} size='xs' />
                </Space>
            </Dropdown>
        </div >
    );
};

export default DropdownPaginate;