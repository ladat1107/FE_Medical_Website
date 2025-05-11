import React, { useState, useEffect } from 'react';
import { Dropdown, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MEDICAL_TREATMENT_TIER } from '@/constant/value';
const DropdownTypeExamination = ({ typeExamination, setTypeExamination }) => {
    const [_, setSelectedLabel] = useState(typeExamination);
    useEffect(() => {
        if (typeExamination) {
            setSelectedLabel(typeExamination);
        }
    }, [typeExamination]);
    let items = [
        {
            label: (<div className={`flex justify-start items-center my-1 ${typeExamination === 'all' ? 'text-primary-tw' : ''}`}>Tất cả</div>),
            key: 'all',
            onClick: () => { setTypeExamination('all') }
        },
        {
            label: (<div className={`flex justify-start items-center my-1 ${typeExamination === "appointment" ? 'text-primary-tw' : ''}`}>Lịch hẹn</div>),
            key: 'appointment',
            onClick: () => { setTypeExamination("appointment") }
        },
        {
            label: (<div className={`flex justify-start items-center my-1 ${typeExamination === MEDICAL_TREATMENT_TIER.INPATIENT ? 'text-primary-tw' : ''}`}>Nội trú</div>),
            key: '1',
            onClick: () => { setTypeExamination(MEDICAL_TREATMENT_TIER.INPATIENT) }
        },
        {
            label: (<div className={`flex justify-start items-center my-1 ${typeExamination === MEDICAL_TREATMENT_TIER.OUTPATIENT ? 'text-primary-tw' : ''}`}>Ngoại trú</div>),
            key: '2',
            onClick: () => { setTypeExamination(MEDICAL_TREATMENT_TIER.OUTPATIENT) }
        },
        {
            label: (<div className={`flex justify-start items-center my-1 ${typeExamination === MEDICAL_TREATMENT_TIER.EMERGENCY ? 'text-primary-tw' : ''}`}>Cấp cứu</div>),
            key: '3',
            onClick: () => { setTypeExamination(MEDICAL_TREATMENT_TIER.EMERGENCY) }
        }
    ]

    return (
        <div className='me-3'>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
                overlayClassName="dropdownPage"
                overlayStyle={{ width: '120px' }}
                placement="bottomRight">
                <Space>
                    <FontAwesomeIcon className='ms-1' icon={faChevronDown} size='xs' />
                </Space>
            </Dropdown>
        </div >
    );
};

export default DropdownTypeExamination;