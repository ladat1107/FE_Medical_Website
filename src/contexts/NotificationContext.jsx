import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import socket from '../Socket/socket';
import { message } from 'antd';
import { markAllRead, updateNotification, getAllNotification } from '../services/doctorService';
import { useSelector } from 'react-redux';

// Create the context
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [socketNotifications, setSocketNotifications] = useState([]);
  const [dbNotifications, setDbNotifications] = useState([]);
  const [unReadDBCount, setUnReadDBCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [apiUnreadCount, setApiUnreadCount] = useState(0);
  const { user } = useSelector(state => state.authen);

  // Fetch notifications from database
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const response = await getAllNotification();
        console.log('DB Notifications response:', response);
        if (response && response.DT) {
          const notifications = response.DT.notifications.rows || [];
          setDbNotifications(notifications);
          setUnReadDBCount(response.DT.unreadCount || 0);

          // Đảm bảo các thành phần UI được cập nhật
          document.dispatchEvent(new CustomEvent('notificationCountUpdated', {
            detail: { count: response.DT.unreadCount || 0 }
          }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông báo từ database:', error);
      }
    };

    fetchNotifications();

    // Thiết lập interval và xử lý cleanup
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [user?.id]); // Thêm user.id để đảm bảo re-fetch khi người dùng thay đổi

  // Socket event handling
  useEffect(() => {
    const handleNewNotification = (data) => {
      console.log('New socket notification received:', data);

      const notificationExists = socketNotifications.some(
        noti => noti.notiCode === data.notiCode
      );

      if (!notificationExists) {
        const newNotification = {
          id: `socket-${Date.now()}`,
          title: data.title,
          status: 1, // Unread
          htmlDescription: data.htmlDescription,
          date: data.date || new Date().toISOString(),
          NotificationSenderData: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
          NotificationAttachFileData: data?.attachedFiles,
          notiCode: data.notiCode,
        };

        setSocketNotifications(prev => [newNotification, ...prev]);
      }
    };

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Socket connected');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    // Đăng ký các event listeners
    socket.on("notification", handleNewNotification);
    socket.on("connect", handleConnect);
    //socket.on("disconnect", handleDisconnect);
    socket.on("reconnect_attempt", (attemptNumber) => console.log('Socket reconnecting, attempt:', attemptNumber));
    socket.on("reconnect_error", (error) => console.error('Socket reconnection error:', error));
    socket.on("reconnect_failed", () => console.error('Socket reconnection failed'));

    // Check socket connection status on mount
    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      // Cleanup event listeners
      socket.off("notification", handleNewNotification);
      socket.off("connect", handleConnect);
      //socket.off("disconnect", handleDisconnect);
      socket.off("reconnect_attempt");
      socket.off("reconnect_error");
      socket.off("reconnect_failed");
    };
  }, [socketNotifications]);

  // Đánh dấu một thông báo cụ thể là đã đọc
  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);

      // Cập nhật trạng thái trong state
      setSocketNotifications(prev =>
        prev.map(noti =>
          noti.id === notificationId ? { ...noti, status: 2 } : noti
        )
      );

      setDbNotifications(prev =>
        prev.map(noti =>
          noti.id === notificationId ? { ...noti, status: 2 } : noti
        )
      );

      // Gọi API để cập nhật trạng thái trên server
      await updateNotification({
        id: notificationId,
        status: 2
      });

    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo đã đọc", error);
    }
  };

  // Mark all notifications as read
  // Trong NotificationContext.js
  const markAllNotificationsAsRead = async () => {
    try {
      console.log('Marking all notifications as read');

      // Call API to mark all as read
      await markAllRead();

      // Update socket notifications
      setSocketNotifications(prev =>
        prev.map(noti => ({ ...noti, status: 2 }))
      );

      // Update database notifications
      setDbNotifications(prev =>
        prev.map(noti => ({ ...noti, status: 2 }))
      );

      // Đặt unReadDBCount về 0
      setUnReadDBCount(0);

      // Notify other components
      document.dispatchEvent(new CustomEvent('markAllNotificationsAsRead'));

      message.success("Đánh dấu tất cả thông báo đã đọc thành công!");
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo đã đọc", error);
      message.error("Có lỗi xảy ra khi đánh dấu thông báo đã đọc");
    }
  };

  const updateApiUnreadCount = (count) => {
    setApiUnreadCount(count);
  };
  // Calculate total unread count - directly from both notification arrays
  const socketUnreadCount = socketNotifications.filter(noti => noti.status === 1).length;
  const dbUnreadCount = unReadDBCount;
  const totalUnreadCount = socketUnreadCount + dbUnreadCount;

  // Combine notifications from both sources and sort by date
  const allNotifications = [...socketNotifications, ...dbNotifications].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const contextValue = {
    socketNotifications,
    dbNotifications,
    socketUnreadCount,
    dbUnreadCount,
    totalUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    updateApiUnreadCount,
    notifications: allNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;