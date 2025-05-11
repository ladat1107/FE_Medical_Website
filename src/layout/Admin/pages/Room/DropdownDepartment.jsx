
import React from 'react';
import { Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { primaryColorAdmin } from "@/styles//variables";
import './DropdownDepartment.scss'

const DropdownDepartment = (props) => {
    const onClick = (value) => {
        props.change(value.key)
    };
    let items = [{ key: 0, label: 'Tất cả' }]
    for (let i = 0; i < props.departments.length; i++) {
        items.push({ key: props.departments[i].value, label: props.departments[i].label })
    }
    return (
        <Dropdown
            menu={{
                items,
                selectable: true,
                onClick,
            }}
            overlayClassName="custom-dropdown">
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <FontAwesomeIcon className='ms-1' icon={faChevronDown} color={primaryColorAdmin} />
                </Space>
            </a>
        </Dropdown>
    )
}

export default DropdownDepartment