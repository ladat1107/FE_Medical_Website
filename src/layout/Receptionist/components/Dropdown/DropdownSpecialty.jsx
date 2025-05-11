import React, { useState } from 'react';
import { Dropdown, Menu, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { TYPE_NUMBER } from '@/constant/value';
const DropdownSpecialty = (props) => {
    let handleChange = (item) => {
        props.setValue(item);  // Trả về key
    };
    let items = [
        {
            label: "Số ưu tiên",
            key: TYPE_NUMBER.PRIORITY,
            onClick: () => { handleChange(TYPE_NUMBER.PRIORITY) }
        },
        {
            label: "Số thường",
            key: TYPE_NUMBER.NORMAL,
            onClick: () => { handleChange(TYPE_NUMBER.NORMAL) }
        },
    ]

    return (

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

    );
};

export default DropdownSpecialty;