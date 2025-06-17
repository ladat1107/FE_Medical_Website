import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './NotiSelection.scss';
import SelectionItem from './selectionItem';

const NotificationSelectionModal = ({ isOpen, onClose, onSubmit, data, checkedUsers }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const selectionItemRef = useRef(null);

    const handleCheckedUsersChange = (checkedUsers) => {
        setSelectedUsers(checkedUsers);
    };
    
    const handleSubmit = () => {
        onSubmit(selectedUsers);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Initialize selectedUsers when modal opens with checkedUsers
    useEffect(() => {
        if (isOpen && checkedUsers && checkedUsers.length > 0) {
            setSelectedUsers(checkedUsers);
        }
    }, [isOpen, checkedUsers]);

    if (!isOpen || !data) return null;

    return (
        <div className="noti-selection-container">
            <div className="noti-selection-content">
                <div className='noti-selection-header'>
                    Danh sách người nhận
                </div>
                <div className='noti-selection-body'>
                    <SelectionItem 
                        ref={selectionItemRef}
                        dataUser={data}
                        onCheckedUsersChange={handleCheckedUsersChange}
                        checkedUsers={selectedUsers}
                    />
                </div>
                <div className='noti-selection-footer'>
                    <button className="close-exam-btn me-3" onClick={onClose}>Đóng</button>
                    <button 
                        className="noti-selection-btn" 
                        onClick={handleSubmit}
                        disabled={selectedUsers.length === 0}
                    >
                        Xác nhận ({selectedUsers.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

NotificationSelectionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    checkedUsers: PropTypes.array
}

export default NotificationSelectionModal;