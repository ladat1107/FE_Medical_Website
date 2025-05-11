import React, { useState, useEffect } from 'react'
import NotiItem from '../NotiItem/notiItem'
import PropTypes from 'prop-types'
import socket from '@/Socket/socket'
import './ViewNoti.scss'

const ViewNoti = ({ initialNotifications = { count: 0, rows: [] }, onUnreadCountChange }) => {
    const [notifications, setNotifications] = useState(initialNotifications)
    const [socketNotifications, setSocketNotifications] = useState([])
    const [todayNotifications, setTodayNotifications] = useState([])
    const [earlierNotifications, setEarlierNotifications] = useState([])
    
    // Cập nhật state khi initialNotifications thay đổi
    useEffect(() => {
        setNotifications(initialNotifications)
    }, [initialNotifications])
    
    // Xử lý khi nhận thông báo mới từ socket
    useEffect(() => {
        const handleNewNotification = (data) => {
            const newNotification = {
                id: Date.now(),
                title: data.title,
                status: 1, // Chưa đọc
                htmlDescription: data.htmlDescription,
                date: data.date,
                NotificationSenderData: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                },
                NotificationAttachFileData: data?.attachedFiles,
            }
            
            setSocketNotifications(prev => [newNotification, ...prev])
        }
        
        socket.on("notification", handleNewNotification)
        return () => {
            socket.off("notification", handleNewNotification)
        }
    }, [])
    
    // Kết hợp thông báo từ API và từ socket
    useEffect(() => {
        const allNotifications = {
            count: notifications.rows.length + socketNotifications.length,
            rows: [...socketNotifications, ...notifications.rows]
        }
        
        const today = new Date().toDateString()
        
        const todayNoti = allNotifications.rows.filter(noti => {
            const createdDate = noti.createdAt || noti.date
            const notiDate = new Date(createdDate).toDateString()
            return notiDate === today
        })
        
        const earlierNoti = allNotifications.rows.filter(noti => {
            const createdDate = noti.createdAt || noti.date
            const notiDate = new Date(createdDate).toDateString()
            return notiDate !== today
        })
        
        setTodayNotifications(todayNoti)
        setEarlierNotifications(earlierNoti)
        
        // Tính toán số thông báo chưa đọc từ socket
        const socketUnreadCount = socketNotifications.filter(noti => noti.status === 1).length;
        
        // Thông báo cho component cha về số thông báo chưa đọc mới
        if (onUnreadCountChange && typeof onUnreadCountChange === 'function') {
            onUnreadCountChange(socketUnreadCount);
        }
    }, [notifications, socketNotifications, onUnreadCountChange])
    
    // Lắng nghe sự kiện đánh dấu tất cả đã đọc
    useEffect(() => {
        const handleMarkAllAsRead = () => {
            setSocketNotifications(prev => 
                prev.map(noti => ({ ...noti, status: 2 }))
            )
        }
        
        document.addEventListener('markAllNotificationsAsRead', handleMarkAllAsRead)
        return () => {
            document.removeEventListener('markAllNotificationsAsRead', handleMarkAllAsRead)
        }
    }, [])
    
    return (
        <div className="notification-container">
            {notifications.count === 0 && socketNotifications.length === 0 ? (
                <p className="no-notifications">Không có thông báo nào</p>
            ) : (
                <>
                    {todayNotifications.length > 0 && (
                        <>
                            <p className="date mt-4">Hôm nay</p>
                            <div className='list-noti'>
                                {todayNotifications.map((noti) => (
                                    <NotiItem key={noti.id || `today-${Date.now()}-${Math.random()}`} noti={noti} />
                                ))}
                            </div>
                        </>
                    )}
                    
                    {earlierNotifications.length > 0 && (
                        <>
                            <p className="date mt-4">Trước đó</p>
                            <div className='list-noti'>
                                {earlierNotifications.map((noti) => (
                                    <NotiItem key={noti.id || `earlier-${Date.now()}-${Math.random()}`} noti={noti} />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

ViewNoti.propTypes = {
    initialNotifications: PropTypes.shape({
        count: PropTypes.number,
        rows: PropTypes.array
    }),
    onUnreadCountChange: PropTypes.func
}

export default ViewNoti