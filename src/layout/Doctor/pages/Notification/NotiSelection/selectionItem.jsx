import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import ListUser from './listUser'; // Make sure this path is correct

const SelectionItem = forwardRef(({ dataUser, onCheckedUsersChange, checkedUsers }, ref) => {
    const listUserRef = useRef(null);
    
    useImperativeHandle(ref, () => ({
        resetAllChecks: () => {
            if (listUserRef.current && listUserRef.current.resetCheckedUsers) {
                listUserRef.current.resetCheckedUsers();
            }
        },
        getCheckedUsers: () => {
            if (listUserRef.current && listUserRef.current.getCheckedUsers) {
                return listUserRef.current.getCheckedUsers();
            }
            return [];
        }
    }));

    return (
        <div className="selection-item">
            <ListUser 
                ref={listUserRef}
                data={dataUser}
                onCheckedUsersChange={onCheckedUsersChange}
                listCheckedUsers={checkedUsers || []}
            />
        </div>
    );
});

SelectionItem.propTypes = {
    dataUser: PropTypes.object.isRequired,
    onCheckedUsersChange: PropTypes.func,
    checkedUsers: PropTypes.array
};

SelectionItem.displayName = 'SelectionItem';

export default SelectionItem;