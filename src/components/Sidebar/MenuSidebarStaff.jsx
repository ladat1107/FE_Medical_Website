import React, { useEffect, useState } from 'react';
import { Badge, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { PATHS } from '@/constant/path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { EMIT } from '@/constant/value';
import { faAddressCard, faCommentDots } from '@fortawesome/free-regular-svg-icons';
import emitter from '@/utils/eventEmitter';
import { ROLE } from '@/constant/role';
import { useNotification } from '@/contexts/NotificationContext';
import { handleLogout } from '@/redux/actions/authenActions';

const MenuSidebar = () => {
    let { user } = useSelector(state => state.authen);
    let dispatch = useDispatch();
    const { totalUnreadCount } = useNotification();
    
    // Force re-render on notification changes
    const [, setForceUpdate] = useState(0);
    
    // Trong MenuSidebar.js
    useEffect(() => {
        
        // Subscribe to events
        const handleMarkAllRead = () => {
            console.log('All notifications marked as read, updating menu');
            setForceUpdate(prev => prev + 1);
        };
        
        const handleCountUpdated = (event) => {
            console.log('Notification count updated:', event.detail.count);
            setForceUpdate(prev => prev + 1); 
        };
        
        document.addEventListener('markAllNotificationsAsRead', handleMarkAllRead);
        document.addEventListener('notificationCountUpdated', handleCountUpdated);
        
        return () => {
            document.removeEventListener('markAllNotificationsAsRead', handleMarkAllRead);
            document.removeEventListener('notificationCountUpdated', handleCountUpdated);
        };
    }, [totalUnreadCount]);

    const getMenuItem = () => {
        const items = [
            {
                type: 'divider',
            },
            {
                key: 'personalAdmin',
                label: (<NavLink to={PATHS.STAFF.PROFILE}>Cá nhân</NavLink>),
                icon: <FontAwesomeIcon icon={faAddressCard} />,
                children: [
                    {
                        key: 'personalAdmin1',
                        label: 'Thông tin cá nhân',
                        onClick: () => { emitter.emit(EMIT.EVENT_PROFILE.key, EMIT.EVENT_PROFILE.info); }
                    },
                    {
                        key: 'personalAdmin2',
                        label: 'Đổi mật khẩu',
                        onClick: () => { emitter.emit(EMIT.EVENT_PROFILE.key, EMIT.EVENT_PROFILE.changePassword); }
                    },
                    {
                        key: 'personal3',
                        label: "Hồ sơ",
                        onClick: () => {
                            emitter.emit(EMIT.EVENT_PROFILE.key, EMIT.EVENT_PROFILE.staff);
                        }
                    }
                ],
            },
            {
                key: 'sub2',
                label: (<NavLink to={PATHS.RECEPTIONIST.DASHBOARD}>Lịch hẹn</NavLink>),
                icon: <i className="fa-solid fa-list"></i>,
                roles: [ROLE.RECEPTIONIST]
            },
            {
                key: 'sub3',
                label: (<NavLink to={PATHS.RECEPTIONIST.CASHIER}>Thanh toán</NavLink>),
                icon: <i className="fa-solid fa-list"></i>,
                roles: [ROLE.ACCOUNTANT]
            },
            {
                key: 'sub4',
                label: 'Danh sách khám bệnh',
                icon: <i className="fa-solid fa-list"></i>,
                roles: [ROLE.DOCTOR],
                children: [
                    {
                        key: '9',
                        label: (<NavLink to={PATHS.STAFF.APPOINTMENT}>Khám Ngoại trú</NavLink>),
                        icon: <i className="fa-solid fa-stethoscope"></i>,
                    },
                    {
                        key: '11',
                        label: (<NavLink to={PATHS.STAFF.INPATIENT}>Khám Nội trú</NavLink>),
                        icon: <i className="fa-solid fa-bed-pulse"></i>
                    },
                    {
                        key: '10',
                        label: (<NavLink to={PATHS.STAFF.PARACLINICAL}>Cận lâm sàng</NavLink>),
                        icon: <i className="fa-solid fa-microscope"></i>,
                    }
                ],
            },
            {
                key: 'sub1',
                label: (<NavLink to={PATHS.RECEPTIONIST.PRESCRIBE}>Lấy thuốc</NavLink>),
                icon: <i className="fa-solid fa-pills"></i>,
                roles: [ROLE.PHARMACIST]
            },
            {
                key: 'sub5',
                label: (<NavLink to={PATHS.STAFF.HANDBOOK}>Cẩm nang</NavLink>),
                icon: <i className="fa-solid fa-book"></i>,
            },
            {
                key: 'sub6',
                label: (<NavLink to={PATHS.STAFF.SCHEDULE}>Lịch trực</NavLink>),
                icon: <i className="fa-regular fa-calendar"></i>,
            },
            {
                key: 'sub7',
                label: (
                    <NavLink to={PATHS.STAFF.NOTIFICATION}>
                        Thông báo
                        {totalUnreadCount > 0 && (
                            <Badge 
                                count={totalUnreadCount} 
                                offset={[60, 0]}
                            />
                        )}
                    </NavLink>
                ),
                icon: (
                    <Badge dot={totalUnreadCount > 0}>
                        <i className="fa-solid fa-bell"></i>
                    </Badge>
                ),
            },
            {
                key: 'message',
                label: (<NavLink to={PATHS.STAFF.CONSULTANT}>Tư vấn</NavLink>),
                icon: <FontAwesomeIcon icon={faCommentDots} />,
                hidden: user.role !== ROLE.RECEPTIONIST
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: ("Đăng xuất"),
                icon: <FontAwesomeIcon icon={faArrowRightFromBracket} rotation={180} />,
                onClick: () => { dispatch(handleLogout()); },
            },
        ];

        return items.filter(item => {
            // Nếu item không có thuộc tính roles, luôn hiển thị
            if (!item.roles) return true;

            // Kiểm tra nếu vai trò của user nằm trong danh sách roles của item
            return item.roles.includes(user.role);
        });
    }

    const items = getMenuItem();

    const onClick = (e) => {
        console.log('Menu item clicked:', e.key);
    };
    
    return (
        <div className='menu-item'>
            <Menu
                onClick={onClick}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
            />  
        </div>
    );
}

export default MenuSidebar;